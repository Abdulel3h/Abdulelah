/**
 * JSON body reader with a hard byte ceiling.
 *
 * `Content-Length` is only a hint — it can be absent on chunked requests and
 * it can simply lie — so the stream itself is measured as it arrives and
 * cancelled the moment it crosses the limit. Nothing oversized is ever fully
 * buffered.
 *
 * A JSON content type is also required. A cross-origin HTML form can only send
 * simple content types, so this refuses form-driven CSRF submissions before
 * any body is read.
 */

export type JsonBodyResult =
  | { ok: true; data: unknown }
  | { ok: false; status: 400 | 413 | 415 };

function hasJsonContentType(request: Request) {
  const contentType = request.headers.get("content-type")?.trim() ?? "";

  return /^application\/(?:[\w.+-]+\+)?json\s*(?:;|$)/i.test(contentType);
}

function exceedsDeclaredLength(request: Request, maxBytes: number) {
  const header = request.headers.get("content-length");

  if (!header) {
    return false;
  }

  const declared = Number(header);

  return Number.isFinite(declared) && declared > maxBytes;
}

function parseJson(text: string): JsonBodyResult {
  try {
    return { ok: true, data: JSON.parse(text) };
  } catch {
    return { ok: false, status: 400 };
  }
}

export async function readJsonBody(
  request: Request,
  maxBytes: number
): Promise<JsonBodyResult> {
  if (!hasJsonContentType(request)) {
    return { ok: false, status: 415 };
  }

  // Cheap pre-check so honest oversized clients are rejected before any read.
  if (exceedsDeclaredLength(request, maxBytes)) {
    return { ok: false, status: 413 };
  }

  const body = request.body;

  if (!body) {
    const text = await request.text().catch(() => "");

    return new TextEncoder().encode(text).byteLength > maxBytes
      ? { ok: false, status: 413 }
      : parseJson(text);
  }

  const reader = body.getReader();
  const chunks: Uint8Array[] = [];
  let receivedBytes = 0;

  try {
    for (;;) {
      const { done, value } = await reader.read();

      if (done) {
        break;
      }

      if (!value?.byteLength) {
        continue;
      }

      receivedBytes += value.byteLength;

      if (receivedBytes > maxBytes) {
        await reader.cancel().catch(() => undefined);

        return { ok: false, status: 413 };
      }

      chunks.push(value);
    }
  } catch {
    return { ok: false, status: 400 };
  }

  const merged = new Uint8Array(receivedBytes);
  let offset = 0;

  for (const chunk of chunks) {
    merged.set(chunk, offset);
    offset += chunk.byteLength;
  }

  return parseJson(new TextDecoder().decode(merged));
}
