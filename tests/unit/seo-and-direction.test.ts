import { describe, expect, it } from "vitest";
import sitemap from "@/app/sitemap";
import { createPageMetadata } from "@/lib/metadata";
import { getTextDirection } from "@/lib/text-direction";

describe("metadata", () => {
  it("sets canonical and hreflang alternates for both languages", () => {
    const metadata = createPageMetadata({ locale: "ar", title: "المشاريع", description: "…", path: "/projects" });

    expect(metadata.alternates?.canonical).toBe("https://www.abdulelah.de/ar/projects");
    expect(metadata.alternates?.languages).toEqual({
      en: "https://www.abdulelah.de/projects",
      ar: "https://www.abdulelah.de/ar/projects",
      "x-default": "https://www.abdulelah.de/projects"
    });
    expect(metadata.openGraph).toMatchObject({ locale: "ar_SA" });
  });

  it("lists every page in both languages in the sitemap", () => {
    const entries = sitemap();
    const urls = entries.map((entry) => entry.url);

    expect(urls).toContain("https://www.abdulelah.de/projects/stadium");
    expect(urls).toContain("https://www.abdulelah.de/ar/projects/stadium");
    expect(new Set(urls).size).toBe(urls.length);
    expect(urls.some((url) => url.includes("status-404") || url.includes("/contact/sent"))).toBe(false);

    for (const entry of entries) {
      expect(entry.alternates?.languages).toHaveProperty("ar");
      expect(entry.alternates?.languages).toHaveProperty("en");
    }
  });
});

describe("text direction", () => {
  it("keeps English answers left-to-right even when they mention the Arabic name", () => {
    expect(getTextDirection("Abdulelah Alkhathami (عبدالإله الخثعمي) builds applied AI prototypes.")).toBe("ltr");
  });

  it("lays out Arabic answers right-to-left even when they start with a project name", () => {
    expect(getTextDirection("ChatUB هو مساعد أكاديمي عربي يعمل محليًا ويستخدم Flask و Ollama")).toBe("rtl");
  });
});
