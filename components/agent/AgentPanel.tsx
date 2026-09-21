"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { AgentLauncher } from "@/components/agent/AgentLauncher";
import { useI18n } from "@/components/i18n/LocaleProvider";
import { OPEN_AGENT_EVENT, type OpenCompanionDetail } from "@/lib/agent/companion";
import { trackEvent } from "@/lib/analytics";
import { whenIdle } from "@/lib/when-idle";

const loadAgentDialog = () => import("@/components/agent/AgentDialog");
const AgentDialog = dynamic(loadAgentDialog, { ssr: false });

/**
 * Abdulelah's guide. The page only ships the minimised launcher and a small
 * event listener; the dialog (chat UI, Radix, Turnstile) is prefetched when
 * the browser is idle and mounted on first use, so it never competes with the
 * first paint.
 */
export function AgentPanel() {
  const { t } = useI18n();
  const launcherRef = useRef<HTMLButtonElement | null>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);
  const [open, setOpen] = useState(false);
  const [initialRequest, setInitialRequest] = useState<OpenCompanionDetail | null>(null);
  const [requested, setRequested] = useState(false);
  const requestedRef = useRef(false);
  const [typingElsewhere, setTypingElsewhere] = useState(false);

  useEffect(() => {
    function onOpenAgent(event: Event) {
      const detail = (event as CustomEvent<OpenCompanionDetail>).detail ?? {};

      returnFocusRef.current =
        detail.returnFocusTo ?? (document.activeElement instanceof HTMLElement ? document.activeElement : null);
      trackEvent("companion_open", { source: "cue" });

      // Before the dialog module exists, it receives the request as a prop;
      // afterwards it listens to the same event itself.
      if (!requestedRef.current) {
        requestedRef.current = true;
        setInitialRequest(detail);
        setRequested(true);
      }

      setOpen(true);
    }

    window.addEventListener(OPEN_AGENT_EVENT, onOpenAgent);
    return () => window.removeEventListener(OPEN_AGENT_EVENT, onOpenAgent);
  }, []);

  // Step the launcher aside on small screens while a page form field has
  // focus, so it never sits on top of the field or its submit button.
  useEffect(() => {
    function isTextField(target: EventTarget | null) {
      return (
        target instanceof HTMLElement &&
        !target.closest("[data-agent-panel]") &&
        (target.tagName === "TEXTAREA" ||
          target.tagName === "SELECT" ||
          (target.tagName === "INPUT" &&
            !["button", "submit", "checkbox", "radio"].includes((target as HTMLInputElement).type)))
      );
    }

    const onFocusIn = (event: FocusEvent) => setTypingElsewhere(isTextField(event.target));
    const onFocusOut = () => setTypingElsewhere(false);

    document.addEventListener("focusin", onFocusIn);
    document.addEventListener("focusout", onFocusOut);

    return () => {
      document.removeEventListener("focusin", onFocusIn);
      document.removeEventListener("focusout", onFocusOut);
    };
  }, []);

  useEffect(() => whenIdle(() => void loadAgentDialog(), 3500), []);

  function openFromLauncher() {
    returnFocusRef.current = launcherRef.current;
    trackEvent("companion_open", { source: "launcher" });
    requestedRef.current = true;
    setRequested(true);
    setOpen(true);
  }

  return (
    <>
      <AgentLauncher
        ref={launcherRef}
        label={t.agent.launcher}
        ariaLabel={t.agent.launcherLabel}
        hidden={open}
        compactHidden={typingElsewhere}
        onClick={openFromLauncher}
        onIntent={() => void loadAgentDialog()}
      />
      {requested ? (
        <AgentDialog
          open={open}
          onOpenChange={setOpen}
          launcherRef={launcherRef}
          returnFocusRef={returnFocusRef}
          initialRequest={initialRequest}
        />
      ) : null}
    </>
  );
}
