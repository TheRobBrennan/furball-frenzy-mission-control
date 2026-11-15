import Image from "next/image";
import ReconPolaroid from "../ReconPolaroid";
import SeattleLocation from "../SeattleLocation";
import type { ReactNode } from "react";
import ExtLink from "../ExtLink";
import Reveal from "../Reveal";
import SectionHeading from "../SectionHeading";
import AirDrone from "./AirDrone";
import BigBlue from "./BigBlue";
import Blazer from "./Blazer";
import Blueberry from "./Blueberry";
import Cinewhoop from "./Cinewhoop";
import Convertible from "./Convertible";
import FpvDrone from "./FpvDrone";
import GolfCart from "./GolfCart";
import LunarRover from "./LunarRover";
import MiniDrone from "./MiniDrone";
import MisAdventure from "./MisAdventure";
import Rocky from "./Rocky";
import Rufus from "./Rufus";
import Slash from "./Slash";
import Watson from "./Watson";

type Ride = { name: string; role: string; blurb: ReactNode; art: ReactNode };
type Member = { name: string; title?: string };

// The role lines are proposals until Rob confirms each character, see docs/characters.md.
const homeWheels: Ride[] = [
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
    name: "Big Blue",
    role: "The prized member of the lineup",
    blurb: "A lifted blue and silver pickup with a chrome roll bar and big mud tires, the pride of the Rockingham lineup.",
    art: <BigBlue />,
  },
  {
    name: "The golf cart",
    role: "The site shuttle",
    blurb: "Zips the crew around the whole property, launch site to home base, with a back seat that faces the way you came.",
    art: <GolfCart />,
  },
];

