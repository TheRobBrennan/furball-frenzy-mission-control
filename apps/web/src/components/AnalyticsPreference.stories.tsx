import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import AnalyticsPreference from "./AnalyticsPreference";

const meta = { component: AnalyticsPreference } satisfies Meta<typeof AnalyticsPreference>;
export default meta;

export const Default: StoryObj<typeof meta> = {};
