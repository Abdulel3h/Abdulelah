import { localizeHref, type Locale } from "@/lib/i18n/config";
import type { AgentAction } from "@/types/agent";

/**
 * The guide's server returns action buttons in English with locale-free
 * routes. On the Arabic site they are relabelled, routed to /ar/..., and
 * prompt buttons ask their question in Arabic so the answer comes back in
 * Arabic too.
 */
const AR_LABELS: Record<string, string> = {
  "View All Projects": "كل المشاريع",
  "View Skills": "المهارات",
  "View Resume": "السيرة الذاتية",
  "Contact Abdulelah": "تواصل مع عبدالإله",
  "Explore AI Insights": "الملاحظات",
  "Read Context Engineering Article": "اقرأ مقال هندسة السياق",
  "Read Student AI Guide": "اقرأ دليل الطلاب",
  "Read Local AI Article": "اقرأ مقال الذكاء الاصطناعي المحلي",
  "Read Urban Planning Article": "اقرأ مقال التخطيط الحضري",
  "Read Predictive Security Article": "اقرأ مقال الأمن الاستباقي",
  "Send Abdulelah a message": "أرسل رسالة إلى عبدالإله",
  "Download AI Engineer CV": "تنزيل نسخة AI Engineer",
  "Download AI Specialist CV": "تنزيل نسخة AI Specialist",
  "Open GitHub": "فتح GitHub",
  "Open LinkedIn": "فتح LinkedIn",
  "Simple explanation": "شرح مبسّط",
  "Technical explanation": "شرح تقني",
  "Recruiter summary": "ملخص لمسؤول التوظيف",
  "Continue answer": "كمّل الإجابة",
  "General Hiring Fit": "ملاءمة عامة للتوظيف",
  "Internship / COOP": "تدريب تعاوني",
  "Cloud AI / Data Role": "دور في السحابة والبيانات"
};

function translatePrompt(prompt: string) {
  const explain = prompt.match(/^Explain (.+?) (simply|technically|for a recruiter)$/);

  if (explain) {
    const [, name, depth] = explain;

    if (depth === "simply") return `اشرح ${name} ببساطة`;
    if (depth === "technically") return `اشرح ${name} تقنيًا`;

    return `ملخص ${name} لمسؤول التوظيف`;
  }

  const explainOnly = prompt.match(/^Explain (.+)$/);

  if (explainOnly) return `اشرح ${explainOnly[1]}`;

  const compare = prompt.match(/^Compare (.+) and (.+)$/);

  if (compare) return `قارن بين ${compare[1]} و${compare[2]}`;

  const hiring = prompt.match(/^(?:I am hiring for an?|We need an?|We are hiring for an?) (.+?)(?: role)?$/);

  if (hiring) return `أبحث عن مرشح لوظيفة ${hiring[1]}`;

  if (/General Hiring Fit/.test(prompt)) return "أعطني ملخصًا عامًا لملاءمة عبدالإله للتوظيف";
  if (prompt === "Continue answer") return "كمل الإجابة";

  return prompt;
}

function translateLabel(label: string) {
  if (AR_LABELS[label]) return AR_LABELS[label];

  const view = label.match(/^View (.+)$/);

  if (view) return `عرض ${view[1]}`;

  const email = label.match(/^Email (.+)$/);

  if (email) return `راسل ${email[1]}`;

  return label;
}

export function localizeAgentAction(action: AgentAction, locale: Locale): AgentAction {
  const href =
    action.type === "internal" && action.href.startsWith("/") ? localizeHref(action.href, locale) : action.href;

  if (locale !== "ar") {
    return { ...action, href };
  }

  if (action.type === "prompt") {
    return { ...action, label: translateLabel(action.label), prompt: translatePrompt(action.prompt) };
  }

  return { ...action, href, label: translateLabel(action.label) };
}
