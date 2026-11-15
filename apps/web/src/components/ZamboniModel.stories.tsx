import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import ZamboniModel from "./ZamboniModel";
import { skins } from "./ZamboniSkins";

const meta = {
  title: "Launch sites/Zamboni model",
  component: ZamboniModel,
  decorators: [(Story) => <div className="h-40 w-80 max-w-[calc(100vw-2rem)] rounded bg-white p-2"><Story /></div>],
} satisfies Meta<typeof ZamboniModel>;

export default meta;
type Story = StoryObj<typeof meta>;

const skin = (id: string) => skins.find((s) => s.id === id)!;

export const Sploosh: Story = { args: { skin: skin("sploosh") } };
export const Claude: Story = { args: { skin: skin("claude") } };
export const SpaceApps: Story = { args: { skin: skin("spaceapps") } };
export const Charlotte: Story = { args: { skin: skin("charlotte") } };
export const KrakenBear: Story = { args: { skin: skin("kraken-bear") } };
export const UptownChina: Story = { args: { skin: skin("uptown-china") } };
