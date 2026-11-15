import { describe, expect, it } from "vitest";
import { balanced, dataStarved, empty, overBudget, powerStarved, tooHeavy } from "./designs.fixtures";
import { chooseHold, chooseTrouble, COUNT_STEP_MS, countdownStart, lineMs, lineStarts, missionScript, names, NC_CREW, type Trouble, type Who } from "./script";
import { simulate } from "./simulate";

const script = (d: Parameters<typeof simulate>[0], hold?: number, trouble?: Trouble) => missionScript(d, simulate(d), hold, trouble);
const kinds = (d: Parameters<typeof simulate>[0]) => script(d).map((s) => s.kind);

describe("missionScript, a mission that works", () => {
  it("tells it from Mission Control to the wrap, with a joyride on the surface", () => {
    expect(kinds(balanced)).toEqual(["control", "liftoff", "transit", "landing", "surface", "joyride", "splashdown", "recovery", "wrap"]);
  });

  it("is cheerful all the way, and the wrap says what worked", () => {
    const scenes = script(balanced);
    expect(scenes.every((s) => s.ok && s.mood === "cheer")).toBe(true);
    expect(scenes.at(-1)?.lesson?.title).toBe("What worked");
    expect(scenes.at(-1)?.title).toBe("Mission success!");
  });

  it("lets Little Bear look on at the joyride, and the elephants have fun", () => {
    const ride = script(balanced).find((s) => s.kind === "joyride")!;
    expect(ride.lines.map((l) => l.who)).toEqual(["elephants", "little-bear", "gray-elephant", "piggy"]);
  });

  it("has the whole North Carolina crew on screen at the start and the end, and every one of them speaks", () => {
    const scenes = script(balanced);
    expect(scenes[0].present).toEqual(NC_CREW);
    expect(scenes.at(-1)?.present).toEqual(expect.arrayContaining(NC_CREW));
    const speakers = new Set(scenes.flatMap((s) => s.lines.map((l) => l.who)));
    for (const who of NC_CREW) expect(speakers.has(who)).toBe(true);
  });

  it("brings everyone home safe with a splashdown and a headcount, even when the mission fell short", () => {
    for (const d of [balanced, dataStarved, powerStarved]) {
      const scenes = script(d);
      const kindsList = scenes.map((s) => s.kind);
      expect(kindsList).toContain("splashdown");
      expect(kindsList.indexOf("recovery")).toBe(kindsList.indexOf("splashdown") + 1);
      expect(scenes.find((s) => s.kind === "recovery")?.headcount).toEqual(NC_CREW);
      expect(scenes.find((s) => s.kind === "recovery")?.lines.some((l) => /safe/.test(l.text))).toBe(true);
    }
  });

  it("has no splashdown for a launch that never happened", () => {
    expect(kinds(tooHeavy)).not.toContain("splashdown");
  });

  it("has every crew member check in at Mission Control, and starts the countdown only after the all clear", () => {
    const control = script(balanced)[0];
    expect(control.countdown).toBe(true);
    expect(control.checks?.map((c) => c.who)).toEqual(["elephants", "gray-elephant", "hamley", "blue-bear", "little-duck"]);
    const starts = lineStarts(control.lines);
    // Each check is confirmed by its own line, in order, and Piggy gives the all clear last.
    control.checks!.forEach((c, i) => expect(control.lines[i + 1].who).toBe(c.who));
    expect(control.lines.at(-1)?.who).toBe("piggy");
    expect(control.lines.at(-1)?.text).toMatch(/All checks complete/);
    // The countdown starts after the all clear has been read, never during the checks.
    expect(countdownStart(control)).toBeGreaterThanOrEqual(starts.at(-1)! + lineMs(control.lines.at(-1)!.text));
    expect(control.ms).toBeGreaterThanOrEqual(countdownStart(control) + 3 * COUNT_STEP_MS);
  });

  it("can have one system report no-go, hold, get fixed, and call in again before the countdown", () => {
    const control = script(balanced, 3)[0];
    const blue = control.checks![3];
    expect(blue.noGoLine).toBeDefined();
    const noGo = control.lines[blue.noGoLine!];
    expect(noGo).toMatchObject({ who: "blue-bear", fx: "nogo" });
    expect(noGo.text).toMatch(/^No-go!/);
    expect(control.lines[blue.fixLine!]).toMatchObject({ who: "blue-bear", fx: "wrench" });
    expect(control.lines[blue.goLine]).toMatchObject({ who: "blue-bear", fx: "fixed" });
    expect(blue.noGoLine!).toBeLessThan(blue.fixLine!);
    expect(blue.fixLine!).toBeLessThan(blue.goLine);
    // Every other system is checked as before, and the all clear is still last.
    expect(control.checks!.filter((c) => c.noGoLine === undefined)).toHaveLength(4);
    expect(control.lines.at(-1)?.text).toMatch(/All checks complete/);
    expect(countdownStart(control)).toBeGreaterThan(lineStarts(control.lines)[blue.goLine]);
  });

  it("has no hold unless one is asked for, and picks one at random about four times in ten", () => {
    expect(script(balanced)[0].checks!.some((c) => c.noGoLine !== undefined)).toBe(false);
    expect(chooseHold(() => 0.9)).toBeUndefined();
    expect(chooseHold(() => 0.1)).toBe(0);
    const dice = [0.1, 0.99];
    expect(chooseHold(() => dice.shift()!)).toBe(4);
  });

  it("can run into trouble in space, then fix it and carry on to the Moon", () => {
    const scenes = script(balanced, undefined, { cause: 0, outcome: "continue" });
    const kinds = scenes.map((s) => s.id);
    expect(kinds.slice(0, 6)).toEqual(["control", "liftoff", "transit", "emergency", "resolution", "landing"]);
    const [alert, resolved] = [scenes[3], scenes[4]];
    expect(alert.lines[0].fx).toBe("alarm");
    expect(alert.photo).toBe("sad");
    expect(alert.lines.some((l) => l.fx === "sad" && l.who === "piggy")).toBe(true);
    expect(alert.lines.some((l) => l.who === "piggy" && /breathe|calm/i.test(l.text))).toBe(true);
    expect(resolved.photo).toBe("happy");
    expect(resolved.title).toBe("Back on track");
    expect(kinds).toContain("surface");
    expect(kinds.at(-2)).toBe("recovery");
  });

  it("can turn for home instead: no landing on the Moon, but everyone comes home safe", () => {
    const scenes = script(balanced, undefined, { cause: 2, outcome: "abort" });
    expect(scenes.map((s) => s.id)).toEqual(["control", "liftoff", "transit", "emergency", "resolution", "splashdown", "recovery", "wrap"]);
    expect(scenes[4].title).toBe("Turning for home");
    expect(scenes.find((s) => s.kind === "recovery")?.headcount).toEqual(NC_CREW);
    const wrap = scenes.at(-1)!;
    expect(wrap.ok).toBe(true);
    expect(wrap.lesson?.title).toMatch(/Turning back/);
  });

  it("has no trouble unless asked for, and picks it at random about a third of the time", () => {
    expect(script(balanced).some((s) => s.kind === "emergency")).toBe(false);
    expect(chooseTrouble(() => 0.9)).toBeUndefined();
    const dice = [0.1, 0.99, 0.1];
    expect(chooseTrouble(() => dice.shift()!)).toEqual({ cause: 2, outcome: "abort" });
    const calm = [0.1, 0.0, 0.9];
    expect(chooseTrouble(() => calm.shift()!)).toEqual({ cause: 0, outcome: "continue" });
  });

  it("counts down to splashdown, 3, 2, 1, SPLASH, after the crew braces, on every mission that comes home", () => {
    for (const trouble of [undefined, { cause: 1, outcome: "abort" } as Trouble]) {
      const splash = script(balanced, undefined, trouble).find((s) => s.kind === "splashdown")!;
      expect(splash.countdown).toBe(true);
      expect(splash.countWord).toBe("SPLASH");
      expect(splash.lines.at(-1)?.text).toMatch(/countdown/i);
      expect(splash.ms).toBeGreaterThanOrEqual(countdownStart(splash) + 3 * COUNT_STEP_MS);
    }
  });

  it("keeps the Polish elephants plural, never I, my, or me, and never says best day ever for a mission of several days", () => {
    for (const d of [balanced, tooHeavy]) {
      for (const trouble of [undefined, { cause: 0, outcome: "continue" } as Trouble, { cause: 1, outcome: "abort" } as Trouble]) {
        const lines = script(d, 1, trouble).flatMap((s) => s.lines);
        for (const l of lines.filter((x) => x.who === "elephants")) expect(l.text).not.toMatch(/\b(I|I'm|I'll|my|me|myself)\b/);
        for (const l of lines) expect(l.text).not.toMatch(/best day ever|all hands/i);
      }
    }
    expect(names.elephants).toBe("The Polish elephants");
  });

  it("has no countdown or checks when the launch is scrubbed", () => {
    const control = script(tooHeavy)[0];
    expect(control.countdown).toBeFalsy();
    expect(control.checks).toBeUndefined();
  });

  it("has the Polish elephants wave hi to their family at the landing, even while being discreet, and give thanks at the end", () => {
    const scenes = script(balanced);
    const landing = scenes.find((s) => s.kind === "landing")!;
    expect(landing.lines.find((l) => l.who === "elephants")?.text).toMatch(/discreet.*hi, family/);
    expect(scenes.at(-1)?.lines.find((l) => l.who === "elephants")?.text).toMatch(/grateful/);
  });

  it("includes all three elephants, the two Polish elephants and the Gray Elephant", () => {
    expect(NC_CREW).toContain("elephants");
    expect(NC_CREW).toContain("gray-elephant");
    expect(names["gray-elephant"]).toBe("The Gray Elephant");
  });

  it("sends the whole beam home when nothing is lost", () => {
    expect(script(balanced).find((s) => s.kind === "surface")?.beam).toBe(1);
  });
});

