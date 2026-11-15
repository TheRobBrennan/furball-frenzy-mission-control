import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { simulate } from "@/lib/mission";
import { balanced, dataStarved, powerStarved, tooHeavy } from "@/lib/mission/designs.fixtures";
import MissionStory from "./MissionStory";

const meta = {
  title: "Mission/Mission story",
  component: MissionStory,
  args: { onDone: () => {} },
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof MissionStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const SuccessfulMission: Story = { args: { design: balanced, result: simulate(balanced) } };
export const LostScienceToTheAntenna: Story = { args: { design: dataStarved, result: simulate(dataStarved) } };
export const BrownedOut: Story = { args: { design: powerStarved, result: simulate(powerStarved) } };
export const ScrubbedOnThePad: Story = { args: { design: tooHeavy, result: simulate(tooHeavy) } };
export const NoGoThenFixed: Story = { args: { design: balanced, result: simulate(balanced), hold: 3 } };
export const AllSystemsGoFirstTime: Story = { args: { design: balanced, result: simulate(balanced), hold: null } };
export const TroubleThenBackOnTrack: Story = { args: { design: balanced, result: simulate(balanced), hold: null, trouble: { cause: 0, outcome: "continue" } } };
export const TroubleSoTheyTurnForHome: Story = { args: { design: balanced, result: simulate(balanced), hold: null, trouble: { cause: 2, outcome: "abort" } } };
