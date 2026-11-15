"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  useSyncExternalStore,
  type CSSProperties,
  type FormEvent,
  type KeyboardEvent,
  type MouseEvent
} from "react";
import { mixed } from "@/components/site/mixed";
import { trackEvent } from "@/lib/analytics";
import { openCompanion } from "@/lib/agent/companion";
import type { ShellData, ShellLine, ShellResult } from "@/lib/shell/commands";

type Engine = typeof import("@/lib/shell/commands");

let engine: Engine | null = null;
let loading: Promise<Engine> | null = null;

/**
 * The command engine stays out of the page's first load: it is fetched the
 * first time a visitor points at, focuses or touches the shell, so it is
 * ready by the time they press a key or a chip.
 */
function loadEngine() {
  if (engine) return Promise.resolve(engine);

  loading ??= import("@/lib/shell/commands").then((module) => (engine = module));

  return loading;
}

export type ShellChip = {
  /** What runs when the chip is pressed (typed into the line first). */
  command: string;
  label: string;
  /** Where the chip goes without JavaScript; absent for script-only chips. */
  href?: string;
};

type Entry = { id: number; input: string; result: ShellResult };

const noopSubscribe = () => () => {};

const MAX_ENTRIES = 5;
const TYPE_MS = 24;

function reducedMotion() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * The opening's command line. Without JavaScript the chips are plain links
 * and the line waits read-only; with it, a chip types its command, the shell
 * prints what the page already says (lib/shell/commands.ts) and then acts:
 * scroll to the work, open a case study, ask the guide, switch language.
 * Keyboard: Enter runs, ↑/↓ walk the history, Tab completes (and otherwise
 * moves focus as usual), Ctrl+L clears.
 */
