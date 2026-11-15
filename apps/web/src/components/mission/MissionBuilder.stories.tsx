import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import MissionBuilder from "./MissionBuilder";

const meta = {
  title: "Mission/Mission builder",
  component: MissionBuilder,
  parameters: { layout: "fullscreen" },
  decorators: [(Story) => <div className="mx-auto max-w-6xl p-4 sm:p-6"><Story /></div>],
} satisfies Meta<typeof MissionBuilder>;

export default meta;

export const Default: StoryObj<typeof meta> = {};
