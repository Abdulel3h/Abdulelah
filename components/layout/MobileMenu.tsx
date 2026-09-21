"use client";

import { Menu } from "lucide-react";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { useI18n } from "@/components/i18n/LocaleProvider";
import { whenIdle } from "@/lib/when-idle";

const loadMenuDialog = () => import("@/components/layout/MobileMenuDialog");
const MobileMenuDialog = dynamic(loadMenuDialog, { ssr: false });

/** The mobile menu button; the full-screen menu itself loads on demand. */
export function MobileMenu() {
  const { t } = useI18n();
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const [open, setOpen] = useState(false);
  const [requested, setRequested] = useState(false);

  useEffect(() => whenIdle(() => void loadMenuDialog(), 3000), []);

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        aria-label={t.nav.openMenu}
        aria-haspopup="dialog"
        aria-expanded={open}
        onPointerEnter={() => void loadMenuDialog()}
        onTouchStart={() => void loadMenuDialog()}
        onClick={() => {
          setRequested(true);
          setOpen(true);
        }}
        className="focus-ring grid h-11 w-11 place-items-center rounded-full border border-white/[0.12] bg-white/[0.04] text-paper transition hover:border-accent/40 lg:hidden"
      >
        <Menu className="h-5 w-5" aria-hidden="true" />
      </button>
      {requested ? <MobileMenuDialog open={open} onOpenChange={setOpen} triggerRef={triggerRef} /> : null}
    </>
  );
}
