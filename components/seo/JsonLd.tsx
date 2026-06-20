/**
 * Renders a JSON-LD structured-data script tag.
 * Escaping "<" prevents premature </script> termination — the pattern
 * recommended by the Next.js docs for JSON-LD.
 */
export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c")
      }}
    />
  );
}
