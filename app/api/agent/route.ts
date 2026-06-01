import { NextResponse } from "next/server";
import {
  enrichAgentActions,
  getAgentActions,
  getPortfolioRedirectActions
} from "@/lib/agent/actions";
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
import { judgePortfolioScope } from "@/lib/agent/scope-judge";
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

function createEvaluatedResponse(
  answer: string,
  actions: AgentApiResponse["actions"],
  responseKind: "portfolio" | "refusal",
  proof: AgentResponseProof,
  startedAt: number,
  init?: ResponseInit
) {
  const evaluation = evaluateAgentAnswer({ actions, answer, responseKind });

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
    startedAt,
    init
  );
}

function getNoScopeJudgeProof(
  debugCode: AgentDebugCode,
  mode: AgentRuntimeProof["mode"]
): AgentResponseProof {
  return {
    mode,
    debugCode,
    providerAttempted: false,
    providerSucceeded: false,
    scopeJudgeAttempted: false,
    scopeJudgeAllowed: false,
    scopeJudgeReason: "not_attempted"
  };
}

function evaluationFailureResponse(
  proof: Omit<AgentResponseProof, "debugCode" | "mode">,
  startedAt: number
) {
  return createEvaluatedResponse(
    getPortfolioScopeResponse(),
    getPortfolioRedirectActions(),
    "refusal",
    {
      mode: "fallback",
      debugCode: "evaluation_failed",
      ...proof
    },
    startedAt
  );
}

function fallbackResponse(
  message: string,
  proof: Omit<AgentResponseProof, "mode">,
  startedAt: number
) {
  const answer = getFallbackAgentResponse(message);
  const actions = enrichAgentActions(answer, getAgentActions(message));
  const evaluation = evaluateAgentAnswer({
    actions,
    answer,
    responseKind: "portfolio"
  });

  if (!evaluation.passed) {
    return evaluationFailureResponse(proof, startedAt);
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
    { mode: "fallback", ...proof },
    startedAt
  );
}

function blockedResponse(safety: AgentSafetyResult, startedAt: number) {
  const debugCode: AgentDebugCode =
    safety.category === "secret-request"
      ? "blocked_secret_request"
      : safety.category === "unrelated-task"
        ? "blocked_unrelated_task"
        : "blocked_prompt_injection";

  return createEvaluatedResponse(
    getSafetyRefusal(safety),
    getPortfolioRedirectActions(),
    "refusal",
    {
      ...getNoScopeJudgeProof(debugCode, "blocked"),
      scopeJudgeReason: "hard_blocked"
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
      getNoScopeJudgeProof("invalid_request", "fallback"),
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
        answer: "Please enter a question about Abdulelah's projects, blog insights, skills, resume, or hiring fit.",
        actions: [],
        quality: { score: MIN_AGENT_QUALITY_SCORE, passed: true }
      },
      getNoScopeJudgeProof("invalid_request", "fallback"),
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
      getNoScopeJudgeProof("invalid_request", "fallback"),
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
          "You've sent several questions in a short time. Please wait a moment, then ask about Abdulelah's portfolio, projects, blog insights, skills, or resume.",
        actions: getPortfolioRedirectActions(),
        quality: { score: 100, passed: true }
      },
      getNoScopeJudgeProof("rate_limited", "fallback"),
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

  const scope = await judgePortfolioScope(message);
  const scopeProof = {
    scopeJudgeAttempted: scope.attempted,
    scopeJudgeAllowed: scope.allowed,
    scopeJudgeReason: scope.reason
  };

  if (!scope.allowed) {
    return createEvaluatedResponse(
      getPortfolioScopeResponse(),
      getPortfolioRedirectActions(),
      "refusal",
      {
        mode: "fallback",
        debugCode: "scope_rejected",
        providerAttempted: false,
        providerSucceeded: false,
        ...scopeProof
      },
      startedAt
    );
  }

  if (!hasDeepSeekApiKey()) {
    return fallbackResponse(
      message,
      {
        debugCode: "missing_key",
        providerAttempted: false,
        providerSucceeded: false,
        ...scopeProof
      },
      startedAt
    );
  }

  try {
    const answer = await askDeepSeek(message, buildPortfolioContext());
    const actions = enrichAgentActions(answer, getAgentActions(message));
    const evaluation = evaluateAgentAnswer({
      actions,
      answer,
      responseKind: "portfolio"
    });

    if (!evaluation.passed) {
      return evaluationFailureResponse(
        {
          providerAttempted: true,
          providerSucceeded: true,
          ...scopeProof
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
        providerSucceeded: true,
        ...scopeProof
      },
      startedAt
    );
  } catch (error) {
    return fallbackResponse(
      message,
      {
        debugCode: getDeepSeekErrorCode(error),
        providerAttempted: true,
        providerSucceeded: false,
        ...scopeProof
      },
      startedAt
    );
  }
}