const seattleWheels: Ride[] = [
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

const seattleWings: Ride[] = [
  {
    name: "B",
    role: "The first flyer",
    blurb: <>A <ExtLink href="https://www.dji.com/mini-2">DJI Mini 2 Pro</ExtLink>, the first flying member of the family. Piggy met B in his Santa hat, and B took a photo of him.</>,
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

const carolinaCrew: Member[] = [
  { name: "Piggy", title: "Captain" },
  { name: "The Polish Elephants" },
  { name: "Hamley" },
  { name: "Blue Bear" },
  { name: "The Gray Elephant" },
  { name: "The Little Duck" },
];

const seattleCrew: Member[] = [
  { name: "Hamlet", title: "Captain" },
  { name: "Little Bear" },
  { name: "Little Bunny" },
  { name: "Kraken Bear" },
  { name: "Fuzzy Black Bear" },
  { name: "Fuzzy Brown Bear" },
];

function Roster({ members }: { members: Member[] }) {
  return (
    <div>
      <h4 className="mt-8 font-mono text-xs uppercase tracking-[0.25em] text-ice">Crew</h4>
      <ul className="mt-3 grid gap-x-6 gap-y-2 text-lg sm:grid-cols-2">
        {members.map((m) => (
          <li key={m.name} className="flex items-baseline gap-2">
            <span className="text-amber" aria-hidden="true">
              &#9733;
            </span>
            <span>
              {m.name}
              {m.title && (
                <span className="ml-2 font-mono text-xs uppercase tracking-widest text-amber">{m.title}</span>
              )}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Rides({ label, rides, compact = false }: { label: string; rides: Ride[]; compact?: boolean }) {
  return (
    <div>
      <h4 className="mt-8 font-mono text-xs uppercase tracking-[0.25em] text-ice">{label}</h4>
      <ul className="reveal-stagger mt-3 grid grid-cols-1 gap-4 min-[420px]:grid-cols-2">
        {rides.map((r, i) => (
          <li
            key={r.name}
            className={`fleet-card flex flex-col rounded-2xl border border-white/10 bg-white/5 p-3 text-left transition-colors hover:bg-white/10 ${
              rides.length % 2 === 1 && i === rides.length - 1 ? "min-[420px]:col-span-2" : ""
            }`}
          >
            <div
              className={`rounded-xl bg-gradient-to-b from-space-2 to-space px-2 pb-1 pt-2 ${compact ? "h-32" : "aspect-[420/170]"}`}
            >
              {r.art}
            </div>
            <p className="mt-3 font-mono text-[0.6rem] uppercase tracking-[0.2em] text-ice">{r.role}</p>
            <h5 className="mt-0.5 text-lg font-bold">{r.name}</h5>
            <p className="mt-1 text-xs leading-relaxed text-white/75">{r.blurb}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Site({
  number,
  place,
  state,
  intro,
  tint,
  children,
}: {
  number: string;
  place: string;
  state: string;
  intro: ReactNode;
  tint: string;
  children: ReactNode;
}) {
  return (
    <article
      className={`flex flex-col rounded-3xl border border-white/10 p-6 shadow-xl shadow-black/30 sm:p-8 lg:row-span-5 lg:grid lg:grid-rows-subgrid ${tint}`}
    >
      <div>
        <p className="font-mono text-[0.65rem] uppercase tracking-[0.25em] text-amber sm:text-xs">Launch site {number}</p>
        <h3 className="mt-2 text-3xl font-black sm:text-4xl">
          {place} <span className="text-white/50">&middot; {state}</span>
        </h3>
        <div className="mt-3 text-white/85">{intro}</div>
      </div>
      {children}
    </article>
  );
}

export default function HomeBases() {
  return (
    <div className="border-y border-white/5 bg-white/[0.03]">
      <Reveal as="section" id="crew" className="mx-auto max-w-6xl scroll-mt-20 px-6 py-14 sm:py-20" aria-labelledby="home-bases-heading">
        <SectionHeading id="home-bases-heading" eyebrow="Two launch sites" title="Where the crew lives">
          <p>Everyone is in the game, wherever they are. Each launch site has its crew, its rides on the land and in the air, and its stories. More furballs join along the way.</p>
        </SectionHeading>
        <div className="mt-10 grid gap-8 lg:grid-cols-2 lg:grid-rows-[repeat(5,auto)] lg:gap-y-0">
          <Site
            number="one"
            place="Rockingham"
            state="NC"
            tint="bg-[#101a4a]/70"
            intro={
              <p>
                The North Carolina crew launches from a lake right out in their backyard.
                <span className="mt-2 block font-mono text-sm text-ice">Coordinates withheld by order of Mission Control</span>
              </p>
            }
          >
            <div className="mt-6 flex flex-col">
              <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start sm:justify-center sm:gap-0 lg:min-h-[340px]">
                <ReconPolaroid
                  src="/images/rockingham-lake-recon-hires.jpg"
                  alt="A satellite view of a small lake filling the frame, with slivers of woods and a few clearings along its shore"
                  readout="Classified"
                  caption="The lake"
                  orientation="landscape"
                  zoom={[1.4, 2]}
                  info="The sharpest public view of this lake comes from North Carolina's statewide imagery, about 6 inches per pixel. NASA's Landsat sees 15 to 30 meters per pixel, so a lake this size would be just a few pixels wide."
                  className="z-0 w-[92%] sm:w-[60%]"
                  tilt="-2.5deg"
                />
                <figure
                  className="polaroid relative z-10 w-[66%] rounded-md bg-white p-2.5 pb-3 shadow-2xl shadow-black/60 sm:-ml-[3%] sm:mt-12 sm:w-[41%]"
                  style={{ ["--tilt" as string]: "3deg" }}
                >
                  <Image
                    src="/images/north-carolina-crew.jpg"
                    alt="Blue Bear, the two Polish elephants, a larger elephant, a pink rubber duck, and a NASCAR race car piled together on a bed"
                    width={2000}
                    height={1500}
                    className="aspect-[3/4] w-full rounded-sm object-cover object-[22%_50%]"
                    sizes="(min-width: 1024px) 200px, 60vw"
                  />
                  <figcaption className="mt-2 text-center font-mono text-[0.65rem] font-semibold leading-snug text-space">
                    The crew, before launch
                  </figcaption>
                </figure>
              </div>
              <p className="mx-auto mt-6 max-w-sm text-balance text-center text-xs leading-relaxed text-white/55">
                Recon by two unnamed Polish elephants.
                <br />
                Imagery: NC OneMap statewide orthoimagery, about 6 inches per pixel. NASA&apos;s Landsat sees 15 to 30 meters
                per pixel, so this lake would be just a few pixels wide.
              </p>
            </div>
            <Roster members={carolinaCrew} />
            <Rides label="Land" rides={homeWheels} />
            <div aria-hidden="true" className="hidden lg:block" />
          </Site>
          <Site
            number="two"
            place="Seattle"
            state="WA"
            tint="bg-[#142a52]/70"
            intro={
              <p>
                The Seattle crew is bopping around town between missions, keeping tabs on Mission Control from
                the <ExtLink href="https://www.spaceneedle.com/">Space Needle</ExtLink>, Pike Place Market, and{" "}
                <ExtLink href="https://climatepledgearena.com/">Climate Pledge Arena</ExtLink>, Kraken Bear&apos;s
                favorite.
              </p>
            }
          >
            <SeattleLocation />
            <Roster members={seattleCrew} />
            <Rides label="Land" rides={seattleWheels} />
            <Rides label="Air" rides={seattleWings} compact />
          </Site>
        </div>
      <div className="fleet-card mt-12 grid items-center gap-8 rounded-3xl border border-amber/60 bg-white/5 p-6 text-left shadow-xl shadow-black/30 backdrop-blur sm:p-8 md:grid-cols-[minmax(0,15rem)_1fr]">
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
      </Reveal>
    </div>
  );
}
