import { NextResponse } from "next/server";
import { hasDeepSeekApiKey } from "@/lib/agent/deepseek";
import {
  judgePortfolioScope,
  judgePortfolioScopeLocally
} from "@/lib/agent/scope-judge";
import { classifyAgentMessage } from "@/lib/agent/safety";
import { applyRuntimeRateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_MESSAGE_LENGTH = 1_200;
const MAX_BODY_BYTES = 32_000;
// In production the diagnose tool runs the scope classifier locally only, so an
// exposed endpoint can never be used to drive paid DeepSeek calls (cost abuse).
const ALLOW_REMOTE_SCOPE_JUDGE = process.env.NODE_ENV !== "production";

function getHardBlockReason(
  category: ReturnType<typeof classifyAgentMessage>["category"]
) {
  return category === "allowed" ? null : category;
}

export async function POST(request: Request) {
  const rateLimit = applyRuntimeRateLimit(request, {
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

  if (Number(request.headers.get("content-length") ?? 0) > MAX_BODY_BYTES) {
    return NextResponse.json({ error: "payload_too_large" }, { status: 413 });
  }

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "invalid_request" },
      { status: 400 }
    );
  }

  const message =
    typeof body === "object" &&
    body !== null &&
    "message" in body &&
    typeof body.message === "string"
      ? body.message.trim()
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
