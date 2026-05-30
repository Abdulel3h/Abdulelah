import { Bot, UserRound } from "lucide-react";
import { AgentActions } from "@/components/agent/AgentActions";
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

  return (
    <article
      className={cn("flex gap-3", isAssistant ? "items-start" : "justify-end")}
      aria-label={`${isAssistant ? "Abdulelah AI Navigator" : "You"} message`}
    >
      {isAssistant ? (
        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-sky-300/25 bg-sky-300/10 text-sky-100">
          <Bot className="h-4 w-4" aria-hidden="true" />
        </span>
      ) : null}

      <div
        className={cn(
          "max-w-[88%] rounded-2xl border px-4 py-3 text-sm leading-6",
          isAssistant
            ? "border-white/10 bg-white/[0.045] text-slate-200"
            : "border-gold/25 bg-gold/[0.11] text-amber-50",
          message.isError && "border-rose-300/25 bg-rose-400/[0.08] text-rose-100"
        )}
      >
        <p className="whitespace-pre-wrap">{message.content}</p>

        {message.mode ? (
          <p className="mt-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
            {message.mode === "deepseek"
              ? "AI-assisted portfolio mode"
              : "Portfolio-grounded mode"}
          </p>
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
