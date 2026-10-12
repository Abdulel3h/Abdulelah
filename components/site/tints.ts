/**
 * Each project's world, in both languages: one tint (as "r g b") used for a
 * soft wash behind its sketch and for its small markers. The brass stays the
 * interface accent; tints never carry meaning on their own. Every tint clears
 * 4.5:1 as text on the ink surface.
 */
export const projectTints: Record<string, string> = {
  // A muted take on the teal of Raqmi’s own branding: the threshold.
  raqmi: "106 192 174",
  // A local Arabic assistant: the brass of the page itself.
  chatub: "201 167 92",
  // Midday sun over a street.
  althil: "227 160 79",
  // The site's own "critical" signal colour.
  "absher-insight-ai": "229 129 107",
  // Pitch green under floodlights.
  stadium: "125 179 122",
  // Concepts stay muted: paper, dusk and ink-gold.
  qanouni: "200 190 165",
  "virtual-astronauts": "168 176 192",
  medad: "198 178 128"
};

export function tintOf(slug: string) {
  return projectTints[slug] ?? projectTints.chatub;
}
