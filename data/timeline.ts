import type { Locale } from "@/lib/i18n/config";

type TimelineText = {
  title: string;
  description: string;
  tags: string[];
};

export type TimelineEvent = TimelineText & {
  year: string;
};

const records: { year: string; en: TimelineText; ar: TimelineText }[] = [
  {
    year: "2023",
    en: {
      title: "CITC Innovation Hackathon finalist",
      description:
        "Reached the final of a national innovation hackathon focused on digital solutions in Saudi Arabia.",
      tags: ["Innovation", "Hackathon", "Digital solutions"]
    },
    ar: {
      title: "التأهل لنهائي هاكاثون هيئة الاتصالات وتقنية المعلومات",
      description: "بلغ المرحلة النهائية في هاكاثون وطني للابتكار يركز على الحلول الرقمية في المملكة.",
      tags: ["الابتكار", "هاكاثون", "الحلول الرقمية"]
    }
  },
  {
    year: "2024",
    en: {
      title: "Qanouni, Virtual Astronauts and AthkaU",
      description:
        "Developed the Qanouni and Virtual Astronauts concepts in SDAIA × Microsoft’s AthkaU program and reached the Top 30 of 80+ teams.",
      tags: ["Legal tech", "VR", "SDAIA × Microsoft", "Top 30"]
    },
    ar: {
      title: "Qanouni وVirtual Astronauts وبرنامج AthkaU",
      description:
        "طوّر تصوّري Qanouni وVirtual Astronauts ضمن برنامج AthkaU من سدايا ومايكروسوفت، ووصل مع فريقه إلى أفضل 30 من أكثر من 80 فريقًا.",
      tags: ["التقنية القانونية", "الواقع الافتراضي", "سدايا × مايكروسوفت", "أفضل 30"]
    }
  },
  {
    year: "2025",
    en: {
      title: "ChatUB, Absher Insight AI and Medad",
      description:
        "Led the ChatUB graduation project to a working prototype, built the Absher Insight AI prototype at the Absher Tuwaiq Hackathon, and designed the Medad inclusive-banking concept.",
      tags: ["Project leadership", "Arabic NLP", "Security analytics", "Fintech"]
    },
    ar: {
      title: "ChatUB وAbsher Insight AI وMedad",
      description:
        "قاد مشروع التخرج ChatUB حتى نموذج أولي عامل، وبنى النموذج الأولي Absher Insight AI في هاكاثون أبشر مع طويق، وصمّم تصوّر Medad للخدمات المصرفية الشاملة.",
      tags: ["قيادة المشاريع", "معالجة اللغة العربية", "تحليلات الأمن", "التقنية المالية"]
    }
  },
  {
    year: "2026",
    en: {
      title: "Althil, Stadium and graduation",
      description:
        "Built the Althil prototype with a team at the Intelligent Planet Hackathon (KFUPM × Google Cloud), built Stadium solo, and graduated from the University of Bisha.",
      tags: ["Google Cloud", "Computer vision", "Graduation"]
    },
    ar: {
      title: "Althil وStadium والتخرج",
      description:
        "بنى مع فريقه النموذج الأولي Althil في هاكاثون الكوكب الذكي (جامعة الملك فهد للبترول والمعادن × Google Cloud)، وبنى Stadium منفردًا، وتخرج في جامعة بيشة.",
      tags: ["Google Cloud", "الرؤية الحاسوبية", "التخرج"]
    }
  }
];

export function getTimeline(locale: Locale = "en"): TimelineEvent[] {
  return records.map((record) => ({ year: record.year, ...record[locale] }));
}

/** English facts for the guide's server-side context. */
export const journeyTimeline = getTimeline("en");
