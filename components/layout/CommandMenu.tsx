"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import type { SearchIndexItem } from "@/lib/search-index";
import { OPEN_SEARCH_EVENT, type OpenSearchDetail } from "@/lib/ui-events";
import { whenIdle } from "@/lib/when-idle";

const loadSearchDialog = () => import("@/components/layout/SearchDialog");
const SearchDialog = dynamic(loadSearchDialog, { ssr: false });

/**
 * Site search entry point. Only the keyboard shortcut and open-event
 * listeners ship with the page; the dialog itself (cmdk + Radix) is fetched
 * when the browser is idle or on first use, keeping it off the critical path.
 */
export function CommandMenu({ index }: { index: SearchIndexItem[] }) {
  const [open, setOpen] = useState(false);
  const [requested, setRequested] = useState(false);
  const [ready, setReady] = useState(false);
  const [pendingQuery, setPendingQuery] = useState("");
  const returnFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    function show(returnFocusTo?: HTMLElement | null) {
      returnFocusRef.current =
        returnFocusTo ?? (document.activeElement instanceof HTMLElement ? document.activeElement : null);
      setRequested(true);
      setOpen(true);
    }

    function onOpenEvent(event: Event) {
      show((event as CustomEvent<OpenSearchDetail>).detail?.returnFocusTo);
    }

    function onKeyDown(event: KeyboardEvent) {
      if ((event.ctrlKey || event.metaKey) && !event.altKey && event.key.toLowerCase() === "k") {
        event.preventDefault();

        if (!open) {
          show();
        } else {
          setOpen(false);
        }
      }
    }

    window.addEventListener(OPEN_SEARCH_EVENT, onOpenEvent);
    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener(OPEN_SEARCH_EVENT, onOpenEvent);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  useEffect(() => whenIdle(() => void loadSearchDialog()), []);

  // Keys typed in the moment between opening and the dialog chunk arriving
  // are kept and become the dialog's first query.
  useEffect(() => {
    if (!open || ready) return;

    function onKey(event: KeyboardEvent) {
      if (event.ctrlKey || event.metaKey || event.altKey) return;

      if (event.key.length === 1) {
        event.preventDefault();
        setPendingQuery((current) => current + event.key);
      } else if (event.key === "Backspace") {
        setPendingQuery((current) => current.slice(0, -1));
      } else if (event.key === "Escape") {
        setOpen(false);
      }
    }

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, ready]);

  return requested ? (
    <SearchDialog
      index={index}
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) setPendingQuery("");
      }}
      returnFocusRef={returnFocusRef}
      initialQuery={pendingQuery}
      onReady={() => setReady(true)}
    />
  ) : null;
}
