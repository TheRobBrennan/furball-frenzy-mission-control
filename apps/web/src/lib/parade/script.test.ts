import { existsSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { nextScene, paradeAudio, paradeImage, paradeScenes, previousScene } from "./script";

describe("parade script", () => {
  it("is led by Piggy, and shows nothing ahead of its turn", () => {
    expect(paradeScenes[0].id).toBe("piggy-hamley");
    expect(paradeScenes.map((s) => s.id)).not.toContain("whole-parade");
  });

  it("closes with the American Space Program, in Santa's spot", () => {
    expect(paradeScenes.slice(-2).map((s) => s.id)).toEqual(["space-program", "moon-float"]);
    expect(paradeScenes.at(-1)?.caption).toContain("Safety and silliness first!");
  });

  it("has a picture for every scene, and runs about a minute", () => {
    expect(new Set(paradeScenes.map((s) => s.id)).size).toBe(paradeScenes.length);
    for (const scene of paradeScenes) expect(existsSync(join(process.cwd(), "public", paradeImage(scene)))).toBe(true);
    const seconds = paradeScenes.reduce((n, s) => n + s.ms, 0) / 1000;
    expect(seconds).toBeGreaterThan(45);
    expect(seconds).toBeLessThan(70);
  });

  it("has a recording for every scene, and saves its own intro for the American Space Program", () => {
    for (const scene of paradeScenes) expect(existsSync(join(process.cwd(), "public", paradeAudio(scene.track)))).toBe(true);
    expect(paradeScenes.filter((s) => s.track === "zarathustra").map((s) => s.id)).toEqual(["space-program", "moon-float"]);
    expect(paradeScenes.some((s) => s.track === "anchors-aweigh")).toBe(true);
  });

  it("stops at both ends", () => {
    expect(previousScene(0)).toBe(0);
    expect(nextScene(0)).toBe(1);
    expect(nextScene(paradeScenes.length - 1)).toBe(paradeScenes.length - 1);
  });
});
