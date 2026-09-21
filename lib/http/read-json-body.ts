/**
 * Request body readers with a hard byte ceiling.
 *
 * `Content-Length` is only a hint — it can be absent on chunked requests and
 * it can simply lie — so the stream itself is measured as it arrives and
 * cancelled the moment it crosses the limit. Nothing oversized is ever fully
 * buffered.
 *
 * `readJsonBody` requires a JSON content type: a cross-origin HTML form can
 * only send simple content types, so JSON endpoints refuse form-driven CSRF
 * before any body is read. `readFormBody` exists for the contact form's
 * no-JavaScript fallback; callers must pair it with an Origin check.
 */

export type JsonBodyResult =
  | { ok: true; data: unknown }
  | { ok: false; status: 400 | 413 | 415 };

export type FormBodyResult =
  | { ok: true; data: Record<string, string> }
  | { ok: false; status: 400 | 413 | 415 };

type TextResult = { ok: true; text: string } | { ok: false; status: 400 | 413 };

function contentType(request: Request) {
  return request.headers.get("content-type")?.trim() ?? "";
}

export function hasJsonContentType(request: Request) {
  return /^application\/(?:[\w.+-]+\+)?json\s*(?:;|$)/i.test(contentType(request));
}

export function hasUrlEncodedContentType(request: Request) {
  return /^application\/x-www-form-urlencoded\s*(?:;|$)/i.test(contentType(request));
}

function exceedsDeclaredLength(request: Request, maxBytes: number) {
  const header = request.headers.get("content-length");

  if (!header) {
    return false;
  }

  const declared = Number(header);

  return Number.isFinite(declared) && declared > maxBytes;
}

async function readLimitedText(request: Request, maxBytes: number): Promise<TextResult> {
  // Cheap pre-check so honest oversized clients are rejected before any read.
  if (exceedsDeclaredLength(request, maxBytes)) {
    return { ok: false, status: 413 };
  }

  const body = request.body;

  if (!body) {
    const text = await request.text().catch(() => "");

    return new TextEncoder().encode(text).byteLength > maxBytes
      ? { ok: false, status: 413 }
      : { ok: true, text };
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

  return { ok: true, text: new TextDecoder().decode(merged) };
}

export async function readJsonBody(request: Request, maxBytes: number): Promise<JsonBodyResult> {
  if (!hasJsonContentType(request)) {
    return { ok: false, status: 415 };
  }

  const result = await readLimitedText(request, maxBytes);

  if (!result.ok) {
    return result;
  }

  try {
    return { ok: true, data: JSON.parse(result.text) };
  } catch {
    return { ok: false, status: 400 };
  }
}

export async function readFormBody(request: Request, maxBytes: number): Promise<FormBodyResult> {
  if (!hasUrlEncodedContentType(request)) {
    return { ok: false, status: 415 };
  }

  const result = await readLimitedText(request, maxBytes);

  if (!result.ok) {
    return result;
  }

  try {
    const params = new URLSearchParams(result.text);
    const data: Record<string, string> = {};

    params.forEach((value, key) => {
      if (!(key in data)) {
        data[key] = value;
      }
    });

    return { ok: true, data };
  } catch {
    return { ok: false, status: 400 };
  }
}
