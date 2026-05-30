import { NextResponse } from "next/server";
import { getAgentActions, getPortfolioRedirectActions } from "@/lib/agent/actions";
import { buildPortfolioContext } from "@/lib/agent/context";
import {
  askDeepSeek,
  getDeepSeekErrorCode,
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
  AgentDebugCode
} from "@/types/agent";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_MESSAGE_LENGTH = 1_200;
const IS_DEVELOPMENT = process.env.NODE_ENV === "development";

function jsonAgentResponse(
  response: Omit<AgentApiResponse, "debugCode">,
  init?: ResponseInit,
  debugCode?: AgentDebugCode
) {
  if (IS_DEVELOPMENT) {
    console.info("[agent]", {
      mode: response.mode,
      errorCode: debugCode
    });
  }

  return NextResponse.json<AgentApiResponse>(
    {
      ...response,
      ...(IS_DEVELOPMENT && debugCode ? { debugCode } : {})
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
  debugCode?: AgentDebugCode
) {
  const evaluation = evaluateAgentAnswer({ actions, answer, safety });

  return jsonAgentResponse(
    {
      answer,
      actions,
      mode: "fallback",
      quality: {
        score: evaluation.score,
        passed: evaluation.passed
      }
    },
    undefined,
    debugCode
  );
}

function fallbackResponse(
  message: string,
  safety: AgentSafetyResult,
  debugCode?: AgentDebugCode
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
        mode: "fallback",
        quality: {
          score: evaluation.score,
          passed: true
        }
      },
      undefined,
      debugCode
    );
  }

  return createSafeResponse(
    getPortfolioScopeResponse(),
    message,
    { allowed: false, category: "out-of-scope" },
    getPortfolioRedirectActions(),
    debugCode
  );
}

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return jsonAgentResponse(
      {
        answer: "Please send a valid message so I can help you explore the portfolio.",
        actions: [],
        mode: "fallback",
        quality: { score: MIN_AGENT_QUALITY_SCORE, passed: true }
      },
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
        mode: "fallback",
        quality: { score: MIN_AGENT_QUALITY_SCORE, passed: true }
      },
      { status: 400 }
    );
  }

  if (message.length > MAX_MESSAGE_LENGTH) {
    return jsonAgentResponse(
      {
        answer: "Please shorten your question so I can give you a focused answer.",
        actions: [],
        mode: "fallback",
        quality: { score: MIN_AGENT_QUALITY_SCORE, passed: true }
      },
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
        mode: "fallback",
        quality: { score: 100, passed: true }
      },
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
    return fallbackResponse(message, safety);
  }

  if (!hasDeepSeekApiKey()) {
    return fallbackResponse(message, safety, "missing_key");
  }

  try {
    const actions = getAgentActions(message);
    const answer = await askDeepSeek(message, buildPortfolioContext());
    const evaluation = evaluateAgentAnswer({ actions, answer, safety });

    if (!evaluation.passed) {
      return fallbackResponse(message, safety, "model_error");
    }

    return jsonAgentResponse({
      answer,
      actions,
      mode: "deepseek",
      quality: {
        score: evaluation.score,
        passed: true
      }
    });
  } catch (error) {
    return fallbackResponse(message, safety, getDeepSeekErrorCode(error));
  }
}
