import type { Metadata } from "next";
import Image from "next/image";
import {
  ArrowUpRight,
  BrainCircuit,
  BriefcaseBusiness,
  CheckCircle2,
  Code2,
  Database,
  Download,
  FileText,
  Github,
  GraduationCap,
  Linkedin,
  Mail,
  Sparkles,
  Target
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/data/site";

const pagePath = "/dal-accelerator-abd-7xq29";
const cvPath = "/resume/Abdulelah_Alkhathami_Dal_AI_Data_CV.pdf";

export const metadata: Metadata = {
  title: {
    absolute: "Abdulelah Alkhathami — Dal Professional Accelerator Profile"
  },
  description:
    "Private application profile for Dal Professional Accelerator, focused on AI, Data Science, and practical training.",
  alternates: {
    canonical: `${siteConfig.url}${pagePath}`
  },
  robots: {
    index: false,
    follow: false
  }
};

const quickFacts = [
  {
    label: "Education",
    value: "Information Systems, University of Bisha",
    icon: GraduationCap
  },
  {
    label: "Focus",
    value: "AI, data science, RAG, and applied software",
    icon: BrainCircuit
  },
  {
    label: "Goal",
    value: "Practical training with real AI and data teams",
    icon: Target
  }
];

const skills = [
  "Python",
  "SQL",
  "Pandas",
  "NumPy",
  "scikit-learn",
  "FastAPI",
  "Git",
  "Docker",
  "PostgreSQL",
  "RAG",
  "AI Agents",
  "Hugging Face",
  "LangChain"
];

const projectDetails = [
  {
    label: "Problem",
    body: "Students often need quick answers from academic regulations and university information."
  },
  {
    label: "What I built",
    body: "A simple AI assistant that uses retrieval-based answering to provide useful responses from academic sources."
  },
  {
    label: "Tools used",
    body: "Python, FastAPI, RAG, embeddings, structured data, Git"
  },
  {
    label: "What I learned",
    body: "How to prepare data, connect AI models with real sources, and build a useful AI application for users."
  }
];

const secondaryProjects = [
  {
    title: "Healthcare Risk Prediction",
    body: "A machine learning project focused on analyzing health-related data and predicting potential risk using Python and traditional ML models.",
    icon: Database
  },
  {
    title: "AI Agents & Automation",
    body: "Practical experiments connecting AI models with application logic to support task execution and decision support.",
    icon: Code2
  }
];

const reviewerLinks = [
  {
    label: "View GitHub",
    href: siteConfig.social.github,
    icon: Github
  },
  {
    label: "View LinkedIn",
    href: siteConfig.social.linkedin,
    icon: Linkedin
  },
  {
    label: "Email Me",
    href: `mailto:${siteConfig.email}`,
    icon: Mail
  }
];

export default function DalAcceleratorProfilePage() {
  return (
    <main className="pb-20">
      <section className="container-shell pt-14 sm:pt-16 lg:pt-20">
        <div className="grid gap-8 lg:grid-cols-[1.12fr_0.88fr] lg:items-stretch">
          <div className="premium-panel p-6 sm:p-8 lg:p-10">
            <div className="relative">
              <div className="flex flex-wrap items-center gap-3">
                <span className="badge">
                  <Sparkles className="h-3.5 w-3.5 text-accent" aria-hidden="true" />
                  Application Profile for Dal Professional Accelerator
                </span>
                <span
                  className="rounded-full border border-accent/20 bg-accent/[0.08] px-3 py-1 text-xs font-medium text-accent-soft"
                  lang="ar"
                  dir="rtl"
                >
                  مسرعة دال المهنية
                </span>
              </div>

              <h1 className="mt-8 max-w-4xl font-display text-4xl font-medium leading-[1.03] text-paper sm:text-5xl lg:text-6xl">
                Abdulelah Alkhathami
              </h1>
              <p className="mt-4 text-lg font-medium text-accent-soft sm:text-xl">
                Information Systems Graduate | AI &amp; Data Science Enthusiast
              </p>
              <p className="mt-6 max-w-3xl text-base leading-8 text-paper-dim sm:text-lg">
                I am a fresh Information Systems graduate interested in Artificial
                Intelligence, Data Science, and building practical AI solutions. I
                have worked on hands-on projects involving Python, data analysis,
                machine learning, RAG, and AI agents. I am applying to Dal
                Professional Accelerator to gain real-world experience, learn from
                professional teams, and contribute to impactful AI and data projects.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <Button asChild size="lg" className="w-full sm:w-auto">
                  <a href={cvPath} download>
                    <Download className="h-4 w-4" aria-hidden="true" />
                    Download CV
                  </a>
                </Button>
                {reviewerLinks.map((link) => {
                  const Icon = link.icon;

                  return (
                    <Button
                      key={link.label}
                      asChild
                      variant="secondary"
                      size="lg"
                      className="w-full sm:w-auto"
                    >
                      <a
                        href={link.href}
                        target={link.href.startsWith("mailto:") ? undefined : "_blank"}
                        rel={
                          link.href.startsWith("mailto:")
                            ? undefined
                            : "noopener noreferrer"
                        }
                      >
                        <Icon className="h-4 w-4" aria-hidden="true" />
                        {link.label}
                      </a>
                    </Button>
                  );
                })}
              </div>
            </div>
          </div>

          <aside className="subtle-card rounded-3xl p-6 sm:p-8">
            <div className="relative mb-7 aspect-[4/3] overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]">
              <Image
                src={siteConfig.assets.profileImage}
                alt="Portrait of Abdulelah Alkhathami"
                fill
                priority
                sizes="(min-width: 1024px) 34vw, 100vw"
                className="object-cover object-[50%_18%]"
              />
            </div>
            <p className="eyebrow mb-6">Reviewer Snapshot</p>
            <div className="space-y-5">
              {quickFacts.map((fact) => {
                const Icon = fact.icon;

                return (
                  <div key={fact.label} className="flex gap-4 border-t border-white/10 pt-5 first:border-t-0 first:pt-0">
                    <span className="mt-1 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-accent/25 bg-accent/[0.08] text-accent-soft">
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-paper-faint">
                        {fact.label}
                      </p>
                      <p className="mt-2 text-sm leading-6 text-paper-dim">
                        {fact.value}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mt-8 rounded-2xl border border-accent/20 bg-accent/[0.07] p-4">
              <p className="text-sm leading-6 text-paper-dim">
                This page was created specifically for my Dal Professional
                Accelerator application and is intentionally unlisted.
              </p>
            </div>
          </aside>
        </div>
      </section>

      <section className="container-shell section-space">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
          <div>
            <p className="eyebrow mb-5">About Me</p>
            <h2 className="font-display text-3xl font-medium leading-tight text-paper sm:text-4xl">
              Building practical AI skills through real problems.
            </h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="glass-card rounded-2xl p-5">
              <BriefcaseBusiness className="h-5 w-5 text-accent" aria-hidden="true" />
              <h3 className="mt-5 font-display text-xl font-medium text-paper">
                Practical Background
              </h3>
              <p className="mt-3 text-sm leading-7 text-paper-dim">
                My Information Systems background helps me connect technical work
                with real user needs, from preparing data to shaping application
                flows that reviewers and users can understand quickly.
              </p>
            </div>
            <div className="glass-card rounded-2xl p-5">
              <BrainCircuit className="h-5 w-5 text-accent" aria-hidden="true" />
              <h3 className="mt-5 font-display text-xl font-medium text-paper">
                AI &amp; Data Direction
              </h3>
              <p className="mt-3 text-sm leading-7 text-paper-dim">
                I am focused on strengthening my work in Python, data analysis,
                machine learning, RAG systems, and AI agents through projects that
                turn AI ideas into useful tools.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="section-band">
        <div className="container-shell section-space">
          <div className="grid gap-10 lg:grid-cols-[1fr_1fr] lg:items-center">
            <div>
              <p className="eyebrow mb-5">Why Dal Professional Accelerator</p>
              <h2 className="font-display text-3xl font-medium leading-tight text-paper sm:text-4xl">
                A focused place to grow with professional AI and data teams.
              </h2>
            </div>
            <p className="text-base leading-8 text-paper-dim">
              I want to join Dal Professional Accelerator to gain deeper practical
              experience in AI and data science, work in a professional environment,
              and learn how real teams turn data and AI ideas into useful products.
              I am especially interested in improving my technical skills, teamwork,
              communication, and problem-solving through real projects.
            </p>
          </div>
        </div>
      </section>

      <section className="container-shell section-space">
        <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <p className="eyebrow mb-5">Relevant Skills</p>
            <h2 className="font-display text-3xl font-medium text-paper sm:text-4xl">
              AI, data, and software foundations.
            </h2>
          </div>
          <p className="max-w-xl text-sm leading-7 text-paper-dim">
            A practical toolkit for learning inside AI/data training environments
            and contributing to applied project work.
          </p>
        </div>
        <div className="mt-8 flex flex-wrap gap-3">
          {skills.map((skill) => (
            <span key={skill} className="chip">
              {skill}
            </span>
          ))}
        </div>
      </section>

      <section className="container-shell section-space pt-0">
        <div className="mb-8 max-w-3xl">
          <p className="eyebrow mb-5">Selected Project</p>
          <h2 className="font-display text-3xl font-medium leading-tight text-paper sm:text-4xl">
            ChatUB - Academic AI Assistant
          </h2>
          <p className="mt-4 text-base leading-8 text-paper-dim">
            ChatUB is the clearest match for AI/Data training because it combines
            academic source preparation, retrieval logic, AI responses, and a simple
            application flow for students.
          </p>
        </div>

        <div className="grid gap-5 lg:grid-cols-4">
          {projectDetails.map((item) => (
            <article key={item.label} className="glass-card rounded-2xl p-5">
              <CheckCircle2 className="h-5 w-5 text-accent" aria-hidden="true" />
              <h3 className="mt-5 text-sm font-semibold uppercase tracking-[0.18em] text-paper">
                {item.label}
              </h3>
              <p className="mt-3 text-sm leading-7 text-paper-dim">{item.body}</p>
            </article>
          ))}
        </div>

        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          {secondaryProjects.map((project) => {
            const Icon = project.icon;

            return (
              <article key={project.title} className="subtle-card rounded-2xl p-5">
                <Icon className="h-5 w-5 text-accent" aria-hidden="true" />
                <h3 className="mt-5 font-display text-xl font-medium text-paper">
                  {project.title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-paper-dim">
                  {project.body}
                </p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="section-band">
        <div className="container-shell section-space">
          <div className="grid gap-8 lg:grid-cols-[1fr_0.9fr] lg:items-center">
            <div>
              <p className="eyebrow mb-5">CV Download</p>
              <h2 className="font-display text-3xl font-medium leading-tight text-paper sm:text-4xl">
                Tailored for AI/Data practical training.
              </h2>
              <p className="mt-4 max-w-2xl text-base leading-8 text-paper-dim">
                This CV highlights Information Systems education, hands-on AI/data
                projects, and skills relevant to the Dal Professional Accelerator.
              </p>
            </div>
            <div className="subtle-card rounded-3xl p-6">
              <FileText className="h-6 w-6 text-accent" aria-hidden="true" />
              <h3 className="mt-5 font-display text-2xl font-medium text-paper">
                Abdulelah_Alkhathami_Dal_AI_Data_CV.pdf
              </h3>
              <p className="mt-3 text-sm leading-7 text-paper-dim">
                One-page CV focused on AI, data science, RAG, machine learning,
                and practical training readiness.
              </p>
              <Button asChild size="lg" className="mt-6 w-full">
                <a href={cvPath} download>
                  <Download className="h-4 w-4" aria-hidden="true" />
                  Download CV
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="container-shell section-space">
        <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
          <div>
            <p className="eyebrow mb-5">Links &amp; Contact</p>
            <h2 className="font-display text-3xl font-medium leading-tight text-paper sm:text-4xl">
              Review the work or reach me directly.
            </h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            {reviewerLinks.map((link) => {
              const Icon = link.icon;
              const isEmail = link.href.startsWith("mailto:");

              return (
                <a
                  key={link.label}
                  href={link.href}
                  target={isEmail ? undefined : "_blank"}
                  rel={isEmail ? undefined : "noopener noreferrer"}
                  className="focus-ring group subtle-card rounded-2xl p-5 transition hover:border-accent/40 hover:bg-white/[0.06]"
                >
                  <Icon className="h-5 w-5 text-accent" aria-hidden="true" />
                  <span className="mt-5 flex items-center justify-between gap-3 text-sm font-semibold text-paper">
                    {link.label}
                    {!isEmail ? (
                      <ArrowUpRight
                        className="h-4 w-4 text-paper-faint transition group-hover:text-accent"
                        aria-hidden="true"
                      />
                    ) : null}
                  </span>
                </a>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
}
