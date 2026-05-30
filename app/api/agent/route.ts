import { NextResponse } from "next/server";
import { getAgentActions } from "@/lib/agent/actions";
import { buildPortfolioContext } from "@/lib/agent/context";
import { askDeepSeek, hasDeepSeekApiKey } from "@/lib/agent/deepseek";
import { getFallbackAgentResponse } from "@/lib/agent/fallback";
import type { AgentApiResponse } from "@/types/agent";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_MESSAGE_LENGTH = 1_200;

function fallbackResponse(message: string) {
  return NextResponse.json<AgentApiResponse>({
    answer: getFallbackAgentResponse(message),
    actions: getAgentActions(message),
    mode: "fallback"
  });
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
        mode: "fallback"
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
        mode: "fallback"
      },
      { status: 400 }
    );
  }

  if (message.length > MAX_MESSAGE_LENGTH) {
    return NextResponse.json<AgentApiResponse>(
      {
        answer: "Please shorten your question so I can give you a focused answer.",
        actions: [],
        mode: "fallback"
      },
      { status: 400 }
    );
  }

  const portfolioContext = buildPortfolioContext();

  if (!hasDeepSeekApiKey()) {
    return fallbackResponse(message);
  }

  try {
    const answer = await askDeepSeek(message, portfolioContext);

    return NextResponse.json<AgentApiResponse>({
      answer,
      actions: getAgentActions(message),
      mode: "deepseek"
    });
  } catch {
    return fallbackResponse(message);
  }
}
