import type { Locale } from "@/lib/i18n/config";

type AchievementText = {
  title: string;
  organization: string;
  /** The result in a few words — what a reviewer should take away. */
  outcome: string;
  description: string;
  tags: string[];
};

export type Achievement = AchievementText & {
  year: string;
  /** Case studies that came out of this program (project slugs). */
  projects: string[];
};

type AchievementRecord = {
  year: string;
  projects?: string[];
  en: AchievementText;
  ar: AchievementText;
};

const records: AchievementRecord[] = [
  {
    year: "2026",
    projects: ["althil"],
    en: {
      title: "Intelligent Planet Hackathon",
      organization: "KFUPM × Google Cloud",
      outcome: "Team prototype with public code: Althil",
      description:
        "Took part in a cloud and AI hackathon on environmental and urban challenges, and built Althil with the team — a prototype that helps planners place shade where it improves thermal comfort most.",
      tags: ["Google Cloud", "Urban sustainability", "Hackathon prototype"]
    },
    ar: {
      title: "هاكاثون الكوكب الذكي",
      organization: "جامعة الملك فهد للبترول والمعادن × Google Cloud",
      outcome: "نموذج أولي مع الفريق بكود منشور: Althil",
      description:
        "شارك في هاكاثون للحوسبة السحابية والذكاء الاصطناعي حول التحديات البيئية والحضرية، وبنى مع الفريق Althil — نموذجًا أوليًا يساعد المخططين على وضع التظليل حيث يحسّن الراحة الحرارية أكثر.",
      tags: ["Google Cloud", "الاستدامة الحضرية", "نموذج أولي في هاكاثون"]
    }
  },
  {
    year: "2025",
    projects: ["absher-insight-ai"],
    en: {
      title: "Absher Tuwaiq Hackathon",
      organization: "Absher × Tuwaiq",
      outcome: "Hackathon prototype with public code: Absher Insight AI",
      description:
        "Worked on Absher Insight AI, an independent prototype for proactive, explainable risk monitoring built entirely on synthetic data.",
      tags: ["Security analytics", "Synthetic data", "Explainable rules", "Dashboards"]
    },
    ar: {
      title: "هاكاثون أبشر مع طويق",
      organization: "أبشر × أكاديمية طويق",
      outcome: "نموذج أولي في هاكاثون بكود منشور: Absher Insight AI",
      description:
        "عمل على Absher Insight AI، وهو نموذج أولي مستقل لرصد المخاطر بشكل استباقي وقابل للتفسير، مبني بالكامل على بيانات اصطناعية.",
      tags: ["تحليلات الأمن", "بيانات اصطناعية", "قواعد قابلة للتفسير", "لوحات المتابعة"]
    }
  },
  {
    year: "2024",
    projects: ["qanouni", "virtual-astronauts"],
    en: {
      title: "#AthkaU Program — Top 30",
      organization: "SDAIA × Microsoft",
      outcome: "Top 30 of 80+ teams nationwide",
      description:
        "Completed the qualifying training program and reached the Top 30 of 80+ teams across Saudi Arabia with two AI ideas: Qanouni and Virtual Astronauts.",
      tags: ["AI", "Innovation", "Microsoft ecosystem"]
    },
    ar: {
      title: "برنامج ‎#AthkaU‎ — أفضل 30 فريقًا",
      organization: "سدايا × مايكروسوفت",
      outcome: "ضمن أفضل 30 من أكثر من 80 فريقًا على مستوى المملكة",
      description:
        "أكمل برنامج التأهيل ووصل مع فريقه إلى أفضل 30 من أكثر من 80 فريقًا على مستوى المملكة بفكرتين في الذكاء الاصطناعي: Qanouni وVirtual Astronauts.",
      tags: ["الذكاء الاصطناعي", "الابتكار", "منظومة مايكروسوفت"]
    }
  },
  {
    year: "2025",
    en: {
      title: "Startup Empowerment Initiative",
      organization: "Digital entrepreneurship program",
      outcome: "Selected participant",
      description:
        "Selected participant in an initiative focused on digital marketing, AI and data analytics.",
      tags: ["Digital marketing", "AI", "Data analytics"]
    },
    ar: {
      title: "مبادرة تمكين الشركات الناشئة",
      organization: "برنامج لريادة الأعمال الرقمية",
      outcome: "مشارك مختار",
      description: "مشارك مختار في مبادرة تركز على التسويق الرقمي والذكاء الاصطناعي وتحليل البيانات.",
      tags: ["التسويق الرقمي", "الذكاء الاصطناعي", "تحليل البيانات"]
    }
  },
  {
    year: "2023",
    en: {
      title: "CITC Innovation Hackathon — Finalist",
      organization: "Communications and Information Technology Commission",
      outcome: "Reached the final round",
      description:
        "Reached the final of the Innovation Hackathon run by Saudi Arabia’s Communications and Information Technology Commission.",
      tags: ["Innovation", "Pitching", "Digital solutions"]
    },
    ar: {
      title: "هاكاثون الابتكار — التأهل للنهائي",
      organization: "هيئة الاتصالات وتقنية المعلومات",
      outcome: "بلغ المرحلة النهائية",
      description:
        "بلغ المرحلة النهائية في هاكاثون الابتكار الذي نظمته هيئة الاتصالات وتقنية المعلومات في المملكة.",
      tags: ["الابتكار", "عرض الأفكار", "الحلول الرقمية"]
    }
  }
];

export function getAchievements(locale: Locale = "en"): Achievement[] {
  return records.map((record) => ({ year: record.year, projects: record.projects ?? [], ...record[locale] }));
}

/** Newest first, in the order the record list was written within a year. */
export function getAchievementsByYear(locale: Locale = "en"): Achievement[] {
  return [...getAchievements(locale)].sort((a, b) => Number(b.year) - Number(a.year));
}

/** English facts for the guide's server-side context. */
export const achievements = getAchievements("en");
