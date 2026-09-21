// The App Router renders with the React 19 build that ships inside Next.js,
// while the installed type packages are React 18. These references expose the
// React 19 APIs this app relies on (the `inert` attribute and resource
// preloading) so they type-check against the runtime that actually runs them.
/// <reference types="react/experimental" />
/// <reference types="react-dom/canary" />
