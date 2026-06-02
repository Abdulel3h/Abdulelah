export function containsArabic(text: string) {
  return /[\u0600-\u06FF]/.test(text);
}

export function getTextDirection(text: string): "rtl" | "ltr" {
  return containsArabic(text) ? "rtl" : "ltr";
}
