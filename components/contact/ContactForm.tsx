"use client";

import { AlertCircle, CheckCircle2, Loader2, Send } from "lucide-react";
import Link from "next/link";
import { useRef, useState, useSyncExternalStore, type FormEvent } from "react";
import { useTurnstile } from "@/components/security/useTurnstile";
import {
  CONTACT_MAX_LENGTHS,
  CONTACT_PAGE_INTERESTS,
  validateContactRequest,
  type ContactField,
  type ContactFieldError,
  type ContactFieldErrors
} from "@/lib/contact";
import { trackEvent } from "@/lib/analytics";
import { localizeHref, type Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import { cn } from "@/lib/utils";

type FormCopy = Dictionary["contact"]["form"];
type Status = "idle" | "sending" | "sent" | "invalid" | "rate_limited" | "verification" | "error" | "offline";

const FIELD_ORDER: ContactField[] = ["name", "email", "company", "interestType", "message"];

const subscribeNever = () => () => undefined;

/**
 * The contact form.
 *
 * - A real POST to /api/contact: with JavaScript it is sent as JSON; without
 *   it, the browser posts the form (same-origin checked on the server) and
 *   lands on a result page. Contact details never end up in a URL.
 * - Validation is shared with the server; the first invalid field receives
 *   focus and every error is tied to its field with aria-describedby.
 * - A failed send keeps everything the visitor typed.
 */
export function ContactForm({
  copy,
  locale,
  email
}: {
  copy: FormCopy;
  locale: Locale;
  email: string;
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const statusRef = useRef<HTMLDivElement>(null);
  const { containerRef, getToken } = useTurnstile();
  // false during server render and hydration, true once the script runs:
  // native validation stays on until the form can validate itself.
  const enhanced = useSyncExternalStore(
    subscribeNever,
    () => true,
    () => false
  );
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<ContactFieldErrors>({});

  function errorText(error: ContactFieldError | undefined, field: ContactField) {
    if (!error) return "";
    if (error === "too_long") return copy.errors.tooLong;
    if (error === "email") return copy.errors.emailInvalid;
    if (error === "interest") return copy.errors.interestInvalid;
    if (field === "name") return copy.errors.nameRequired;
    if (field === "email") return copy.errors.emailRequired;

    return copy.errors.messageRequired;
  }

  function focusFirstInvalid(fieldErrors: ContactFieldErrors) {
    const first = FIELD_ORDER.find((field) => fieldErrors[field]);

    if (first) {
      formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (status === "sending") return;

    const form = event.currentTarget;
    const values = Object.fromEntries(new FormData(form).entries()) as Record<string, string>;
    const validation = validateContactRequest({ ...values, source: "contact-page" });

    if (!validation.ok) {
      setErrors(validation.errors);
      setStatus("invalid");
      focusFirstInvalid(validation.errors);
      return;
    }

    setErrors({});
    setStatus("sending");

    try {
      const turnstileToken = await getToken();
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, source: "contact-page", locale, turnstileToken })
      });
      const payload = (await response.json().catch(() => ({}))) as {
        code?: string;
        errors?: ContactFieldErrors;
      };

      if (response.ok) {
        form.reset();
        setStatus("sent");
        trackEvent("contact_submitted", { source: "contact-page" });
        window.requestAnimationFrame(() => statusRef.current?.focus());
        return;
      }

      if (response.status === 400 && payload.errors) {
        setErrors(payload.errors);
        setStatus("invalid");
        focusFirstInvalid(payload.errors);
        return;
      }

      setStatus(
        response.status === 429 ? "rate_limited" : response.status === 403 ? "verification" : "error"
      );
    } catch {
      setStatus(typeof navigator !== "undefined" && !navigator.onLine ? "offline" : "error");
    }
  }

  const sending = status === "sending";
  const describedBy = (field: ContactField, hintId?: string) =>
    [hintId, errors[field] ? `contact-${field}-error` : undefined].filter(Boolean).join(" ") || undefined;

  function fieldError(field: ContactField) {
    const message = errorText(errors[field], field);

    return message ? (
      <p id={`contact-${field}-error`} className="flex items-center gap-1.5 text-sm text-[#F0A28F]">
        <AlertCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
        {message}
      </p>
    ) : null;
  }

  function fieldLabel(field: ContactField, text: string, required: boolean) {
    return (
      <label htmlFor={`contact-${field}`} className="flex flex-wrap items-baseline gap-x-2 text-sm font-medium text-paper">
        {text}
        <span className={cn("text-xs font-normal", required ? "text-accent-soft" : "text-paper-dim")}>
          ({required ? copy.required : copy.optional})
        </span>
      </label>
    );
  }

  return (
    <form
      ref={formRef}
      method="post"
      action="/api/contact"
      noValidate={enhanced}
      onSubmit={handleSubmit}
      aria-labelledby="contact-form-title"
      aria-busy={sending || undefined}
      className="premium-panel p-5 sm:p-7"
    >
      <h2 id="contact-form-title" className="sr-only">
        {copy.title}
      </h2>
      <input type="hidden" name="locale" value={locale} />
      <input type="hidden" name="source" value="contact-page" />

      <div className="relative grid gap-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="grid gap-2">
            {fieldLabel("name", copy.name, true)}
            <input
              id="contact-name"
              name="name"
              type="text"
              required
              dir="auto"
              autoComplete="name"
              maxLength={CONTACT_MAX_LENGTHS.name}
              placeholder={copy.namePlaceholder}
              aria-invalid={errors.name ? true : undefined}
              aria-describedby={describedBy("name")}
              className="field-control h-12"
            />
            {fieldError("name")}
          </div>

          <div className="grid gap-2">
            {fieldLabel("email", copy.email, true)}
            <input
              id="contact-email"
              name="email"
              type="email"
              required
              dir="ltr"
              inputMode="email"
              autoComplete="email"
              spellCheck={false}
              maxLength={CONTACT_MAX_LENGTHS.email}
              placeholder={copy.emailPlaceholder}
              aria-invalid={errors.email ? true : undefined}
              aria-describedby={describedBy("email")}
              className="field-control h-12 rtl:text-right"
            />
            {fieldError("email")}
          </div>

          <div className="grid gap-2">
            {fieldLabel("company", copy.company, false)}
            <input
              id="contact-company"
              name="company"
              type="text"
              dir="auto"
              autoComplete="organization"
              maxLength={CONTACT_MAX_LENGTHS.company}
              placeholder={copy.companyPlaceholder}
              aria-invalid={errors.company ? true : undefined}
              aria-describedby={describedBy("company")}
              className="field-control h-12"
            />
            {fieldError("company")}
          </div>

          <div className="grid gap-2">
            {fieldLabel("interestType", copy.interest, true)}
            <div className="relative">
              <select
                id="contact-interestType"
                name="interestType"
                required
                defaultValue="Hiring"
                aria-invalid={errors.interestType ? true : undefined}
                aria-describedby={describedBy("interestType")}
                className="field-control h-12 appearance-none pe-10"
              >
                {CONTACT_PAGE_INTERESTS.map((interest) => (
                  <option key={interest} value={interest} className="bg-ink-800 text-paper">
                    {copy.interests[interest]}
                  </option>
                ))}
              </select>
              <svg
                aria-hidden="true"
                viewBox="0 0 16 16"
                className="pointer-events-none absolute end-4 top-1/2 h-4 w-4 -translate-y-1/2 text-paper-dim"
              >
                <path d="M4 6l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            {fieldError("interestType")}
          </div>
        </div>

        <div className="grid gap-2">
          {fieldLabel("message", copy.message, true)}
          <textarea
            id="contact-message"
            name="message"
            required
            dir="auto"
            rows={6}
            maxLength={CONTACT_MAX_LENGTHS.message}
            placeholder={copy.messagePlaceholder}
            aria-invalid={errors.message ? true : undefined}
            aria-describedby={describedBy("message", "contact-message-hint")}
            className="field-control min-h-36 resize-y py-3"
          />
          <p id="contact-message-hint" className="text-xs text-paper-dim">
            {copy.messageHint}
          </p>
          {fieldError("message")}
        </div>

        {/* Honeypot for bots. Off-screen, out of the tab order, and removed
            from the accessibility tree (aria-hidden + inert), but still a real
            field so naive bots fill it. */}
        <div aria-hidden="true" inert className="absolute -start-[10000px] top-auto h-px w-px overflow-hidden">
          <label htmlFor="contact-website">Website</label>
          <input id="contact-website" type="text" name="website" tabIndex={-1} autoComplete="off" defaultValue="" />
        </div>

        <div ref={containerRef} className="empty:hidden" />

        <div
          ref={statusRef}
          tabIndex={-1}
          role="status"
          aria-live="polite"
          aria-atomic="true"
          className="empty:hidden focus:outline-none"
        >
          {status === "sent" ? (
            <p className="flex items-start gap-2 rounded-xl border border-accent/35 bg-accent/10 px-4 py-3 text-sm text-paper">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden="true" />
              <span>
                <strong className="font-semibold">{copy.successTitle}. </strong>
                {copy.success}
              </span>
            </p>
          ) : null}
          {status === "sending" ? <span className="sr-only">{copy.sending}</span> : null}
          {status === "invalid" ? (
            <p className="rounded-xl border border-[#E5816B]/40 bg-[#E5816B]/10 px-4 py-3 text-sm text-paper">
              {copy.errors.summary}
            </p>
          ) : null}
          {status === "rate_limited" || status === "verification" || status === "error" || status === "offline" ? (
            <p className="rounded-xl border border-[#E5816B]/40 bg-[#E5816B]/10 px-4 py-3 text-sm leading-6 text-paper">
              {status === "rate_limited"
                ? copy.rateLimited
                : status === "verification"
                  ? copy.verification
                  : status === "offline"
                    ? copy.networkError
                    : (
                      <>
                        {copy.serverError}{" "}
                        <a href={`mailto:${email}`} className="font-semibold underline underline-offset-4" dir="ltr">
                          {email}
                        </a>
                        .
                      </>
                    )}
            </p>
          ) : null}
        </div>

        <div className="flex flex-col gap-4 border-t border-white/[0.08] pt-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-sm text-xs leading-5 text-paper-dim">
            {copy.privacy}{" "}
            <Link
              href={localizeHref("/privacy", locale)}
              className="focus-ring rounded font-semibold text-paper underline decoration-accent/50 underline-offset-4 hover:text-accent-soft"
            >
              {copy.privacyLink}
            </Link>
          </p>
          <button
            type="submit"
            disabled={sending}
            aria-disabled={sending || undefined}
            className="focus-ring inline-flex h-12 w-full shrink-0 items-center justify-center gap-2 rounded-full bg-accent px-6 text-sm font-semibold text-ink-900 transition hover:bg-accent-soft disabled:cursor-wait disabled:opacity-70 sm:w-auto"
          >
            {sending ? (
              <Loader2 className="h-4 w-4 animate-spin motion-reduce:animate-none" aria-hidden="true" />
            ) : (
              <Send className="h-4 w-4 rtl:-scale-x-100" aria-hidden="true" />
            )}
            {sending ? copy.sending : copy.submit}
          </button>
        </div>
      </div>
    </form>
  );
}
