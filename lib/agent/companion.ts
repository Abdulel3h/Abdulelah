export const OPEN_AGENT_EVENT = "open-abdulelah-ai";

export type OpenCompanionDetail = {
  /** A question to bring into the companion. */
  prompt?: string;
  /** When true, the prompt is asked immediately; otherwise it is pre-filled. */
  send?: boolean;
  /**
   * Where focus should go when the guide closes. Defaults to the element that
   * had focus when it opened (the button that asked for it).
   */
  returnFocusTo?: HTMLElement | null;
};

/**
 * Opens Abdulelah's companion from anywhere on the site — optionally seeding (or
 * immediately asking) a context-specific question. Used by inline invitations
 * so the companion becomes part of the experience rather than a separate widget.
 */
export function openCompanion(detail: OpenCompanionDetail = {}) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(OPEN_AGENT_EVENT, { detail }));
}
