import { Bot, UserRound } from "lucide-react";
import { AgentActions } from "@/components/agent/AgentActions";
import { AgentFormattedMessage } from "@/components/agent/AgentFormattedMessage";
import { cn } from "@/lib/utils";
import type { AgentAction, AgentChatMessage } from "@/types/agent";

export function AgentMessage({
  message,
  onAction
}: {
  message: AgentChatMessage;
  onAction?: (action: AgentAction) => void;
}) {
  const isAssistant = message.role === "assistant";

  function getModeLabel() {
    if (message.mode === "deepseek") {
      return "AI-assisted portfolio mode";
    }

    if (message.mode === "blocked") {
      return "Portfolio scope only";
    }

    return "Portfolio-grounded mode";
  }

  return (
    <article
      className={cn("flex gap-3", isAssistant ? "items-start" : "justify-end")}
      aria-label={`${isAssistant ? "Agent Abdulelah" : "You"} message`}
    >
      {isAssistant ? (
        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-sky-300/25 bg-sky-300/10 text-sky-100">
          <Bot className="h-4 w-4" aria-hidden="true" />
        </span>
      ) : null}

      <div
        className={cn(
          "min-w-0 max-w-[92%] overflow-visible rounded-2xl border px-4 py-3 text-sm sm:max-w-[90%]",
          isAssistant
            ? "border-white/10 bg-white/[0.045] text-slate-200"
            : "border-gold/25 bg-gold/[0.11] text-amber-50",
          message.isError && "border-rose-300/25 bg-rose-400/[0.08] text-rose-100"
        )}
      >
        <AgentFormattedMessage content={message.content} />

        {message.mode ? (
          <p
            dir="ltr"
            className="mt-2 text-left text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500"
          >
            {getModeLabel()}
          </p>
        ) : null}

        {message.runtime ? (
          <details
            dir="ltr"
            className="mt-2 border-t border-white/[0.07] pt-2 text-left text-[10px] leading-4 text-slate-500"
          >
            <summary className="cursor-pointer text-slate-500/80 transition hover:text-slate-400">
              Runtime details
            </summary>
            <p className="mt-1 [overflow-wrap:anywhere]">
              Mode: {message.runtime.mode} | Model: {message.runtime.model} | Provider attempted:{" "}
              {message.runtime.providerAttempted ? "yes" : "no"} | Provider succeeded:{" "}
              {message.runtime.providerSucceeded ? "yes" : "no"} | Duration:{" "}
              {message.runtime.durationMs} ms
              {message.runtime.finishReason
                ? ` | Finish reason: ${message.runtime.finishReason}`
                : ""}{" "}
              | Code: {message.runtime.debugCode} | Scope judge:{" "}
              {message.runtime.scopeJudgeAttempted ? "yes" : "no"} | Scope allowed:{" "}
              {message.runtime.scopeJudgeAllowed ? "yes" : "no"} | Scope reason:{" "}
              {message.runtime.scopeJudgeReason}
            </p>
          </details>
        ) : null}

        {message.actions?.length ? (
          <AgentActions actions={message.actions} onAction={onAction} />
        ) : null}
      </div>

      {!isAssistant ? (
        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-gold/25 bg-gold/10 text-amber-100">
          <UserRound className="h-4 w-4" aria-hidden="true" />
        </span>
      ) : null}
    </article>
  );
}
