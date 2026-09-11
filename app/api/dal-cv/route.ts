import { readFile } from "node:fs/promises";
import path from "node:path";
import { cookies } from "next/headers";
import {
  DAL_ACCESS_COOKIE,
  verifyDalAccessToken
} from "@/lib/security/dal-access";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// The CV lives outside /public precisely so it cannot be fetched directly;
// it is only ever served through this authorization check.
const CV_FILE_NAME = "Abdulelah_Alkhathami_Dal_AI_Data_CV.pdf";

export async function GET() {
  const cookieStore = await cookies();
  const isAuthorized = await verifyDalAccessToken(
    cookieStore.get(DAL_ACCESS_COOKIE)?.value
  );

  if (!isAuthorized) {
    // 404 rather than 403: an unauthorized visitor learns nothing about it.
    return new Response(null, { status: 404 });
  }

  try {
    const file = await readFile(
      path.join(process.cwd(), "private", "dal", CV_FILE_NAME)
    );

    return new Response(new Uint8Array(file), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${CV_FILE_NAME}"`,
        "Cache-Control": "private, no-store",
        "X-Robots-Tag": "noindex, nofollow"
      }
    });
  } catch {
    return new Response(null, { status: 404 });
  }
}
