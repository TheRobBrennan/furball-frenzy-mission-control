import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import MissionPatch from "./MissionPatch";

const meta = {
  title: "Hero/Mission patch",
  component: MissionPatch,
  args: { className: "h-40 w-40 max-w-full" },
} satisfies Meta<typeof MissionPatch>;

export default meta;

export const Default: StoryObj<typeof meta> = {};
