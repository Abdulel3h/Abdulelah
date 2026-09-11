import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Public liveness probe. It deliberately says nothing about which API keys are
 * configured, which model is used, or how the runtime is wired — that is
 * reconnaissance material, not health information.
 */
export function GET() {
  return NextResponse.json(
    { status: "ok" as const },
    {
      headers: {
        "Cache-Control": "no-store"
      }
    }
  );
}
