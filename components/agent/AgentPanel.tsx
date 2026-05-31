"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Bot, MessageCircle, RotateCcw, Send, Sparkles, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { AgentContactForm } from "@/components/agent/AgentContactForm";
import { AgentLauncher } from "@/components/agent/AgentLauncher";
import { AgentMessage } from "@/components/agent/AgentMessage";
import { AgentSuggestion } from "@/components/agent/AgentSuggestion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type {
  AgentAction,
  AgentApiResponse,
  AgentChatMessage,
  AgentMode
} from "@/types/agent";

const INITIAL_MESSAGE: AgentChatMessage = {
  id: "welcome",
  role: "assistant",
  content:
    "Hi, I'm Abdulelah AI Navigator. I can help you explore Abdulelah's projects, skills, achievements, and the best resume version for your hiring needs."
};

const suggestions = [
  "Why hire Abdulelah?",
  "Show strongest projects",
  "Explain ChatUB",
  "Cloud AI experience",
  "Security AI experience",
  "Which CV should I download?",
  "Contact Abdulelah"
];

class AgentRequestError extends Error {}

function createMessageId(role: AgentChatMessage["role"]) {
  return `${role}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function AgentPanel() {
  const reduceMotion = useReducedMotion();
  const launcherRef = useRef<HTMLButtonElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isContactFormOpen, setIsContactFormOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [input, setInput] = useState("");
  const [mode, setMode] = useState<AgentMode>();
  const [messages, setMessages] = useState<AgentChatMessage[]>([INITIAL_MESSAGE]);

  function openPanel() {
    setIsOpen(true);
  }

  function closePanel() {
    setIsOpen(false);
    window.setTimeout(() => launcherRef.current?.focus(), 0);
  }

  function clearConversation() {
    setMessages([INITIAL_MESSAGE]);
    setMode(undefined);
    setInput("");
    setIsContactFormOpen(false);
    inputRef.current?.focus();
  }

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    inputRef.current?.focus();

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        closePanel();
      }
    }

    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({
        behavior: reduceMotion ? "auto" : "smooth",
        block: "nearest"
      });
    }
  }, [isLoading, isOpen, messages, reduceMotion]);

  async function sendMessage(prompt = input) {
    const message = prompt.trim();

    if (!message || isLoading) {
      return;
    }

    setMessages((current) => [
      ...current,
      {
        id: createMessageId("user"),
        role: "user",
        content: message
      }
    ]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/agent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ message })
      });
      const payload = (await response.json()) as AgentApiResponse;

      if (!response.ok) {
        throw new AgentRequestError(payload.answer);
      }

      setMode(payload.mode);
      setMessages((current) => [
        ...current,
        {
          id: createMessageId("assistant"),
          role: "assistant",
          content: payload.answer,
          actions: payload.actions,
          mode: payload.mode
        }
      ]);
    } catch (error) {
      setMessages((current) => [
        ...current,
        {
          id: createMessageId("assistant"),
          role: "assistant",
          content:
            error instanceof AgentRequestError
              ? error.message
              : "I couldn't reach the portfolio assistant just now. Please try again in a moment or use the contact page.",
          isError: true,
          actions: [
            {
              label: "Contact Abdulelah",
              href: "/contact",
              type: "internal"
            }
          ]
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  }

  function handleAction(action: AgentAction) {
    if (action.type === "contact") {
      setIsContactFormOpen(true);
      return;
    }

    if (action.type === "internal") {
      closePanel();
    }
  }

  return (
    <>
      <AnimatePresence>
        {!isOpen ? (
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduceMotion ? undefined : { opacity: 0, y: 8, scale: 0.98 }}
          >
            <AgentLauncher ref={launcherRef} onClick={openPanel} />
          </motion.div>
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen ? (
          <>
            <motion.button
              type="button"
              aria-label="Close Abdulelah AI Navigator"
              className="fixed inset-0 z-[39] bg-slate-950/55 backdrop-blur-sm"
              initial={reduceMotion ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={reduceMotion ? undefined : { opacity: 0 }}
              onClick={closePanel}
            />
            <motion.section
              role="dialog"
              aria-modal="false"
              aria-labelledby="agent-panel-title"
              aria-describedby="agent-panel-description"
              className="fixed inset-x-0 bottom-0 top-16 z-40 flex h-[calc(100vh-4rem)] flex-col overflow-hidden rounded-t-3xl border border-white/10 bg-slate-950/95 shadow-[0_-24px_90px_rgba(15,23,42,0.7),0_0_44px_rgba(56,189,248,0.12)] backdrop-blur-2xl supports-[height:100dvh]:h-[calc(100dvh-4rem)] sm:inset-x-auto sm:bottom-24 sm:right-5 sm:top-auto sm:h-[min(660px,calc(100dvh-11rem))] sm:w-[min(440px,calc(100vw-2.5rem))] sm:rounded-3xl"
              initial={reduceMotion ? false : { opacity: 0, y: 20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={reduceMotion ? undefined : { opacity: 0, y: 16, scale: 0.98 }}
              transition={{ duration: reduceMotion ? 0 : 0.24, ease: "easeOut" }}
            >
              <div className="relative border-b border-white/10 px-5 py-4">
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-sky-300/60 to-transparent" />
                <div className="flex items-start gap-3 pr-20">
                  <span className="relative grid h-11 w-11 shrink-0 place-items-center rounded-full border border-sky-300/30 bg-sky-300/10 text-sky-100 shadow-glow">
                    <Bot className="h-5 w-5" aria-hidden="true" />
                    <Sparkles className="absolute -right-1 -top-1 h-3.5 w-3.5 text-amber-200" aria-hidden="true" />
                  </span>
                  <div className="min-w-0">
                    <h2 id="agent-panel-title" className="text-base font-semibold text-white">
                      Abdulelah AI Navigator
                    </h2>
                    <p id="agent-panel-description" className="mt-1 text-xs leading-5 text-slate-400">
                      Ask about projects, skills, resume, or hiring fit.
                    </p>
                    <p className="mt-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-sky-200/80">
                      {mode === "deepseek"
                        ? "AI-assisted portfolio mode"
                        : mode
                          ? "Portfolio-grounded mode"
                          : "Recruiter assistant"}
                    </p>
                  </div>
                </div>

                <div className="absolute right-4 top-4 flex gap-1">
                  <button
                    type="button"
                    onClick={clearConversation}
                    className="focus-ring grid h-9 w-9 place-items-center rounded-full border border-white/10 text-slate-400 transition hover:border-sky-300/35 hover:text-white"
                    aria-label="Clear conversation"
                  >
                    <RotateCcw className="h-4 w-4" aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    onClick={closePanel}
                    className="focus-ring grid h-9 w-9 place-items-center rounded-full border border-white/10 text-slate-400 transition hover:border-sky-300/35 hover:text-white"
                    aria-label="Close Abdulelah AI Navigator"
                  >
                    <X className="h-4 w-4" aria-hidden="true" />
                  </button>
                </div>
              </div>

              <div
                className="flex-1 touch-pan-y space-y-4 overflow-x-hidden overflow-y-auto overscroll-contain px-4 py-5 [-webkit-overflow-scrolling:touch]"
                aria-live="polite"
              >
                {messages.map((message) => (
                  <AgentMessage key={message.id} message={message} onAction={handleAction} />
                ))}

                {messages.length === 1 ? (
                  <section aria-label="Suggested questions" className="pt-1">
                    <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500">
                      Try a guided question
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {suggestions.map((suggestion) => (
                        <AgentSuggestion
                          key={suggestion}
                          disabled={isLoading}
                          onSelect={sendMessage}
                        >
                          {suggestion}
                        </AgentSuggestion>
                      ))}
                    </div>
                  </section>
                ) : null}

                {isContactFormOpen ? (
                  <AgentContactForm onClose={() => setIsContactFormOpen(false)} />
                ) : (
                  <button
                    type="button"
                    onClick={() => setIsContactFormOpen(true)}
                    className="focus-ring flex w-full items-center justify-between gap-3 rounded-2xl border border-gold/20 bg-gold/[0.055] px-4 py-3 text-left text-xs font-semibold text-amber-100 transition hover:border-gold/45 hover:bg-gold/[0.09]"
                  >
                    <span>Send Abdulelah a message</span>
                    <MessageCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
                  </button>
                )}

                {isLoading ? (
                  <div className="flex items-start gap-3" role="status">
                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-sky-300/25 bg-sky-300/10 text-sky-100">
                      <Bot className="h-4 w-4" aria-hidden="true" />
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-2xl border border-white/10 bg-white/[0.045] px-4 py-3">
                      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-sky-200" />
                      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-violet-300 [animation-delay:160ms]" />
                      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-amber-200 [animation-delay:320ms]" />
                      <span className="sr-only">Abdulelah AI Navigator is preparing a response.</span>
                    </span>
                  </div>
                ) : null}
                <div ref={messagesEndRef} />
              </div>

              <form
                className="border-t border-white/10 bg-slate-950/70 px-4 pb-[calc(env(safe-area-inset-bottom)+0.75rem)] pt-3"
                onSubmit={(event) => {
                  event.preventDefault();
                  void sendMessage();
                }}
              >
                <div className="flex items-center gap-2">
                  <Input
                    ref={inputRef}
                    value={input}
                    onChange={(event) => setInput(event.target.value)}
                    placeholder="Ask about Abdulelah's portfolio..."
                    aria-label="Ask Abdulelah AI Navigator a question"
                    maxLength={1_200}
                    disabled={isLoading}
                    className="min-w-0 flex-1"
                  />
                  <Button
                    type="submit"
                    size="icon"
                    disabled={isLoading || !input.trim()}
                    aria-label="Send message"
                    className="shrink-0"
                  >
                    <Send className="h-4 w-4" aria-hidden="true" />
                  </Button>
                </div>
                <p className="mt-2 text-[10px] leading-4 text-slate-500">
                  Portfolio-grounded answers only. No private API key is sent to your browser.
                </p>
              </form>
            </motion.section>
          </>
        ) : null}
      </AnimatePresence>
    </>
  );
}
