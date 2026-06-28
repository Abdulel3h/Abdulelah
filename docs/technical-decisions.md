# Technical Decisions

| Decision | Rationale | Tradeoff |
| --- | --- | --- |
| Use Next.js App Router | Matches a modern portfolio with pages, metadata, API routes, and deployability. | Requires careful server/client boundaries. |
| Centralize portfolio facts in `/data` | Keeps website copy, SEO, project pages, and assistant context aligned. | Data changes need review because they affect multiple surfaces. |
| Keep assistant responses constrained | Reduces hallucinated portfolio claims. | Assistant is less flexible than a general chatbot. |
| Make external services optional | The site can run locally without paid API keys. | Degraded behavior must stay documented and tested. |
