import { notFound } from "next/navigation";

/**
 * Any path under a locale that no page claims. Throwing here (before anything
 * streams) renders the localized not-found page with a real 404 status.
 */
export default function UnknownPage() {
  notFound();
}
