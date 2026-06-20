import { NextResponse } from "next/server";
import {
  enrichAgentActions,
  getContinueAnswerAction,
  getAgentActions,
  getPortfolioRedirectActions
} from "@/lib/agent/actions";
import {
  buildPortfolioContext,
  EMPTY_AGENT_SESSION_CONTEXT,
  resolveAgentFollowUp,
  sanitizeAgentHistory,
  sanitizeAgentSessionContext,
  updateAgentSessionContext,
  type AgentConversationMemory
} from "@/lib/agent/context";
import {
  askDeepSeek,
  getDeepSeekModel,
  hasDeepSeekApiKey
} from "@/lib/agent/deepseek";
import {
  evaluateAgentAnswer,
  MIN_AGENT_QUALITY_SCORE
} from "@/lib/agent/evaluate";
import { getFallbackAgentResponse } from "@/lib/agent/fallback";
import {
  judgePortfolioScope,
  judgePortfolioScopeLocally
} from "@/lib/agent/scope-judge";
import {
  classifyAgentMessage,
  getPortfolioScopeResponse,
  getSafetyRefusal,
  type AgentSafetyResult
} from "@/lib/agent/safety";
import { applyRuntimeRateLimit } from "@/lib/rate-limit";
import { containsArabic } from "@/lib/text-direction";
import type {
  AgentApiResponse,
  AgentDebugCode,
  AgentRuntimeProof,
  AgentSessionContext
} from "@/types/agent";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_MESSAGE_LENGTH = 1_200;
// Reject oversized payloads before parsing JSON into memory. Comfortably above a
// max message plus 8 trimmed history turns and session context, far below the
// platform body cap.
const MAX_BODY_BYTES = 32_000;

type AgentResponseBody = Pick<AgentApiResponse, "actions" | "answer" | "quality">;
type AgentResponseProof = Omit<AgentRuntimeProof, "durationMs" | "model">;

function appendContinuationHint(answer: string, message: string) {
  const hint = containsArabic(message)
    ? "الجواب طويل، أقدر أكمل لك التفاصيل في رسالة ثانية."
    : "The answer is long. I can continue with more details in the next message.";

  return `${answer.trim()}\n\n${hint}`;
}

function jsonAgentResponse(
  response: AgentResponseBody,
  proof: AgentResponseProof,
  startedAt: number,
  init?: ResponseInit,
  sessionContext: AgentSessionContext = EMPTY_AGENT_SESSION_CONTEXT
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
      ...runtimeProof,
      sessionContext: sanitizeAgentSessionContext(sessionContext)
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
  init?: ResponseInit,
  sessionContext: AgentSessionContext = EMPTY_AGENT_SESSION_CONTEXT
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
    init,
    sessionContext
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
  message: string,
  proof: Omit<AgentResponseProof, "debugCode" | "mode">,
  startedAt: number,
  sessionContext: AgentSessionContext
) {
  return createEvaluatedResponse(
    getPortfolioScopeResponse(message),
    getPortfolioRedirectActions(),
    "refusal",
    {
      mode: "fallback",
      debugCode: "evaluation_failed",
      ...proof
    },
    startedAt,
    undefined,
    sessionContext
  );
}

function fallbackResponse(
  message: string,
  proof: Omit<AgentResponseProof, "mode">,
  startedAt: number,
  memory: AgentConversationMemory
) {
  const resolvedMessage = resolveAgentFollowUp(
    message,
    memory.sessionContext
  );
  const answer = getFallbackAgentResponse(message, memory.sessionContext);
  const actions = enrichAgentActions(
    answer,
    getAgentActions(resolvedMessage)
  );
  const evaluation = evaluateAgentAnswer({
    actions,
    answer,
    responseKind: "portfolio"
  });

  if (!evaluation.passed) {
    return evaluationFailureResponse(
      message,
      proof,
      startedAt,
      memory.sessionContext
    );
  }

  const sessionContext = updateAgentSessionContext({
    answer,
    message,
    sessionContext: memory.sessionContext
  });

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
    startedAt,
    undefined,
    sessionContext
  );
}

function blockedResponse(
  message: string,
  safety: AgentSafetyResult,
  startedAt: number,
  sessionContext: AgentSessionContext
) {
  const debugCode: AgentDebugCode =
    safety.category === "secret-request"
      ? "blocked_secret_request"
      : safety.category === "unrelated-task"
        ? "blocked_unrelated_task"
        : safety.category === "high-risk-advice"
          ? "blocked_high_risk_advice"
          : "blocked_prompt_injection";

  return createEvaluatedResponse(
    getSafetyRefusal(safety, message),
    getPortfolioRedirectActions(),
    "refusal",
    {
      ...getNoScopeJudgeProof(debugCode, "blocked"),
      scopeJudgeReason: "hard_blocked"
    },
    startedAt,
    undefined,
    sessionContext
  );
}

