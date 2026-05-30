"use client";

import { Search } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { projects } from "@/data/projects";
import { contactLink, navLinks } from "@/data/site";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator
} from "@/components/ui/command";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

const staticCommands = [
  ...navLinks,
  contactLink,
  { label: "Blog / Insights", href: "/blog" },
  { label: "AI Journey", href: "/journey" }
];

export function CommandMenu() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  const commands = useMemo(
    () => [
      ...staticCommands,
      ...projects.slice(0, 3).map((project) => ({
        label: project.title.split(" - ")[0],
        href: `/projects/${project.slug}`
      }))
    ],
    []
  );

  const filteredCommands = useMemo(() => {
    const normalized = query.trim().toLowerCase();

    if (!normalized) {
      return commands;
    }

    return commands.filter((command) =>
      `${command.label} ${command.href}`.toLowerCase().includes(normalized)
    );
  }, [commands, query]);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen((value) => !value);
      }

      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    if (!open) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  function navigate(href: string) {
    setOpen(false);
    setQuery("");
    router.push(href);
  }

  return (
    <>
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="hidden text-xs text-slate-300 lg:inline-flex"
        onClick={() => setOpen(true)}
        aria-label="Open command menu"
      >
        <Search className="h-3.5 w-3.5" aria-hidden="true" />
        Search
        <span className="rounded-md border border-white/10 bg-white/[0.06] px-1.5 py-0.5 text-[10px] text-slate-400">
          Ctrl K
        </span>
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="top-[12%] max-w-2xl translate-y-0 p-0">
          <DialogTitle className="sr-only">Command menu</DialogTitle>
          <Command shouldFilter={false}>
            <div className="flex items-center pr-12">
              <CommandInput
                autoFocus
                value={query}
                onValueChange={setQuery}
                placeholder="Search pages, projects, or case studies..."
                aria-label="Search pages, projects, or case studies"
              />
            </div>
            <CommandList>
              <CommandEmpty>No matching page or project found.</CommandEmpty>
              <CommandGroup heading="Navigation">
                {filteredCommands.map((command) => (
                  <CommandItem
                    key={command.href}
                    value={`${command.label} ${command.href}`}
                    onSelect={() => navigate(command.href)}
                    asChild
                    className="cursor-pointer"
                  >
                    <Link
                      href={command.href}
                      onClick={() => {
                        setOpen(false);
                        setQuery("");
                      }}
                    >
                      <span>{command.label}</span>
                      <span className="text-xs text-slate-500">{command.href}</span>
                    </Link>
                  </CommandItem>
                ))}
              </CommandGroup>
              <CommandSeparator />
              <p className="px-4 py-3 text-xs text-slate-500">
                Tip: use Ctrl K or Cmd K from anywhere on the site.
              </p>
            </CommandList>
          </Command>
        </DialogContent>
      </Dialog>
    </>
  );
}
