"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { MessageCircle, RotateCcw, Send, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { AgentContactForm } from "@/components/agent/AgentContactForm";
import { AgentLauncher } from "@/components/agent/AgentLauncher";
import { AgentMessage } from "@/components/agent/AgentMessage";
import { AgentSuggestion } from "@/components/agent/AgentSuggestion";
import { OPEN_AGENT_EVENT } from "@/lib/agent/companion";
import { duration, ease } from "@/lib/motion";
import { Monogram } from "@/components/ui/Monogram";
import { Button } from "@/components/ui/button";
import { trackEvent } from "@/lib/analytics";
import { Input } from "@/components/ui/input";
import type {
  AgentAction,
  AgentApiResponse,
  AgentChatMessage,
  AgentHistoryMessage,
  AgentMode,
  AgentSessionContext
} from "@/types/agent";

const INITIAL_MESSAGE: AgentChatMessage = {
  id: "welcome",
  role: "assistant",
  content:
    "I\u2019m a guide to Abdulelah\u2019s work \u2014 here to walk you through the projects, the thinking behind them, and where he\u2019d fit. Ask me anything, and I\u2019ll stick to what\u2019s real on this site."
};

const suggestions = [
  "Give me the 30-second summary",
  "Show the strongest projects",
  "Which CV fits my role?",
  "Which projects have GitHub code?",
  "Why does ChatUB matter?",
  "How do I contact Abdulelah?"
];

const MAX_HISTORY_TURNS = 8;
const PROJECT_SLUGS: Record<
  NonNullable<AgentSessionContext["lastProject"]>,
  string
> = {
  ChatUB: "chatub",
  Althil: "althil",
  "Absher Insight AI": "absher-insight-ai",
  Qanouni: "qanouni",
  Medad: "medad",
  "Virtual Astronauts": "virtual-astronauts"
};
const PROJECT_FOLLOW_UPS = {
  ar: [
    "وش التقنيات؟",
    "وش دوري فيه؟",
    "اشرحها تقنيًا",
    "عطيني ملخص للريكروتر"
  ],
  en: [
    "Technologies",
    "My role",
    "Technical explanation",
    "Recruiter summary"
  ]
};

class AgentRequestError extends Error {}

function createEmptySessionContext(): AgentSessionContext {
  return {
    lastProject: null,
    lastIntent: null,
    lastRoleInterest: null,
    lastLanguage: null,
    lastRecommendedCV: null
  };
}

