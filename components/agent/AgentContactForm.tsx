"use client";

import Link from "next/link";
import { ArrowLeft, Send, X } from "lucide-react";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { useI18n } from "@/components/i18n/LocaleProvider";
import { useTurnstile } from "@/components/security/useTurnstile";
import { siteConfig } from "@/data/site";
import { trackEvent } from "@/lib/analytics";
import { AGENT_CONTACT_INTENTS, CONTACT_MAX_LENGTHS, type AgentContactIntent } from "@/lib/contact";

type Status = "idle" | "success" | "error" | "unverified" | "rate_limited" | "invalid";

/** A short message form inside the guide. Delivered by email, never to the AI. */
export function AgentContactForm({ onClose }: { onClose: () => void }) {
  const { t, href, locale } = useI18n();
  const c = t.agent.contactForm;
  const nameInputRef = useRef<HTMLInputElement>(null);
  const { containerRef, getToken } = useTurnstile();
  const [intent, setIntent] = useState<AgentContactIntent | null>(null);
  const [isSending, setIsSending] = useState(false);
  const [status, setStatus] = useState<Status>("idle");

  useEffect(() => {
    if (intent) {
      nameInputRef.current?.focus();
    }
  }, [intent]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!intent || isSending) return;

    const form = event.currentTarget;
    const formData = new FormData(form);

    setIsSending(true);
    setStatus("idle");

    try {
      const turnstileToken = await getToken();
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.get("name"),
          email: formData.get("email"),
          company: formData.get("company"),
          interestType: intent,
          message: formData.get("message"),
          website: formData.get("website"),
          source: "agent-abdulelah",
          locale,
          turnstileToken
        })
      });

      if (response.ok) {
        form.reset();
        setStatus("success");
        trackEvent("contact_submitted", { source: "guide" });
        return;
      }

      setStatus(
        response.status === 403
          ? "unverified"
          : response.status === 429
            ? "rate_limited"
            : response.status === 400
              ? "invalid"
              : "error"
      );
    } catch {
      setStatus("error");
    } finally {
      setIsSending(false);
    }
  }

  const fieldClass = "field-control h-11";

  return (
    <section
      id="agent-contact"
      aria-labelledby="agent-contact-title"
      className="rounded-2xl border border-accent/30 bg-accent/[0.07] p-4"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 id="agent-contact-title" className="text-sm font-semibold text-paper">
            {c.title}
          </h3>
          <p className="mt-1 text-xs leading-5 text-paper-dim">{c.body}</p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="focus-ring grid h-10 w-10 shrink-0 place-items-center rounded-full border border-white/[0.12] text-paper-dim transition hover:text-paper"
          aria-label={c.close}
        >
          <X className="h-3.5 w-3.5" aria-hidden="true" />
        </button>
      </div>

      {intent ? (
        <form className="mt-4 grid gap-3" onSubmit={handleSubmit}>
          <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-white/10 bg-white/[0.035] px-3 py-2">
            <p className="text-xs text-paper-dim">
              {c.intentLabel}: <span className="font-semibold text-accent-soft">{c.intents[intent]}</span>
            </p>
            <button
              type="button"
              onClick={() => {
                setIntent(null);
                setStatus("idle");
              }}
              className="focus-ring inline-flex min-h-9 items-center gap-1 rounded-full px-2 text-xs font-semibold text-accent-soft transition hover:text-paper"
            >
              <ArrowLeft className="h-3 w-3 rtl:-scale-x-100" aria-hidden="true" />
              {c.change}
            </button>
          </div>
          <label className="grid gap-1.5 text-xs font-medium text-paper">
            {c.name}
            <input
              ref={nameInputRef}
              required
              name="name"
              dir="auto"
              autoComplete="name"
              maxLength={CONTACT_MAX_LENGTHS.name}
              className={fieldClass}
            />
          </label>
          <label className="grid gap-1.5 text-xs font-medium text-paper">
            {c.email}
            <input
              required
              type="email"
              name="email"
              dir="ltr"
              inputMode="email"
              autoComplete="email"
              maxLength={CONTACT_MAX_LENGTHS.email}
              className={`${fieldClass} rtl:text-right`}
            />
          </label>
          <label className="grid gap-1.5 text-xs font-medium text-paper">
            <span>
              {c.company} <span className="font-normal text-paper-dim">({c.optional})</span>
            </span>
            <input
              name="company"
              dir="auto"
              autoComplete="organization"
              maxLength={CONTACT_MAX_LENGTHS.company}
              className={fieldClass}
            />
          </label>
          <label className="grid gap-1.5 text-xs font-medium text-paper">
            {c.message}
            <textarea
              required
              name="message"
              dir="auto"
              rows={4}
              maxLength={CONTACT_MAX_LENGTHS.message}
              placeholder={c.messagePlaceholder}
              className="field-control min-h-24 resize-y py-2.5"
            />
          </label>

          {/* Honeypot: invisible, unfocusable and absent from the accessibility tree. */}
          <div aria-hidden="true" inert className="absolute -start-[10000px] h-px w-px overflow-hidden">
            <label htmlFor="agent-contact-website">Website</label>
            <input id="agent-contact-website" type="text" name="website" tabIndex={-1} autoComplete="off" defaultValue="" />
          </div>

          <div ref={containerRef} className="empty:hidden" />

          <div role="status" aria-live="polite" className="empty:hidden">
            {status === "success" ? (
              <p className="rounded-xl border border-accent/35 bg-accent/10 px-3 py-2 text-xs leading-5 text-paper">
                {c.success}
              </p>
            ) : null}
            {status === "unverified" || status === "rate_limited" || status === "invalid" ? (
              <p className="rounded-xl border border-[#E5816B]/40 bg-[#E5816B]/10 px-3 py-2 text-xs leading-5 text-paper">
                {status === "unverified" ? c.unverified : status === "rate_limited" ? c.rateLimited : c.invalid}
              </p>
            ) : null}
            {status === "error" ? (
              <p className="rounded-xl border border-[#E5816B]/40 bg-[#E5816B]/10 px-3 py-2 text-xs leading-5 text-paper">
                {c.error}{" "}
                <a href={`mailto:${siteConfig.email}`} className="font-semibold underline underline-offset-2" dir="ltr">
                  {siteConfig.email}
                </a>
                .
              </p>
            ) : null}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3">
            <Link
              href={href("/privacy")}
              className="focus-ring rounded text-xs text-paper-dim underline underline-offset-4 transition hover:text-paper"
            >
              {c.privacy}
            </Link>
            <button
              type="submit"
              disabled={isSending}
              className="focus-ring inline-flex h-10 items-center gap-2 rounded-full bg-accent px-4 text-xs font-semibold text-ink-900 transition hover:bg-accent-soft disabled:opacity-70"
            >
              <Send className="h-3.5 w-3.5 rtl:-scale-x-100" aria-hidden="true" />
              {isSending ? c.sending : c.submit}
            </button>
          </div>
        </form>
      ) : (
        <fieldset className="mt-4">
          <legend className="text-xs font-semibold text-paper">{c.intentLegend}</legend>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {AGENT_CONTACT_INTENTS.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setIntent(option)}
                className="focus-ring min-h-11 rounded-xl border border-white/[0.12] bg-white/[0.035] px-3 py-2 text-start text-xs font-semibold leading-5 text-paper transition hover:border-accent/40 hover:bg-accent/10"
              >
                {c.intents[option]}
              </button>
            ))}
          </div>
          <Link
            href={href("/privacy")}
            className="focus-ring mt-3 inline-block rounded text-xs text-paper-dim underline underline-offset-4 transition hover:text-paper"
          >
            {c.privacy}
          </Link>
        </fieldset>
      )}
    </section>
  );
}
