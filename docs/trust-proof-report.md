# Trust & Proof Report — Internal

> Internal audit only. Not served by the app (lives in `docs/`, outside `app/`).
> Last run: 2026-06-28 · GitHub account: https://github.com/Abdulel3h

Verification rule: a repository is linked on the public site **only** at ≥90%
confidence, after a quality audit, and only if it is suitable for public
presentation. Nothing is fabricated.

## Final-phase update (launch readiness)
- **Stadium** was promoted to a real project and linked → `github.com/Abdulel3h/Stadium` (100% — his own solo build). So **3 repos are now linked**: ChatUB, Absher Insight AI, Stadium.
- Public proof shown = only verified GitHub source links (Evidence section renders only when a repo exists). No demo links shown (none verified). No fabricated metrics — project "metrics" are qualitative signals, not invented numbers.
- **Still missing real assets (do not surface until provided):** Althil repo, Qanouni repo, live demos for any project, screenshots/GIFs in the linked repos, LICENSE files in ChatUB/absher-insight/Stadium, Medad repo confirmation (midad-landing). `Stadium` candidate `architect-of-intelligence` (has a live demo) remains a future portfolio addition.

## Per-project verification

| Project | Repo | Confidence | Quality | Public URL | Linked? |
|---|---|---|---|---|---|
| ChatUB | `ChatUB` | 99% | 7.5/10 | https://github.com/Abdulel3h/ChatUB | ✅ Yes |
| Absher Insight AI | `absher-insight` | 98% | 7.5/10 | https://github.com/Abdulel3h/absher-insight | ✅ Yes |
| Medad | `midad-landing` | ~85% | not audited | https://github.com/Abdulel3h/midad-landing | ⚠️ Needs verification |
| Virtual Astronauts | `example` | ~90% (identity) | ~3/10 | https://github.com/Abdulel3h/example | ❌ Not suitable |
| Althil | — | — | — | — | ❌ No repo found |
| Qanouni | — | — | — | — | ❌ No repo found |

### ChatUB → ChatUB ✅ LINKED
- Exact name match; description "Local Arabic AI academic assistant using semantic search, university FAQ data, Flask, and Ollama" matches the project precisely. Topics: arabic-nlp, local-ai, ollama, semantic-search, education-technology.
- README: overview, features, architecture diagram, tech stack, install, usage (curl), folder structure, challenges, future work. Python (Flask, SentenceTransformers, PyTorch, NLTK, Ollama). 6 commits, 1 star.
- **Missing:** LICENSE; real screenshots/demo GIF; live deployment; automated tests.

### Absher Insight AI → absher-insight ✅ LINKED
- Description "AI security analytics prototype with FastAPI, behavioral rules, synthetic data, dashboard concepts" matches (UEBA, anomaly detection, synthetic data). Repo homepage points to `/projects/absher-insight-ai`.
- README: overview, features (`/predict` API), architecture, tech stack (FastAPI, Pydantic, scikit-learn), install, usage, screenshots referenced, challenges/future work.
- **Missing:** LICENSE; live demo; persistence (in-memory only).

### Medad → midad-landing ⚠️ NEEDS VERIFICATION (not linked)
- `midad-landing` ("Next.js Arabic financial-inclusion landing prototype with accessible banking assistant concept") is a strong thematic match for Medad (financial inclusion banking).
- Held back because: (a) name spelling differs (Medad vs Midad/مداد), (b) three similar repos exist — `midad-landing` (live prototype), `midad` (scaffold, archive-candidate), `madad` (static, archive-candidate). Per the ≥90%/no-guessing rule, do not link until confirmed.
- **Action:** confirm `midad-landing` is the canonical Medad repo, then audit its README and link.

### Virtual Astronauts → example ❌ NOT SUITABLE
- `example` ("Early Virtual Astronaut static mockup; archive or rebuild as full AI/VR case study") is the same project but is an early static mockup, archive-candidate, with a non-credible repo name.
- **Action:** rebuild as a real AI/VR case-study repo (rename), or leave unlinked. Do not surface in current state.

### Althil ❌ NO REPO
- No repository found for the urban thermal-comfort / Google Cloud project.
- **Action:** if a repo exists privately or under another account, share it; otherwise the project stands on its case study (hackathon: KFUPM × Google Cloud, real).

### Qanouni ❌ NO REPO
- No repository found for the AI legal advisor (Azure AI) project.
- **Action:** share a repo if one exists; otherwise leave as case study only.

## Repositories NOT in the portfolio (candidates / out of scope)
- `Stadium` — computer-vision stadium gate monitor (YOLO/OpenCV/Flask). Real, looks substantial — **candidate for a new portfolio project.**
- `architect-of-intelligence` — AI infra platform prototype (TanStack Start), has a live Vercel demo. **Candidate.**
- `alpha-ai-innovations` — Arabic AI advisory site, live Vercel demo. Possibly not portfolio-grade.
- `Abdulelah` — this website's repo. `Abdulel3h` — profile README.
- Archive candidates (do not surface): `midad`, `madad`, `LearnEnglish`, `FlowerDatabase`, `ex-1`, `EtecResults`, `ali2`, `Ali`, `Data-Structures-Project`.

## Recommended next actions (priority order)
1. Confirm Medad → `midad-landing`; then link.
2. Add a LICENSE (e.g. MIT) to ChatUB and absher-insight — removes legal ambiguity, raises credibility.
3. Add real screenshots / a short demo GIF to ChatUB and absher-insight READMEs.
4. Decide on Althil/Qanouni repos (publish or leave as case studies).
5. Consider promoting `Stadium` and `architect-of-intelligence` to portfolio projects (both real, the latter has a live demo).
6. Rebuild/rename `example` before surfacing Virtual Astronauts source.
