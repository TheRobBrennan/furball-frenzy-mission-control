import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import PartCard from "./PartCard";

const meta = {
  title: "Mission/Part card",
  component: PartCard,
  args: { name: "Spectrometer", blurb: "Reads what the rocks are made of.", stats: ["8 kg", "20 W", "$25M", "900 Mb/day", "30 science"], selected: false, onSelect: () => {} },
  decorators: [(Story) => <div className="w-80"><Story /></div>],
} satisfies Meta<typeof PartCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Picked: Story = { args: { selected: true } };
