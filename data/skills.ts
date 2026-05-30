export type SkillLevel = "Strong" | "Practical Experience" | "Familiar";

export type SkillGroup = {
  title: string;
  skills: {
    name: string;
    level: SkillLevel;
  }[];
};

export const skillGroups: SkillGroup[] = [
  {
    title: "AI & Machine Learning",
    skills: [
      { name: "Machine Learning", level: "Practical Experience" },
      { name: "AI Modeling", level: "Practical Experience" },
      { name: "NLP", level: "Strong" },
      { name: "Generative AI", level: "Practical Experience" },
      { name: "LLM Applications", level: "Practical Experience" },
      { name: "AI Agents", level: "Familiar" },
      { name: "Intelligent Search", level: "Practical Experience" },
      { name: "AI-Driven Insights", level: "Practical Experience" },
      { name: "Model Optimization", level: "Familiar" }
    ]
  },
  {
    title: "Cloud & Deployment",
    skills: [
      { name: "Azure AI Services", level: "Practical Experience" },
      { name: "Google Cloud Run", level: "Practical Experience" },
      { name: "Vertex AI", level: "Practical Experience" },
      { name: "BigQuery", level: "Practical Experience" },
      { name: "Cloud Storage", level: "Practical Experience" },
      { name: "Model Deployment", level: "Familiar" },
      { name: "Cloud Architecture", level: "Practical Experience" }
    ]
  },
  {
    title: "Programming & Data",
    skills: [
      { name: "Python", level: "Strong" },
      { name: "SQL", level: "Practical Experience" },
      { name: "R Programming", level: "Familiar" },
      { name: "Database Management", level: "Practical Experience" },
      { name: "Power BI", level: "Practical Experience" },
      { name: "Data Visualization", level: "Practical Experience" }
    ]
  },
  {
    title: "Software & Tools",
    skills: [
      { name: "GitHub", level: "Practical Experience" },
      { name: "Version Control", level: "Practical Experience" },
      { name: "API Integration", level: "Practical Experience" },
      { name: "Web Development", level: "Familiar" },
      { name: "Dashboard Design", level: "Practical Experience" }
    ]
  },
  {
    title: "Professional Skills",
    skills: [
      { name: "Team Leadership", level: "Practical Experience" },
      { name: "Problem Solving", level: "Strong" },
      { name: "Analytical Thinking", level: "Strong" },
      { name: "Communication", level: "Practical Experience" },
      { name: "Creativity", level: "Strong" },
      { name: "Adaptability", level: "Strong" },
      { name: "Continuous Learning", level: "Strong" }
    ]
  }
];
