import { NextResponse } from "next/server";
import { hasDeepSeekApiKey } from "@/lib/agent/deepseek";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Minimal status surface only: enough to confirm the agent runtime is wired,
// without disclosing the model id or deployment URL to anonymous callers.
export function GET() {
  return NextResponse.json(
    {
      status: "ok" as const,
      hasDeepSeekKey: hasDeepSeekApiKey(),
      runtime: "node" as const
    },
    {
      headers: {
        "Cache-Control": "no-store"
      }
    }
  );
}
