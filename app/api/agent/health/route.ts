import { NextResponse } from "next/server";
import {
  getDeepSeekModel,
  hasDeepSeekApiKey
} from "@/lib/agent/deepseek";
import { siteUrl } from "@/data/site";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export function GET() {
  return NextResponse.json(
    {
      hasDeepSeekKey: hasDeepSeekApiKey(),
      model: getDeepSeekModel(),
      siteUrl,
      runtime: "node" as const
    },
    {
      headers: {
        "Cache-Control": "no-store"
      }
    }
  );
}