describe("missionScript, a mission that falls short", () => {
  it("has no joyride, and teaches the antenna lesson when data was lost", () => {
    const scenes = script(dataStarved);
    expect(scenes.map((s) => s.kind)).not.toContain("joyride");
    const surface = scenes.find((s) => s.kind === "surface")!;
    expect(surface.mood).toBe("worry");
    expect(surface.beam).toBeLessThan(0.5);
    expect(scenes.at(-1)?.mood).toBe("learn");
    expect(scenes.at(-1)?.lesson?.title).toMatch(/gets home/);
  });

  it("shows the brownout and teaches the power lesson", () => {
    const scenes = script(powerStarved);
    const surface = scenes.find((s) => s.kind === "surface")!;
    expect(surface.ok).toBe(false);
    expect(surface.lines.some((l) => l.who === "blue-bear")).toBe(true);
    expect(scenes.at(-1)?.lesson?.title).toBe("Power is a budget");
  });
});

describe("missionScript, a launch that never happens", () => {
  it("scrubs at Mission Control and teaches the matching lesson", () => {
    expect(kinds(tooHeavy)).toEqual(["control", "wrap"]);
    expect(script(tooHeavy).at(-1)?.lesson?.title).toBe("Mass is the first limit");
    expect(script(overBudget).at(-1)?.lesson?.title).toBe("Money is a limit too");
    expect(script(empty).at(-1)?.lesson?.title).toBe("Every mission needs a ride");
  });

  it("has Mission Control read out the reason", () => {
    const control = script(tooHeavy)[0];
    expect(control.mood).toBe("worry");
    expect(control.lines.some((l) => /too heavy/.test(l.text))).toBe(true);
  });
});

