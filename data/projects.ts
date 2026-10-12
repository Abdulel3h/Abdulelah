import type { Locale } from "@/lib/i18n/config";

/**
 * Project facts — the single source of truth for the project index, the case
 * studies, search, metadata and Abdulelah's guide.
 *
 * Evidence rule: a status is never stronger than what can be verified. The
 * five public repositories (Raqmi, ChatUB, Althil, absher-insight, Stadium)
 * describe themselves as prototypes or case studies, so nothing here is called
 * "shipped", "live" or "in production". Projects without public code say so,
 * and the code-drawn previews are always labelled as concept visualizations.
 * Every figure restates its source with its scope (Raqmi: the executed
 * notebook and the evaluation, tool-calling and guardrail reports).
 */

export type ProjectStatus =
  | "live"
  | "production"
  | "pilot"
  | "working-prototype"
  | "graduation-project"
  | "hackathon-prototype"
  | "concept";

/** What a reviewer can inspect today. */
export type EvidenceType = "public-repository" | "program-record" | "private-evidence";

export type PreviewKind =
  | "chat"
  | "map"
  | "security"
  | "legal"
  | "fintech"
  | "vr"
  | "vision"
  | "gate";

export type EvidenceItem = {
  kind: "repository" | "document" | "screenshots" | "program-record" | "private";
  /** Internal routes are locale-free; external links are absolute. */
  href?: string;
  label: Record<Locale, string>;
  detail: Record<Locale, string>;
};

/** A documented figure: the number as written in the source, and what it counts. */
export type BoundaryRow = { label: string; value: string; code?: boolean; tone?: "deny" | "allow" };

export type StoryFigure = { value: string; label: string };

/**
 * The longer engineering story a flagship case study tells beyond the
 * standard sections. Every block is optional and the case study renders only
 * the blocks a project has; figures always travel with their scope.
 */
export type ProjectStory = {
  /** The problem as a few real requests, from a question to a refusal. */
  requests?: {
    title: string;
    intro: string;
    items: { text: string; outcome: string; tone: "answer" | "action" | "refuse" }[];
    question: string;
  };
  /** One principle, set as two short lines. */
  principle?: { kicker: string; lines: [string, string]; body: string };
  /** The architecture in groups of steps; the decisive group is marked. */
  architecture?: {
    groups: { label: string; steps: string[]; decisive?: boolean }[];
    outcomesLabel: string;
    outcomes: string[];
    note: string;
  };
  /** One captured moment, row by row, as the evidence printed it. */
  boundary?: {
    title: string;
    intro: string;
    rows: BoundaryRow[];
    body: string;
    counterpart: string;
    /**
     * The same boundary as a two-scenario explorer: the captured denial in
     * `rows`, and its allowed counterpart here. Rows run in the order the
     * evidence prints them: message, proposal, decision, then what followed.
     */
    gate?: {
      legend: string;
      proposes: string;
      decides: string;
      note: string;
      replay: string;
      allowed: { choice: string; detail: string; verdict: string; rows: BoundaryRow[] };
      denied: { choice: string; detail: string; verdict: string };
    };
  };
  evaluation?: {
    title: string;
    intro: string;
    passed: number;
    total: number;
    passedLabel: string;
    failedLabel: string;
    figures: StoryFigure[];
    providers: string;
    scope: string;
  };
  failures?: { title: string; body: string; casesLabel: string; cases: string[] };
  guardrails?: { title: string; intro: string; layers: string[]; figures: StoryFigure[]; scope: string };
  checks?: {
    title: string;
    intro: string;
    subject: string;
    steps: string[];
    outcomes: [string, string];
    figures: StoryFigure[];
    scope: string;
  };
  providers?: { title: string; items: { name: string; body: string }[]; note: string };
};

type ProjectText = {
  descriptor: string;
  /** One-line purpose — what it does and for whom. */
  summary: string;
  domain: string;
  role: string;
  /** Why the status is what it is, in one sentence. */
  statusDetail: string;
  context: string;
  problem: string;
  constraints: string[];
  solution: string;
  responsibilities: string[];
  /** Architecture / workflow, 3–4 steps. */
  flow: string[];
  /** Engineering notes: how the flow is implemented or designed. */
  approach: string[];
  /** Capabilities that can be read in the code, or designed ones for concepts. */
  capabilities: string[];
  decisions: { title: string; body: string }[];
  /** Verified outcome — honest when there is no measurable result. */
  outcome: string;
  notClaimed: string;
  limitations: string[];
  next: string[];
  technologiesNote?: string;
  lesson?: string;
  quote?: string;
  /** Up to four short margin notes for the opening (the first three on the homepage). */
  highlights?: string[];
  story?: ProjectStory;
};

type ProjectRecord = {
  slug: string;
  name: string;
  /** A name in another script, where the project has one (Raqmi → رقمي). */
  localName?: Partial<Record<Locale, string>>;
  /** Extra search and metadata terms, in both languages. */
  keywords?: string[];
  year: string;
  status: ProjectStatus;
  evidenceType: EvidenceType;
  featured?: boolean;
  previewKind: PreviewKind;
  technologies: string[];
  links?: { github?: string; demo?: string };
  evidence: EvidenceItem[];
  en: ProjectText;
  ar: ProjectText;
};

export type LocalizedProject = ProjectText & {
  slug: string;
  /** The name as this locale shows it. */
  name: string;
  /** The same name in the other script, when the project has one. */
  altName?: string;
  keywords: string[];
  /** "ChatUB — Local Arabic academic assistant" */
  title: string;
  year: string;
  status: ProjectStatus;
  evidenceType: EvidenceType;
  featured: boolean;
  previewKind: PreviewKind;
  technologies: string[];
  links: { github?: string; demo?: string };
  evidence: { kind: EvidenceItem["kind"]; href?: string; label: string; detail: string }[];
  locale: Locale;
};

const ATHKAU_RECORD: EvidenceItem = {
  kind: "program-record",
  href: "/achievements",
  label: {
    en: "AthkaU Top 30 — program record",
    ar: "أفضل 30 فريقًا في برنامج AthkaU — سجل البرنامج"
  },
  detail: {
    en: "Listed under Recognition: one of two ideas that took the team to the Top 30 of 80+ teams in SDAIA × Microsoft's AthkaU.",
    ar: "موثّق في صفحة الإنجازات: إحدى فكرتين أوصلتا الفريق إلى أفضل 30 من أكثر من 80 فريقًا في برنامج AthkaU من سدايا ومايكروسوفت."
  }
};

const NO_PUBLIC_CODE: EvidenceItem = {
  kind: "private",
  label: {
    en: "Private project evidence",
    ar: "أدلة خاصة غير منشورة"
  },
  detail: {
    en: "No public repository or demo is available, so nothing is linked.",
    ar: "لا يوجد مستودع عام أو عرض تجريبي متاح، لذلك لا توجد روابط."
  }
};

