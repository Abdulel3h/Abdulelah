import { Resend } from "resend";
import {
  createContactEmailSubject,
  createContactEmailText,
  sanitizeLine,
  validateContactRequest,
  type ContactFieldErrors
} from "@/lib/contact";
import {
  hasUrlEncodedContentType,
  readFormBody,
  readJsonBody
} from "@/lib/http/read-json-body";
import { isLocale, localizeHref, type Locale } from "@/lib/i18n/config";
import { applyRateLimit } from "@/lib/rate-limit";
import { checkBotProtection } from "@/lib/security/bot-check";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const DEFAULT_TO_EMAIL = "me@abdulelah.de";
const DEFAULT_FROM_EMAIL = "Portfolio Contact <onboarding@resend.dev>";
// Largest valid payload is a 5,000-character message plus short fields and a
// Turnstile token. Enforced against the bytes actually read.
const MAX_BODY_BYTES = 24_000;

type Outcome =
  | { kind: "sent" }
  | { kind: "invalid"; errors?: ContactFieldErrors }
  | { kind: "rate_limited"; retryAfterSeconds: number }
  | { kind: "verification" }
  | { kind: "unavailable" };

type Transport = "json" | "form";

const STATUS: Record<Outcome["kind"], number> = {
  sent: 200,
  invalid: 400,
  rate_limited: 429,
  verification: 403,
  unavailable: 500
};

/**
 * A native form post (the no-JavaScript fallback) must come from this site.
 * Browsers always send Origin on cross-site POSTs, so a mismatch — or no
 * provenance at all — is refused before anything is read or sent.
 */
function isSameOrigin(request: Request) {
  const origin = request.headers.get("origin");
  const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host");

  if (origin) {
    try {
      return Boolean(host) && new URL(origin).host === host;
    } catch {
      return false;
    }
  }

  return request.headers.get("sec-fetch-site") === "same-origin";
}

function respond(outcome: Outcome, transport: Transport, locale: Locale, request: Request) {
  if (transport === "form") {
    // Post/Redirect/Get: the result page never carries form data in its URL.
    const path = outcome.kind === "sent" ? "/contact/sent" : "/contact/failed";

    return Response.redirect(new URL(localizeHref(path, locale), request.url), 303);
  }

  const headers: HeadersInit =
    outcome.kind === "rate_limited" ? { "Retry-After": String(outcome.retryAfterSeconds) } : {};

  return Response.json(
    {
      success: outcome.kind === "sent",
      code: outcome.kind,
      ...(outcome.kind === "invalid" && outcome.errors ? { errors: outcome.errors } : {})
    },
    { status: STATUS[outcome.kind], headers }
  );
}

async function handle(request: Request, transport: Transport, body: Record<string, unknown>): Promise<Outcome> {
  const validation = validateContactRequest(body);

  // Honeypot: answer as if it succeeded so a bot learns nothing, and never
  // spend a Turnstile verification or an email on it.
  if (sanitizeLine(body.website)) {
    return { kind: "sent" };
  }

  if (!validation.ok) {
    return { kind: "invalid", errors: validation.errors };
  }

  const token = body.turnstileToken ?? body["cf-turnstile-response"];
  const botCheck = await checkBotProtection({ request, token });

  if (!botCheck.ok) {
    return { kind: "verification" };
  }

  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    return { kind: "unavailable" };
  }

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from: process.env.CONTACT_FROM_EMAIL || DEFAULT_FROM_EMAIL,
      to: process.env.CONTACT_TO_EMAIL || DEFAULT_TO_EMAIL,
      replyTo: validation.data.email,
      subject: createContactEmailSubject(validation.data),
      text: createContactEmailText(validation.data)
    });

    return error ? { kind: "unavailable" } : { kind: "sent" };
  } catch {
    return { kind: "unavailable" };
  }
}

export async function POST(request: Request) {
  const transport: Transport = hasUrlEncodedContentType(request) ? "form" : "json";
  let locale: Locale = "en";

  if (transport === "form" && !isSameOrigin(request)) {
    return Response.json({ success: false, code: "verification" }, { status: 403 });
  }

  const rateLimit = await applyRateLimit(request, {
    namespace: "contact",
    limit: 5,
    windowMs: 15 * 60_000
  });

  if (!rateLimit.allowed) {
    return respond({ kind: "rate_limited", retryAfterSeconds: rateLimit.retryAfterSeconds }, transport, locale, request);
  }

  const parsed =
    transport === "form"
      ? await readFormBody(request, MAX_BODY_BYTES)
      : await readJsonBody(request, MAX_BODY_BYTES);

  if (!parsed.ok || typeof parsed.data !== "object" || parsed.data === null || Array.isArray(parsed.data)) {
    return respond({ kind: "invalid" }, transport, locale, request);
  }

  const body = parsed.data as Record<string, unknown>;

  if (isLocale(body.locale)) {
    locale = body.locale;
  }

  return respond(await handle(request, transport, body), transport, locale, request);
}