describe("every script", () => {
  const all = [balanced, dataStarved, powerStarved, tooHeavy, overBudget, empty];
  it("is deterministic", () => {
    for (const d of all) expect(script(d)).toEqual(script(d));
  });

  it("has lines for every scene, from known characters, and positive times except the last", () => {
    for (const d of all) {
      const scenes = script(d);
      scenes.forEach((s, i) => {
        expect(s.lines.length).toBeGreaterThan(0);
        for (const l of s.lines) expect(names[l.who as Who]).toBeTruthy();
        if (i < scenes.length - 1) expect(s.ms).toBeGreaterThan(0);
        else expect(s.ms).toBe(0);
      });
    }
  });

  it("always ends with a wrap that holds a lesson", () => {
    for (const d of all) expect(script(d).at(-1)?.lesson).toBeTruthy();
  });
});

describe("reading time", () => {
  it("gives a longer line more time, and never less than two and a half seconds", () => {
    expect(lineMs("Hi")).toBe(2400);
    expect(lineMs("x".repeat(100))).toBeGreaterThan(lineMs("x".repeat(40)));
  });

  it("starts the first line after a quiet beat, then spaces the lines by how long each takes to read", () => {
    const lines = script(balanced)[0].lines;
    const starts = lineStarts(lines);
    expect(starts[0]).toBe(1200);
    starts.slice(1).forEach((t, i) => expect(t - starts[i]).toBe(lineMs(lines[i].text)));
  });

  it("never ends a scene before its last line can be read", () => {
    for (const d of [balanced, dataStarved, powerStarved, tooHeavy]) {
      for (const scene of script(d)) {
        if (scene.ms === 0) continue;
        expect(scene.ms).toBeGreaterThanOrEqual(lineStarts(scene.lines).at(-1)! + lineMs(scene.lines.at(-1)!.text));
      }
    }
  });
});
