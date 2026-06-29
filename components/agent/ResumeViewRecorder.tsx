"use client";

import { useEffect } from "react";
import { recordResumeView } from "@/lib/agent/session-memory";

/** Records (visit-only) that the résumé was viewed. Renders nothing. */
export function ResumeViewRecorder() {
  useEffect(() => {
    recordResumeView();
  }, []);

  return null;
}
