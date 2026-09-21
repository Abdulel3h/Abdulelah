const ARABIC_LETTER = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/;
const LATIN_LETTER = /[A-Za-z\u00C0-\u024F]/;

export function containsArabic(text: string) {
  return /[\u0600-\u06FF]/.test(text);
}

/**
 * Direction for a block of mixed Arabic/English text.
 *
 * `dir="auto"` only looks at the first strong character, so an Arabic answer
 * that opens with a project name ("ChatUB هو …") would be laid out LTR, while
 * a single Arabic name inside an English answer used to flip the whole block
 * to RTL. Counting words matches how a reader perceives the text: Arabic
 * sentences keep plenty of Arabic words even when they cite English
 * technology names.
 */
export function getTextDirection(text: string): "rtl" | "ltr" {
  let arabicWords = 0;
  let latinWords = 0;

  for (const word of text.split(/\s+/)) {
    if (ARABIC_LETTER.test(word)) {
      arabicWords += 1;
    } else if (LATIN_LETTER.test(word)) {
      latinWords += 1;
    }
  }

  if (arabicWords === 0) {
    return "ltr";
  }

  return arabicWords / (arabicWords + latinWords) >= 0.3 ? "rtl" : "ltr";
}
