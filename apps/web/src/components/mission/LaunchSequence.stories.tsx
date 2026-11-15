import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { simulate } from "@/lib/mission";
import { balanced, powerStarved } from "@/lib/mission/designs.fixtures";
import LaunchSequence from "./LaunchSequence";

const meta = {
  title: "Mission/Launch sequence",
  component: LaunchSequence,
  args: { onDone: () => {} },
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof LaunchSequence>;

export default meta;
type Story = StoryObj<typeof meta>;

export const SuccessfulMission: Story = { args: { result: simulate(balanced) } };
export const BrownedOut: Story = { args: { result: simulate(powerStarved) } };
