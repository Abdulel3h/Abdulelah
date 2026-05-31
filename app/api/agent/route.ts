import { NextResponse } from "next/server";
import { getAgentActions, getPortfolioRedirectActions } from "@/lib/agent/actions";
import { buildPortfolioContext } from "@/lib/agent/context";
import {
  askDeepSeek,
  getDeepSeekErrorCode,
  getDeepSeekModel,
  hasDeepSeekApiKey
} from "@/lib/agent/deepseek";
import {
  evaluateAgentAnswer,
  MIN_AGENT_QUALITY_SCORE
} from "@/lib/agent/evaluate";
import { getFallbackAgentResponse } from "@/lib/agent/fallback";
import {
  classifyAgentMessage,
  getPortfolioScopeResponse,
  getSafetyRefusal,
  type AgentSafetyResult
} from "@/lib/agent/safety";
import { applyRuntimeRateLimit } from "@/lib/rate-limit";
import type {
  AgentApiResponse,
  AgentDebugCode,
  AgentRuntimeProof
} from "@/types/agent";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_MESSAGE_LENGTH = 1_200;

type AgentResponseBody = Pick<AgentApiResponse, "actions" | "answer" | "quality">;
type AgentResponseProof = Omit<AgentRuntimeProof, "durationMs" | "model">;

function jsonAgentResponse(
  response: AgentResponseBody,
  proof: AgentResponseProof,
  startedAt: number,
  init?: ResponseInit
) {
  const runtimeProof: AgentRuntimeProof = {
    ...proof,
    model: getDeepSeekModel(),
    durationMs: Date.now() - startedAt
  };

  console.info("[agent]", runtimeProof);

  return NextResponse.json<AgentApiResponse>(
    {
      ...response,
      ...runtimeProof
    },
    init
  );
}

function createSafeResponse(
  answer: string,
  message: string,
  safety: AgentSafetyResult,
  actions = safety.allowed
    ? getAgentActions(message)
    : getPortfolioRedirectActions(),
  proof: AgentResponseProof,
  startedAt: number
) {
  const evaluation = evaluateAgentAnswer({ actions, answer, safety });

  return jsonAgentResponse(
    {
      answer,
      actions,
      quality: {
        score: evaluation.score,
        passed: evaluation.passed
      }
    },
    proof,
    startedAt
  );
}

function fallbackResponse(
  message: string,
  safety: AgentSafetyResult,
  proof: Omit<AgentResponseProof, "mode">,
  startedAt: number
) {
  const actions = safety.allowed
    ? getAgentActions(message)
    : getPortfolioRedirectActions();
  const answer = safety.allowed
    ? getFallbackAgentResponse(message)
    : getSafetyRefusal(safety);
  const evaluation = evaluateAgentAnswer({ actions, answer, safety });

  if (evaluation.passed) {
    return jsonAgentResponse(
      {
        answer,
        actions,
        quality: {
          score: evaluation.score,
          passed: true
        }
      },
      { mode: "fallback", ...proof },
      startedAt
    );
  }

  return createSafeResponse(
    getPortfolioScopeResponse(),
    message,
    { allowed: false, category: "out-of-scope" },
    getPortfolioRedirectActions(),
    { mode: "fallback", ...proof },
    startedAt
  );
}

function blockedResponse(safety: AgentSafetyResult, startedAt: number) {
  const actions = getPortfolioRedirectActions();
  const answer = getSafetyRefusal(safety);
  const evaluation = evaluateAgentAnswer({ actions, answer, safety });
  const debugCode: AgentDebugCode =
    safety.category === "out-of-scope"
      ? "blocked_out_of_scope"
      : safety.category === "sensitive-request"
        ? "blocked_sensitive_request"
        : "blocked_prompt_injection";

  return jsonAgentResponse(
    {
      answer,
      actions,
      quality: {
        score: evaluation.score,
        passed: evaluation.passed
      }
    },
    {
      mode: "blocked",
      debugCode,
      providerAttempted: false,
      providerSucceeded: false
    },
    startedAt
  );
}

export async function POST(request: Request) {
  const startedAt = Date.now();
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return jsonAgentResponse(
      {
        answer: "Please send a valid message so I can help you explore the portfolio.",
        actions: [],
        quality: { score: MIN_AGENT_QUALITY_SCORE, passed: true }
      },
      {
        mode: "fallback",
        debugCode: "invalid_request",
        providerAttempted: false,
        providerSucceeded: false
      },
      startedAt,
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

  if (!message) {
    return jsonAgentResponse(
      {
        answer: "Please enter a question about Abdulelah's projects, skills, resume, or hiring fit.",
        actions: [],
        quality: { score: MIN_AGENT_QUALITY_SCORE, passed: true }
      },
      {
        mode: "fallback",
        debugCode: "invalid_request",
        providerAttempted: false,
        providerSucceeded: false
      },
      startedAt,
      { status: 400 }
    );
  }

  if (message.length > MAX_MESSAGE_LENGTH) {
    return jsonAgentResponse(
      {
        answer: "Please shorten your question so I can give you a focused answer.",
        actions: [],
        quality: { score: MIN_AGENT_QUALITY_SCORE, passed: true }
      },
      {
        mode: "fallback",
        debugCode: "invalid_request",
        providerAttempted: false,
        providerSucceeded: false
      },
      startedAt,
      { status: 400 }
    );
  }

  const rateLimit = applyRuntimeRateLimit(request, {
    namespace: "agent",
    limit: 30,
    windowMs: 60_000
  });

  if (!rateLimit.allowed) {
    return jsonAgentResponse(
      {
        answer:
          "You've sent several questions in a short time. Please wait a moment, then ask about Abdulelah's portfolio, projects, skills, or resume.",
        actions: getPortfolioRedirectActions(),
        quality: { score: 100, passed: true }
      },
      {
        mode: "fallback",
        debugCode: "rate_limited",
        providerAttempted: false,
        providerSucceeded: false
      },
      startedAt,
      {
        status: 429,
        headers: {
          "Retry-After": String(rateLimit.retryAfterSeconds)
        }
      }
    );
  }

  const safety = classifyAgentMessage(message);

  if (!safety.allowed) {
    return blockedResponse(safety, startedAt);
  }

  if (!hasDeepSeekApiKey()) {
    return fallbackResponse(
      message,
      safety,
      {
        debugCode: "missing_key",
        providerAttempted: false,
        providerSucceeded: false
      },
      startedAt
    );
  }

  try {
    const actions = getAgentActions(message);
    const answer = await askDeepSeek(message, buildPortfolioContext());
    const evaluation = evaluateAgentAnswer({ actions, answer, safety });

    if (!evaluation.passed) {
      return fallbackResponse(
        message,
        safety,
        {
          debugCode: "evaluation_failed",
          providerAttempted: true,
          providerSucceeded: true
        },
        startedAt
      );
    }

    return jsonAgentResponse(
      {
        answer,
        actions,
        quality: {
          score: evaluation.score,
          passed: true
        }
      },
      {
        mode: "deepseek",
        debugCode: "sent_to_deepseek",
        providerAttempted: true,
        providerSucceeded: true
      },
      startedAt
    );
  } catch (error) {
    return fallbackResponse(
      message,
      safety,
      {
        debugCode: getDeepSeekErrorCode(error),
        providerAttempted: true,
        providerSucceeded: false
      },
      startedAt
    );
  }
}
