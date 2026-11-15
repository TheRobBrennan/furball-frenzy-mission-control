import { describe, expect, it } from "vitest";
import { emptyDesign, evaluate, judgesDesign, judgesPicks, simulate } from "@/lib/mission";

describe("judges, start here", () => {
  it("builds a launchable design that succeeds, one pick at a time", () => {
    expect(judgesPicks).toHaveLength(5);
    expect(evaluate(emptyDesign).canLaunch).toBe(false);
    expect(evaluate(judgesDesign).canLaunch).toBe(true);
    expect(simulate(judgesDesign).success).toBe(true);
  });

  it("has the Polish elephants narrate every pick in a sentence that says why", () => {
    for (const p of judgesPicks) expect(p.line.length).toBeGreaterThan(30);
  });
});
