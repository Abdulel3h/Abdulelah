import { describe, expect, it } from "vitest";
import { getAchievements, getAchievementsByYear } from "@/data/achievements";
import { getProject } from "@/data/projects";

describe("recognition records", () => {
  it("give every record an outcome in both languages", () => {
    for (const locale of ["en", "ar"] as const) {
      for (const item of getAchievements(locale)) {
        expect(item.outcome.length).toBeGreaterThan(5);
        expect(item.organization.length).toBeGreaterThan(2);
      }
    }
  });

  it("link only to case studies that exist", () => {
    for (const item of getAchievements("en")) {
      for (const slug of item.projects) {
        expect(getProject(slug, "en"), slug).toBeDefined();
      }
    }

    const intelligentPlanet = getAchievements("en").find((item) => item.title === "Intelligent Planet Hackathon");
    expect(intelligentPlanet?.projects).toEqual(["althil"]);
  });

  it("list the newest first", () => {
    const years = getAchievementsByYear("en").map((item) => Number(item.year));
    expect(years).toEqual([...years].sort((a, b) => b - a));
  });

  it("never upgrade a result beyond the record", () => {
    const text = JSON.stringify(getAchievements("en"));
    expect(text).not.toMatch(/\bwon\b|\bwinner\b|first place|national finalist/i);
  });
});
