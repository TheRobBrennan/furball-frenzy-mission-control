import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import GamePageNav from "./GamePageNav";

const meta = { component: GamePageNav, parameters: { nextjs: { appDirectory: true, navigation: { pathname: "/missions" } } } } satisfies Meta<typeof GamePageNav>;
export default meta;

export const Default: StoryObj<typeof meta> = {};
