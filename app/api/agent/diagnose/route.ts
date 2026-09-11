import { NextResponse } from "next/server";
import { hasDeepSeekApiKey } from "@/lib/agent/deepseek";
import {
  judgePortfolioScope,
  judgePortfolioScopeLocally
} from "@/lib/agent/scope-judge";
import { classifyAgentMessage } from "@/lib/agent/safety";
import { readJsonBody } from "@/lib/http/read-json-body";
import { applyRateLimit } from "@/lib/rate-limit";
import { constantTimeEquals } from "@/lib/security/signed-token";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_MESSAGE_LENGTH = 1_200;
const MAX_BODY_BYTES = 32_000;

/**
 * Developer-only diagnostics. This endpoint reports safety classifier and
 * scope judge internals, which must never be readable by the public, so in
 * production it stays closed unless AGENT_DIAGNOSE_TOKEN is configured and
 * presented as a bearer token. Unauthorized callers get a plain 404.
 */
function isAuthorized(request: Request) {
  if (process.env.NODE_ENV !== "production") {
    return true;
  }

  const expectedToken = process.env.AGENT_DIAGNOSE_TOKEN?.trim();

  if (!expectedToken) {
    return false;
  }

  const header = request.headers.get("authorization") ?? "";
  const providedToken = header.toLowerCase().startsWith("bearer ")
    ? header.slice(7).trim()
    : "";

  return (
    providedToken.length > 0 && constantTimeEquals(providedToken, expectedToken)
  );
}

// Even when authorized, production never drives paid DeepSeek calls from here.
const ALLOW_REMOTE_SCOPE_JUDGE = process.env.NODE_ENV !== "production";

function getHardBlockReason(
  category: ReturnType<typeof classifyAgentMessage>["category"]
) {
  return category === "allowed" ? null : category;
}

function notFound() {
  return new NextResponse(null, { status: 404 });
}

export async function POST(request: Request) {
  if (!isAuthorized(request)) {
    return notFound();
  }

  const rateLimit = await applyRateLimit(request, {
    namespace: "agent-diagnose",
    limit: 10,
    windowMs: 60_000
  });

  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: "rate_limited" },
      {
        status: 429,
        headers: {
          "Retry-After": String(rateLimit.retryAfterSeconds)
        }
      }
    );
  }

  const body = await readJsonBody(request, MAX_BODY_BYTES);

  if (!body.ok) {
    return NextResponse.json(
      {
        error:
          body.status === 413
            ? "payload_too_large"
            : body.status === 415
              ? "unsupported_media_type"
              : "invalid_request"
      },
      { status: body.status }
    );
  }

  const payload = body.data;
  const message =
    typeof payload === "object" &&
    payload !== null &&
    "message" in payload &&
    typeof payload.message === "string"
      ? payload.message.trim()
      : "";

  if (!message || message.length > MAX_MESSAGE_LENGTH) {
    return NextResponse.json(
      { error: "invalid_request" },
      { status: 400 }
    );
  }

  const safety = classifyAgentMessage(message);
  const hasDeepSeekKey = hasDeepSeekApiKey();

  if (!safety.allowed) {
    return NextResponse.json(
      {
        hardBlocked: true,
        hardBlockReason: getHardBlockReason(safety.category),
        scopeJudgeAttempted: false,
        scopeJudgeAllowed: false,
        scopeJudgeReason: "hard_blocked",
        wouldCallAnswerGenerator: false,
        hasDeepSeekKey
      },
      {
        headers: {
          "Cache-Control": "no-store"
        }
      }
    );
  }

  const scope =
    hasDeepSeekKey && ALLOW_REMOTE_SCOPE_JUDGE
      ? await judgePortfolioScope(message)
      : {
          ...judgePortfolioScopeLocally(message),
          attempted: false
        };

  return NextResponse.json(
    {
      hardBlocked: false,
      hardBlockReason: null,
      scopeJudgeAttempted: scope.attempted,
      scopeJudgeAllowed: scope.allowed,
      scopeJudgeReason: scope.reason,
      wouldCallAnswerGenerator: scope.allowed && hasDeepSeekKey,
      hasDeepSeekKey
    },
    {
      headers: {
        "Cache-Control": "no-store"
      }
    }
  );
}
