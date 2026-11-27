import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import ParadeInvite from "./ParadeInvite";

const meta = { component: ParadeInvite, args: { className: "flex" } } satisfies Meta<typeof ParadeInvite>;
export default meta;

export const Default: StoryObj<typeof meta> = {};
