import ExtLink from "@/components/ExtLink";
import type { ReactNode } from "react";
import Reveal from "../Reveal";
import SectionHeading from "../SectionHeading";
import AirDrone from "./AirDrone";
import Blueberry from "./Blueberry";
import Cinewhoop from "./Cinewhoop";
import FpvDrone from "./FpvDrone";
import MiniDrone from "./MiniDrone";
import Rufus from "./Rufus";
import Slash from "./Slash";
import Watson from "./Watson";

type Ride = { name: string; role: string; blurb: ReactNode; art: ReactNode };

// The role lines are proposals until Rob confirms each one, see docs/characters.md.
const ground: Ride[] = [
  {
    name: "Slash",
    role: "The scout",
    blurb: "A 1/10 scale truck that runs flat out ahead of the big ones. Rocky is his full-size cousin.",
    art: <Slash />,
  },
  {
    name: "Blueberry",
    role: "The daily driver",
    blurb: "Dark blue and dependable, always ready for the next errand.",
    art: <Blueberry />,
  },
  {
    name: "Watson",
    role: "The newest on the road",
    blurb: "Sharp-edged and modern, the newest member of the Seattle fleet.",
    art: <Watson />,
  },
  {
    name: "Rufus",
    role: "The family legend",
    blurb:
      "A very loving and incredible vehicle, the go-to for every trip: the Olympic Peninsula, the Oregon coast, California, Vegas, Yellowstone, Montana, Idaho, Bend, all over. He retired after an unfortunate run-in with a boulder that rolled off a mountain, and the whole fleet salutes him.",
    art: <Rufus />,
  },
];

const air: Ride[] = [
  {
    name: "B",
    role: "The brand new family member",
    blurb: <>A <ExtLink href="https://www.dji.com/mini-2">DJI Mini 2 Pro</ExtLink>, small and light. Piggy met B for the first time in his Santa hat, and B took a photo of him.</>,
    art: <MiniDrone />,
  },
  {
    name: "Optimus",
    role: "The high flyer",
    blurb: <>A <ExtLink href="https://www.dji.com/air-2s">DJI Air 2S</ExtLink> with a big camera that sees the big picture.</>,
    art: <AirDrone />,
  },
  {
    name: "Blades",
    role: "The acrobat",
    blurb: <>A <ExtLink href="https://www.dji.com/avata">DJI Avata</ExtLink>, tucked inside its round guards so it can dart through the tightest spaces.</>,
    art: <Cinewhoop />,
  },
  {
    name: "Blurr",
    role: "The speed demon",
    blurb: <>A <ExtLink href="https://www.dji.com/fpv">DJI FPV</ExtLink>, fast and fearless, with the camera up front and the battery on its back.</>,
    art: <FpvDrone />,
  },
];

function Group({ label, rides, wide = false }: { label: string; rides: Ride[]; wide?: boolean }) {
  return (
    <div className="mt-10 first:mt-8">
      <h3 className="text-left font-mono text-xs uppercase tracking-[0.25em] text-ice sm:text-center">{label}</h3>
      <ul className={`reveal-stagger mt-4 grid gap-6 sm:grid-cols-2 ${wide ? "" : "lg:grid-cols-4"}`}>
        {rides.map((r) => (
          <li
            key={r.name}
            className="fleet-card flex flex-col rounded-3xl border border-white/10 bg-white/5 p-5 text-left shadow-xl shadow-black/30 backdrop-blur transition-colors hover:bg-white/10"
          >
            <div className={`rounded-2xl bg-gradient-to-b from-space-2 to-space px-3 pb-2 pt-3 ${wide ? "aspect-[420/170]" : "h-44"}`}>{r.art}</div>
            <p className="mt-4 font-mono text-[0.65rem] uppercase tracking-[0.2em] text-ice">{r.role}</p>
            <h4 className="mt-1 text-xl font-bold">{r.name}</h4>
            <p className="mt-2 text-sm leading-relaxed text-white/80">{r.blurb}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function SeattleFleet() {
  return (
    <Reveal as="section" id="seattle-fleet" className="mx-auto max-w-6xl scroll-mt-6 px-6 py-14 sm:py-20" aria-labelledby="seattle-fleet-heading">
      <SectionHeading id="seattle-fleet-heading" eyebrow="Wheels and wings" title="The Seattle fleet">
        <p>The Seattle crew has rides of its own, on the road and in the air.</p>
      </SectionHeading>
      <Group label="On the ground" rides={ground} wide />
      <Group label="In the air" rides={air} />
    </Reveal>
  );
}
