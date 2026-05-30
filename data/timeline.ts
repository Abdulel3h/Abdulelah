export type TimelineEvent = {
  year: string;
  title: string;
  description: string;
  tags: string[];
};

export const journeyTimeline: TimelineEvent[] = [
  {
    year: "2023",
    title: "CITC Innovation Hackathon Finalist",
    description:
      "Reached the finalist stage in a national innovation hackathon focused on digital solutions in Saudi Arabia.",
    tags: ["Innovation", "Hackathon", "Digital Solutions"]
  },
  {
    year: "2024",
    title: "Qanouni, Virtual Astronauts, and AthkaU",
    description:
      "Built Qanouni AI Legal Advisor and Virtual Astronauts VR + AI Educational Experience, completed AthkaU training by SDAIA x Microsoft, and reached Top 30 out of 80+ teams.",
    tags: ["LegalTech", "VR", "SDAIA x Microsoft", "Top 30"]
  },
  {
    year: "2025",
    title: "ChatUB, Medad, and Absher Insight AI",
    description:
      "Led the ChatUB graduation project, built Medad fintech AI banking app, and participated in Absher Tuwaiq Hackathon with Absher Insight AI.",
    tags: ["Project Leadership", "Education AI", "Fintech", "AI Security"]
  },
  {
    year: "2026",
    title: "Althil and University of Bisha Graduation",
    description:
      "Participated in the Intelligent Planet Hackathon by KFUPM x Google Cloud, built Althil using Google Cloud and AI for urban sustainability, and graduated from University of Bisha.",
    tags: ["Google Cloud", "Sustainability", "Graduation"]
  }
];
