"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";
import { trackEvent } from "@/lib/analytics";

export function CopyEmailButton({ email }: { email: string }) {
  const [copyState, setCopyState] = useState<"idle" | "copied" | "failed">("idle");

  function copyWithFallback(value: string) {
    const textarea = document.createElement("textarea");
    textarea.value = value;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "fixed";
    textarea.style.left = "-9999px";
    textarea.style.top = "0";
    document.body.appendChild(textarea);
    textarea.select();

    try {
      return document.execCommand("copy");
    } finally {
      document.body.removeChild(textarea);
    }
  }

  async function copyEmail() {
    let copied = false;

    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(email);
        copied = true;
      }
    } catch {
      copied = false;
    }

    if (!copied) {
      copied = copyWithFallback(email);
    }

    setCopyState(copied ? "copied" : "failed");
    if (copied) trackEvent("email_copied");
    window.setTimeout(() => setCopyState("idle"), 1800);
  }

  const copied = copyState === "copied";

  return (
    <button
      type="button"
      onClick={copyEmail}
      className="focus-ring inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-4 py-2 text-sm font-semibold text-paper transition hover:border-accent/35 hover:text-paper"
      aria-label="Copy email address"
      aria-live="polite"
    >
      {copied ? <Check className="h-4 w-4 text-accent" /> : <Copy className="h-4 w-4" />}
      {copyState === "failed" ? "Copy failed" : copied ? "Copied" : "Copy email"}
    </button>
  );
}
