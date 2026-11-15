import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import GaugeBar from "./GaugeBar";

const meta = {
  title: "Mission/Gauge bar",
  component: GaugeBar,
  decorators: [(Story) => <div className="w-72"><Story /></div>],
} satisfies Meta<typeof GaugeBar>;

export default meta;
type Story = StoryObj<typeof meta>;

const base = { id: "mass" as const, label: "Mass", unit: "kg" };

export const Ok: Story = { args: { gauge: { ...base, used: 189, limit: 900, status: "ok" } } };
export const Tight: Story = { args: { gauge: { ...base, used: 226, limit: 250, status: "tight" } } };
export const Over: Story = { args: { gauge: { ...base, used: 261, limit: 250, status: "over" } } };
export const NoLimitYet: Story = { args: { gauge: { ...base, used: 150, limit: 0, status: "ok" } } };

export const Compact: Story = { args: { gauge: { ...base, used: 189, limit: 900, status: "ok" }, compact: true } };
