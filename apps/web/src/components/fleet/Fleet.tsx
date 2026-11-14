import type { ReactNode } from "react";
import Reveal from "../Reveal";
import SectionHeading from "../SectionHeading";
import Blazer from "./Blazer";
import Convertible from "./Convertible";
import GolfCart from "./GolfCart";
import LunarRover from "./LunarRover";
import MisAdventure from "./MisAdventure";
import Rocky from "./Rocky";

type Vehicle = {
  name: string;
  role: string;
  blurb: string;
  art: ReactNode;
};

// The role lines are proposals until Rob confirms each character, see docs/characters.md.
const vehicles: Vehicle[] = [
  {
    name: "Rocky",
    role: "The hauler",
    blurb: "Big, blue, and happy to carry the rocket parts out to the pad.",
    art: <Rocky />,
  },
  {
    name: "The Blazer",
    role: "The crew shuttle",
    blurb: "Roomy and steady, it gets everyone out to the site and back again.",
    art: <Blazer />,
  },
  {
    name: "The convertible",
    role: "The road-trip car",
    blurb: "Top down, Piggy at the wheel, always first out of the driveway.",
    art: <Convertible />,
  },
  {
    name: "Mis' Adventure",
    role: "The basecamp on wheels",
    blurb: "Where the crew bunks down on road trips and long site surveys. Every trip comes with a story, and a few misadventures.",
    art: <MisAdventure />,
  },
  {
    name: "The golf cart",
    role: "The site shuttle",
    blurb: "Zips the crew around the whole property, launch site to home base, with a back seat that faces the way you came.",
    art: <GolfCart />,
  },
];

export default function Fleet() {
  return (
    <Reveal
      as="section"
      id="fleet"
      className="mx-auto max-w-6xl scroll-mt-6 px-6 py-14 text-center sm:py-20"
      aria-labelledby="fleet-heading"
    >
      <SectionHeading id="fleet-heading" eyebrow="Wheels" title="The fleet">
        <p>One very special rover for the Moon, and wheels for road trips and site surveys on the ground.</p>
      </SectionHeading>
      <div className="fleet-card mt-10 grid items-center gap-8 rounded-3xl border border-amber/60 bg-white/5 p-6 text-left shadow-xl shadow-black/30 backdrop-blur sm:p-8 md:grid-cols-[minmax(0,15rem)_1fr]">
        <div className="mx-auto w-full max-w-[13rem] rounded-2xl bg-gradient-to-b from-space-2 to-space p-4 md:max-w-none">
          <LunarRover />
        </div>
        <div>
          <p className="font-mono text-[0.65rem] uppercase tracking-[0.2em] text-amber">
            The elephants&apos; pride and joy
          </p>
          <h3 className="mt-1 text-2xl font-bold sm:text-3xl">The lunar rover</h3>
          <p className="mt-3 leading-relaxed text-white/85">
            A tilt-and-steer moon buggy with big knobbly tires, a tool box up front, twin lights on
            each side, and a little display for the road ahead.
          </p>
          <p className="mt-3 leading-relaxed text-white/85">
            Both Polish elephants ride it at once, one stacked on the other on the single seat,
            happily driving. They love to be tied together and stay close, that is the Bunny system,
            like all good furballs: safety and silliness first.
          </p>
          <p className="mt-3 text-sm text-white/65">
            Proud of their hard work, their creativity, and their team ethos.
          </p>
        </div>
      </div>
      <ul className="reveal-stagger mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-6">
        {vehicles.map((v, i) => (
          <li
            key={v.name}
            className={`fleet-card flex flex-col rounded-3xl border border-white/10 bg-white/5 p-5 text-left shadow-xl shadow-black/30 backdrop-blur transition-colors hover:bg-white/10 lg:col-span-2 ${i === 3 ? "lg:col-start-2" : ""}`}
          >
            <div className="aspect-[420/170] rounded-2xl bg-gradient-to-b from-space-2 to-space px-3 pb-2 pt-3">
              {v.art}
            </div>
            <p className="mt-4 font-mono text-[0.65rem] uppercase tracking-[0.2em] text-ice">
              {v.role}
            </p>
            <h3 className="mt-1 text-xl font-bold">{v.name}</h3>
            <p className="mt-2 text-sm leading-relaxed text-white/80">{v.blurb}</p>
          </li>
        ))}
      </ul>
    </Reveal>
  );
}
