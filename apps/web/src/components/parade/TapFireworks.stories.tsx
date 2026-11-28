import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import TapFireworks from "./TapFireworks";

const meta = { component: TapFireworks, decorators: [(Story) => <div className="min-h-80 p-6 text-white">Tap anywhere.{Story()}</div>] } satisfies Meta<typeof TapFireworks>;
export default meta;

export const Default: StoryObj<typeof meta> = {};
