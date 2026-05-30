"use client";

import { Send } from "lucide-react";
import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

const interestTypes = ["Hiring", "Collaboration", "Hackathon", "AI Project", "Other"];
const SUCCESS_MESSAGE = "Thank you. Your message has been sent successfully.";
const ERROR_MESSAGE =
  "Something went wrong. Please email me directly at Abdul0l0h.0@gmail.com.";

export function ContactForm() {
  const [statusMessage, setStatusMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [interest, setInterest] = useState("Hiring");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);

    setIsSending(true);
    setStatusMessage("");

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
          interestType: interest,
          message: formData.get("message"),
          website: formData.get("website")
        })
      });

      if (!response.ok) {
        throw new Error("Unable to send contact message.");
      }

      form.reset();
      setInterest("Hiring");
      setStatusMessage(SUCCESS_MESSAGE);
    } catch {
      setStatusMessage(ERROR_MESSAGE);
    } finally {
      setIsSending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="premium-panel p-6">
      <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-sky-400/10 blur-3xl" aria-hidden="true" />
      <div className="relative">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="grid gap-2 text-sm font-medium text-slate-200">
            Name
            <Input
              required
              name="name"
              autoComplete="name"
              maxLength={120}
              placeholder="Your name"
            />
          </label>
          <label className="grid gap-2 text-sm font-medium text-slate-200">
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
          <label className="grid gap-2 text-sm font-medium text-slate-200">
            Company
            <Input
              name="company"
              autoComplete="organization"
              maxLength={160}
              placeholder="Company or organization"
            />
          </label>
          <div className="grid gap-2 text-sm font-medium text-slate-200">
            <span id="interest-label">Interest type</span>
            <input type="hidden" name="interestType" value={interest} />
            <Select value={interest} onValueChange={setInterest}>
              <SelectTrigger aria-labelledby="interest-label">
                <SelectValue placeholder="Choose an interest" />
              </SelectTrigger>
              <SelectContent>
                {interestTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <label className="mt-4 grid gap-2 text-sm font-medium text-slate-200">
          Message
          <Textarea
            required
            name="message"
            rows={6}
            maxLength={5000}
            placeholder="Tell me about the role, project, or collaboration."
          />
        </label>

        <div className="absolute -left-[9999px] h-px w-px overflow-hidden" aria-hidden="true">
          <label>
            Website
            <input
              type="text"
              name="website"
              tabIndex={-1}
              autoComplete="off"
            />
          </label>
        </div>

        {statusMessage ? (
          <p
            className="mt-4 rounded-xl border border-sky-300/25 bg-sky-300/10 px-4 py-3 text-sm text-sky-100"
            role="status"
            aria-live="polite"
          >
            {statusMessage}
          </p>
        ) : null}

        <Button
          type="submit"
          disabled={isSending}
          className="mt-5 w-full sm:w-auto"
        >
          <Send className="h-4 w-4" aria-hidden="true" />
          {isSending ? "Sending..." : "Send Message"}
        </Button>
      </div>
    </form>
  );
}