export async function POST(request: Request) {
  const startedAt = Date.now();

  if (Number(request.headers.get("content-length") ?? 0) > MAX_BODY_BYTES) {
    return jsonAgentResponse(
      {
        answer: "Please send a shorter request so I can help you explore the portfolio.",
        actions: [],
        quality: { score: MIN_AGENT_QUALITY_SCORE, passed: true }
      },
      getNoScopeJudgeProof("invalid_request", "fallback"),
      startedAt,
      { status: 413 }
    );
  }

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
  const history =
    typeof body === "object" && body !== null && "history" in body
      ? sanitizeAgentHistory(body.history)
      : [];
  const sessionContext =
    typeof body === "object" && body !== null && "sessionContext" in body
      ? sanitizeAgentSessionContext(body.sessionContext)
      : { ...EMPTY_AGENT_SESSION_CONTEXT };
  const memory: AgentConversationMemory = {
    history,
    sessionContext
  };

  if (!message) {
    return jsonAgentResponse(
      {
        answer: "Please enter a question about Abdulelah's projects, blog insights, skills, resume, or hiring fit.",
        actions: [],
        quality: { score: MIN_AGENT_QUALITY_SCORE, passed: true }
      },
      getNoScopeJudgeProof("invalid_request", "fallback"),
      startedAt,
      { status: 400 },
      sessionContext
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
      { status: 400 },
      sessionContext
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
      },
      sessionContext
    );
  }

  const safety = classifyAgentMessage(message);

  if (!safety.allowed) {
    return blockedResponse(message, safety, startedAt, sessionContext);
  }

  if (!hasDeepSeekApiKey()) {
    const scope = judgePortfolioScopeLocally(message, sessionContext);
    const scopeProof = {
      scopeJudgeAttempted: false,
      scopeJudgeAllowed: scope.allowed,
      scopeJudgeReason: scope.reason
    };

    if (!scope.allowed) {
      return createEvaluatedResponse(
        getPortfolioScopeResponse(message),
        getPortfolioRedirectActions(),
        "refusal",
        {
          mode: "fallback",
          debugCode: "scope_rejected",
          providerAttempted: false,
          providerSucceeded: false,
          ...scopeProof
        },
        startedAt,
        undefined,
        sessionContext
      );
    }

    return fallbackResponse(
      message,
      {
        debugCode: "missing_key",
        providerAttempted: false,
        providerSucceeded: false,
        ...scopeProof
      },
      startedAt,
      memory
    );
  }

  const scope = await judgePortfolioScope(message, memory);
  const scopeProof = {
    scopeJudgeAttempted: scope.attempted,
    scopeJudgeAllowed: scope.allowed,
    scopeJudgeReason: scope.reason
  };

  if (!scope.allowed) {
    return createEvaluatedResponse(
      getPortfolioScopeResponse(message),
      getPortfolioRedirectActions(),
      "refusal",
      {
        mode: "fallback",
        debugCode: "scope_rejected",
        providerAttempted: false,
        providerSucceeded: false,
        ...scopeProof
      },
      startedAt,
      undefined,
      sessionContext
    );
  }

  try {
    const resolvedMessage = resolveAgentFollowUp(message, sessionContext);
    const completion = await askDeepSeek(message, buildPortfolioContext(), {
      ...memory,
      resolvedMessage
    });
    const answer =
      completion.finishReason === "length"
        ? appendContinuationHint(completion.content, message)
        : completion.content;
    const actions = enrichAgentActions(
      answer,
      [
        ...(completion.finishReason === "length"
          ? [getContinueAnswerAction(message)]
          : []),
        ...getAgentActions(resolvedMessage)
      ]
    );
    const evaluation = evaluateAgentAnswer({
      actions,
      answer,
      responseKind: "portfolio"
    });

    if (!evaluation.passed) {
      if (
        evaluation.reasons.some(
          (reason) =>
            reason === "incomplete-ending-risk" ||
            reason === "answer-too-long"
        )
      ) {
        return fallbackResponse(
          message,
          {
            debugCode: "evaluation_failed",
            providerAttempted: true,
            providerSucceeded: true,
            finishReason: completion.finishReason,
            ...scopeProof
          },
          startedAt,
          memory
        );
      }

      return evaluationFailureResponse(
        message,
        {
          providerAttempted: true,
          providerSucceeded: true,
          finishReason: completion.finishReason,
          ...scopeProof
        },
        startedAt,
        sessionContext
      );
    }

    const updatedSessionContext = updateAgentSessionContext({
      answer,
      message,
      sessionContext
    });

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
        debugCode:
          completion.finishReason === "length"
            ? "output_truncated"
            : "sent_to_deepseek",
        providerAttempted: true,
        providerSucceeded: true,
        finishReason: completion.finishReason,
        ...scopeProof
      },
      startedAt,
      undefined,
      updatedSessionContext
    );
  } catch {
    return fallbackResponse(
      message,
      {
        debugCode: "provider_failed",
        providerAttempted: true,
        providerSucceeded: false,
        ...scopeProof
      },
      startedAt,
      memory
    );
  }
}
