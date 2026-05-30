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

export function ContactForm() {
  const [message, setMessage] = useState("");
  const [interest, setInterest] = useState("Hiring");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(
      "This form is currently a front-end demo. Please contact me directly by email."
    );
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
              placeholder="you@example.com"
            />
          </label>
          <label className="grid gap-2 text-sm font-medium text-slate-200">
            Company
            <Input
              name="company"
              autoComplete="organization"
              placeholder="Company or organization"
            />
          </label>
          <div className="grid gap-2 text-sm font-medium text-slate-200">
            <span id="interest-label">Interest type</span>
            <input type="hidden" name="interest" value={interest} />
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
            placeholder="Tell me about the role, project, or collaboration."
          />
        </label>

        {message ? (
          <p
            className="mt-4 rounded-xl border border-sky-300/25 bg-sky-300/10 px-4 py-3 text-sm text-sky-100"
            role="status"
            aria-live="polite"
          >
            {message}
          </p>
        ) : null}

        <Button
          type="submit"
          className="mt-5 w-full sm:w-auto"
        >
          <Send className="h-4 w-4" aria-hidden="true" />
          Send Message
        </Button>
      </div>
    </form>
  );
}
