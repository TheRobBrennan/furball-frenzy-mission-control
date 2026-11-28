import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import SiteFooter from "./SiteFooter";

const meta = { component: SiteFooter } satisfies Meta<typeof SiteFooter>;
export default meta;

export const Default: StoryObj<typeof meta> = {};
