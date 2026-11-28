import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import ParadeShow from "./ParadeShow";

const meta = { component: ParadeShow } satisfies Meta<typeof ParadeShow>;
export default meta;

export const Default: StoryObj<typeof meta> = {};
