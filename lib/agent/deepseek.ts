const DEEPSEEK_API_URL = "https://api.deepseek.com/chat/completions";
const REQUEST_TIMEOUT_MS = 12_000;

type DeepSeekCompletion = {
  choices?: {
    message?: {
      content?: string;
    };
  }[];
};

export class DeepSeekRequestError extends Error {
  constructor() {
    super("DeepSeek request failed");
    this.name = "DeepSeekRequestError";
  }
}

export function hasDeepSeekApiKey() {
  return Boolean(process.env.DEEPSEEK_API_KEY?.trim());
}

export async function askDeepSeek(userMessage: string, portfolioContext: string) {
  const apiKey = process.env.DEEPSEEK_API_KEY?.trim();

  if (!apiKey) {
    throw new DeepSeekRequestError();
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  const systemPrompt = [
    "You are Abdulelah AI Navigator.",
    "You help recruiters, hiring managers, and portfolio visitors explore Abdulelah Alkhathami's portfolio.",
    "Answer only using the provided portfolio context.",
    "If information is not available in the context, say that clearly.",
    "Do not invent jobs, clients, metrics, employment history, or seniority.",
    "Position Abdulelah as a Junior AI Engineer, AI Solutions Specialist, applied AI builder, Information Systems graduate, project leader, and hackathon-tested AI talent.",
    "Do not call him an expert, senior engineer, founder, or employee of organizations unless the context explicitly says so.",
    "Keep answers concise, professional, and recruiter-friendly.",
    "When relevant, suggest a next step such as reviewing a project, resume, skills, or contact page. The interface will render the action buttons.",
    "",
    "PORTFOLIO CONTEXT",
    portfolioContext
  ].join("\n");

  try {
    const response = await fetch(DEEPSEEK_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: process.env.DEEPSEEK_MODEL?.trim() || "deepseek-chat",
        messages: [
          {
            role: "system",
            content: systemPrompt
          },
          {
            role: "user",
            content: userMessage
          }
        ],
        max_tokens: 500,
        temperature: 0.2,
        stream: false
      }),
      cache: "no-store",
      signal: controller.signal
    });

    if (!response.ok) {
      throw new DeepSeekRequestError();
    }

    const completion = (await response.json()) as DeepSeekCompletion;
    const answer = completion.choices?.[0]?.message?.content?.trim();

    if (!answer) {
      throw new DeepSeekRequestError();
    }

    return answer;
  } catch {
    throw new DeepSeekRequestError();
  } finally {
    clearTimeout(timeout);
  }
}
