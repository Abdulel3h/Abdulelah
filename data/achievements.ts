export type Achievement = {
  title: string;
  organization: string;
  year: string;
  description: string;
  tags: string[];
};

export const achievements: Achievement[] = [
  {
    title: "Intelligent Planet Hackathon",
    organization: "KFUPM x Google Cloud",
    year: "2026",
    description:
      "Participated in a cloud and AI hackathon focused on environmental and urban challenges. Contributed to Althil, a platform for improving urban thermal comfort using Google Cloud and AI.",
    tags: ["Google Cloud Run", "BigQuery", "Cloud Storage", "Vertex AI"]
  },
  {
    title: "Absher Tuwaiq Hackathon",
    organization: "Absher x Tuwaiq",
    year: "2025",
    description:
      "Worked on Absher Insight AI, a proactive AI-driven digital security concept for predicting risks in government digital systems.",
    tags: ["AI", "UEBA", "Synthetic Data", "Behavioral Analytics", "Dashboards"]
  },
  {
    title: "#AthkaU Program",
    organization: "SDAIA x Microsoft",
    year: "2024",
    description:
      "Completed the qualifying training program and reached Top 30 out of 80+ teams across Saudi Arabia with two AI ideas: Qanouni and Virtual Astronauts.",
    tags: ["AI", "Innovation", "Microsoft ecosystem"]
  },
  {
    title: "CITC Innovation Hackathon Finalist",
    organization: "Communications and Information Technology Commission",
    year: "2023",
    description:
      "Finalist in the Innovation Hackathon by the Communications and Information Technology Commission in Saudi Arabia.",
    tags: ["Innovation", "Pitching", "Digital Solutions"]
  },
  {
    title: "Startup Empowerment Initiative",
    organization: "Digital entrepreneurship program",
    year: "2025",
    description:
      "Selected participant in an initiative focused on digital marketing, AI, and data analytics.",
    tags: ["Digital Marketing", "AI", "Data Analytics"]
  }
];

export const metrics = [
  "6+ AI Projects",
  "5+ Applied AI Domains",
  "Top 30 in SDAIA x Microsoft AthkaU",
  "Multiple National Hackathons",
  "Cloud AI Experience",
  "Project Leadership Experience"
];
