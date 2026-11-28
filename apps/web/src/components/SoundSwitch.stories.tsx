import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import SoundSwitch from "./SoundSwitch";

const meta = { component: SoundSwitch, args: { on: true, onToggle: () => {}, className: "text-white" } } satisfies Meta<typeof SoundSwitch>;
export default meta;

export const On: StoryObj<typeof meta> = {};
export const Off: StoryObj<typeof meta> = { args: { on: false } };
