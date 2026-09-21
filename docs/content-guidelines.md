# Content Guidelines

Rules that keep the site credible, consistent and bilingual. They apply to page copy, project data, the guide's answers and metadata.

## Evidence and status

Every project in `data/projects.ts` carries one status. Never pick a stronger status than the evidence supports.

| Status | Use only when | Current projects |
| --- | --- | --- |
| Live / In production / Pilot | Real users or a real deployment can be shown | none |
| Working prototype | Runnable code exists and can be inspected or demonstrated | Stadium |
| Graduation project | Academic project that reached a working prototype | ChatUB |
| Hackathon prototype | Built during a hackathon; working code exists | Absher Insight AI, Althil |
| Concept | Designed or pitched, no working build is available | Qanouni, Virtual Astronauts, Medad |

Evidence types shown on cards and case studies:

- **Public repository** — linked GitHub repository (ChatUB, absher-insight, Stadium). Say "public code" or "public repository", never "open source": the repositories have no licence file.
- **Program record** — the achievement is documented (e.g. AthkaU Top 30), but no code is public.
- **Private project evidence** — work exists but is not published; nothing is linked.

Every case study states what is **not claimed** (deployment, users, accuracy). No invented metrics, rankings, users or outcomes. The code-drawn previews are always captioned **Concept visualization** and contain no measured numbers.

Verification sources used for the September 2026 audit: the public READMEs of `Abdulel3h/ChatUB`, `Abdulel3h/absher-insight` and `Abdulel3h/Stadium` (each states "Status: prototype"), `data/achievements.ts` for program records, and the private Althil code, which shows a FastAPI backend containerised for Cloud Run with sun-path, heat and imagery analysis. The BigQuery, Cloud Storage and Vertex AI parts of the Althil design could not be verified and are described as design only.

## Terminology

- **Resume** names the page and its navigation item. **CV** names the two downloadable documents: *AI Engineer CV* and *AI Specialist CV*. "Résumé" is not used.
- **Abdulelah's guide** / **دليل عبدالإله** is the AI assistant; its launcher reads **Ask Abdulelah** / **اسأل عبدالإله**.
- **Notes** / **ملاحظات** is the blog; its URL stays `/blog`.
- Positioning line: **AI Product Builder · Agents, RAG & Arabic AI**.
- Availability: **Open to AI engineering roles & collaborations**.

## Arabic

- Modern Standard Arabic for the interface and pages; the Notes keep their existing Najdi-professional voice.
- Project, product and technology names stay in Latin script (ChatUB, Google Cloud, RAG).
- Western digits (0–9) throughout, matching the English pages and the CVs.
- Arabic pages set `lang="ar"` and `dir="rtl"` on `<html>`. Arabic inside English pages uses `lang="ar" dir="rtl"` (inline: `<bdi>`); email addresses and code use `dir="ltr"`. User-entered text uses `dir="auto"`.
- Layout uses logical properties (`ms-`, `pe-`, `start-`, `text-start`); arrows that express direction mirror with `rtl:-scale-x-100`.

## Accessibility and motion

- Text colours: `paper` (≈17:1), `paper-dim` (≈8:1), `paper-faint` (≈5.4:1) on the ink surfaces. Do not use lower-contrast opacity text for anything a visitor needs to read.
- Essential content never starts hidden: no `opacity: 0` first states, no JavaScript-gated reveals above the fold. Scroll reveals (`<Reveal>`) only hide content that is below the fold after hydration and always show it on focus.
- Every page ends with at most one closing call to action; the footer carries none.
- Analytics events never include names, emails, message text or guide questions.
