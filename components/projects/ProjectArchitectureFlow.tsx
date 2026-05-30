import { ArrowRight, Bot, Database, LayoutDashboard, Lightbulb } from "lucide-react";
import type { Project } from "@/data/projects";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

const architectureBySlug: Record<string, string[]> = {
  chatub: [
    "Official University Documents",
    "Intelligent Search / NLP / LLM",
    "Context-aware Answers",
    "Student Interface"
  ],
  althil: [
    "Location Data / Sun Path / Heat Exposure",
    "BigQuery / Vertex AI",
    "Recommendations",
    "Map + Conversational Agent"
  ],
  "absher-insight-ai": [
    "Synthetic User Behavior",
    "UEBA / Anomaly Detection",
    "Risk Prediction",
    "Security Dashboard"
  ]
};

const defaultFlow = ["Input Data", "AI Processing", "Insights", "Dashboard / User Experience"];
const icons = [Database, Bot, Lightbulb, LayoutDashboard];

export function ProjectArchitectureFlow({ project }: { project: Project }) {
  const steps = architectureBySlug[project.slug] ?? defaultFlow;

  return (
    <div className="premium-panel p-6 sm:p-8">
      <div className="absolute inset-0 bg-soft-grid bg-[length:28px_28px] opacity-20" aria-hidden="true" />
      <div className="relative">
        <Badge variant="sky" className="mb-4">
          Architecture Flow
        </Badge>
        <h2 className="text-2xl font-semibold text-white">From data to usable AI value</h2>
        <div className="mt-8 grid gap-4 lg:grid-cols-4">
          {steps.map((step, index) => {
            const Icon = icons[index] ?? Bot;

            return (
              <div key={step} className="relative">
                <Card className="h-full bg-white/[0.045] p-5">
                  <span className="grid h-11 w-11 place-items-center rounded-full border border-sky-300/20 bg-sky-300/10 text-sky-200">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <p className="mt-5 text-sm font-semibold leading-6 text-white">{step}</p>
                </Card>
                {index < steps.length - 1 ? (
                  <ArrowRight
                    className="absolute -right-5 top-1/2 z-10 hidden h-5 w-5 -translate-y-1/2 text-sky-200 lg:block"
                    aria-hidden="true"
                  />
                ) : null}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
