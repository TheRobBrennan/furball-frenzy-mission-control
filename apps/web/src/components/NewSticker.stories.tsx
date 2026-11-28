import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import NewSticker from "./NewSticker";

const meta = { component: NewSticker } satisfies Meta<typeof NewSticker>;
export default meta;

export const Default: StoryObj<typeof meta> = {};
