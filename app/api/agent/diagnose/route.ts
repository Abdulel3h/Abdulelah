import { NextResponse } from "next/server";
import {
  getDeepSeekModel,
  hasDeepSeekApiKey
} from "@/lib/agent/deepseek";
import { classifyAgentMessage } from "@/lib/agent/safety";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_MESSAGE_LENGTH = 1_200;

function getBlockedReason(
  category: ReturnType<typeof classifyAgentMessage>["category"]
) {
  if (category === "allowed") {
    return null;
  }

  if (category === "prompt-injection") {
    return "prompt_injection";
  }

  if (category === "sensitive-request") {
    return "sensitive_request";
  }

  return "out_of_scope";
}

export async function POST(request: Request) {
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

  return NextResponse.json(
    {
      hasDeepSeekKey,
      model: getDeepSeekModel(),
      allowedBySafety: safety.allowed,
      wouldCallDeepSeek: safety.allowed && hasDeepSeekKey,
      blockedReason: getBlockedReason(safety.category)
    },
    {
      headers: {
        "Cache-Control": "no-store"
      }
    }
  );
}
