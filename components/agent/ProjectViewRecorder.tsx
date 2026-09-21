"use client";

import { useEffect } from "react";
import { recordProjectView } from "@/lib/agent/session-memory";
import { trackEvent } from "@/lib/analytics";

/**
 * Records (visit-only, sessionStorage) that this case study was opened so the
 * guide can suggest a reading path, and sends one anonymous "project_opened"
 * analytics event. Renders nothing.
 */
export function ProjectViewRecorder({
  slug,
  name,
  category
}: {
  slug: string;
  name: string;
  category: string;
}) {
  useEffect(() => {
    recordProjectView({ slug, name, category });
    trackEvent("project_opened", { project: slug });
  }, [slug, name, category]);

  return null;
}
