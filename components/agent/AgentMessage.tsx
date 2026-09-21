"use client";

import { UserRound } from "lucide-react";
import { AgentActions } from "@/components/agent/AgentActions";
import { AgentFormattedMessage } from "@/components/agent/AgentFormattedMessage";
import { useI18n } from "@/components/i18n/LocaleProvider";
import { Monogram } from "@/components/ui/Monogram";
import { cn } from "@/lib/utils";
import type { AgentAction, AgentChatMessage } from "@/types/agent";

export function AgentMessage({
  message,
  onAction
}: {
  message: AgentChatMessage;
  onAction?: (action: AgentAction) => void;
}) {
  const { t } = useI18n();
  const isAssistant = message.role === "assistant";

  return (
    <article
      className={cn("flex gap-3", isAssistant ? "items-start" : "justify-end")}
      aria-label={isAssistant ? t.agent.guide : t.agent.you}
    >
      {isAssistant ? (
        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-accent/25 bg-accent/10 text-accent">
          <Monogram className="h-3.5 w-auto" />
        </span>
      ) : null}

      <div
        className={cn(
          "min-w-0 max-w-[92%] rounded-2xl border px-4 py-3 text-sm",
          isAssistant ? "border-white/10 bg-white/[0.045] text-paper" : "border-accent/25 bg-accent/[0.11] text-paper",
          message.isError && "border-[#E5816B]/40 bg-[#E5816B]/[0.08]"
        )}
      >
        <AgentFormattedMessage content={message.content} />
        {message.actions?.length ? <AgentActions actions={message.actions} onAction={onAction} /> : null}
      </div>

      {!isAssistant ? (
        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-accent/25 bg-accent/10 text-accent-soft">
          <UserRound className="h-4 w-4" aria-hidden="true" />
        </span>
      ) : null}
    </article>
  );
}