function createMessageId(role: AgentChatMessage["role"]) {
  return `${role}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function getModeLabel(mode?: AgentMode) {
  if (mode === "blocked") {
    return "Keeping to the work";
  }

  return "Grounded in what's real here";
}

export function AgentPanel() {
  const reduceMotion = useReducedMotion();
  const launcherRef = useRef<HTMLButtonElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const sendMessageRef = useRef<(prompt?: string) => void>(() => {});
  const [isOpen, setIsOpen] = useState(false);
  const [isContactFormOpen, setIsContactFormOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [input, setInput] = useState("");
  const [mode, setMode] = useState<AgentMode>();
  const [messages, setMessages] = useState<AgentChatMessage[]>([INITIAL_MESSAGE]);
  const [chatHistory, setChatHistory] = useState<AgentHistoryMessage[]>([]);
  const [sessionContext, setSessionContext] = useState<AgentSessionContext>(
    createEmptySessionContext
  );
  const latestMessage = messages[messages.length - 1];
  const projectSlug = sessionContext.lastProject
    ? PROJECT_SLUGS[sessionContext.lastProject]
    : null;
  const showProjectFollowUps =
    Boolean(projectSlug) &&
    latestMessage?.role === "assistant" &&
    !latestMessage.isError &&
    !isLoading &&
    (sessionContext.lastIntent === "project_explanation" ||
      sessionContext.lastIntent === "technical_details" ||
      sessionContext.lastIntent === "comparison");
  const projectFollowUps =
    PROJECT_FOLLOW_UPS[sessionContext.lastLanguage === "ar" ? "ar" : "en"];

  useEffect(() => {
    function onOpenAgent(event: Event) {
      const detail = (event as CustomEvent<{ prompt?: string; send?: boolean }>)
        .detail;
      const prompt = detail?.prompt;

      setIsOpen(true);
      trackEvent("companion_open", { source: "cue" });

      if (prompt) {
        if (detail?.send) {
          void sendMessageRef.current(prompt);
        } else {
          setInput(prompt);
        }
      }
    }

    window.addEventListener(OPEN_AGENT_EVENT, onOpenAgent);

    return () => {
      window.removeEventListener(OPEN_AGENT_EVENT, onOpenAgent);
    };
  }, []);

  function openPanel() {
    setIsOpen(true);
    trackEvent("companion_open", { source: "launcher" });
  }

  function closePanel() {
    setIsOpen(false);
    window.setTimeout(() => launcherRef.current?.focus(), 0);
  }

  function clearConversation() {
    setMessages([INITIAL_MESSAGE]);
    setChatHistory([]);
    setSessionContext(createEmptySessionContext());
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
        body: JSON.stringify({
          message,
          history: chatHistory.slice(-MAX_HISTORY_TURNS),
          sessionContext
        })
      });
      const payload = (await response.json()) as AgentApiResponse;

      setSessionContext(payload.sessionContext);

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
          mode: payload.mode,
          runtime: {
            mode: payload.mode,
            debugCode: payload.debugCode,
            model: payload.model,
            providerAttempted: payload.providerAttempted,
            providerSucceeded: payload.providerSucceeded,
            scopeJudgeAttempted: payload.scopeJudgeAttempted,
            scopeJudgeAllowed: payload.scopeJudgeAllowed,
            scopeJudgeReason: payload.scopeJudgeReason,
            durationMs: payload.durationMs,
            finishReason: payload.finishReason
          }
        }
      ]);
      if (payload.scopeJudgeAllowed) {
        setChatHistory((current) =>
          [
            ...current,
            { role: "user", content: message } satisfies AgentHistoryMessage,
            {
              role: "assistant",
              content: payload.answer
            } satisfies AgentHistoryMessage
          ].slice(-MAX_HISTORY_TURNS)
        );
      }
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

  sendMessageRef.current = sendMessage;

  function handleAction(action: AgentAction) {
    if (action.type === "prompt") {
      void sendMessage(action.prompt);
      return;
    }

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
              aria-label="Close Abdulelah's guide"
              className="fixed inset-0 z-[39] bg-ink-900/55 backdrop-blur-sm"
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
              className="fixed inset-x-0 bottom-0 top-16 z-40 flex h-[calc(100vh-4rem)] flex-col overflow-hidden rounded-t-3xl border border-white/10 bg-ink-900/95 shadow-[0_-24px_90px_rgba(20,20,22,0.7),0_0_44px_rgba(201,167,92,0.12)] backdrop-blur-md supports-[height:100dvh]:h-[calc(100dvh-4rem)] sm:inset-x-auto sm:bottom-24 sm:right-5 sm:top-auto sm:h-[min(660px,calc(100dvh-11rem))] sm:w-[min(440px,calc(100vw-2.5rem))] sm:rounded-3xl"
              initial={reduceMotion ? false : { opacity: 0, y: 20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={reduceMotion ? undefined : { opacity: 0, y: 16, scale: 0.98 }}
              transition={{ duration: reduceMotion ? 0 : duration.base, ease: ease.out }}
            >
              <div className="relative border-b border-white/10 px-5 py-4">
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/60 to-transparent" />
                <div className="flex items-center gap-3 pr-20">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-accent/25 bg-accent/[0.08] text-accent">
                    <Monogram className="h-5 w-auto" />
                  </span>
                  <div className="min-w-0">
                    <h2 id="agent-panel-title" className="font-display text-lg font-medium text-paper">
                      Abdulelah&rsquo;s guide
                    </h2>
                    <p id="agent-panel-description" className="mt-0.5 text-xs leading-5 text-paper-dim">
                      A calm walk through the work · {getModeLabel(mode)}
                    </p>
                  </div>
                </div>

                <div className="absolute right-4 top-4 flex gap-1">
                  <button
                    type="button"
                    onClick={clearConversation}
                    className="focus-ring grid h-9 w-9 place-items-center rounded-full border border-white/10 text-paper-dim transition hover:border-accent/35 hover:text-paper"
                    aria-label="Clear conversation"
                    title="Clear chat"
                  >
                    <RotateCcw className="h-4 w-4" aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    onClick={closePanel}
                    className="focus-ring grid h-9 w-9 place-items-center rounded-full border border-white/10 text-paper-dim transition hover:border-accent/35 hover:text-paper"
                    aria-label="Close Abdulelah's guide"
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
                    <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-paper-faint">
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

                {showProjectFollowUps ? (
                  <section aria-label="Project follow-up questions" className="pt-1">
                    <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-paper-faint">
                      Follow up on {sessionContext.lastProject}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {projectFollowUps.map((followUp) => (
                        <AgentSuggestion
                          key={followUp}
                          disabled={isLoading}
                          onSelect={sendMessage}
                        >
                          {followUp}
                        </AgentSuggestion>
                      ))}
                      <Link
                        href={`/projects/${projectSlug}`}
                        onClick={closePanel}
                        className="focus-ring inline-flex items-center rounded-full border border-white/10 bg-white/[0.045] px-3 py-2 text-left text-xs font-medium text-paper-dim transition hover:border-accent/35 hover:bg-accent/[0.08] hover:text-paper"
                      >
                        {sessionContext.lastLanguage === "ar"
                          ? "عرض دراسة الحالة"
                          : "View case study"}
                      </Link>
                    </div>
                  </section>
                ) : null}

                {isContactFormOpen ? (
                  <AgentContactForm onClose={() => setIsContactFormOpen(false)} />
                ) : (
                  <button
                    type="button"
                    onClick={() => setIsContactFormOpen(true)}
                    className="focus-ring flex w-full items-center justify-between gap-3 rounded-2xl border border-accent/20 bg-accent/[0.055] px-4 py-3 text-left text-xs font-semibold text-accent-soft transition hover:border-accent/45 hover:bg-accent/[0.09]"
                  >
                    <span>Send Abdulelah a message</span>
                    <MessageCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
                  </button>
                )}

                {isLoading ? (
                  <div className="flex items-start gap-3" role="status">
                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-accent/25 bg-accent/10 text-accent">
                      <Monogram className="h-3.5 w-auto" />
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-2xl border border-white/10 bg-white/[0.045] px-4 py-3">
                      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent" />
                      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent [animation-delay:160ms]" />
                      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent-soft [animation-delay:320ms]" />
                      <span className="sr-only">Abdulelah&apos;s guide is preparing a response.</span>
                    </span>
                  </div>
                ) : null}
                <div ref={messagesEndRef} />
              </div>

              <form
                className="border-t border-white/10 bg-ink-900/70 px-4 pb-[calc(env(safe-area-inset-bottom)+0.75rem)] pt-3"
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
                    placeholder="Ask about Abdulelah's work…"
                    aria-label="Ask Abdulelah's guide a question"
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
                <p className="mt-2 text-[10px] leading-4 text-paper-faint">
                  Portfolio-grounded answers only. Memory is temporary for this session only.
                  No private API key is sent to your browser.
                </p>
              </form>
            </motion.section>
          </>
        ) : null}
      </AnimatePresence>
    </>
  );
}
