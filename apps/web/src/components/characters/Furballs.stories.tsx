import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { names, NC_CREW, type Mood, type Who } from "@/lib/mission";
import Furball from "./Furballs";

const meta = { title: "Characters/Furballs", component: Furball } satisfies Meta<typeof Furball>;
export default meta;

const row = (mood: Mood) => (
  <div className="flex flex-wrap items-end gap-4 rounded-2xl bg-space-2 p-4">
    {([...NC_CREW, "little-bear"] as Who[]).map((who) => (
      <div key={who} className="flex flex-col items-center gap-1">
        <Furball who={who} mood={mood} label={names[who]} className="h-20 w-20" />
        <span className="font-mono text-[0.65rem] text-white/70">{names[who]}</span>
      </div>
    ))}
  </div>
);

export const Cheering: StoryObj<typeof meta> = { render: () => row("cheer"), args: { who: "piggy", label: "Piggy" } };
export const Worried: StoryObj<typeof meta> = { render: () => row("worry"), args: { who: "piggy", label: "Piggy" } };
