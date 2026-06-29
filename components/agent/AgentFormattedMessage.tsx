import { Fragment } from "react";
import { cn } from "@/lib/utils";
import { getTextDirection } from "@/lib/text-direction";

type MessageBlock =
  | { type: "paragraph"; lines: string[] }
  | { type: "bullets"; items: string[] }
  | { type: "numbers"; items: string[] };

const INLINE_TOKEN_PATTERN = /(\*\*[^*\n]+\*\*|`[^`\n]+`)/g;
const BULLET_PATTERN = /^-\s+(.+)$/;
const NUMBERED_PATTERN = /^\d+[.)]\s+(.+)$/;

function renderInlineFormatting(text: string) {
  return text
    .split(INLINE_TOKEN_PATTERN)
    .filter(Boolean)
    .map((token, index) => {
      if (token.startsWith("**") && token.endsWith("**")) {
        return <strong key={`${token}-${index}`}>{token.slice(2, -2)}</strong>;
      }

      if (token.startsWith("`") && token.endsWith("`")) {
        return (
          <code
            key={`${token}-${index}`}
            dir="ltr"
            className="rounded bg-white/[0.08] px-1 py-0.5 font-mono text-[0.92em] text-accent"
          >
            {token.slice(1, -1)}
          </code>
        );
      }

      return <Fragment key={`${token}-${index}`}>{token}</Fragment>;
    });
}

function parseBlocks(content: string) {
  const blocks: MessageBlock[] = [];
  let paragraphLines: string[] = [];
  let listType: "bullets" | "numbers" | null = null;
  let listItems: string[] = [];

  function flushParagraph() {
    if (paragraphLines.length > 0) {
      blocks.push({ type: "paragraph", lines: paragraphLines });
      paragraphLines = [];
    }
  }

  function flushList() {
    if (listType && listItems.length > 0) {
      blocks.push({ type: listType, items: listItems });
      listType = null;
      listItems = [];
    }
  }

  for (const rawLine of content.split(/\r?\n/)) {
    const line = rawLine.trim();
    const bullet = line.match(BULLET_PATTERN);
    const numbered = line.match(NUMBERED_PATTERN);

    if (!line) {
      flushParagraph();
      flushList();
      continue;
    }

    if (bullet || numbered) {
      const nextType = bullet ? "bullets" : "numbers";

      flushParagraph();

      if (listType && listType !== nextType) {
        flushList();
      }

      listType = nextType;
      listItems.push((bullet ?? numbered)![1]);
      continue;
    }

    flushList();
    paragraphLines.push(line);
  }

  flushParagraph();
  flushList();

  return blocks;
}

function renderParagraph(lines: string[]) {
  return lines.flatMap((line, index) => [
    ...(index > 0 ? [<br key={`break-${index}`} />] : []),
    ...renderInlineFormatting(line)
  ]);
}

export function AgentFormattedMessage({ content }: { content: string }) {
  const direction = getTextDirection(content);
  const blocks = parseBlocks(content);
  const listPadding = direction === "rtl" ? "pr-5" : "pl-5";

  return (
    <div
      dir={direction}
      className={cn(
        "max-w-full space-y-2.5 overflow-visible leading-relaxed [overflow-wrap:anywhere]",
        direction === "rtl" ? "text-right" : "text-left"
      )}
    >
      {blocks.map((block, index) => {
        if (block.type === "paragraph") {
          return <p key={`paragraph-${index}`}>{renderParagraph(block.lines)}</p>;
        }

        const List = block.type === "bullets" ? "ul" : "ol";

        return (
          <List
            key={`${block.type}-${index}`}
            className={cn(
              "max-w-full list-outside space-y-1 [overflow-wrap:anywhere]",
              block.type === "bullets" ? "list-disc" : "list-decimal",
              listPadding
            )}
          >
            {block.items.map((item, itemIndex) => (
              <li key={`${item}-${itemIndex}`}>{renderInlineFormatting(item)}</li>
            ))}
          </List>
        );
      })}
    </div>
  );
}
