import { NextResponse } from "next/server";
import {
  getDeepSeekModel,
  hasDeepSeekApiKey
} from "@/lib/agent/deepseek";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export function GET() {
  return NextResponse.json(
    {
      hasDeepSeekKey: hasDeepSeekApiKey(),
      model: getDeepSeekModel(),
      siteUrl: process.env.NEXT_PUBLIC_SITE_URL?.trim() || null,
      runtime: "node" as const
    },
    {
      headers: {
        "Cache-Control": "no-store"
      }
    }
  );
}
