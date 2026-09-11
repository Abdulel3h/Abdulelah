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
import { readJsonBody } from "@/lib/http/read-json-body";
import { applyRateLimit } from "@/lib/rate-limit";
import { buildHumanGrantCookie, checkBotProtection } from "@/lib/security/bot-check";
import { containsArabic } from "@/lib/text-direction";
import type {
  AgentApiResponse,
  AgentDebugCode,
  AgentPublicRuntime,
  AgentRuntimeProof,
  AgentSessionContext
} from "@/types/agent";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_MESSAGE_LENGTH = 1_200;
// Measured against the bytes actually read, so a missing or lying
// Content-Length cannot get a huge payload through. Comfortably above a max
// message plus 8 trimmed history turns, session context and a bot token.
const MAX_BODY_BYTES = 32_000;

type AgentResponseBody = Pick<AgentApiResponse, "actions" | "answer" | "quality">;
type AgentResponseProof = Omit<AgentRuntimeProof, "durationMs" | "model">;

function appendContinuationHint(answer: string, message: string) {
  const hint = containsArabic(message)
    ? "الجواب طويل، أقدر أكمل لك التفاصيل في رسالة ثانية."
    : "The answer is long. I can continue with more details in the next message.";

  return `${answer.trim()}\n\n${hint}`;
}

/**
 * Production clients get only what the UI needs: the conversation mode and
 * whether the question stayed in scope. The model id, debug codes, provider
 * attempts and scope-judge reasoning describe internal implementation and are
 * kept for local development only.
 */
function toPublicRuntime(proof: AgentRuntimeProof): AgentPublicRuntime {
  if (process.env.NODE_ENV !== "production") {
    return proof;
  }

  return {
    mode: proof.mode,
    scopeJudgeAllowed: proof.scopeJudgeAllowed
  };
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

  // The full proof is operator information: it stays in the server log.
  console.info("[agent]", runtimeProof);

  return NextResponse.json<AgentApiResponse>(
    {
      ...response,
      ...toPublicRuntime(runtimeProof),
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

/**
 * The answering pipeline, reached only after the request has passed rate
 * limiting, size limits, input validation and bot protection.
 */
async function respondToAgentMessage(
  message: string,
  memory: AgentConversationMemory,
  startedAt: number
) {
  const { sessionContext } = memory;
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

function invalidRequestResponse(
  answer: string,
  startedAt: number,
  status: 400 | 403 | 413 | 415,
  debugCode: "invalid_request" | "verification_failed",
  sessionContext?: AgentSessionContext
) {
  return jsonAgentResponse(
    {
      answer,
      actions: [],
      quality: { score: MIN_AGENT_QUALITY_SCORE, passed: true }
    },
    getNoScopeJudgeProof(debugCode, "fallback"),
    startedAt,
    { status },
    sessionContext
  );
}

export async function POST(request: Request) {
  const startedAt = Date.now();

  // Throttle first, so a flood costs nothing beyond one shared-store lookup.
  const rateLimit = await applyRateLimit(request, {
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

  const body = await readJsonBody(request, MAX_BODY_BYTES);

  if (!body.ok) {
    return invalidRequestResponse(
      body.status === 413
        ? "Please send a shorter request so I can help you explore the portfolio."
        : "Please send a valid message so I can help you explore the portfolio.",
      startedAt,
      body.status,
      "invalid_request"
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
  const history =
    typeof payload === "object" && payload !== null && "history" in payload
      ? sanitizeAgentHistory(payload.history)
      : [];
  const sessionContext =
    typeof payload === "object" &&
    payload !== null &&
    "sessionContext" in payload
      ? sanitizeAgentSessionContext(payload.sessionContext)
      : { ...EMPTY_AGENT_SESSION_CONTEXT };
  const memory: AgentConversationMemory = {
    history,
    sessionContext
  };

  if (!message) {
    return invalidRequestResponse(
      "Please enter a question about Abdulelah's projects, blog insights, skills, resume, or hiring fit.",
      startedAt,
      400,
      "invalid_request",
      sessionContext
    );
  }

  if (message.length > MAX_MESSAGE_LENGTH) {
    return invalidRequestResponse(
      "Please shorten your question so I can give you a focused answer.",
      startedAt,
      400,
      "invalid_request",
      sessionContext
    );
  }

  // Turnstile runs before any model call. The first verified message mints a
  // short-lived signed cookie so the rest of the conversation is not
  // challenged again; the cookie is HttpOnly and server-signed.
  const botCheck = await checkBotProtection({
    request,
    token:
      typeof payload === "object" &&
      payload !== null &&
      "turnstileToken" in payload
        ? (payload as { turnstileToken: unknown }).turnstileToken
        : undefined,
    allowSessionGrant: true
  });

  if (!botCheck.ok) {
    return invalidRequestResponse(
      "I couldn't verify this request. Please reload the page and ask again.",
      startedAt,
      403,
      "verification_failed",
      sessionContext
    );
  }

  const response = await respondToAgentMessage(message, memory, startedAt);

  if (botCheck.grant) {
    response.headers.append("Set-Cookie", buildHumanGrantCookie(botCheck.grant));
  }

  return response;
}
