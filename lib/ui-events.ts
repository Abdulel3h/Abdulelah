/**
 * Small window-event bridge so any button can open the site-wide search
 * dialog (rendered once in the layout) and tell it where focus should return
 * when it closes.
 */
export const OPEN_SEARCH_EVENT = "abdulelah:open-search";

export type OpenSearchDetail = {
  /** Element that should receive focus after the dialog closes. */
  returnFocusTo?: HTMLElement | null;
};

export function openSearch(detail: OpenSearchDetail = {}) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent<OpenSearchDetail>(OPEN_SEARCH_EVENT, { detail }));
}

/** Focuses `element` if it is still in the document and visible; returns success. */
export function restoreFocus(element: HTMLElement | null | undefined) {
  if (!element || !element.isConnected) {
    return false;
  }

  const rect = element.getBoundingClientRect();

  if (rect.width === 0 && rect.height === 0) {
    return false;
  }

  element.focus({ preventScroll: false });

  return document.activeElement === element;
}
