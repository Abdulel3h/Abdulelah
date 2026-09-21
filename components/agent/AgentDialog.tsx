"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { MessageCircle, RotateCcw, Send, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState, type MutableRefObject } from "react";
import { AgentContactForm } from "@/components/agent/AgentContactForm";
import { AgentMessage } from "@/components/agent/AgentMessage";
import { AgentSuggestion } from "@/components/agent/AgentSuggestion";
import { useI18n } from "@/components/i18n/LocaleProvider";
import { useTurnstile } from "@/components/security/useTurnstile";
import { Monogram } from "@/components/ui/Monogram";
import { OPEN_AGENT_EVENT, type OpenCompanionDetail } from "@/lib/agent/companion";
import { localizeAgentAction } from "@/lib/agent/localize-actions";
import { clearSessionMemory } from "@/lib/agent/session-memory";
import { format } from "@/lib/i18n/format";
import { restoreFocus } from "@/lib/ui-events";
import type {
  AgentAction,
  AgentApiResponse,
  AgentChatMessage,
  AgentHistoryMessage,
  AgentMode,
  AgentSessionContext
} from "@/types/agent";

const MAX_HISTORY_MESSAGES = 8;
const PROJECT_SLUGS: Record<NonNullable<AgentSessionContext["lastProject"]>, string> = {
  ChatUB: "chatub",
  Althil: "althil",
  "Absher Insight AI": "absher-insight-ai",
  Qanouni: "qanouni",
  Medad: "medad",
  "Virtual Astronauts": "virtual-astronauts",
  Stadium: "stadium"
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

/**
 * Keyboard-aware bottom offset for small screens. Chrome on Android resizes
 * the layout (see the viewport's interactive-widget), but iOS Safari only
 * shrinks the visual viewport, so the panel is lifted by the keyboard height.
 */
function useKeyboardInset(active: boolean) {
  const [inset, setInset] = useState(0);

  useEffect(() => {
    const maybeVisual = window.visualViewport;

    if (!active || !maybeVisual) {
      return;
    }

    const visual: VisualViewport = maybeVisual;

    function update() {
      const overlap = window.innerHeight - (visual.height + visual.offsetTop);

      setInset(overlap > 60 ? Math.round(overlap) : 0);
    }

    const frame = window.requestAnimationFrame(update);

    visual.addEventListener("resize", update);
    visual.addEventListener("scroll", update);

    return () => {
      window.cancelAnimationFrame(frame);
      visual.removeEventListener("resize", update);
      visual.removeEventListener("scroll", update);
    };
  }, [active]);

  return active ? inset : 0;
}

/**
 * Abdulelah’s guide as a modal dialog (Radix: focus trap, Escape, inert
 * background). Loaded on demand by <AgentPanel>; it stays mounted after the
 * first open so the conversation survives closing and reopening.
 */
export default function AgentDialog({
  open,
  onOpenChange,
  launcherRef,
  returnFocusRef,
  initialRequest
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  launcherRef: MutableRefObject<HTMLButtonElement | null>;
  returnFocusRef: MutableRefObject<HTMLElement | null>;
  initialRequest: OpenCompanionDetail | null;
}) {
  const { t, locale, dir } = useI18n();
  const a = t.agent;
  const { containerRef: turnstileRef, getToken } = useTurnstile();
  // The server mints a short-lived signed cookie after the first verified
  // message, so later messages do not run a challenge unless it rejects them.
  const isVerifiedRef = useRef(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const logRef = useRef<HTMLDivElement>(null);
  const sendMessageRef = useRef<(prompt?: string) => void>(() => {});
  const welcome: AgentChatMessage = { id: "welcome", role: "assistant", content: a.welcome };
  const [isContactFormOpen, setIsContactFormOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [input, setInput] = useState(
    initialRequest?.prompt && !initialRequest.send ? initialRequest.prompt : ""
  );
  const [mode, setMode] = useState<AgentMode>();
  const [notice, setNotice] = useState("");
  const [messages, setMessages] = useState<AgentChatMessage[]>([welcome]);
  const [chatHistory, setChatHistory] = useState<AgentHistoryMessage[]>([]);
  const [sessionContext, setSessionContext] = useState<AgentSessionContext>(createEmptySessionContext);
  const keyboardInset = useKeyboardInset(open);
  const isOpen = open;

  const latestMessage = messages[messages.length - 1];
  const projectSlug = sessionContext.lastProject ? PROJECT_SLUGS[sessionContext.lastProject] : null;
  const showProjectFollowUps =
    Boolean(projectSlug) &&
    latestMessage?.role === "assistant" &&
    !latestMessage.isError &&
    !isLoading &&
    (sessionContext.lastIntent === "project_explanation" ||
      sessionContext.lastIntent === "technical_details" ||
      sessionContext.lastIntent === "comparison");

  // The prompt that caused this module to load is asked once it is ready.
  useEffect(() => {
    if (!initialRequest?.prompt || !initialRequest.send) return;

    const prompt = initialRequest.prompt;
    const timer = window.setTimeout(() => void sendMessageRef.current(prompt), 0);

    return () => window.clearTimeout(timer);
  }, [initialRequest]);

  // Later requests (inline cues) arrive as events while the dialog is loaded.
  useEffect(() => {
    function onOpenAgent(event: Event) {
      const detail = (event as CustomEvent<OpenCompanionDetail>).detail ?? {};

      if (!detail.prompt) return;

      if (detail.send) {
        void sendMessageRef.current(detail.prompt);
      } else {
        setInput(detail.prompt);
      }
    }

    window.addEventListener(OPEN_AGENT_EVENT, onOpenAgent);
    return () => window.removeEventListener(OPEN_AGENT_EVENT, onOpenAgent);
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    const log = logRef.current;

    if (log) {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      log.scrollTo({ top: log.scrollHeight, behavior: reduce ? "auto" : "smooth" });
    }
  }, [isLoading, isOpen, messages]);

  function clearConversation() {
    setMessages([welcome]);
    setChatHistory([]);
    setSessionContext(createEmptySessionContext());
    setMode(undefined);
    setInput("");
    setIsContactFormOpen(false);
    clearSessionMemory();
    setNotice(a.cleared);
    inputRef.current?.focus();
  }

  async function sendMessage(prompt = input) {
    const message = prompt.trim();

    if (!message || isLoading) return;

    setNotice("");
    setMessages((current) => [...current, { id: createMessageId("user"), role: "user", content: message }]);
    setInput("");
    setIsLoading(true);

    try {
      const postMessage = (turnstileToken: string | null) =>
        fetch("/api/agent", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message,
            history: chatHistory.slice(-MAX_HISTORY_MESSAGES),
            sessionContext,
            locale,
            turnstileToken
          })
        });

      let response = await postMessage(isVerifiedRef.current ? null : await getToken());

      // The session grant expired or was never issued: solve one challenge
      // and retry, so the visitor never sees a verification error mid-chat.
      if (response.status === 403) {
        isVerifiedRef.current = false;
        response = await postMessage(await getToken());
      }

      if (response.ok) {
        isVerifiedRef.current = true;
      }

      if (response.status === 429) {
        throw new AgentRequestError(a.rateLimited);
      }

      if (response.status === 403) {
        throw new AgentRequestError(a.verification);
      }

      const payload = (await response.json()) as AgentApiResponse;

      setSessionContext(payload.sessionContext);

      if (!response.ok) {
        throw new AgentRequestError(payload.answer || a.errorGeneric);
      }

      setMode(payload.mode);
      setMessages((current) => [
        ...current,
        {
          id: createMessageId("assistant"),
          role: "assistant",
          content: payload.answer,
          actions: payload.actions.map((action) => localizeAgentAction(action, locale)),
          mode: payload.mode
        }
      ]);

      if (payload.scopeJudgeAllowed) {
        setChatHistory((current) =>
          [
            ...current,
            { role: "user", content: message } satisfies AgentHistoryMessage,
            { role: "assistant", content: payload.answer } satisfies AgentHistoryMessage
          ].slice(-MAX_HISTORY_MESSAGES)
        );
      }
    } catch (error) {
      const offline = typeof navigator !== "undefined" && !navigator.onLine;

      setMessages((current) => [
        ...current,
        {
          id: createMessageId("assistant"),
          role: "assistant",
          content:
            error instanceof AgentRequestError ? error.message : offline ? a.errorOffline : a.errorGeneric,
          isError: true,
          actions: [localizeAgentAction({ label: "Contact Abdulelah", href: "/contact", type: "internal" }, locale)]
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
      // Following a link closes the guide; focus moves to the new page.
      returnFocusRef.current = null;
      onOpenChange(false);
    }
  }

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="dialog-overlay fixed inset-0 z-[65] bg-ink-900/60 backdrop-blur-sm" />

        <Dialog.Content
          asChild
          aria-describedby="agent-panel-description"
          onOpenAutoFocus={(event) => {
            event.preventDefault();
            inputRef.current?.focus();
          }}
          onCloseAutoFocus={(event) => {
            const target = returnFocusRef.current;

            returnFocusRef.current = null;

            if (target) {
              event.preventDefault();

              if (!restoreFocus(target) && !restoreFocus(launcherRef.current)) {
                document.getElementById("main-content")?.focus();
              }
            }
          }}
        >
          <section
            data-agent-panel
            dir={dir}
            style={keyboardInset ? { bottom: keyboardInset } : undefined}
            className="dialog-sheet fixed inset-x-0 bottom-0 top-[calc(env(safe-area-inset-top)+0.75rem)] z-[66] flex flex-col overflow-hidden rounded-t-3xl border border-white/[0.12] bg-ink-900 shadow-[0_-24px_90px_rgba(0,0,0,0.6)] sm:inset-x-auto sm:bottom-6 sm:end-6 sm:top-auto sm:h-[min(680px,calc(100dvh-7rem))] sm:w-[min(440px,calc(100vw-3rem))] sm:rounded-3xl"
          >
                <header className="relative border-b border-white/10 px-5 py-4">
                  <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/60 to-transparent" />
                  <div className="flex items-center gap-3 pe-28">
                    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-accent/25 bg-accent/[0.08] text-accent">
                      <Monogram className="h-5 w-auto" />
                    </span>
                    <div className="min-w-0">
                      <Dialog.Title className="font-display text-lg font-medium text-paper">{a.title}</Dialog.Title>
                      <p id="agent-panel-description" className="mt-0.5 text-xs leading-5 text-paper-dim">
                        {mode === "blocked" ? a.subtitleBlocked : a.subtitle}
                      </p>
                    </div>
                  </div>

                  <div className="absolute end-3 top-3.5 flex gap-1.5">
                    <button
                      type="button"
                      onClick={clearConversation}
                      aria-label={a.clearLabel}
                      className="focus-ring inline-flex h-11 items-center gap-1.5 rounded-full border border-white/[0.12] px-3 text-xs font-medium text-paper-dim transition hover:border-accent/40 hover:text-paper"
                    >
                      <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
                      {a.clear}
                    </button>
                    <Dialog.Close asChild>
                      <button
                        type="button"
                        aria-label={a.closeLabel}
                        className="focus-ring grid h-11 w-11 place-items-center rounded-full border border-white/[0.12] text-paper-dim transition hover:border-accent/40 hover:text-paper"
                      >
                        <X className="h-4 w-4" aria-hidden="true" />
                      </button>
                    </Dialog.Close>
                  </div>
                </header>

                <div
                  ref={logRef}
                  role="log"
                  aria-live="polite"
                  aria-relevant="additions"
                  aria-label={a.title}
                  className="flex-1 space-y-4 overflow-y-auto overflow-x-hidden overscroll-contain px-4 py-5"
                >
                  {messages.map((message) => (
                    <AgentMessage key={message.id} message={message} onAction={handleAction} />
                  ))}

                  {messages.length === 1 ? (
                    <section aria-labelledby="agent-suggestions-title" className="pt-1">
                      <h3 id="agent-suggestions-title" className="mb-3 text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-paper-dim">
                        {a.suggestionsTitle}
                      </h3>
                      <ul className="flex flex-wrap gap-2">
                        {a.suggestions.map((suggestion) => (
                          <li key={suggestion}>
                            <AgentSuggestion disabled={isLoading} onSelect={sendMessage}>
                              {suggestion}
                            </AgentSuggestion>
                          </li>
                        ))}
                      </ul>
                    </section>
                  ) : null}

                  {showProjectFollowUps && sessionContext.lastProject ? (
                    <section aria-labelledby="agent-followups-title" className="pt-1">
                      <h3 id="agent-followups-title" className="mb-3 text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-paper-dim">
                        {format(a.followUpsTitle, { project: sessionContext.lastProject })}
                      </h3>
                      <ul className="flex flex-wrap gap-2">
                        {a.followUps.map((followUp) => (
                          <li key={followUp}>
                            <AgentSuggestion disabled={isLoading} onSelect={sendMessage}>
                              {followUp}
                            </AgentSuggestion>
                          </li>
                        ))}
                        <li>
                          <Link
                            href={locale === "ar" ? `/ar/projects/${projectSlug}` : `/projects/${projectSlug}`}
                            onClick={() => {
                              returnFocusRef.current = null;
                              onOpenChange(false);
                            }}
                            className="focus-ring inline-flex min-h-10 items-center rounded-full border border-accent/30 bg-accent/[0.06] px-3.5 text-xs font-semibold text-accent-soft transition hover:border-accent/60"
                          >
                            {a.viewCaseStudy}
                          </Link>
                        </li>
                      </ul>
                    </section>
                  ) : null}

                  {isContactFormOpen ? (
                    <AgentContactForm onClose={() => setIsContactFormOpen(false)} />
                  ) : (
                    <button
                      type="button"
                      onClick={() => setIsContactFormOpen(true)}
                      className="focus-ring flex min-h-11 w-full items-center justify-between gap-3 rounded-2xl border border-accent/25 bg-accent/[0.06] px-4 py-3 text-start text-sm font-semibold text-accent-soft transition hover:border-accent/50"
                    >
                      <span>{a.sendMessageCta}</span>
                      <MessageCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
                    </button>
                  )}

                  {isLoading ? (
                    <div className="flex items-start gap-3" role="status">
                      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-accent/25 bg-accent/10 text-accent">
                        <Monogram className="h-3.5 w-auto" />
                      </span>
                      <span className="inline-flex items-center gap-1 rounded-2xl border border-white/10 bg-white/[0.045] px-4 py-3">
                        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent motion-reduce:animate-none" aria-hidden="true" />
                        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent [animation-delay:160ms] motion-reduce:animate-none" aria-hidden="true" />
                        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent-soft [animation-delay:320ms] motion-reduce:animate-none" aria-hidden="true" />
                        <span className="sr-only">{a.thinking}</span>
                      </span>
                    </div>
                  ) : null}
                </div>

                <form
                  className="border-t border-white/10 bg-ink-900 px-4 pb-[calc(env(safe-area-inset-bottom)+0.75rem)] pt-3"
                  onSubmit={(event) => {
                    event.preventDefault();
                    void sendMessage();
                  }}
                >
                  <div className="flex items-center gap-2">
                    <label htmlFor="agent-input" className="sr-only">
                      {a.inputLabel}
                    </label>
                    <input
                      id="agent-input"
                      ref={inputRef}
                      value={input}
                      onChange={(event) => setInput(event.target.value)}
                      placeholder={a.inputPlaceholder}
                      maxLength={1_200}
                      dir="auto"
                      enterKeyHint="send"
                      autoComplete="off"
                      className="field-control h-12 min-w-0 flex-1"
                    />
                    <button
                      type="submit"
                      disabled={isLoading || !input.trim()}
                      aria-label={a.send}
                      className="focus-ring grid h-12 w-12 shrink-0 place-items-center rounded-full bg-accent text-ink-900 transition hover:bg-accent-soft disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <Send className="h-4 w-4 rtl:-scale-x-100" aria-hidden="true" />
                    </button>
                  </div>
                  <div ref={turnstileRef} className="mt-2 empty:mt-0" />
                  <p className="mt-2 text-[0.72rem] leading-5 text-paper-dim">
                    {a.disclosure}{" "}
                    <Link
                      href={locale === "ar" ? "/ar/privacy" : "/privacy"}
                      onClick={() => {
                        returnFocusRef.current = null;
                        onOpenChange(false);
                      }}
                      className="focus-ring rounded font-semibold text-paper underline decoration-accent/50 underline-offset-2"
                    >
                      {a.privacyLink}
                    </Link>
                  </p>
                  <p role="status" className="sr-only">
                    {notice}
                  </p>
                </form>
          </section>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
