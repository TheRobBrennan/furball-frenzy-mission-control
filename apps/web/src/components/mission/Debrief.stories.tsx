import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { simulate } from "@/lib/mission";
import { balanced, dataStarved, powerStarved, tooHeavy } from "@/lib/mission/designs.fixtures";
import Debrief from "./Debrief";

const meta = {
  title: "Mission/Debrief",
  component: Debrief,
  args: { onChange: () => {}, onReset: () => {} },
  parameters: { layout: "padded" },
  decorators: [(Story) => <div className="max-w-2xl"><Story /></div>],
} satisfies Meta<typeof Debrief>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Success: Story = { args: { result: simulate(balanced), design: balanced } };
export const LostScienceToTheAntenna: Story = { args: { result: simulate(dataStarved), design: dataStarved } };
export const BrownedOut: Story = { args: { result: simulate(powerStarved), design: powerStarved } };
export const StuckOnThePad: Story = { args: { result: simulate(tooHeavy), design: tooHeavy } };
