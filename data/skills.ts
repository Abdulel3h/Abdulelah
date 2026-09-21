import type { Locale } from "@/lib/i18n/config";

export type SkillLevel = "Strong" | "Practical Experience" | "Familiar";

export type SkillGroup = {
  title: string;
  skills: {
    name: string;
    level: SkillLevel;
  }[];
};

type SkillRecord = { name: string; ar?: string; level: SkillLevel };

// Technology and product names stay in English in both languages; only
// plain-language skills get an Arabic label.
const records: { title: string; titleAr: string; skills: SkillRecord[] }[] = [
  {
    title: "AI & Machine Learning",
    titleAr: "الذكاء الاصطناعي وتعلّم الآلة",
    skills: [
      { name: "Machine Learning", ar: "تعلّم الآلة", level: "Practical Experience" },
      { name: "AI Modeling", ar: "نمذجة الذكاء الاصطناعي", level: "Practical Experience" },
      { name: "NLP", ar: "معالجة اللغات الطبيعية (NLP)", level: "Strong" },
      { name: "Generative AI", ar: "الذكاء الاصطناعي التوليدي", level: "Practical Experience" },
      { name: "LLM Applications", ar: "تطبيقات النماذج اللغوية الكبيرة", level: "Practical Experience" },
      { name: "AI Agents", ar: "الوكلاء الأذكياء (AI Agents)", level: "Familiar" },
      { name: "Intelligent Search", ar: "البحث الذكي", level: "Practical Experience" },
      { name: "AI-Driven Insights", ar: "رؤى مدعومة بالذكاء الاصطناعي", level: "Practical Experience" },
      { name: "Model Optimization", ar: "تحسين النماذج", level: "Familiar" }
    ]
  },
  {
    title: "Cloud & Deployment",
    titleAr: "الحوسبة السحابية والنشر",
    skills: [
      { name: "Azure AI Services", level: "Practical Experience" },
      { name: "Google Cloud Run", level: "Practical Experience" },
      { name: "Vertex AI", level: "Practical Experience" },
      { name: "BigQuery", level: "Practical Experience" },
      { name: "Cloud Storage", level: "Practical Experience" },
      { name: "Model Deployment", ar: "نشر النماذج", level: "Familiar" },
      { name: "Cloud Architecture", ar: "البنية السحابية", level: "Practical Experience" }
    ]
  },
  {
    title: "Programming & Data",
    titleAr: "البرمجة والبيانات",
    skills: [
      { name: "Python", level: "Strong" },
      { name: "SQL", level: "Practical Experience" },
      { name: "R Programming", ar: "لغة R", level: "Familiar" },
      { name: "Database Management", ar: "إدارة قواعد البيانات", level: "Practical Experience" },
      { name: "Power BI", level: "Practical Experience" },
      { name: "Data Visualization", ar: "العرض البصري للبيانات", level: "Practical Experience" }
    ]
  },
  {
    title: "Software & Tools",
    titleAr: "البرمجيات والأدوات",
    skills: [
      { name: "GitHub", level: "Practical Experience" },
      { name: "Version Control", ar: "إدارة الإصدارات", level: "Practical Experience" },
      { name: "API Integration", ar: "تكامل الواجهات البرمجية", level: "Practical Experience" },
      { name: "Web Development", ar: "تطوير الويب", level: "Familiar" },
      { name: "Dashboard Design", ar: "تصميم لوحات المعلومات", level: "Practical Experience" }
    ]
  },
  {
    title: "Professional Skills",
    titleAr: "المهارات المهنية",
    skills: [
      { name: "Team Leadership", ar: "قيادة الفرق", level: "Practical Experience" },
      { name: "Problem Solving", ar: "حل المشكلات", level: "Strong" },
      { name: "Analytical Thinking", ar: "التفكير التحليلي", level: "Strong" },
      { name: "Communication", ar: "التواصل", level: "Practical Experience" },
      { name: "Creativity", ar: "الإبداع", level: "Strong" },
      { name: "Adaptability", ar: "المرونة", level: "Strong" },
      { name: "Continuous Learning", ar: "التعلّم المستمر", level: "Strong" }
    ]
  }
];

export function getSkillGroups(locale: Locale = "en"): SkillGroup[] {
  return records.map((group) => ({
    title: locale === "ar" ? group.titleAr : group.title,
    skills: group.skills.map((skill) => ({
      name: locale === "ar" ? skill.ar ?? skill.name : skill.name,
      level: skill.level
    }))
  }));
}

/** English facts for the guide's server-side context. */
export const skillGroups = getSkillGroups("en");