const records: ProjectRecord[] = [
  {
    slug: "raqmi",
    name: "Raqmi",
    localName: { ar: "رقمي" },
    keywords: [
      "Raqmi",
      "رقمي",
      "LLM",
      "authorization",
      "tool calling",
      "function calling",
      "guardrails",
      "Golden Set",
      "evaluation",
      "SDAIA Academy",
      "أكاديمية سدايا",
      "customer support",
      "retail",
      "خدمة العملاء",
      "الصلاحيات"
    ],
    year: "2026",
    status: "working-prototype",
    evidenceType: "public-repository",
    featured: true,
    previewKind: "gate",
    technologies: ["Python", "Pydantic", "DeepSeek API", "ALLaM-7B", "vLLM", "Native tool calling", "Google Colab"],
    links: { github: "https://github.com/Abdulel3h/llm-application-engineering-Raqmi" },
    evidence: [
      {
        kind: "repository",
        href: "https://github.com/Abdulel3h/llm-application-engineering-Raqmi",
        label: { en: "Public repository on GitHub", ar: "مستودع عام على GitHub" },
        detail: {
          en: "Source, the native tool module, 240 recorded local tests and every report.",
          ar: "الكود، ووحدة الأدوات، و240 اختبارًا محليًا مسجّلًا، وكل التقارير."
        }
      },
      {
        kind: "document",
        href: "https://github.com/Abdulel3h/llm-application-engineering-Raqmi/blob/main/Raqmi_Capstone.ipynb",
        label: { en: "The executed notebook", ar: "الدفتر المنفَّذ" },
        detail: {
          en: "87 cells, all 47 code cells run in one captured Colab session — the evidence of record.",
          ar: "87 خلية، نُفّذت خلايا الكود الـ47 كلها في جلسة Colab واحدة موثّقة، وهو مرجع الأدلة."
        }
      },
      {
        kind: "document",
        href: "https://github.com/Abdulel3h/llm-application-engineering-Raqmi/blob/main/EVALUATION_REPORT.md",
        label: { en: "Evaluation report", ar: "تقرير التقييم" },
        detail: {
          en: "The Golden Set on both models, the failed cases, structured output and judge calibration, with live and deterministic results kept apart.",
          ar: "مجموعة Golden Set على النموذجين، والحالات الفاشلة، والمخرجات المهيكلة، ومعايرة المُحكِّم، مع فصل النتائج الحية عن الحتمية."
        }
      },
      {
        kind: "document",
        href: "https://github.com/Abdulel3h/llm-application-engineering-Raqmi/blob/main/TOOL_CALLING.md",
        label: { en: "Native tool calling", ar: "استدعاء الأدوات الأصلي" },
        detail: {
          en: "The protocol, the authorization boundary and the denied cross-user lookup.",
          ar: "البروتوكول، وحدّ الصلاحيات، والاستعلام المرفوض عن طلب عميل آخر."
        }
      }
    ],
    en: {
      descriptor: "Bilingual AI retail support",
      summary:
        "An Arabic-first support assistant for a fictional Saudi store — grounded answers, order lookups, returns and escalation — where the model proposes a tool call and application code decides whether it runs.",
      domain: "LLM application engineering · Retail support",
      role: "Design, build and evaluation",
      statusDetail:
        "Capstone for LLM Application Engineering at SDAIA Academy, September 2026 — a working prototype over fictional in-memory data, with a captured evaluation. Not a deployed product.",
      context:
        "The capstone of SDAIA Academy’s LLM Application Engineering programme (SDA-AIE-213), Track D — Retail Order Support. Built as one executed Colab notebook for a fictional Saudi store, with a public repository of tests, evaluation reports and provenance.",
      problem:
        "Retail support mixes questions with account-sensitive actions. “What is the return policy?” needs a grounded answer; “Where is my order?” reads account data; “Return this item” changes it; and “Show me another customer’s order” must be refused. A language model is flexible enough for the conversation, but it should never be the one deciding who may read or change an order.",
      constraints: [
        "Arabic first, with English alongside",
        "Fictional in-memory catalogue, customers, orders and returns",
        "One executed notebook as the evidence of record",
        "Two model backends behind one boundary: DeepSeek, and ALLaM served locally by vLLM"
      ],
      solution:
        "A router sends each message to a bounded workflow — a grounded answer, an order lookup, a return or an escalation — and a separate native tool loop accepts tool calls issued by the provider. Before any tool runs, application code validates the arguments, resolves the catalogue identity and checks that the current session owns the order. Inbound and outbound guards wrap the whole path.",
      responsibilities: [
        "Designed the router, the tool contracts and the authorization boundary",
        "Built the native tool loop, with strict argument schemas and idempotent returns",
        "Built the five-stage guard pipeline and its attack and legitimate corpora",
        "Built the 56-case Golden Set, the failed-case reporter and the structured-output evaluation",
        "Ran and captured the live evaluation on DeepSeek and ALLaM, and documented every limit"
      ],
      flow: ["Arabic or English message", "Inbound guards", "Model proposes a tool call", "Application allows or denies"],
      approach: [
        "Provider tool calls are reduced to four fields, then checked against a whitelist of three tools: lookup_order, create_return and escalate_to_human",
        "Arguments pass strict Pydantic schemas that forbid unknown fields, so a user ID or consent flag supplied by the model is rejected",
        "Products resolve to one catalogue identity before authorization, so a casing variant cannot create a second return",
        "Session.authorize_order() checks ownership in application code before any read or change",
        "One open return per customer, order and product keeps retries idempotent; the application mints the return ID"
      ],
      capabilities: [
        "Answer catalogue and policy questions from the supplied store facts",
        "Look up an order the session owns",
        "Create a bounded return after validation and ownership checks",
        "Escalate to a human when an answer cannot be verified",
        "Refuse access to another customer’s data"
      ],
      decisions: [
        {
          title: "A router first, not an open agent",
          body: "Retail requests fall into a few stable intents. A router sends each one to a bounded workflow; an open-ended agent loop would add latency and failure modes without evidence the domain needs them."
        },
        {
          title: "One boundary for every model",
          body: "DeepSeek and ALLaM sit behind the same client interface, so business logic and authorization never depend on one provider."
        },
        {
          title: "Escalate rather than guess",
          body: "When an answer cannot be verified against the store facts, Raqmi hands the case to a human instead of inventing one. In the captured run, all five of DeepSeek’s failed cases were escalations like this — safe, but scored as misses."
        }
      ],
      outcome:
        "A working prototype with a captured evaluation. On the 56-case Golden Set, DeepSeek and ALLaM each passed 51 of 56 exact-case checks, including all 24 high-risk cases. A live cross-user lookup was denied by application authorization, and a live authorized return completed with one return created. Everything runs on fictional data; nothing is deployed.",
      notClaimed:
        "No deployment, no real store or customer data, no measured business outcome, and no claim that the guards stop every attack. The pass rate is an exact-case harness score from one captured run, not model accuracy.",
      limitations: [
        "Fictional in-memory data, a narrow catalogue and local escalation — no real store or help-desk integration.",
        "One captured environment and an exact-case metric; five FAQ cases failed for each model.",
        "The guards are lexical: new phrasing can get past them, and PII masking covers only Saudi mobile numbers and e-mail addresses.",
        "ALLaM’s native tool calling is untested — the live tool evidence is DeepSeek only.",
        "No provider billing, measured throughput or production cost figures."
      ],
      next: [
        "Fix the five FAQ misses, so a verified fact is quoted instead of escalated",
        "Test native tool calling on ALLaM",
        "Add a semantic safety layer and wider PII coverage",
        "Evaluate on real, consented support conversations before any pilot"
      ],
      technologiesNote:
        "DeepSeek (deepseek-v4-flash) through its API; ALLaM (humain-ai/ALLaM-7B-Instruct-preview) served by vLLM on a Colab T4.",
      lesson:
        "Building an AI application isn’t mostly about the prompt. The model works inside a system that owns authorization, validation, evaluation and a clear way to fail.",
      highlights: [
        "Arabic and English",
        "56-case Golden Set: 51 passed, 5 failed",
        "Authorization outside the model",
        "SDAIA Academy capstone"
      ],
      story: {
        requests: {
          title: "Not every request is a question",
          intro: "Support mixes answers with actions on someone’s account. The risk sits where one becomes the other.",
          items: [
            { text: "“What is the return policy?”", outcome: "Answer from the store’s own facts", tone: "answer" },
            { text: "“Where is my order?”", outcome: "Read — only if the session owns it", tone: "action" },
            { text: "“Return this item.”", outcome: "Change — after validation, ownership and consent", tone: "action" },
            { text: "“Show me another customer’s order.”", outcome: "Refuse — whatever the model proposes", tone: "refuse" }
          ],
          question: "The real problem: keep the model’s flexibility without handing it the authority to decide."
        },
        principle: {
          kicker: "The principle",
          lines: ["The model proposes.", "The system decides."],
          body: "A language model may propose a tool call. Application code checks the session, ownership, the tool, the schema, the arguments, the item and consent — and only then allows or denies it."
        },
        architecture: {
          groups: [
            { label: "Inbound", steps: ["Arabic or English message", "Normalize, detect injection, mask PII, classify"] },
            { label: "Model", steps: ["Router, or the native tool loop", "DeepSeek or ALLaM proposes"] },
            {
              label: "System",
              steps: ["Validate the schema and arguments", "Authorize against the session", "Run the tool"],
              decisive: true
            },
            { label: "Outbound", steps: ["Check the reply for leaks", "Verified result"] }
          ],
          outcomesLabel: "Every message ends as",
          outcomes: ["A grounded answer", "A tool action", "A refusal", "An escalation"],
          note: "The Golden Set measures the router path. Native tool calling has its own captured DeepSeek transcripts."
        },
        boundary: {
          title: "The moment that matters",
          intro: "In the captured live run, the session asked about order 5521, which belongs to another customer.",
          rows: [
            { label: "Message", value: "“Where is order 5521?”" },
            { label: "Model proposed", value: 'lookup_order({"order_id": "5521"})', code: true },
            { label: "Application decided", value: "DENIED · authorization_denied", code: true, tone: "deny" },
            { label: "Executed", value: "Nothing", tone: "deny" },
            {
              label: "Reply",
              value: "“I cannot execute a request that bypasses account permissions or safety controls. I can help with your own orders.”"
            }
          ],
          body: "The model asked for the order. The code refused to run it, because order 5521 belongs to another customer — so none of that customer’s data reached the reply.",
          counterpart: "The same check let order 1024 through, because the session owns it, and a live return on it completed as R-1001.",
          // TOOL_CALLING.md, "Final LIVE evidence": both lookups ran against
          // DeepSeek in the executed notebook. Only 5521's message and reply
          // were printed, so 1024's are described, not quoted.
          gate: {
            legend: "Choose a captured scenario",
            proposes: "The model proposes",
            decides: "The application decides",
            note: "Both lookups were captured in the live DeepSeek run. This replays them; nothing here calls a model.",
            replay: "Replay",
            allowed: {
              choice: "Order 1024",
              detail: "This session’s own order",
              verdict: "Allowed",
              rows: [
                { label: "Message", value: "A question about order 1024, which this session owns" },
                { label: "Model proposed", value: 'lookup_order({"order_id": "1024"})', code: true },
                { label: "Application decided", value: "Allowed — the session owns order 1024", tone: "allow" },
                { label: "Executed", value: "lookup_order, run by the application", tone: "allow" },
                { label: "Reply", value: "The model answered from the tool’s result" }
              ]
            },
            denied: { choice: "Order 5521", detail: "Another customer’s order", verdict: "Denied" }
          }
        },
        evaluation: {
          title: "Evaluation",
          intro: "The same 56-case Golden Set ran on both models in one captured run. A case passes only when the blocked status, the intent and a required fact in the answer all match.",
          passed: 51,
          total: 56,
          passedLabel: "passed",
          failedLabel: "failed",
          figures: [
            { value: "29", label: "Arabic cases" },
            { value: "27", label: "English cases" },
            { value: "24", label: "high-risk cases" },
            { value: "24 / 24", label: "high-risk cases passed, on both models" }
          ],
          providers: "DeepSeek and ALLaM each passed 51 of 56.",
          scope: "An exact-case harness score from one captured run — not model accuracy, and not a claim about inputs outside the set."
        },
        failures: {
          title: "What failed",
          body: "Five FAQ cases failed for each model, none of them high-risk. DeepSeek escalated all five to a human instead of quoting the fact the case required — safe, but the harness counts it as a miss. ALLaM sent two to the order-status path, answered two without the required figure and escalated one.",
          casesLabel: "DeepSeek’s five",
          cases: [
            "كم مدة التوصيل؟",
            "كم سعر السماعة؟",
            "كم ضمان الساعة الذكية؟",
            "How long does delivery take?",
            "Can a defective product be returned?"
          ]
        },
        guardrails: {
          title: "Guardrails, and their limits",
          intro: "Five stages wrap the model: four before it, one after.",
          layers: ["Normalize", "Detect injection", "Mask PII", "Classify", "Check outbound"],
          figures: [
            { value: "32 / 32", label: "attacks blocked" },
            { value: "0 / 32", label: "legitimate requests blocked" },
            { value: "0 / 56", label: "Golden Set answers changed" }
          ],
          scope: "Measured offline on the documented deterministic corpus. It does not show that the guards stop every attack: the classifier is lexical, and a paraphrased leak can pass. Authorization is the boundary that does not depend on them."
        },
        checks: {
          title: "A return is more than JSON",
          intro: "When the model extracts a return request, its output is a proposal too. It runs only after:",
          subject: "ReturnRequest",
          steps: ["Schema", "Evidence", "Ownership", "Catalogue identity", "Consent"],
          outcomes: ["Execute", "Escalate"],
          figures: [
            { value: "20", label: "live DeepSeek cases, 10 Arabic and 10 English" },
            { value: "20 / 20", label: "matched the designed outcome" }
          ],
          scope: "In each language, 5 were valid on the first pass, 1 after repair and 4 escalated by design. A correct escalation counts as the designed outcome — this is not 20 valid returns. No order, product, reason or owner was invented."
        },
        providers: {
          title: "Two model paths, one boundary",
          items: [
            { name: "DeepSeek", body: "Commercial backend through its API. It carries the live native tool-calling evidence." },
            {
              name: "ALLaM",
              body: "Open-weight backend, served locally by vLLM on a Colab T4 and evaluated on the same Golden Set. Its native tool calling is untested."
            }
          ],
          note: "Validation and authorization live in application code, so neither depends on which model is answering."
        }
      }
    },
    ar: {
      descriptor: "مساعد خدمة عملاء ذكي بلغتين",
      summary:
        "مساعد دعم عربي أولًا لمتجر سعودي خيالي: إجابات من بيانات المتجر، واستعلام عن الطلبات، وإرجاع، وتحويل لموظف — يقترح فيه النموذج استدعاء الأداة، ويقرر كود التطبيق هل يُنفَّذ.",
      domain: "هندسة تطبيقات LLM · خدمة عملاء المتاجر",
      role: "التصميم والبناء والتقييم",
      statusDetail:
        "مشروع ختامي في برنامج LLM Application Engineering بأكاديمية سدايا، سبتمبر 2026 — نموذج أولي عامل على بيانات خيالية في الذاكرة، مع تقييم موثّق. ليس منتجًا منشورًا.",
      context:
        "المشروع الختامي لبرنامج LLM Application Engineering في أكاديمية سدايا (SDA-AIE-213)، المسار D — دعم طلبات التجزئة. بُني في دفتر Colab واحد منفَّذ لمتجر سعودي خيالي، مع مستودع عام يضم الاختبارات وتقارير التقييم ومصدر النتائج.",
      problem:
        "خدمة العملاء في المتاجر تجمع أسئلة وإجراءات على حساب العميل. «وش سياسة الإرجاع؟» تحتاج إجابة من بيانات المتجر، و«وين طلبي؟» تقرأ بيانات الحساب، و«أبي أرجّع هذا المنتج» تغيّرها، أما «اعرض لي طلب عميل ثاني» فلا بد أن تُرفض. النموذج اللغوي مرن بما يكفي للمحادثة، لكن لا يصح أن يكون هو من يقرر من يقرأ الطلب أو يعدّله.",
      constraints: [
        "العربية أولًا، والإنجليزية معها",
        "بيانات خيالية في الذاكرة: كتالوج وعملاء وطلبات وإرجاعات",
        "دفتر منفَّذ واحد هو مرجع الأدلة",
        "نموذجان خلف واجهة واحدة: DeepSeek، وALLaM عبر vLLM محليًا"
      ],
      solution:
        "يرسل الموجّه كل رسالة إلى مسار محدد: إجابة من بيانات المتجر، أو استعلام عن طلب، أو إرجاع، أو تحويل لموظف، ويستقبل مسار منفصل استدعاءات الأدوات التي يصدرها النموذج. وقبل تشغيل أي أداة يتحقق كود التطبيق من المدخلات، ويوحّد هوية المنتج من الكتالوج، ويتأكد أن الجلسة الحالية تملك الطلب. وتحيط حمايات المدخل والمخرج بالمسار كله.",
      responsibilities: [
        "صمّم الموجّه وعقود الأدوات وحدّ الصلاحيات",
        "بنى حلقة الأدوات الأصلية بمخططات صارمة للمدخلات وإرجاع لا يتكرر",
        "بنى خط الحماية بمراحله الخمس ومجموعتي الهجمات والطلبات المشروعة",
        "بنى Golden Set من 56 حالة، وتقرير الحالات الفاشلة، وتقييم المخرجات المهيكلة",
        "شغّل التقييم الحي على DeepSeek وALLaM ووثّقه، ووثّق كل قيد"
      ],
      flow: ["رسالة بالعربية أو الإنجليزية", "حمايات المدخل", "النموذج يقترح استدعاء أداة", "التطبيق يسمح أو يرفض"],
      approach: [
        "تُختصر استدعاءات الأدوات القادمة من المزوّد في أربعة حقول، ثم تُطابَق مع قائمة من ثلاث أدوات فقط: lookup_order وcreate_return وescalate_to_human",
        "تمر المدخلات بمخططات Pydantic صارمة ترفض أي حقل غير معروف، فيُرفض أي معرّف مستخدم أو موافقة يرسلها النموذج",
        "يُوحَّد المنتج في هوية واحدة من الكتالوج قبل التحقق من الصلاحية، فلا يُنشئ اختلاف الكتابة إرجاعًا ثانيًا",
        "تتحقق Session.authorize_order() من الملكية في كود التطبيق قبل أي قراءة أو تعديل",
        "إرجاع مفتوح واحد لكل عميل وطلب ومنتج، فتعيد المحاولة الإرجاع نفسه، ورقم الإرجاع يصدره التطبيق"
      ],
      capabilities: [
        "الإجابة عن أسئلة الكتالوج والسياسات من بيانات المتجر",
        "الاستعلام عن طلب تملكه الجلسة",
        "إنشاء إرجاع محدود بعد التحقق من المدخلات والملكية",
        "التحويل لموظف حين لا يمكن التحقق من الإجابة",
        "رفض الوصول إلى بيانات عميل آخر"
      ],
      decisions: [
        {
          title: "موجّه أولًا، لا وكيل مفتوح",
          body: "طلبات المتجر تنحصر في نوايا ثابتة قليلة. يرسل الموجّه كل طلب إلى مسار محدد، وحلقة وكيل مفتوحة كانت ستضيف وقتًا ونقاط فشل دون دليل على حاجة المجال لها."
        },
        {
          title: "واجهة واحدة لكل نموذج",
          body: "DeepSeek وALLaM خلف الواجهة نفسها، فلا يعتمد منطق المتجر ولا الصلاحيات على مزوّد واحد."
        },
        {
          title: "التحويل بدل التخمين",
          body: "حين لا يمكن التحقق من الإجابة من بيانات المتجر، يحوّل رقمي الحالة لموظف بدل أن يختلق معلومة. وفي التشغيل الموثّق كانت إخفاقات DeepSeek الخمسة كلها من هذا النوع: آمنة، لكنها تُحسب إخفاقًا."
        }
      ],
      outcome:
        "نموذج أولي عامل بتقييم موثّق. على Golden Set من 56 حالة اجتاز كلٌّ من DeepSeek وALLaM ‏51 من 56 حالة، ومنها الحالات عالية الخطورة الـ24 كلها. ورُفض استعلام حيّ عن طلب عميل آخر بقرار من التطبيق، واكتمل إرجاع حيّ مصرّح به بإنشاء إرجاع واحد. كل ذلك على بيانات خيالية، ولا شيء منشور.",
      notClaimed:
        "لا تشغيل فعلي، ولا متجر أو بيانات عملاء حقيقية، ولا أثر تجاري مقاس، ولا ادّعاء بأن الحمايات توقف كل هجوم. ونسبة الاجتياز درجة اختبار حالات محددة من تشغيل واحد، وليست دقة النموذج.",
      limitations: [
        "بيانات خيالية في الذاكرة، وكتالوج ضيق، وتحويل محلي، بلا ربط بمتجر أو نظام دعم حقيقي.",
        "بيئة تشغيل واحدة ومقياس حالات محددة، وفشلت خمس حالات من الأسئلة الشائعة لكل نموذج.",
        "الحمايات معجمية: صياغة جديدة قد تتجاوزها، وإخفاء البيانات الشخصية يغطي أرقام الجوال السعودية والبريد الإلكتروني فقط.",
        "استدعاء الأدوات الأصلي في ALLaM لم يُختبر، وأدلة الأدوات الحية من DeepSeek فقط.",
        "لا فواتير مزوّد، ولا قياس للأداء تحت الضغط، ولا أرقام لتكلفة تشغيل فعلي."
      ],
      next: [
        "معالجة إخفاقات الأسئلة الشائعة الخمسة لتُقتبس المعلومة الموثّقة بدل التحويل",
        "اختبار استدعاء الأدوات الأصلي على ALLaM",
        "إضافة طبقة حماية دلالية وتغطية أوسع للبيانات الشخصية",
        "تقييمه على محادثات دعم حقيقية بموافقة أصحابها قبل أي تجربة"
      ],
      technologiesNote:
        "DeepSeek ‏(deepseek-v4-flash) عبر واجهته البرمجية، وALLaM ‏(humain-ai/ALLaM-7B-Instruct-preview) عبر vLLM على Colab T4.",
      lesson:
        "بناء تطبيق ذكاء اصطناعي ليس تحسين Prompt فقط. النموذج يعمل داخل نظام يملك الصلاحيات والتحقق والتقييم، وطريقة واضحة للفشل.",
      highlights: [
        "عربي وإنجليزي",
        "Golden Set من 56 حالة: 51 نجحت و5 فشلت",
        "الصلاحيات خارج النموذج",
        "مشروع ختامي في أكاديمية سدايا"
      ],
      story: {
        requests: {
          title: "ليس كل طلب سؤالًا",
          intro: "خدمة العملاء تخلط الإجابات بإجراءات على حساب أحد، والخطر في المسافة بينهما.",
          items: [
            { text: "«وش سياسة الإرجاع؟»", outcome: "إجابة من بيانات المتجر نفسها", tone: "answer" },
            { text: "«وين طلبي؟»", outcome: "قراءة — إذا كانت الجلسة تملك الطلب", tone: "action" },
            { text: "«أبي أرجّع هذا المنتج»", outcome: "تعديل — بعد التحقق والملكية والموافقة", tone: "action" },
            { text: "«اعرض لي طلب عميل ثاني»", outcome: "رفض — مهما اقترح النموذج", tone: "refuse" }
          ],
          question: "المشكلة الحقيقية: كيف نستفيد من مرونة النموذج دون أن نعطيه سلطة القرار؟"
        },
        principle: {
          kicker: "المبدأ",
          lines: ["النموذج يقترح.", "النظام يقرّر."],
          body: "يحق للنموذج اللغوي أن يقترح استدعاء أداة. أما كود التطبيق فيتحقق من الجلسة والملكية والأداة والمخطط والمدخلات والمنتج والموافقة، وبعدها فقط يسمح أو يرفض."
        },
        architecture: {
          groups: [
            { label: "المدخل", steps: ["رسالة بالعربية أو الإنجليزية", "توحيد النص، وكشف الحقن، وإخفاء البيانات الشخصية، والتصنيف"] },
            { label: "النموذج", steps: ["الموجّه، أو حلقة الأدوات الأصلية", "DeepSeek أو ALLaM يقترح"] },
            {
              label: "النظام",
              steps: ["التحقق من المخطط والمدخلات", "التحقق من الصلاحية مقابل الجلسة", "تشغيل الأداة"],
              decisive: true
            },
            { label: "المخرج", steps: ["فحص الرد من أي تسريب", "نتيجة موثّقة"] }
          ],
          outcomesLabel: "تنتهي كل رسالة إلى",
          outcomes: ["إجابة من البيانات", "إجراء بأداة", "رفض", "تحويل لموظف"],
          note: "يقيس Golden Set مسار الموجّه، ولاستدعاء الأدوات الأصلي سجلات DeepSeek حية خاصة به."
        },
        boundary: {
          title: "اللحظة الفاصلة",
          intro: "في التشغيل الحي الموثّق، سألت الجلسة عن الطلب 5521، وهو لعميل آخر.",
          rows: [
            { label: "الرسالة", value: "“Where is order 5521?”" },
            { label: "اقترح النموذج", value: 'lookup_order({"order_id": "5521"})', code: true },
            { label: "قرر التطبيق", value: "DENIED · authorization_denied", code: true, tone: "deny" },
            { label: "ما نُفّذ", value: "لا شيء", tone: "deny" },
            {
              label: "الرد",
              value: "“I cannot execute a request that bypasses account permissions or safety controls. I can help with your own orders.”"
            }
          ],
          body: "طلب النموذج الطلب، ورفض الكود تنفيذه لأن الطلب 5521 لعميل آخر، فلم تصل بيانات ذلك العميل إلى الرد.",
          counterpart: "والفحص نفسه سمح بالطلب 1024 لأن الجلسة تملكه، واكتمل عليه إرجاع حيّ برقم R-1001.",
          gate: {
            legend: "اختر سيناريو موثّقًا",
            proposes: "النموذج يقترح",
            decides: "التطبيق يقرّر",
            note: "الاستعلامان موثّقان من التشغيل الحي على DeepSeek. هذا عرض لهما، ولا يستدعي أي نموذج.",
            replay: "أعد العرض",
            allowed: {
              choice: "الطلب 1024",
              detail: "طلب هذه الجلسة",
              verdict: "سُمح",
              rows: [
                { label: "الرسالة", value: "سؤال عن الطلب 1024، وهو طلب تملكه هذه الجلسة" },
                { label: "اقترح النموذج", value: 'lookup_order({"order_id": "1024"})', code: true },
                { label: "قرر التطبيق", value: "سُمح: الجلسة تملك الطلب 1024", tone: "allow" },
                { label: "ما نُفّذ", value: "lookup_order، نفّذه التطبيق", tone: "allow" },
                { label: "الرد", value: "أجاب النموذج من نتيجة الأداة" }
              ]
            },
            denied: { choice: "الطلب 5521", detail: "طلب عميل آخر", verdict: "رُفض" }
          }
        },
        evaluation: {
          title: "التقييم",
          intro: "شُغّلت مجموعة Golden Set نفسها من 56 حالة على النموذجين في تشغيل واحد موثّق. ولا تُحسب الحالة ناجحة إلا إذا طابقت حالة الحظر والنية ومعلومة مطلوبة في الإجابة.",
          passed: 51,
          total: 56,
          passedLabel: "نجحت",
          failedLabel: "فشلت",
          figures: [
            { value: "29", label: "حالة عربية" },
            { value: "27", label: "حالة إنجليزية" },
            { value: "24", label: "حالة عالية الخطورة" },
            { value: "24 / 24", label: "حالة عالية الخطورة نجحت، في النموذجين" }
          ],
          providers: "اجتاز كلٌّ من DeepSeek وALLaM ‏51 من 56.",
          scope: "درجة اختبار لحالات محددة من تشغيل واحد موثّق — ليست دقة النموذج، ولا تنطبق على مدخلات خارج المجموعة."
        },
        failures: {
          title: "ما الذي لم ينجح",
          body: "فشلت خمس حالات من الأسئلة الشائعة لكل نموذج، ولا واحدة منها عالية الخطورة. حوّل DeepSeek الخمس كلها لموظف بدل أن يقتبس المعلومة المطلوبة، وهذا سلوك آمن لكن الاختبار يعدّه إخفاقًا. أما ALLaM فوجّه حالتين إلى مسار حالة الطلب، وأجاب عن اثنتين دون الرقم المطلوب، وحوّل واحدة.",
          casesLabel: "إخفاقات DeepSeek الخمسة",
          cases: [
            "كم مدة التوصيل؟",
            "كم سعر السماعة؟",
            "كم ضمان الساعة الذكية؟",
            "How long does delivery take?",
            "Can a defective product be returned?"
          ]
        },
        guardrails: {
          title: "الحمايات، وحدودها",
          intro: "خمس مراحل تحيط بالنموذج: أربع قبله وواحدة بعده.",
          layers: ["توحيد النص", "كشف الحقن", "إخفاء البيانات الشخصية", "التصنيف", "فحص المخرج"],
          figures: [
            { value: "32 / 32", label: "هجومًا مُنع" },
            { value: "0 / 32", label: "طلبًا مشروعًا مُنع" },
            { value: "0 / 56", label: "إجابة في Golden Set تغيّرت" }
          ],
          scope: "قيست دون اتصال على مجموعة الاختبار الحتمية الموثّقة. ولا تعني أن الحمايات تمنع كل هجوم: المصنّف معجمي، والتسريب المعاد صياغته قد يمر. والحدّ الذي لا يعتمد عليها هو التحقق من الصلاحية."
        },
        checks: {
          title: "الإرجاع أكثر من JSON",
          intro: "حين يستخرج النموذج طلب إرجاع، فمخرجاته اقتراح أيضًا، ولا تُنفَّذ إلا بعد:",
          subject: "ReturnRequest",
          steps: ["المخطط", "الدليل", "الملكية", "هوية المنتج في الكتالوج", "الموافقة"],
          outcomes: ["تنفيذ", "تحويل"],
          figures: [
            { value: "20", label: "حالة حيّة على DeepSeek: 10 عربية و10 إنجليزية" },
            { value: "20 / 20", label: "طابقت النتيجة المصمَّمة" }
          ],
          scope: "في كل لغة: 5 صحيحة من أول مرة، و1 بعد الإصلاح، و4 حُوّلت كما صُمّم. والتحويل الصحيح يُحسب نتيجة مصمَّمة — فهذه ليست 20 عملية إرجاع صحيحة. ولم يُختلق أي طلب أو منتج أو سبب أو مالك."
        },
        providers: {
          title: "مساران للنموذج، وحدّ واحد",
          items: [
            { name: "DeepSeek", body: "نموذج تجاري عبر واجهته البرمجية، ومنه أدلة استدعاء الأدوات الحية." },
            {
              name: "ALLaM",
              body: "نموذج مفتوح الأوزان يعمل محليًا عبر vLLM على Colab T4، وقُيّم على Golden Set نفسها. واستدعاء الأدوات الأصلي فيه لم يُختبر."
            }
          ],
          note: "التحقق والصلاحيات في كود التطبيق، فلا يعتمدان على النموذج الذي يجيب."
        }
      }
    }
  },
  {
    slug: "chatub",
    name: "ChatUB",
    year: "2025",
    status: "graduation-project",
    evidenceType: "public-repository",
    featured: true,
    previewKind: "chat",
    technologies: ["Python", "Flask", "Sentence Transformers", "PyTorch", "NLTK", "Ollama"],
    links: { github: "https://github.com/Abdulel3h/ChatUB" },
    evidence: [
      {
        kind: "repository",
        href: "https://github.com/Abdulel3h/ChatUB",
        label: { en: "Public repository on GitHub", ar: "مستودع عام على GitHub" },
        detail: {
          en: "Source, architecture, setup steps and the documented limitations of the prototype.",
          ar: "الكود المصدري والبنية وخطوات التشغيل والقيود الموثّقة للنموذج الأولي."
        }
      },
      {
        kind: "screenshots",
        href: "https://github.com/Abdulel3h/ChatUB#screenshot",
        label: { en: "Interface screenshot in the README", ar: "لقطة شاشة للواجهة في ملف README" },
        detail: {
          en: "Captured from the committed chat interface — a real screenshot, not a mock-up.",
          ar: "ملتقطة من واجهة المحادثة الموجودة في المستودع — لقطة حقيقية وليست تصميمًا تخيليًا."
        }
      }
    ],
    en: {
      descriptor: "Local Arabic academic assistant",
      summary:
        "Answers students’ Arabic questions from curated University of Bisha FAQ content, with retrieval and generation kept on a local machine.",
      domain: "Education · Arabic NLP",
      role: "Project lead",
      statusDetail:
        "Graduation project at the University of Bisha — a working prototype, not deployed to students.",
      context:
        "Information Systems graduation project at the University of Bisha. Abdulelah led the team from the first idea to a working prototype.",
      problem:
        "Students look for academic rules — course withdrawal, apology deadlines, registration — that are spread across documents and offices, and answers can differ depending on who they ask. A generic chatbot does not know one university’s rules, and sending campus questions to a hosted model sends them off-site.",
      constraints: [
        "Arabic-first questions and answers",
        "University content and inference stay on a local machine",
        "Curated FAQ content, not the full body of regulations",
        "A graduation-project timeline and team"
      ],
      solution:
        "A Flask web app matches an incoming Arabic question to curated FAQ entries with multilingual sentence embeddings, then passes the closest entry to a locally served Ollama model, which writes a concise Arabic answer.",
      responsibilities: [
        "Defined the product scope and the problem it should solve",
        "Led the graduation team from concept to a working prototype",
        "Made the call to keep retrieval and generation local",
        "Shaped the assistant’s behaviour and how the FAQ knowledge is structured"
      ],
      flow: ["Arabic question", "Stop-word cleanup (NLTK)", "Embedding match against FAQs", "Local answer via Ollama"],
      approach: [
        "FAQ question–answer pairs are loaded from JSON files in the repository",
        "Arabic text is preprocessed and NLTK Arabic stop words are removed",
        "Multilingual Sentence Transformer embeddings select the nearest FAQ entry",
        "An Ollama model defined in a Modelfile generates the answer locally",
        "The latest question and answer are carried forward as light context"
      ],
      capabilities: [
        "Arabic web chat interface",
        "JSON question endpoint",
        "Semantic matching against curated FAQs",
        "Local answer generation with Ollama"
      ],
      decisions: [
        {
          title: "Local-first, not cloud",
          body: "Retrieval and generation run on the same machine, so university content and student questions never leave it. Privacy and institutional trust mattered more than the convenience of a hosted model."
        },
        {
          title: "Anchored to curated FAQs",
          body: "Answers start from the closest curated question–answer pair instead of the model’s general knowledge. When nothing is close enough the model can still answer unguided — a limitation the repository documents openly."
        }
      ],
      outcome:
        "A working prototype: a web chat interface, a question endpoint, Arabic preprocessing and semantic FAQ matching that feeds a local model — readable and runnable from the public repository. It has not been deployed to students, and no answer-accuracy figure is claimed.",
      notClaimed: "No production deployment and no accuracy measurement are claimed.",
      limitations: [
        "Grounding is not guaranteed: if no FAQ entry passes the similarity threshold, generation continues without reference context.",
        "There is no automated evaluation of answer accuracy or hallucination.",
        "The official university sources behind the FAQ data are not yet documented in the repository.",
        "Committed model artifacts make the repository heavy."
      ],
      next: [
        "Build an Arabic test set and measure answer accuracy before any rollout",
        "Decline or hand over when no FAQ entry is close enough, instead of answering unguided",
        "Document the official source behind every FAQ entry",
        "Run a small pilot with students and academic advisers"
      ],
      quote:
        "Real innovation starts when technology respects context, privacy, and real human needs."
    },
    ar: {
      descriptor: "مساعد أكاديمي عربي يعمل محليًا",
      summary:
        "يجيب عن أسئلة الطلاب بالعربية انطلاقًا من أسئلة شائعة منتقاة لجامعة بيشة، مع إبقاء الاسترجاع والتوليد على جهاز محلي.",
      domain: "التعليم · معالجة اللغة العربية",
      role: "قائد المشروع",
      statusDetail: "مشروع تخرج في جامعة بيشة — نموذج أولي عامل، ولم يُطلَق للطلاب.",
      context:
        "مشروع تخرج في تخصص نظم المعلومات بجامعة بيشة، قاد فيه عبدالإله الفريق من الفكرة الأولى حتى نموذج أولي عامل.",
      problem:
        "يبحث الطلاب عن أنظمة أكاديمية مثل الاعتذار عن المقررات ومواعيد التسجيل، وهي موزعة بين مستندات وجهات مختلفة، وقد تختلف الإجابة باختلاف من يُسأل. والمساعد العام لا يعرف أنظمة جامعة بعينها، كما أن إرسال أسئلة الطلاب إلى نموذج مستضاف يعني خروجها من الجامعة.",
      constraints: [
        "أسئلة وإجابات بالعربية أولًا",
        "بقاء محتوى الجامعة والمعالجة على جهاز محلي",
        "أسئلة شائعة منتقاة لا كامل اللوائح",
        "إطار زمني وفريق مشروع تخرج"
      ],
      solution:
        "تطبيق ويب مبني بـ Flask يطابق سؤال الطالب مع أقرب مدخل في الأسئلة الشائعة باستخدام تمثيلات دلالية متعددة اللغات، ثم يمرّر هذا المدخل إلى نموذج يعمل محليًا عبر Ollama ليصوغ إجابة عربية موجزة.",
      responsibilities: [
        "حدّد نطاق المنتج والمشكلة التي يعالجها",
        "قاد فريق التخرج من الفكرة إلى نموذج أولي عامل",
        "اتخذ قرار إبقاء الاسترجاع والتوليد على الجهاز المحلي",
        "صمّم سلوك المساعد وطريقة تنظيم المعرفة في الأسئلة الشائعة"
      ],
      flow: ["سؤال بالعربية", "تنقية النص (NLTK)", "مطابقة دلالية مع الأسئلة الشائعة", "إجابة محلية عبر Ollama"],
      approach: [
        "تُحمَّل أزواج الأسئلة والأجوبة من ملفات JSON داخل المستودع",
        "يُعالَج النص العربي مسبقًا وتُحذف كلمات الوقف العربية عبر NLTK",
        "تختار تمثيلات Sentence Transformers متعددة اللغات أقرب مدخل",
        "يولّد نموذج Ollama المعرَّف في Modelfile الإجابة محليًا",
        "يُحتفظ بآخر سؤال وجواب سياقًا خفيفًا للمتابعة"
      ],
      capabilities: [
        "واجهة محادثة عربية على الويب",
        "واجهة برمجية لاستقبال الأسئلة",
        "مطابقة دلالية مع أسئلة شائعة منتقاة",
        "توليد الإجابة محليًا عبر Ollama"
      ],
      decisions: [
        {
          title: "محليًا لا سحابيًا",
          body: "يعمل الاسترجاع والتوليد على الجهاز نفسه، فلا يغادر محتوى الجامعة ولا أسئلة الطلاب. كانت الخصوصية وثقة المؤسسة أهم من سهولة النموذج المستضاف."
        },
        {
          title: "الاستناد إلى أسئلة شائعة منتقاة",
          body: "تنطلق الإجابة من أقرب سؤال وجواب منتقى بدل المعرفة العامة للنموذج. وإذا لم يوجد مدخل قريب بما يكفي فقد يجيب النموذج دون توجيه، وهو قيد يوثّقه المستودع بوضوح."
        }
      ],
      outcome:
        "نموذج أولي عامل: واجهة محادثة، وواجهة برمجية للأسئلة، ومعالجة مسبقة للعربية، ومطابقة دلالية تغذي نموذجًا محليًا — ويمكن قراءته وتشغيله من المستودع العام. لم يُطلَق للطلاب، ولا تُدّعى أي نسبة لدقة الإجابات.",
      notClaimed: "لا يُدّعى تشغيل فعلي ولا قياس للدقة.",
      limitations: [
        "الاستناد غير مضمون: إذا لم يتجاوز أي مدخل حدّ التشابه يستمر التوليد دون سياق مرجعي.",
        "لا يوجد تقييم آلي لدقة الإجابات أو لاختلاق المعلومات.",
        "المصادر الرسمية التي بُنيت منها الأسئلة الشائعة غير موثّقة في المستودع بعد.",
        "ملفات النماذج المرفوعة تجعل المستودع كبير الحجم."
      ],
      next: [
        "بناء مجموعة اختبار عربية وقياس دقة الإجابات قبل أي إطلاق",
        "الاعتذار أو التحويل عند غياب مدخل قريب بدل الإجابة دون توجيه",
        "توثيق المصدر الرسمي لكل سؤال وجواب",
        "تجربة محدودة مع مجموعة من الطلاب والمرشدين الأكاديميين"
      ],
      quote: "يبدأ الابتكار الحقيقي حين تحترم التقنية السياق والخصوصية واحتياجات الناس الفعلية."
    }
  },
  {
    slug: "althil",
    name: "Althil",
    year: "2026",
    status: "hackathon-prototype",
    evidenceType: "public-repository",
    featured: true,
    previewKind: "map",
    technologies: ["Python", "FastAPI", "OpenCV", "pysolar", "Docker", "Google Cloud Run"],
    links: { github: "https://github.com/Abdulel3h/Althil" },
    evidence: [
      {
        kind: "repository",
        href: "https://github.com/Abdulel3h/Althil",
        label: { en: "Public repository on GitHub", ar: "مستودع عام على GitHub" },
        detail: {
          en: "FastAPI backend, analysis services, the Cloud Run Dockerfile and tests, with a plain account of which inputs are simulated.",
          ar: "الأنظمة الخلفية بـ FastAPI وخدمات التحليل وملف Dockerfile لـ Cloud Run والاختبارات، مع بيان صريح للمدخلات المحاكاة."
        }
      },
      {
        kind: "screenshots",
        href: "https://github.com/Abdulel3h/Althil#screenshots",
        label: { en: "Screenshots in the README", ar: "لقطات شاشة في ملف README" },
        detail: {
          en: "Captured from the running app; the README notes that the server clock was pinned to midday so the sun is up.",
          ar: "ملتقطة من التطبيق أثناء تشغيله، ويذكر ملف README أن ساعة الخادم ثُبّتت على منتصف النهار لتظهر الشمس."
        }
      },
      {
        kind: "program-record",
        href: "/achievements",
        label: {
          en: "Intelligent Planet Hackathon — program record",
          ar: "هاكاثون الكوكب الذكي — سجل المشاركة"
        },
        detail: {
          en: "Listed under Recognition: KFUPM × Google Cloud, 2026.",
          ar: "موثّق في صفحة الإنجازات: جامعة الملك فهد للبترول والمعادن مع Google Cloud، عام 2026."
        }
      }
    ],
    en: {
      descriptor: "Urban thermal comfort decision support",
      summary:
        "A decision-support prototype that helps urban planners decide where shade interventions belong, from sun position, a heat-exposure score and site-photo analysis.",
      domain: "Sustainability · Urban planning",
      role: "Backend developer & cloud architecture contributor",
      statusDetail:
        "Built with a team during the Intelligent Planet Hackathon (KFUPM × Google Cloud). A hackathon prototype with public code — not used by a city.",
      context:
        "Team project built during the Intelligent Planet Hackathon, hosted by KFUPM in collaboration with Google Cloud.",
      problem:
        "Urban planners need to know where shade canopies will actually improve comfort. Heat exposure shifts with the sun’s path across the day and the year, which static plans rarely account for.",
      constraints: [
        "Hackathon time limit",
        "A team build — Abdulelah’s part was the backend, the cloud architecture and the service integration",
        "No land-cover data, so urban density is simulated",
        "One container, deployable to Cloud Run"
      ],
      solution:
        "A map-based planning tool served by one FastAPI application. Selecting a point returns the sun’s altitude and azimuth, a 0–100 heat-risk score, a shade type chosen from the sun angle with candidate placements, and a report the planner can download as a PDF. A site photo adds an estimate of vegetation versus hard surface.",
      responsibilities: [
        "Built the FastAPI backend and its analysis endpoints",
        "Integrated the sun-position, heat-scoring, image-analysis and report services into one deployable application",
        "Packaged the application as one stateless container for Google Cloud Run",
        "Supported the Google Cloud architecture direction of the design"
      ],
      flow: ["Map location", "Sun position & heat score", "Site-photo analysis", "Shade recommendations & report"],
      approach: [
        "pysolar computes the sun’s altitude and azimuth for the selected point at the current time",
        "A rule weights sun altitude and an urban-density factor into a 0–100 heat score with Low, Moderate and High levels",
        "The sun angle selects the shade type — horizontal canopy, angled shade sail or vertical green wall — and three candidate points are placed around the selection",
        "OpenCV colour thresholds estimate vegetation and grey-surface coverage in a site photo",
        "One FastAPI app serves the map, the API and a PDF report, packaged as a container for Cloud Run"
      ],
      capabilities: [
        "Sun-position and heat-risk analysis for any map point",
        "Shade-type recommendations with candidate placements",
        "Site-photo surface analysis",
        "Report page and PDF export"
      ],
      technologiesNote:
        "Cloud Run packaging is in the repository. The hackathon design also called for BigQuery, Cloud Storage and Vertex AI; those integrations are not implemented in the code.",
      decisions: [
        {
          title: "One container, built for Cloud Run",
          body: "The map, the API and the reports are served by a single stateless FastAPI app packaged for Cloud Run, so the team could deploy the whole system as one unit inside the hackathon. BigQuery, Cloud Storage and Vertex AI stayed in the design, not the code."
        },
        {
          title: "Compute what can be computed, label the rest",
          body: "The sun’s position is computed exactly with pysolar. Urban density, candidate placements and cooling estimates are simulated or estimated, and the README, the report and the PDF say so."
        },
        {
          title: "Shade type from sun geometry",
          body: "A high sun calls for horizontal cover and a low sun for vertical screening, so the recommendation is a kind of shade, not only a score."
        }
      ],
      outcome:
        "A runnable hackathon prototype with public code: one FastAPI app that computes sun position and a heat-risk score for any map point, recommends a shade type with candidate placements, analyses site photos and exports a PDF report, packaged as a container for Cloud Run. Service and API tests were added when the code was published. No city deployment and no measured cooling effect are claimed.",
      notClaimed:
        "No city deployment, no measured temperature reduction and no BigQuery, Cloud Storage or Vertex AI integration are claimed.",
      limitations: [
        "Urban density is simulated from the coordinates, and candidate placements and cooling figures are estimates.",
        "Sun position always uses the current time; there is no date picker and no night-time handling.",
        "Image analysis uses colour thresholds, not a trained model, and the assistant panel gives scripted replies.",
        "Recommendations have not been validated with planners or with field temperature data."
      ],
      next: [
        "Replace simulated density with land-cover data",
        "Let planners choose the date and time and compare sun paths",
        "Implement the designed BigQuery, Cloud Storage and Vertex AI components",
        "Validate recommendations against measured street temperatures"
      ],
      lesson:
        "This project strengthened my experience in cloud-native design, data-driven decisions and cross-functional collaboration under real constraints."
    },
    ar: {
      descriptor: "دعم القرار للراحة الحرارية في المدن",
      summary:
        "نموذج أولي لدعم القرار يساعد المخططين الحضريين على تحديد مواضع التظليل، انطلاقًا من موقع الشمس ودرجة التعرض للحرارة وتحليل صور الموقع.",
      domain: "الاستدامة · التخطيط الحضري",
      role: "مطوّر أنظمة خلفية ومساهم في البنية السحابية",
      statusDetail:
        "بُني ضمن فريق خلال هاكاثون الكوكب الذكي (جامعة الملك فهد للبترول والمعادن مع Google Cloud). نموذج أولي في هاكاثون بكود منشور — لا تستخدمه أي مدينة.",
      context:
        "مشروع فريق بُني خلال هاكاثون الكوكب الذكي الذي نظمته جامعة الملك فهد للبترول والمعادن بالتعاون مع Google Cloud.",
      problem:
        "يحتاج المخططون الحضريون إلى معرفة أين يحسّن التظليل الراحة فعلًا. فالتعرض للحرارة يتغير مع مسار الشمس خلال اليوم والسنة، وهو ما نادرًا ما تراعيه المخططات الثابتة.",
      constraints: [
        "المدة المحدودة للهاكاثون",
        "عمل جماعي — تولّى عبدالإله الأنظمة الخلفية والبنية السحابية ودمج الخدمات",
        "لا توجد بيانات لاستخدامات الأراضي، لذلك تُحاكى الكثافة العمرانية",
        "حاوية واحدة قابلة للنشر على Cloud Run"
      ],
      solution:
        "أداة تخطيط قائمة على الخريطة يقدّمها تطبيق FastAPI واحد. عند اختيار نقطة يعيد ارتفاع الشمس واتجاهها، ودرجة لخطر الحرارة من 0 إلى 100، ونوع تظليل يُختار حسب زاوية الشمس مع مواقع مرشحة، وتقريرًا يمكن تنزيله بصيغة PDF. وتضيف صورة الموقع تقديرًا لنسبة الغطاء النباتي مقابل الأسطح الصلبة.",
      responsibilities: [
        "بنى الأنظمة الخلفية بـ FastAPI ونقاط التحليل فيها",
        "دمج خدمات موقع الشمس وتقييم الحرارة وتحليل الصور والتقارير في تطبيق واحد قابل للنشر",
        "جهّز التطبيق في حاوية واحدة بلا حالة للعمل على Google Cloud Run",
        "دعم توجه البنية على Google Cloud في التصميم"
      ],
      flow: ["موقع على الخريطة", "موقع الشمس ودرجة الحرارة", "تحليل صورة الموقع", "توصيات التظليل والتقرير"],
      approach: [
        "تحسب مكتبة pysolar ارتفاع الشمس واتجاهها للنقطة المختارة في الوقت الحالي",
        "تجمع قاعدةٌ ارتفاعَ الشمس وعاملَ الكثافة العمرانية في درجة حرارة من 0 إلى 100 بمستويات منخفض ومتوسط ومرتفع",
        "تحدد زاوية الشمس نوع التظليل — مظلة أفقية أو شراع مائل أو جدار أخضر عمودي — وتُوضع ثلاث نقاط مرشحة حول النقطة المختارة",
        "تقدّر عتبات الألوان في OpenCV نسبة الغطاء النباتي والأسطح الرمادية في صورة الموقع",
        "يقدّم تطبيق FastAPI واحد الخريطة والواجهة البرمجية وتقرير PDF، ضمن حاوية مجهزة لـ Cloud Run"
      ],
      capabilities: [
        "تحليل موقع الشمس وخطر الحرارة لأي نقطة على الخريطة",
        "توصيات بنوع التظليل مع مواقع مرشحة",
        "تحليل أسطح الموقع من الصور",
        "صفحة تقرير وتصدير PDF"
      ],
      technologiesNote:
        "التجهيز لـ Cloud Run موجود في المستودع. وتضمّن تصميم الهاكاثون أيضًا BigQuery وCloud Storage وVertex AI، لكن هذه التكاملات غير منفذة في الكود.",
      decisions: [
        {
          title: "حاوية واحدة مبنية لـ Cloud Run",
          body: "تُقدَّم الخريطة والواجهة البرمجية والتقارير من تطبيق FastAPI واحد بلا حالة مجهز لـ Cloud Run، ليتمكن الفريق من نشر النظام كاملًا وحدةً واحدة خلال الهاكاثون. وبقيت BigQuery وCloud Storage وVertex AI في التصميم لا في الكود."
        },
        {
          title: "احسب ما يمكن حسابه ووضّح الباقي",
          body: "يُحسب موقع الشمس بدقة عبر pysolar، أما الكثافة العمرانية والمواقع المرشحة وتقديرات التبريد فهي محاكاة أو تقديرية، ويذكر ذلك ملف README والتقرير وملف PDF."
        },
        {
          title: "نوع التظليل من هندسة الشمس",
          body: "الشمس العالية تحتاج غطاءً أفقيًا والمنخفضة تحتاج حجبًا عموديًا، لذلك تأتي التوصية بنوع من التظليل لا بدرجة فقط."
        }
      ],
      outcome:
        "نموذج أولي قابل للتشغيل بكود منشور: تطبيق FastAPI واحد يحسب موقع الشمس ودرجة خطر الحرارة لأي نقطة على الخريطة، ويقترح نوع التظليل مع مواقع مرشحة، ويحلل صور الموقع، ويصدّر تقريرًا بصيغة PDF، ضمن حاوية مجهزة لـ Cloud Run. وأُضيفت اختبارات للخدمات والواجهة البرمجية عند نشر الكود. لا يُدّعى تشغيل في أي مدينة ولا أثر تبريد مقاس.",
      notClaimed:
        "لا يُدّعى تشغيل في مدينة ولا انخفاض مقاس في درجات الحرارة ولا تكامل مع BigQuery أو Cloud Storage أو Vertex AI.",
      limitations: [
        "الكثافة العمرانية محاكاة من الإحداثيات، والمواقع المرشحة وأرقام التبريد تقديرية.",
        "يعتمد موقع الشمس دائمًا على الوقت الحالي؛ لا يوجد اختيار للتاريخ ولا معالجة لساعات الليل.",
        "تحليل الصور يعتمد على عتبات الألوان لا على نموذج مدرَّب، ولوحة المساعد تقدّم ردودًا مُعدّة مسبقًا.",
        "لم تُختبر التوصيات مع مخططين ولا مقابل قياسات حرارة ميدانية."
      ],
      next: [
        "استبدال الكثافة المحاكاة ببيانات فعلية لاستخدامات الأراضي",
        "تمكين المخطط من اختيار التاريخ والوقت ومقارنة مسارات الشمس",
        "تنفيذ مكونات BigQuery وCloud Storage وVertex AI المصممة",
        "مقارنة التوصيات بقياسات فعلية لحرارة الشوارع"
      ],
      lesson:
        "عمّق هذا المشروع خبرتي في التصميم السحابي واتخاذ القرار المبني على البيانات والتعاون بين التخصصات تحت قيود حقيقية."
    }
  },
  {
    slug: "absher-insight-ai",
    name: "Absher Insight AI",
    year: "2025",
    status: "hackathon-prototype",
    evidenceType: "public-repository",
    featured: true,
    previewKind: "security",
    technologies: ["Python", "FastAPI", "Pydantic", "scikit-learn", "pandas", "NumPy"],
    links: { github: "https://github.com/Abdulel3h/absher-insight" },
    evidence: [
      {
        kind: "repository",
        href: "https://github.com/Abdulel3h/absher-insight",
        label: { en: "Public repository on GitHub", ar: "مستودع عام على GitHub" },
        detail: {
          en: "FastAPI service, rules engine, dashboard, an API test and a plain account of what the numbers mean.",
          ar: "خدمة FastAPI ومحرك القواعد ولوحة المتابعة واختبار للواجهة البرمجية، مع شرح صريح لمعنى الأرقام."
        }
      },
      {
        kind: "screenshots",
        href: "https://github.com/Abdulel3h/absher-insight#screenshots",
        label: { en: "Dashboard screenshots in the README", ar: "لقطات شاشة للوحة المتابعة في ملف README" },
        detail: {
          en: "Captured from the committed dashboard — every event shown is synthetic.",
          ar: "ملتقطة من لوحة المتابعة الموجودة في المستودع — وكل الأحداث المعروضة اصطناعية."
        }
      }
    ],
    en: {
      descriptor: "Explainable behavioural-risk prototype",
      summary:
        "Scores access events against explainable behavioural rules and surfaces unusual activity on an operations dashboard — built entirely on synthetic data.",
      domain: "Security analytics · Digital services",
      role: "AI security solution contributor",
      statusDetail:
        "Built during the Absher × Tuwaiq hackathon. An independent prototype on synthetic data — not affiliated with Absher or any government entity, and not a deployed security system.",
      context:
        "Built during the Absher Tuwaiq Hackathon as an independent demonstration of proactive, explainable risk monitoring.",
      problem:
        "Account-takeover signals in digital services are behavioural: the right credentials used from an unusual place, at an unusual hour, at an unusual rate. Monitoring usually reacts after an incident, and analysts also need to know why an event was flagged.",
      constraints: [
        "No real citizen data — every event is synthetic or simulated",
        "Every flag has to explain itself",
        "A hackathon timeline"
      ],
      solution:
        "A FastAPI service scores each access event with rules that state their reasoning — unusual location, late-night access, high action volume — and keeps live statistics that feed an operations dashboard. A simulator keeps the dashboard populated for demonstration.",
      responsibilities: [
        "Contributed to the proactive, behaviour-based security concept",
        "Helped shape the behavioural risk scenarios",
        "Supported the dashboard and decision-support design",
        "Kept the work privacy-first by building on synthetic data"
      ],
      flow: ["Access event", "Explainable rules", "Risk flag with reasons", "Operations dashboard"],
      approach: [
        "A /predict endpoint receives service type, location, login time and action count",
        "Rules check for unusual location, late-night access and high action volume",
        "Each response returns the flag, a rule-assigned score and the reasons behind it",
        "In-memory statistics expose totals, top services and a recent timeline",
        "Joblib and scikit-learn utilities support anomaly-model experiments"
      ],
      capabilities: [
        "Explainable, rule-based risk checks",
        "Live in-memory statistics",
        "Background event simulator",
        "Static operations dashboard"
      ],
      decisions: [
        {
          title: "Proactive over reactive",
          body: "Designed around spotting risky behaviour early, rather than responding after something has already gone wrong."
        },
        {
          title: "Explainable rules before a black box",
          body: "The live path uses rules that return the reasons behind each flag. Model utilities stay experimental, and the rule-assigned score is never presented as a calibrated probability."
        },
        {
          title: "Privacy by design, on synthetic data",
          body: "Everything runs on synthetic behaviour, so the idea can be tested and demonstrated without touching real personal data."
        }
      ],
      outcome:
        "A runnable prototype: an endpoint that returns explainable rule-based flags, live statistics, a background simulator and a static dashboard, plus an API test for the response schema. No real-world detection performance is claimed.",
      notClaimed: "No production deployment, no government affiliation and no detection-accuracy figures are claimed.",
      limitations: [
        "Synthetic data only — there is no production deployment and no affiliation with any government service.",
        "Rules, not a trained detector: the model artifacts support experiments only.",
        "State lives in memory and resets on restart; there is no persistent event store.",
        "Tests cover the response schema, not detection quality."
      ],
      next: [
        "Replay realistic benchmark data to measure false-positive rates",
        "Persist events and capture analyst feedback on each flag",
        "Compare a trained anomaly model against the rule baseline"
      ],
      quote: "True innovation does not wait for the perfect moment. It creates it."
    },
    ar: {
      descriptor: "نموذج أولي قابل للتفسير لرصد المخاطر السلوكية",
      summary:
        "يقيّم أحداث الدخول وفق قواعد سلوكية قابلة للتفسير، ويعرض النشاط غير المعتاد في لوحة متابعة تشغيلية — وكل ذلك مبني على بيانات اصطناعية.",
      domain: "تحليلات الأمن · الخدمات الرقمية",
      role: "مساهم في حلول أمن الذكاء الاصطناعي",
      statusDetail:
        "بُني خلال هاكاثون أبشر مع أكاديمية طويق. نموذج أولي مستقل على بيانات اصطناعية، لا يتبع لأبشر ولا لأي جهة حكومية، وليس نظامًا أمنيًا قيد التشغيل.",
      context:
        "بُني خلال هاكاثون أبشر مع أكاديمية طويق عرضًا مستقلًا لرصد المخاطر بشكل استباقي وقابل للتفسير.",
      problem:
        "مؤشرات الاستيلاء على الحسابات في الخدمات الرقمية سلوكية: بيانات دخول صحيحة لكن من مكان غير معتاد أو في وقت غير معتاد أو بمعدل غير معتاد. وغالبًا ما تأتي الاستجابة بعد وقوع الحادثة، كما يحتاج المحلل إلى معرفة سبب التنبيه.",
      constraints: [
        "لا بيانات حقيقية للمواطنين — كل الأحداث اصطناعية أو محاكاة",
        "كل تنبيه يجب أن يشرح سببه",
        "الإطار الزمني للهاكاثون"
      ],
      solution:
        "خدمة مبنية بـ FastAPI تقيّم كل حدث دخول بقواعد تذكر أسبابها — موقع غير معتاد، دخول في ساعة متأخرة، كثافة إجراءات عالية — وتحتفظ بإحصاءات حيّة تغذي لوحة متابعة تشغيلية، مع محاكٍ يبقي اللوحة نشطة لأغراض العرض.",
      responsibilities: [
        "ساهم في فكرة الأمن الاستباقي القائم على السلوك",
        "شارك في صياغة سيناريوهات المخاطر السلوكية",
        "دعم تصميم لوحة المتابعة ومنطق دعم القرار",
        "حافظ على الخصوصية أولًا بالاعتماد على بيانات اصطناعية"
      ],
      flow: ["حدث دخول", "قواعد قابلة للتفسير", "تنبيه مع الأسباب", "لوحة متابعة تشغيلية"],
      approach: [
        "تستقبل نقطة التنبؤ (predict) نوع الخدمة والموقع ووقت الدخول وعدد الإجراءات",
        "تتحقق القواعد من الموقع غير المعتاد والدخول المتأخر وكثافة الإجراءات",
        "تعيد كل استجابة التنبيه ودرجة تحددها القواعد مع أسبابها",
        "إحصاءات في الذاكرة تعرض الإجماليات وأبرز الخدمات وخطًا زمنيًا حديثًا",
        "أدوات joblib وscikit-learn لتجارب نماذج رصد الشذوذ"
      ],
      capabilities: [
        "فحوص مخاطر قائمة على قواعد قابلة للتفسير",
        "إحصاءات حيّة في الذاكرة",
        "محاكٍ للأحداث في الخلفية",
        "لوحة متابعة تشغيلية ثابتة"
      ],
      decisions: [
        {
          title: "الاستباق بدل ردّ الفعل",
          body: "صُمّم لرصد السلوك الخطر مبكرًا بدل الاستجابة بعد وقوع المشكلة."
        },
        {
          title: "قواعد مفسَّرة قبل الصندوق الأسود",
          body: "يعتمد المسار الفعلي على قواعد تذكر أسباب كل تنبيه، وتبقى أدوات النماذج تجريبية، ولا تُقدَّم الدرجة التي تحددها القواعد على أنها احتمال مُعايَر."
        },
        {
          title: "الخصوصية في التصميم عبر بيانات اصطناعية",
          body: "كل شيء يعمل على سلوك اصطناعي، فيمكن اختبار الفكرة وعرضها دون المساس ببيانات شخصية حقيقية."
        }
      ],
      outcome:
        "نموذج أولي قابل للتشغيل: واجهة تعيد تنبيهات مفسَّرة قائمة على القواعد، وإحصاءات حيّة، ومحاكٍ في الخلفية، ولوحة متابعة، إضافة إلى اختبار لبنية الاستجابة. لا يُدّعى أي أداء فعلي في رصد التهديدات.",
      notClaimed: "لا يُدّعى تشغيل فعلي ولا ارتباط بجهة حكومية ولا أرقام لدقة الرصد.",
      limitations: [
        "بيانات اصطناعية فقط — لا تشغيل فعلي ولا ارتباط بأي خدمة حكومية.",
        "قواعد لا نموذج مدرَّب: ملفات النماذج للتجارب فقط.",
        "البيانات في الذاكرة وتُفقد عند إعادة التشغيل؛ لا يوجد مخزن دائم للأحداث.",
        "الاختبارات تغطي بنية الاستجابة لا جودة الرصد."
      ],
      next: [
        "إعادة تشغيل بيانات مرجعية واقعية لقياس معدل الإنذارات الكاذبة",
        "حفظ الأحداث وجمع ملاحظات المحللين على كل تنبيه",
        "مقارنة نموذج مدرَّب لرصد الشذوذ بخط الأساس القائم على القواعد"
      ],
      quote: "الابتكار الحقيقي لا ينتظر اللحظة المثالية، بل يصنعها."
    }
  },
  {
    slug: "stadium",
    name: "Stadium",
    year: "2026",
    status: "working-prototype",
    evidenceType: "public-repository",
    featured: true,
    previewKind: "vision",
    technologies: ["Python", "Ultralytics YOLO", "OpenCV", "Flask", "NumPy", "JavaScript"],
    links: { github: "https://github.com/Abdulel3h/Stadium" },
    evidence: [
      {
        kind: "repository",
        href: "https://github.com/Abdulel3h/Stadium",
        label: { en: "Public repository on GitHub", ar: "مستودع عام على GitHub" },
        detail: {
          en: "Vision loop, gate decision engine, Flask API and dashboard, with setup steps and limitations.",
          ar: "حلقة الرؤية الحاسوبية ومحرك قرارات البوابات وواجهة Flask ولوحة المتابعة، مع خطوات التشغيل والقيود."
        }
      },
      {
        kind: "screenshots",
        href: "https://github.com/Abdulel3h/Stadium#screenshot",
        label: { en: "Dashboard screenshot in the README", ar: "لقطة شاشة للوحة المتابعة في ملف README" },
        detail: {
          en: "Captured from the committed gate dashboard.",
          ar: "ملتقطة من لوحة البوابات الموجودة في المستودع."
        }
      }
    ],
    en: {
      descriptor: "Crowd and gate monitoring prototype",
      summary:
        "Estimates how many people are at each stadium gate from video, flags crowding early and recommends where to move staff.",
      domain: "Computer vision · Crowd safety",
      role: "Solo developer",
      statusDetail:
        "A solo working prototype that runs on local video files or a webcam. It has not been calibrated for a real venue.",
      context: "A solo project, built end to end by Abdulelah.",
      problem:
        "Crowding at an entrance becomes a safety problem before anyone has counted it. Gate staff see their own queue, not the whole picture, so the decision that matters — move staff, redirect arrivals — often comes late.",
      constraints: [
        "Use existing camera feeds instead of new sensors",
        "Output has to be something an operator can act on immediately",
        "Runs locally against video files or a webcam"
      ],
      solution:
        "YOLO detects people in each frame and assigns them to one of four gate zones. A decision engine sets each gate’s status — normal, busy, critical or overflow — logs alerts, estimates arrival time and recommends staff moves. A Flask API serves that state to a dashboard that polls every two seconds.",
      responsibilities: [
        "Built the whole system as a solo project",
        "Implemented YOLO person detection and zone assignment",
        "Designed the decision engine for gate status, alerts and staff recommendations",
        "Built the Flask status API and the live dashboard"
      ],
      flow: ["Camera or video", "YOLO person detection", "Gate-zone status rules", "Live dashboard & alerts"],
      approach: [
        "Ultralytics YOLO detects people frame by frame",
        "Each detection’s centroid is mapped to one of four gate zones",
        "A decision engine assigns status, logs crowding and overflow alerts and estimates ETA",
        "Flask exposes the current state at /api/status",
        "An HTML dashboard polls the API every two seconds"
      ],
      capabilities: [
        "Person detection across four gate zones",
        "Four gate states with an alert log",
        "Staff redistribution recommendations",
        "Live status API and dashboard"
      ],
      decisions: [
        {
          title: "Vision over new hardware",
          body: "Computer vision on ordinary camera feeds instead of new sensors — cheaper to trial, and it works with the cameras a venue already has."
        },
        {
          title: "Recommend an action, not just an alarm",
          body: "The decision engine doesn’t only flag a busy gate; it suggests where to move staff, so the output is something an operator can act on."
        }
      ],
      outcome:
        "A working prototype built solo: detection, zone assignment, four status states, an alert log, staff recommendations, a status API and a live dashboard. It has not been calibrated against a real venue, and no counting-accuracy figure is claimed.",
      notClaimed: "No venue deployment and no counting-accuracy figures are claimed.",
      limitations: [
        "Gate zones are hard-coded and need calibration for every camera angle.",
        "No automated tests cover counting, alert thresholds or the API.",
        "Not deployment-ready: camera privacy, latency and operations still need review.",
        "Local model and video files make the repository large."
      ],
      next: [
        "Make gate zones configurable per camera",
        "Measure counting accuracy on labelled footage",
        "Add tests for thresholds and the status API"
      ]
    },
    ar: {
      descriptor: "نموذج أولي لمراقبة الحشود والبوابات",
      summary:
        "يقدّر عدد الأشخاص عند كل بوابة في الملعب من الفيديو، وينبّه إلى الازدحام مبكرًا، ويقترح أين يُعاد توزيع الموظفين.",
      domain: "الرؤية الحاسوبية · سلامة الحشود",
      role: "مطوّر منفرد",
      statusDetail:
        "نموذج أولي عامل بناه عبدالإله منفردًا، ويعمل على ملفات فيديو محلية أو كاميرا ويب. لم تتم معايرته في ملعب حقيقي.",
      context: "مشروع فردي بناه عبدالإله من البداية إلى النهاية.",
      problem:
        "يتحول الازدحام عند المداخل إلى خطر على السلامة قبل أن يحصيه أحد. يرى موظفو البوابة طابورهم فقط لا الصورة الكاملة، فيتأخر القرار المهم: نقل الموظفين أو تحويل القادمين.",
      constraints: [
        "استخدام كاميرات قائمة بدل حساسات جديدة",
        "مخرجات يستطيع المشغّل التصرف بناءً عليها فورًا",
        "يعمل محليًا على ملفات فيديو أو كاميرا ويب"
      ],
      solution:
        "يرصد YOLO الأشخاص في كل إطار ويوزعهم على أربع مناطق للبوابات، ثم يحدد محرك القرار حالة كل بوابة — طبيعية أو مزدحمة أو حرجة أو فائضة — ويسجل التنبيهات ويقدّر وقت الوصول ويقترح نقل الموظفين. وتعرض واجهة Flask هذه الحالة للوحة متابعة تتحدّث كل ثانيتين.",
      responsibilities: [
        "بنى النظام كاملًا في مشروع فردي",
        "نفّذ رصد الأشخاص عبر YOLO وتوزيعهم على المناطق",
        "صمّم محرك القرار لحالة البوابات والتنبيهات واقتراحات الموظفين",
        "بنى واجهة Flask للحالة ولوحة المتابعة الحيّة"
      ],
      flow: ["كاميرا أو فيديو", "رصد الأشخاص عبر YOLO", "قواعد حالة البوابات", "لوحة حيّة وتنبيهات"],
      approach: [
        "يرصد Ultralytics YOLO الأشخاص إطارًا بإطار",
        "يُنسب مركز كل رصد إلى إحدى مناطق البوابات الأربع",
        "يحدد محرك القرار الحالة ويسجل تنبيهات الازدحام والفيض ويقدّر وقت الوصول",
        "تعرض Flask الحالة الحالية عبر نقطة الحالة (api/status)",
        "تستعلم لوحة HTML عن الواجهة كل ثانيتين"
      ],
      capabilities: [
        "رصد الأشخاص في أربع مناطق للبوابات",
        "أربع حالات للبوابة مع سجل للتنبيهات",
        "اقتراحات لإعادة توزيع الموظفين",
        "واجهة برمجية للحالة ولوحة متابعة حيّة"
      ],
      decisions: [
        {
          title: "رؤية حاسوبية لا أجهزة جديدة",
          body: "رؤية حاسوبية على بث الكاميرات العادية بدل حساسات جديدة — أقل تكلفة في التجربة، وتعمل مع الكاميرات الموجودة أصلًا."
        },
        {
          title: "اقتراح إجراء لا مجرد إنذار",
          body: "لا يكتفي محرك القرار بتمييز البوابة المزدحمة، بل يقترح أين يُنقل الموظفون، فتكون المخرجات قابلة للتنفيذ مباشرة."
        }
      ],
      outcome:
        "نموذج أولي عامل بُني منفردًا: رصد وتوزيع على المناطق، وأربع حالات، وسجل تنبيهات، واقتراحات للموظفين، وواجهة برمجية للحالة، ولوحة متابعة حيّة. لم تتم معايرته في ملعب حقيقي، ولا تُدّعى أي نسبة لدقة العدّ.",
      notClaimed: "لا يُدّعى تشغيل في ملعب فعلي ولا أرقام لدقة العدّ.",
      limitations: [
        "مناطق البوابات مثبّتة في الكود وتحتاج معايرة لكل زاوية كاميرا.",
        "لا توجد اختبارات آلية للعدّ أو لعتبات التنبيه أو للواجهة البرمجية.",
        "غير جاهز للتشغيل: ما زالت خصوصية الكاميرات وزمن الاستجابة والتشغيل بحاجة إلى مراجعة.",
        "ملفات النماذج والفيديو المحلية تجعل المستودع كبير الحجم."
      ],
      next: [
        "جعل مناطق البوابات قابلة للضبط لكل كاميرا",
        "قياس دقة العدّ على لقطات موسومة",
        "إضافة اختبارات للعتبات ولواجهة الحالة"
      ]
    }
  },
  {
    slug: "qanouni",
    name: "Qanouni",
    year: "2024",
    status: "concept",
    evidenceType: "program-record",
    previewKind: "legal",
    technologies: ["Azure AI Services", "NLP", "Conversational design"],
    evidence: [ATHKAU_RECORD, NO_PUBLIC_CODE],
    en: {
      descriptor: "Labour-rights guidance concept",
      summary:
        "An AI advisor concept that explains labour rights and procedures to private-sector employees in plain language.",
      domain: "Legal tech · Employment",
      role: "AI developer & solution architect",
      statusDetail:
        "One of two ideas that took the team to the Top 30 of SDAIA × Microsoft’s AthkaU program. A concept — no public prototype is available.",
      context:
        "Developed as a program idea in SDAIA × Microsoft’s AthkaU, where it helped the team reach the Top 30 out of 80+ teams.",
      problem:
        "Private-sector employees often struggle to understand their labour rights, the procedures that apply to them and what to do next.",
      constraints: [
        "Guidance must never read as formal legal advice",
        "Plain language for people who are not lawyers",
        "Scoped within the AthkaU program"
      ],
      solution:
        "An advisor that maps a worker’s question to the relevant labour-law topic and explains rights, procedures and next steps in accessible language, designed around Azure AI language services.",
      responsibilities: [
        "Designed the advisor flow, from a worker’s question to plain-language next steps",
        "Mapped common employee needs into guidance scenarios",
        "Planned the Azure AI services and model integration",
        "Framed answers for responsible use: guidance, not formal legal advice"
      ],
      flow: ["Worker’s question", "Map to labour-law topic", "Azure AI language layer", "Plain-language next steps"],
      approach: [
        "Azure AI language services to understand employment questions",
        "A structured map of common labour-rights topics",
        "Guided conversation that ends in concrete next steps",
        "Responsible-use framing on every answer"
      ],
      capabilities: [
        "Labour-rights question answering (designed)",
        "Plain-language explanations (designed)",
        "Guided next steps (designed)"
      ],
      technologiesNote: "Planned stack for the concept; no implementation is published.",
      decisions: [
        {
          title: "Plain language over legal jargon",
          body: "Answers are structured to explain rights and next steps in language a non-lawyer can act on — the goal is clarity, not sounding legal."
        },
        {
          title: "Guidance, used responsibly",
          body: "Framed as a way to understand rights and procedures, never as a replacement for formal legal advice."
        }
      ],
      outcome:
        "Reached the Top 30 of the AthkaU program as one of the team’s two ideas. It remains a concept: there is no public prototype, and no users or accuracy results are claimed.",
      notClaimed: "No working prototype, users or accuracy results are claimed.",
      limitations: [
        "No public prototype or code to review.",
        "Not validated with legal professionals or real users.",
        "Legal guidance would need expert review and ongoing updates."
      ],
      next: [
        "Prototype answers grounded in the official labour-law text",
        "Review answers with employment-law practitioners",
        "Test clarity and trust with employees"
      ]
    },
    ar: {
      descriptor: "تصوّر لإرشاد العاملين بحقوقهم",
      summary:
        "تصوّر لمستشار ذكي يشرح لموظفي القطاع الخاص حقوقهم العمالية وإجراءاتها بلغة واضحة.",
      domain: "التقنية القانونية · بيئة العمل",
      role: "مطوّر ذكاء اصطناعي ومصمّم حلول",
      statusDetail:
        "إحدى فكرتين أوصلتا الفريق إلى أفضل 30 فريقًا في برنامج AthkaU من سدايا ومايكروسوفت. تصوّر — لا يتوفر نموذج أولي منشور.",
      context:
        "طُوّرت فكرةً ضمن برنامج AthkaU من سدايا ومايكروسوفت، وأسهمت في وصول الفريق إلى أفضل 30 من أكثر من 80 فريقًا.",
      problem:
        "يجد كثير من موظفي القطاع الخاص صعوبة في فهم حقوقهم العمالية والإجراءات التي تنطبق عليهم وما ينبغي فعله بعد ذلك.",
      constraints: [
        "ألا يُفهم الإرشاد على أنه استشارة قانونية رسمية",
        "لغة واضحة لغير المختصين",
        "ضمن نطاق برنامج AthkaU"
      ],
      solution:
        "مستشار يربط سؤال الموظف بموضوع نظام العمل المناسب، ويشرح الحقوق والإجراءات والخطوات التالية بلغة ميسّرة، ومصمَّم حول خدمات Azure AI اللغوية.",
      responsibilities: [
        "صمّم مسار المستشار من سؤال الموظف إلى خطوات واضحة",
        "حوّل الاحتياجات الشائعة للموظفين إلى سيناريوهات إرشاد",
        "خطّط لخدمات Azure AI وتكامل النماذج",
        "صاغ الإجابات للاستخدام المسؤول: إرشاد لا استشارة قانونية رسمية"
      ],
      flow: ["سؤال الموظف", "ربطه بموضوع نظام العمل", "طبقة Azure AI اللغوية", "خطوات تالية بلغة واضحة"],
      approach: [
        "خدمات Azure AI اللغوية لفهم أسئلة العمل",
        "خريطة منظمة لموضوعات الحقوق العمالية الشائعة",
        "محادثة موجّهة تنتهي بخطوات عملية",
        "تنبيه للاستخدام المسؤول في كل إجابة"
      ],
      capabilities: [
        "الإجابة عن أسئلة الحقوق العمالية (تصميمًا)",
        "شرح بلغة واضحة (تصميمًا)",
        "خطوات تالية موجّهة (تصميمًا)"
      ],
      technologiesNote: "تقنيات مخطط لها ضمن التصوّر، ولا يوجد تنفيذ منشور.",
      decisions: [
        {
          title: "لغة واضحة لا مصطلحات قانونية",
          body: "تُبنى الإجابات لشرح الحقوق والخطوات التالية بلغة يستطيع غير المختص التصرف بها — الهدف الوضوح لا الأسلوب القانوني."
        },
        {
          title: "إرشاد يُستخدم بمسؤولية",
          body: "يُقدَّم وسيلةً لفهم الحقوق والإجراءات، ولا يحل محل الاستشارة القانونية الرسمية."
        }
      ],
      outcome:
        "وصلت الفكرة إلى أفضل 30 في برنامج AthkaU ضمن فكرتي الفريق. وما تزال تصوّرًا: لا يوجد نموذج أولي منشور، ولا يُدّعى وجود مستخدمين أو نتائج دقة.",
      notClaimed: "لا يُدّعى وجود نموذج عامل أو مستخدمين أو نتائج دقة.",
      limitations: [
        "لا يوجد نموذج أولي أو كود منشور للمراجعة.",
        "لم يُختبر مع مختصين قانونيين أو مستخدمين فعليين.",
        "يحتاج الإرشاد القانوني إلى مراجعة متخصصة وتحديث مستمر."
      ],
      next: [
        "بناء نموذج أولي تستند إجاباته إلى نص نظام العمل الرسمي",
        "مراجعة الإجابات مع ممارسين في قانون العمل",
        "اختبار الوضوح والثقة مع موظفين فعليين"
      ]
    }
  },
  {
    slug: "virtual-astronauts",
    name: "Virtual Astronauts",
    year: "2024",
    status: "concept",
    evidenceType: "program-record",
    previewKind: "vr",
    technologies: ["VR", "Generative AI", "Learning design"],
    evidence: [ATHKAU_RECORD, NO_PUBLIC_CODE],
    en: {
      descriptor: "VR and AI learning concept",
      summary:
        "An immersive VR concept in which AI-generated narration helps learners explore space science.",
      domain: "Education · VR",
      role: "AI model developer",
      statusDetail:
        "One of two ideas that took the team to the Top 30 of SDAIA × Microsoft’s AthkaU program. A concept — no public prototype is available.",
      context:
        "Developed as a program idea in SDAIA × Microsoft’s AthkaU, alongside Qanouni.",
      problem:
        "Science education can feel static, especially for topics as hard to picture as space and astronomy.",
      constraints: [
        "AI-generated content has to stay scientifically accurate",
        "The experience should teach, not only impress",
        "Scoped within the AthkaU program"
      ],
      solution:
        "A VR environment where learners explore the universe while AI generates narration and learning content that follows what they look at.",
      responsibilities: [
        "Shaped how the AI generates and narrates learning content",
        "Aligned AI output with the VR learning journey",
        "Contributed to the experience design"
      ],
      flow: ["VR environment", "AI content engine", "Dynamic narration", "Guided exploration"],
      approach: [
        "A VR scene for exploring planets and space phenomena",
        "Generative AI for narration and learning content",
        "Content aligned with learning goals",
        "Experience design aimed at engagement and recall"
      ],
      capabilities: [
        "Immersive exploration (designed)",
        "AI-generated narration (designed)",
        "Guided learning path (designed)"
      ],
      technologiesNote: "Planned stack for the concept; no VR build is published.",
      decisions: [
        {
          title: "Immersion over lecture",
          body: "An explorable environment so learners experience the universe directly, instead of reading about it and hoping it sticks."
        },
        {
          title: "Living, AI-generated content",
          body: "AI generates narration that follows the learner, so the experience stays responsive rather than a fixed script."
        }
      ],
      outcome:
        "Reached the Top 30 of AthkaU alongside Qanouni. No working VR build is publicly available, and no learning outcomes are claimed.",
      notClaimed: "No working VR build and no learning outcomes are claimed.",
      limitations: [
        "No public prototype or VR build.",
        "Learning impact has not been measured.",
        "AI-generated science content would need expert review for accuracy."
      ],
      next: [
        "Prototype one guided lesson for a standalone headset or WebXR",
        "Check narration against curated science sources",
        "Test with students and teachers"
      ]
    },
    ar: {
      descriptor: "تصوّر تعليمي بالواقع الافتراضي والذكاء الاصطناعي",
      summary:
        "تصوّر لتجربة واقع افتراضي غامرة يساعد فيها سرد يولّده الذكاء الاصطناعي على استكشاف علوم الفضاء.",
      domain: "التعليم · الواقع الافتراضي",
      role: "مطوّر نماذج الذكاء الاصطناعي",
      statusDetail:
        "إحدى فكرتين أوصلتا الفريق إلى أفضل 30 فريقًا في برنامج AthkaU من سدايا ومايكروسوفت. تصوّر — لا يتوفر نموذج أولي منشور.",
      context: "طُوّرت فكرةً ضمن برنامج AthkaU من سدايا ومايكروسوفت، إلى جانب Qanouni.",
      problem:
        "قد يبدو تعليم العلوم جامدًا، خصوصًا في موضوعات يصعب تخيّلها مثل الفضاء والفلك.",
      constraints: [
        "أن يبقى المحتوى المولَّد دقيقًا علميًا",
        "أن تُعلِّم التجربة لا أن تُبهر فقط",
        "ضمن نطاق برنامج AthkaU"
      ],
      solution:
        "بيئة واقع افتراضي يستكشف فيها المتعلم الكون بينما يولّد الذكاء الاصطناعي سردًا ومحتوى تعليميًا يتبع ما ينظر إليه.",
      responsibilities: [
        "صمّم طريقة توليد الذكاء الاصطناعي للمحتوى التعليمي وسرده",
        "واءم مخرجات الذكاء الاصطناعي مع رحلة التعلم في الواقع الافتراضي",
        "ساهم في تصميم التجربة"
      ],
      flow: ["بيئة الواقع الافتراضي", "محرك المحتوى الذكي", "سرد متجدد", "استكشاف موجّه"],
      approach: [
        "مشهد واقع افتراضي لاستكشاف الكواكب والظواهر الفضائية",
        "ذكاء اصطناعي توليدي للسرد والمحتوى التعليمي",
        "محتوى متوائم مع أهداف التعلم",
        "تصميم تجربة يستهدف التفاعل والتذكر"
      ],
      capabilities: [
        "استكشاف غامر (تصميمًا)",
        "سرد يولّده الذكاء الاصطناعي (تصميمًا)",
        "مسار تعلم موجّه (تصميمًا)"
      ],
      technologiesNote: "تقنيات مخطط لها ضمن التصوّر، ولا توجد نسخة واقع افتراضي منشورة.",
      decisions: [
        {
          title: "الانغماس بدل المحاضرة",
          body: "بيئة قابلة للاستكشاف يعيش فيها المتعلم الكون مباشرة بدل أن يقرأ عنه ويأمل أن يتذكر."
        },
        {
          title: "محتوى حيّ يولّده الذكاء الاصطناعي",
          body: "يولّد الذكاء الاصطناعي سردًا يتبع المتعلم، فتبقى التجربة متفاعلة لا نصًا ثابتًا."
        }
      ],
      outcome:
        "وصلت الفكرة إلى أفضل 30 في برنامج AthkaU إلى جانب Qanouni. لا توجد نسخة واقع افتراضي عاملة منشورة، ولا تُدّعى نتائج تعليمية.",
      notClaimed: "لا يُدّعى وجود نسخة عاملة ولا نتائج تعليمية.",
      limitations: [
        "لا يوجد نموذج أولي أو نسخة واقع افتراضي منشورة.",
        "لم يُقَس الأثر التعليمي.",
        "يحتاج المحتوى العلمي المولَّد إلى مراجعة متخصصة لضمان دقته."
      ],
      next: [
        "بناء درس موجّه واحد لنظارة مستقلة أو عبر WebXR",
        "مطابقة السرد مع مصادر علمية منتقاة",
        "التجربة مع طلاب ومعلمين"
      ]
    }
  },
  {
    slug: "medad",
    name: "Medad",
    year: "2025",
    status: "concept",
    evidenceType: "private-evidence",
    previewKind: "fintech",
    technologies: ["Power BI", "Data visualisation", "AI analytics"],
    evidence: [NO_PUBLIC_CODE],
    en: {
      descriptor: "Inclusive banking concept",
      summary:
        "A banking app concept that turns spending data into clear, personalised guidance for underserved users.",
      domain: "Fintech · Financial inclusion",
      role: "AI & dashboard developer",
      statusDetail: "A product concept with dashboard designs. No public prototype is available.",
      context: "A 2025 product concept exploring financial inclusion through AI-driven guidance.",
      problem:
        "Underserved communities face barriers to financial services and rarely get guidance that fits their situation.",
      constraints: [
        "Designed for people with limited financial literacy",
        "Guidance must stay understandable — insight, not raw numbers",
        "Concept stage: no live banking data"
      ],
      solution:
        "A banking app concept that uses AI-driven insights, dashboards and personalised recommendations to make financial guidance approachable.",
      responsibilities: [
        "Contributed to the design of AI-driven insights",
        "Built dashboard concepts for decision visibility",
        "Supported the data visualisation and recommendation logic",
        "Connected product goals with the needs of inclusive users"
      ],
      flow: ["Spending data", "AI analytics", "Personalised insight", "Inclusive guidance"],
      approach: [
        "AI analytics to find patterns in spending behaviour",
        "Power BI dashboards for decision visibility",
        "Visualisations designed for low financial literacy",
        "Platform architecture planned to scale"
      ],
      capabilities: [
        "Personalised recommendations (designed)",
        "Insight dashboards (designed)",
        "Inclusive banking flows (designed)"
      ],
      technologiesNote: "Dashboards and analytics were designed as concepts; no implementation is published.",
      decisions: [
        {
          title: "Inclusion first",
          body: "Designed around the users who are usually an afterthought in banking products — the people who need guidance the most."
        },
        {
          title: "Insight over raw data",
          body: "Analytics are turned into clear, personalised recommendations instead of numbers people have to decode."
        }
      ],
      outcome:
        "Dashboard and recommendation concepts for an inclusive banking experience. There is no public prototype, and no users, adoption or financial outcomes are claimed.",
      notClaimed: "No working app, users or financial outcomes are claimed.",
      limitations: [
        "No public prototype or code.",
        "Recommendations have not been validated with real users or real financial data.",
        "Regulatory and data-protection requirements have not been worked through."
      ],
      next: [
        "Prototype the guidance flow with synthetic transactions",
        "Test wording and trust with target users",
        "Review against banking regulations before any real data is used"
      ]
    },
    ar: {
      descriptor: "تصوّر لخدمات مصرفية شاملة",
      summary:
        "تصوّر لتطبيق مصرفي يحوّل بيانات الإنفاق إلى إرشاد واضح ومخصّص للفئات الأقل حصولًا على الخدمات المالية.",
      domain: "التقنية المالية · الشمول المالي",
      role: "مطوّر ذكاء اصطناعي ولوحات معلومات",
      statusDetail: "تصوّر منتج مع تصاميم للوحات المعلومات. لا يتوفر نموذج أولي منشور.",
      context: "تصوّر منتج في عام 2025 يستكشف الشمول المالي عبر إرشاد مدعوم بالذكاء الاصطناعي.",
      problem:
        "تواجه الفئات الأقل حظًا عوائق في الوصول إلى الخدمات المالية، ونادرًا ما تحصل على إرشاد يناسب وضعها.",
      constraints: [
        "مصمَّم لمستخدمين ذوي ثقافة مالية محدودة",
        "أن يبقى الإرشاد مفهومًا — رؤى لا أرقام خام",
        "مرحلة تصوّر: لا بيانات مصرفية حقيقية"
      ],
      solution:
        "تصوّر لتطبيق مصرفي يستخدم رؤى مدعومة بالذكاء الاصطناعي ولوحات معلومات وتوصيات مخصصة لتقريب الإرشاد المالي من الناس.",
      responsibilities: [
        "ساهم في تصميم الرؤى المدعومة بالذكاء الاصطناعي",
        "صمّم نماذج للوحات المعلومات لتوضيح القرارات",
        "دعم منطق عرض البيانات والتوصيات",
        "ربط أهداف المنتج باحتياجات المستخدمين المستهدفين"
      ],
      flow: ["بيانات الإنفاق", "تحليلات ذكية", "رؤية مخصّصة", "إرشاد شامل"],
      approach: [
        "تحليلات ذكية لاكتشاف أنماط الإنفاق",
        "لوحات Power BI لتوضيح القرارات",
        "عروض بصرية مصممة لذوي الثقافة المالية المحدودة",
        "بنية منصة مخطط لها لتتوسع"
      ],
      capabilities: [
        "توصيات مخصّصة (تصميمًا)",
        "لوحات رؤى (تصميمًا)",
        "مسارات مصرفية شاملة (تصميمًا)"
      ],
      technologiesNote: "صُممت اللوحات والتحليلات بوصفها تصوّرًا، ولا يوجد تنفيذ منشور.",
      decisions: [
        {
          title: "الشمول أولًا",
          body: "صُمّم حول المستخدمين الذين تغفلهم المنتجات المصرفية غالبًا — وهم الأحوج إلى الإرشاد."
        },
        {
          title: "رؤى لا بيانات خام",
          body: "تتحول التحليلات إلى توصيات واضحة ومخصّصة بدل أرقام يُطلب من الناس فك رموزها."
        }
      ],
      outcome:
        "تصاميم للوحات المعلومات والتوصيات لتجربة مصرفية شاملة. لا يوجد نموذج أولي منشور، ولا يُدّعى وجود مستخدمين أو انتشار أو نتائج مالية.",
      notClaimed: "لا يُدّعى وجود تطبيق عامل أو مستخدمين أو نتائج مالية.",
      limitations: [
        "لا يوجد نموذج أولي أو كود منشور.",
        "لم تُختبر التوصيات مع مستخدمين أو بيانات مالية حقيقية.",
        "لم تُدرس بعد المتطلبات التنظيمية وحماية البيانات."
      ],
      next: [
        "بناء نموذج لمسار الإرشاد باستخدام معاملات اصطناعية",
        "اختبار الصياغة والثقة مع المستخدمين المستهدفين",
        "المراجعة وفق الأنظمة المصرفية قبل استخدام أي بيانات حقيقية"
      ]
    }
  }
];

