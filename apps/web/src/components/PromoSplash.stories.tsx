import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import PromoSplash from "./PromoSplash";

const meta = { title: "Home/Promo splash", component: PromoSplash, parameters: { layout: "fullscreen" } } satisfies Meta<typeof PromoSplash>;
export default meta;
type Story = StoryObj<typeof meta>;

/** It opens a moment after loading, once per visit, so clear the session storage to see it again. */
export const Trailer: Story = {};
