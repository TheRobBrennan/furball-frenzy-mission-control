import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import PresentedBy from "./PresentedBy";

const meta = { component: PresentedBy, decorators: [(Story) => <div className="rounded-2xl bg-white p-4">{Story()}</div>] } satisfies Meta<typeof PresentedBy>;
export default meta;

export const Default: StoryObj<typeof meta> = {};

export const Compact: StoryObj<typeof meta> = { args: { compact: true } };