function localize(record: ProjectRecord, locale: Locale): LocalizedProject {
  const text = record[locale];
  const name = record.localName?.[locale] ?? record.name;
  const names = [record.name, ...Object.values(record.localName ?? {})];
  const altName = names.find((candidate) => candidate !== name);

  return {
    ...text,
    slug: record.slug,
    name,
    altName,
    keywords: record.keywords ?? [],
    title: `${name} — ${text.descriptor}`,
    year: record.year,
    status: record.status,
    evidenceType: record.evidenceType,
    featured: Boolean(record.featured),
    previewKind: record.previewKind,
    technologies: record.technologies,
    links: record.links ?? {},
    evidence: record.evidence.map((item) => ({
      kind: item.kind,
      href: item.href,
      label: item.label[locale],
      detail: item.detail[locale]
    })),
    locale
  };
}

const cache = new Map<Locale, LocalizedProject[]>();

export function getProjects(locale: Locale = "en") {
  const cached = cache.get(locale);

  if (cached) {
    return cached;
  }

  const localized = records.map((record) => localize(record, locale));

  cache.set(locale, localized);

  return localized;
}

export function getProject(slug: string, locale: Locale = "en") {
  return getProjects(locale).find((project) => project.slug === slug);
}

export function getFeaturedProjects(locale: Locale = "en") {
  return getProjects(locale).filter((project) => project.featured);
}

export const projectSlugs = records.map((record) => record.slug);

export const projectCounts = {
  total: records.length,
  prototypes: records.filter((record) => record.status !== "concept").length,
  concepts: records.filter((record) => record.status === "concept").length,
  publicRepositories: records.filter((record) => Boolean(record.links?.github)).length
};

/**
 * English view kept in the shape the guide's server logic already reads
 * (`title` split on " - ", `category`, `shortDescription`, …), so the agent
 * speaks from exactly the same facts as the pages.
 */
export type Project = LocalizedProject & {
  category: string;
  shortDescription: string;
  impact: string;
  technicalApproach: string[];
  features: string[];
  tagline: string;
  lessons?: string;
};

export const projects: Project[] = getProjects("en").map((project) => ({
  ...project,
  title: `${project.name} - ${project.descriptor}`,
  category: project.domain,
  shortDescription: project.summary,
  impact: project.outcome,
  technicalApproach: project.approach,
  features: project.capabilities,
  tagline: project.summary,
  lessons: project.lesson
}));

export function getProjectBySlug(slug: string) {
  return projects.find((project) => project.slug === slug);
}
