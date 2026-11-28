import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import Breadcrumbs from "./Breadcrumbs";

const meta = { component: Breadcrumbs, args: { current: "Thanksgiving 2026 Parade" } } satisfies Meta<typeof Breadcrumbs>;
export default meta;

export const Default: StoryObj<typeof meta> = {};
