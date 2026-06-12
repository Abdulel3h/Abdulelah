import { NextResponse } from "next/server";
import {
  getDeepSeekModel,
  hasDeepSeekApiKey
} from "@/lib/agent/deepseek";
import {
  judgePortfolioScope,
  judgePortfolioScopeLocally
} from "@/lib/agent/scope-judge";
import { classifyAgentMessage } from "@/lib/agent/safety";
import { applyRuntimeRateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_MESSAGE_LENGTH = 1_200;

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
        model: getDeepSeekModel(),
        hasDeepSeekKey
      },
      {
        headers: {
          "Cache-Control": "no-store"
        }
      }
    );
  }

  const scope = hasDeepSeekKey
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
      model: getDeepSeekModel(),
      hasDeepSeekKey
    },
    {
      headers: {
        "Cache-Control": "no-store"
      }
    }
  );
}