export function Shell({
  data,
  chips,
  labels
}: {
  data: ShellData;
  chips: ShellChip[];
  labels: {
    inputLabel: string;
    placeholder: string;
    run: string;
    logLabel: string;
    chipsLabel: string;
    hint: string;
    copy: string;
    copied: string;
    path: string;
  };
}) {
  const router = useRouter();
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const logRef = useRef<HTMLDivElement>(null);
  const shellRef = useRef<HTMLDivElement>(null);
  const timers = useRef<number[]>([]);
  const nextId = useRef(1);
  // False in the server HTML and during hydration, true once the client runs.
  const ready = useSyncExternalStore(noopSubscribe, () => true, () => false);
  const [value, setValue] = useState("");
  const [busy, setBusy] = useState(false);
  const [entries, setEntries] = useState<Entry[]>([]);
  const [history, setHistory] = useState<string[]>([]);
  const [cursor, setCursor] = useState(-1);

  useEffect(() => {
    const pending = timers.current;

    return () => pending.forEach((timer) => window.clearTimeout(timer));
  }, []);

  // While the shell is on screen, it offers the guide itself: tell the page,
  // so the floating launcher can step aside on a phone (see shell.css).
  useEffect(() => {
    const shell = shellRef.current;

    if (!shell || !("IntersectionObserver" in window)) return;

    const root = document.documentElement;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) root.dataset.shellInView = "true";
        else delete root.dataset.shellInView;
      },
      { threshold: 0.2 }
    );

    observer.observe(shell);

    return () => {
      observer.disconnect();
      delete root.dataset.shellInView;
    };
  }, []);

  // Keep the newest output in view inside the log, without moving the page.
  useEffect(() => {
    const log = logRef.current;

    if (log) log.scrollTop = log.scrollHeight;
  }, [entries]);

  const later = useCallback((fn: () => void, ms: number) => {
    timers.current.push(window.setTimeout(fn, ms));
  }, []);

  const act = useCallback(
    (result: ShellResult) => {
      const effect = result.effect;

      if (!effect) return;

      const instant = reducedMotion();

      switch (effect.type) {
        case "clear":
          setEntries([]);
          break;
        case "scroll": {
          const target = document.getElementById(effect.target);
          const heading = target?.querySelector<HTMLElement>("h2");

          later(() => {
            target?.scrollIntoView({ behavior: instant ? "auto" : "smooth", block: "start" });

            if (heading) {
              heading.setAttribute("tabindex", "-1");
              heading.focus({ preventScroll: true });
            }
          }, instant ? 0 : 260);
          break;
        }
        case "navigate":
          later(() => router.push(effect.href), instant ? 0 : 420);
          break;
        case "ask":
          openCompanion(
            effect.prompt
              ? { prompt: effect.prompt, send: true, returnFocusTo: inputRef.current }
              : { returnFocusTo: inputRef.current }
          );
          break;
        case "locale":
          later(() => window.location.assign(effect.href), instant ? 0 : 320);
          break;
      }
    },
    [later, router]
  );

  const execute = useCallback(
    async (input: string) => {
      const line = input.trim();

      if (!line) return;

      const { run, parse } = await loadEngine();
      const result = run(data, line);
      // Only the recognised command name is recorded, never what was typed.
      const { command } = parse(data, line);

      trackEvent("signature_interaction_used", { project: "shell", command: command ?? "other" });
      setHistory((previous) => [...previous.filter((item) => item !== line), line].slice(-20));
      setCursor(-1);
      setValue("");

      if (result.effect?.type !== "clear") {
        setEntries((previous) => [...previous, { id: nextId.current++, input: line, result }].slice(-MAX_ENTRIES));
      }

      act(result);
    },
    [act, data]
  );

  /** Types a command into the line, then runs it — instantly under reduced motion. */
  const typeAndRun = useCallback(
    (command: string) => {
      if (busy) return;

      if (reducedMotion()) {
        void execute(command);
        return;
      }

      setBusy(true);
      setValue("");

      for (let index = 0; index < command.length; index += 1) {
        later(() => setValue(command.slice(0, index + 1)), TYPE_MS * (index + 1));
      }
      later(() => {
        void execute(command);
        setBusy(false);
      }, TYPE_MS * command.length + 140);
    },
    [busy, execute, later]
  );

  function onSubmit(event: FormEvent) {
    event.preventDefault();

    if (!busy) void execute(value);
  }

  function onKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "ArrowUp" && history.length) {
      event.preventDefault();
      const next = cursor === -1 ? history.length - 1 : Math.max(0, cursor - 1);

      setCursor(next);
      setValue(history[next]);
    } else if (event.key === "ArrowDown" && cursor !== -1) {
      event.preventDefault();
      const next = cursor + 1;

      if (next >= history.length) {
        setCursor(-1);
        setValue("");
      } else {
        setCursor(next);
        setValue(history[next]);
      }
    } else if (event.key === "Tab" && !event.shiftKey && value.trim() && engine) {
      // Only take Tab when there is something to complete; otherwise it moves
      // focus. (The engine is loaded by the time anything has been typed.)
      const completed = engine.complete(data, value);

      if (completed !== value) {
        event.preventDefault();
        setValue(completed);
      }
    } else if (event.key === "l" && event.ctrlKey) {
      event.preventDefault();
      setEntries([]);
    }
  }

  function onChip(event: MouseEvent<HTMLElement>, chip: ShellChip) {
    // Modified clicks keep their native meaning (new tab, download…).
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

    event.preventDefault();
    typeAndRun(chip.command);
  }

  return (
    <div
      ref={shellRef}
      className="sh-shell"
      data-ready={ready ? "true" : "false"}
      onPointerEnter={() => void loadEngine()}
      onTouchStart={() => void loadEngine()}
      onFocusCapture={() => void loadEngine()}
    >
      <div
        ref={logRef}
        role="log"
        aria-live="polite"
        aria-label={labels.logLabel}
        className="sh-log"
        data-empty={entries.length === 0 ? "true" : "false"}
      >
        {entries.map((entry) => (
          <div key={entry.id} className="sh-entry">
            <p className="sh-echo" dir="ltr">
              <span aria-hidden="true" className="sh-ps">
                {labels.path}
              </span>
              <span lang={/[؀-ۿ]/.test(entry.input) ? "ar" : "en"} dir="auto">
                {entry.input}
              </span>
            </p>
            {entry.result.lines.map((line, index) => (
              <Line
                key={index}
                line={line}
                index={index}
                locale={data.locale}
                labels={labels}
                onRun={typeAndRun}
              />
            ))}
          </div>
        ))}
      </div>

      <form className="sh-line" onSubmit={onSubmit} dir="ltr">
        <label htmlFor={inputId} className="sh-ps">
          <span aria-hidden="true">{labels.path}</span>
          <span className="sr-only">{labels.inputLabel}</span>
        </label>
        <input
          ref={inputRef}
          id={inputId}
          className="sh-input"
          value={value}
          onChange={(event) => {
            setValue(event.target.value);
            setCursor(-1);
          }}
          onKeyDown={onKeyDown}
          readOnly={!ready || busy}
          placeholder={labels.placeholder}
          dir="auto"
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="none"
          spellCheck={false}
          enterKeyHint="go"
          aria-describedby={`${inputId}-hint`}
        />
        <button type="submit" className="sh-enter focus-ring" aria-label={labels.run} disabled={!ready}>
          <span aria-hidden="true">⏎</span>
        </button>
      </form>
      <p id={`${inputId}-hint`} className="sh-hint">
        {labels.hint}
      </p>

      <ul className="sh-chips" aria-label={labels.chipsLabel}>
        {chips.map((chip, index) => (
          <li key={chip.command} style={{ "--i": index } as CSSProperties}>
            {chip.href ? (
              <a href={chip.href} className="sh-chip focus-ring" onClick={(event) => onChip(event, chip)}>
                <span className="sh-chip-cmd" aria-hidden="true">
                  {chip.command.split(" ")[0]}
                </span>
                <span>{chip.label}</span>
              </a>
            ) : (
              <button
                type="button"
                className="sh-chip focus-ring"
                aria-haspopup="dialog"
                onClick={(event) => onChip(event, chip)}
                disabled={!ready}
              >
                <span className="sh-chip-cmd" aria-hidden="true">
                  {chip.command.split(" ")[0]}
                </span>
                <span>{chip.label}</span>
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

function Line({
  line,
  index,
  locale,
  labels,
  onRun
}: {
  line: ShellLine;
  index: number;
  locale: "en" | "ar";
  labels: { copy: string; copied: string };
  onRun: (command: string) => void;
}) {
  const style = { "--i": index } as CSSProperties;

  switch (line.kind) {
    case "text":
      return (
        <p className="sh-out" data-tone={line.tone} style={style}>
          {mixed(line.text, locale)}
        </p>
      );
    case "pair":
      return (
        <p className="sh-out sh-pair" style={style}>
          <span className="sh-key">{mixed(line.label, locale)}</span>
          <span>{mixed(line.value, locale)}</span>
        </p>
      );
    case "command":
      return (
        <p className="sh-out sh-pair" style={style}>
          <button type="button" className="sh-cmd focus-ring" dir="ltr" lang="en" onClick={() => onRun(line.name)}>
            {line.name}
          </button>
          <span>{mixed(line.description, locale)}</span>
        </p>
      );
    case "project":
      return (
        <p className="sh-out sh-project" data-concept={line.concept ? "true" : "false"} style={style}>
          <Link href={line.href} className="sh-project-name focus-ring">
            {mixed(line.name, locale)}
          </Link>
          <span className="sh-status">{line.status}</span>
          <span className="sh-year ds-num">{line.year}</span>
          <span className="sh-project-line">{mixed(line.line, locale)}</span>
        </p>
      );
    case "link":
      return (
        <p className="sh-out" style={style}>
          {line.external || line.download ? (
            <a
              href={line.href}
              className="sh-link focus-ring"
              {...(line.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              {...(line.download ? { download: true } : {})}
            >
              {mixed(line.label, locale)}
              <span aria-hidden="true"> {line.download ? "↓" : locale === "ar" ? "↖" : "↗"}</span>
            </a>
          ) : (
            <Link href={line.href} className="sh-link focus-ring">
              {mixed(line.label, locale)}
              <span aria-hidden="true"> {locale === "ar" ? "←" : "→"}</span>
            </Link>
          )}
          {line.meta ? <span className="sh-meta"> {line.meta}</span> : null}
        </p>
      );
    case "copy":
      return <CopyLine value={line.value} labels={labels} style={style} />;
  }
}

function CopyLine({ value, labels, style }: { value: string; labels: { copy: string; copied: string }; style: CSSProperties }) {
  const [copied, setCopied] = useState(false);

  return (
    <p className="sh-out sh-pair" style={style}>
      <a href={`mailto:${value}`} className="sh-link focus-ring" dir="ltr" lang="en">
        {value}
      </a>
      <button
        type="button"
        className="sh-cmd focus-ring"
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(value);
            setCopied(true);
            trackEvent("email_copied", { source: "shell" });
          } catch {
            setCopied(false);
          }
        }}
      >
        <span aria-live="polite">{copied ? labels.copied : labels.copy}</span>
      </button>
    </p>
  );
}
