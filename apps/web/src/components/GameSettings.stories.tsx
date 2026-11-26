import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import GameSettings from "./GameSettings";

const meta = { component: GameSettings } satisfies Meta<typeof GameSettings>;
export default meta;

export const Default: StoryObj<typeof meta> = {};
