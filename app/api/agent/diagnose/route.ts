import { NextResponse } from "next/server";
import {
  getDeepSeekModel,
  hasDeepSeekApiKey
} from "@/lib/agent/deepseek";
import { classifyAgentMessage } from "@/lib/agent/safety";
import type { AgentDebugCode } from "@/types/agent";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_MESSAGE_LENGTH = 1_200;

function getDiagnosticCode(
  allowedBySafety: boolean,
  category: ReturnType<typeof classifyAgentMessage>["category"],
  hasDeepSeekKey: boolean
): AgentDebugCode {
  if (!allowedBySafety) {
    return category === "out-of-scope"
      ? "blocked_out_of_scope"
      : "blocked_prompt_injection";
  }

  return hasDeepSeekKey ? "sent_to_deepseek" : "missing_key";
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
      allowedBySafety: safety.allowed,
      wouldCallDeepSeek: safety.allowed && hasDeepSeekKey,
      model: getDeepSeekModel(),
      hasDeepSeekKey,
      debugCode: getDiagnosticCode(
        safety.allowed,
        safety.category,
        hasDeepSeekKey
      )
    },
    {
      headers: {
        "Cache-Control": "no-store"
      }
    }
  );
}
