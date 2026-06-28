"use client";

import { useEffect } from "react";
import { recordProjectView } from "@/lib/agent/session-memory";

/** Records (visit-only) that this project was explored, so the guide can later
 * suggest comparisons and a reading path. Renders nothing. */
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
  }, [slug, name, category]);

  return null;
}
