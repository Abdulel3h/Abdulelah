import { NextResponse } from "next/server";
import { getAgentActions, getPortfolioRedirectActions } from "@/lib/agent/actions";
import { buildPortfolioContext } from "@/lib/agent/context";
import { askDeepSeek, hasDeepSeekApiKey } from "@/lib/agent/deepseek";
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
import type { AgentApiResponse } from "@/types/agent";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_MESSAGE_LENGTH = 1_200;

function createSafeResponse(
  answer: string,
  message: string,
  safety: AgentSafetyResult,
  actions = safety.allowed
    ? getAgentActions(message)
    : getPortfolioRedirectActions()
) {
  const evaluation = evaluateAgentAnswer({ actions, answer, safety });

  return NextResponse.json<AgentApiResponse>({
    answer,
    actions,
    mode: "fallback",
    quality: {
      score: evaluation.score,
      passed: evaluation.passed
    }
  });
}

function fallbackResponse(message: string, safety: AgentSafetyResult) {
  const actions = safety.allowed
    ? getAgentActions(message)
    : getPortfolioRedirectActions();
  const answer = safety.allowed
    ? getFallbackAgentResponse(message)
    : getSafetyRefusal(safety);
  const evaluation = evaluateAgentAnswer({ actions, answer, safety });

  if (evaluation.passed) {
    return NextResponse.json<AgentApiResponse>({
      answer,
      actions,
      mode: "fallback",
      quality: {
        score: evaluation.score,
        passed: true
      }
    });
  }

  return createSafeResponse(
    getPortfolioScopeResponse(),
    message,
    { allowed: false, category: "out-of-scope" },
    getPortfolioRedirectActions()
  );
}

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json<AgentApiResponse>(
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
    return NextResponse.json<AgentApiResponse>(
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
    return NextResponse.json<AgentApiResponse>(
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
    return NextResponse.json<AgentApiResponse>(
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
    return fallbackResponse(message, safety);
  }

  try {
    const actions = getAgentActions(message);
    const answer = await askDeepSeek(message, buildPortfolioContext());
    const evaluation = evaluateAgentAnswer({ actions, answer, safety });

    if (!evaluation.passed) {
      return fallbackResponse(message, safety);
    }

    return NextResponse.json<AgentApiResponse>({
      answer,
      actions,
      mode: "deepseek",
      quality: {
        score: evaluation.score,
        passed: true
      }
    });
  } catch {
    return fallbackResponse(message, safety);
  }
}
