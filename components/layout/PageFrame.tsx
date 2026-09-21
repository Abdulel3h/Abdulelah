"use client";

import { usePathname } from "next/navigation";
import { useState, type ReactNode } from "react";
import { splitLocalePath } from "@/lib/i18n/config";

/**
 * The page's <main> landmark. The first render is never animated — essential
 * content must be visible the moment the HTML arrives. A light CSS entrance
 * only plays on later client-side navigations (and not at all under reduced
 * motion, see globals.css).
 */
export function PageFrame({ children }: { children: ReactNode }) {
  const pathname = splitLocalePath(usePathname() ?? "/").path;
  const [initialPath] = useState(pathname);
  const hasNavigated = pathname !== initialPath;

  return (
    <main
      id="main-content"
      tabIndex={-1}
      key={pathname}
      className={hasNavigated ? "page-enter" : undefined}
    >
      {children}
    </main>
  );
}
