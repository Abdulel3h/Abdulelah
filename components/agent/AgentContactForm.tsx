"use client";

import Link from "next/link";
import { Send, X } from "lucide-react";
import { FormEvent, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const SUCCESS_MESSAGE = "Your message was sent to Abdulelah successfully.";

export function AgentContactForm({ onClose }: { onClose: () => void }) {
  const nameInputRef = useRef<HTMLInputElement>(null);
  const [isSending, setIsSending] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  useEffect(() => {
    nameInputRef.current?.focus();
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);

    setIsSending(true);
    setStatus("idle");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: formData.get("name"),
          email: formData.get("email"),
          company: formData.get("company"),
          interestType: "AI Navigator",
          message: formData.get("message"),
          website: formData.get("website"),
          source: "ai-navigator"
        })
      });

      if (!response.ok) {
        throw new Error("Unable to send Navigator message.");
      }

      form.reset();
      setStatus("success");
    } catch {
      setStatus("error");
    } finally {
      setIsSending(false);
    }
  }

  return (
    <section
      id="agent-contact"
      aria-labelledby="agent-contact-title"
      className="rounded-2xl border border-gold/25 bg-gold/[0.07] p-4"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 id="agent-contact-title" className="text-sm font-semibold text-white">
            Send Abdulelah a message
          </h3>
          <p className="mt-1 text-xs leading-5 text-slate-400">
            Your message is sent privately to Abdulelah&apos;s email through Resend.
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="focus-ring grid h-8 w-8 shrink-0 place-items-center rounded-full border border-white/10 text-slate-400 transition hover:text-white"
          aria-label="Close message form"
        >
          <X className="h-3.5 w-3.5" aria-hidden="true" />
        </button>
      </div>

      <form className="mt-4 grid gap-3" onSubmit={handleSubmit}>
        <label className="grid gap-1.5 text-xs font-medium text-slate-200">
          Name
          <Input
            ref={nameInputRef}
            required
            name="name"
            autoComplete="name"
            maxLength={120}
            placeholder="Your name"
          />
        </label>
        <label className="grid gap-1.5 text-xs font-medium text-slate-200">
          Email
          <Input
            required
            type="email"
            name="email"
            autoComplete="email"
            maxLength={254}
            placeholder="you@example.com"
          />
        </label>
        <label className="grid gap-1.5 text-xs font-medium text-slate-200">
          Company <span className="text-slate-500">Optional</span>
          <Input
            name="company"
            autoComplete="organization"
            maxLength={160}
            placeholder="Company or organization"
          />
        </label>
        <label className="grid gap-1.5 text-xs font-medium text-slate-200">
          Message
          <Textarea
            required
            name="message"
            rows={4}
            maxLength={5_000}
            placeholder="Tell Abdulelah about the role or opportunity."
          />
        </label>

        <div className="absolute -left-[9999px] h-px w-px overflow-hidden" aria-hidden="true">
          <label>
            Website
            <input type="text" name="website" tabIndex={-1} autoComplete="off" />
          </label>
        </div>

        {status === "success" ? (
          <p
            className="rounded-xl border border-emerald-300/25 bg-emerald-300/10 px-3 py-2 text-xs leading-5 text-emerald-100"
            role="status"
            aria-live="polite"
          >
            {SUCCESS_MESSAGE}
          </p>
        ) : null}

        {status === "error" ? (
          <p
            className="rounded-xl border border-rose-300/25 bg-rose-300/10 px-3 py-2 text-xs leading-5 text-rose-100"
            role="alert"
          >
            Something went wrong. Please email Abdulelah directly at{" "}
            <a
              href="mailto:Abdul0l0h.0@gmail.com"
              className="font-semibold underline underline-offset-2"
            >
              Abdul0l0h.0@gmail.com
            </a>
            .
          </p>
        ) : null}

        <div className="flex flex-wrap items-center justify-between gap-3">
          <Link
            href="/privacy"
            className="focus-ring rounded text-[11px] text-slate-400 underline underline-offset-4 transition hover:text-white"
          >
            Privacy notice
          </Link>
          <Button type="submit" size="sm" disabled={isSending}>
            <Send className="h-3.5 w-3.5" aria-hidden="true" />
            {isSending ? "Sending..." : "Send message"}
          </Button>
        </div>
      </form>
    </section>
  );
}
