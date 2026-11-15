// Real NASA surface missions the debrief compares a design to. Every figure here was read on the page named in `source`,
// the figure is null where the page did not state it, and the game never fills a gap from memory. Read 2026-11-15.
// The game's own numbers are simplified teaching values, so a comparison shows scale and spirit, not equivalence.

export type Source = { label: string; url: string };

export type RealMission = {
  id: string;
  name: string;
  /** Where it worked. */
  where: string;
  massKg: number | null;
  /** Science instruments, null when the page does not give a count. */
  instruments: number | null;
  power: string;
  /** What the page says about how long it was planned for and how long it lasted. */
  length: string;
  /** One sentence on what the real mission teaches that the game also teaches. */
  lesson: string;
  sources: Source[];
};

export const realMissions: RealMission[] = [
  {
    id: "sojourner",
    name: "Mars Pathfinder's Sojourner",
    where: "Mars",
    massKg: 10.6,
    instruments: 3,
    power: "about 13 W, nominal",
    length: "landed July 1997, last contact September 1997",
    lesson: "A very small rover, with a handful of instruments, still changed what we knew about Mars. Small can be enough.",
    sources: [
      { label: "NASA Mars Pathfinder", url: "https://science.nasa.gov/mission/mars-pathfinder/" },
      { label: "NASA NSSDCA, Sojourner", url: "https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=MESURPR" },
    ],
  },
  {
    id: "mer",
    name: "Spirit and Opportunity",
    where: "Mars",
    massKg: 185,
    instruments: 6,
    power: "solar, up to 140 W in full Sun",
    length: "planned for 90 sols, Spirit lasted over 6 years and Opportunity nearly 15",
    lesson: "Solar power with a healthy margin let two rovers outlive their plan many times over, dust and all.",
    sources: [
      { label: "NASA Spirit", url: "https://science.nasa.gov/mission/mer-spirit/" },
      { label: "NASA Opportunity", url: "https://science.nasa.gov/mission/mer-opportunity/" },
      { label: "NASA NSSDCA, Spirit", url: "https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=2003-027A" },
    ],
  },
  {
    id: "lrv",
    name: "Apollo Lunar Roving Vehicle",
    where: "the Moon",
    massKg: 210,
    instruments: 0,
    power: "two 36 volt silver-zinc batteries that could not be recharged",
    length: "three drives on each of Apollo 15, 16, and 17, up to 35.9 km in one mission",
    lesson: "Power you cannot recharge sets the length of the whole mission, so every kilogram and every watt was counted.",
    sources: [{ label: "NASA NSSDCA, Apollo LRV", url: "https://nssdc.gsfc.nasa.gov/planetary/lunar/apollo_lrv.html" }],
  },
  {
    id: "viper",
    name: "VIPER",
    where: "the Moon's south pole",
    massKg: null,
    instruments: 4,
    power: "not stated on NASA's page",
    length: "planned for 100 days",
    lesson: "The rover the elephants dream of: a south pole rover with a drill and instruments, whose plan keeps changing as the launch and the lander change.",
    sources: [{ label: "NASA VIPER", url: "https://science.nasa.gov/mission/viper/" }],
  },
  {
    id: "curiosity",
    name: "Curiosity",
    where: "Mars",
    massKg: 899,
    instruments: 10,
    power: "a radioisotope generator, 125 W at the start",
    length: "planned for one Martian year, 687 Earth days, and still going after 14 years",
    lesson: "A big rover can carry many instruments and its own power, but it needs a big launcher and a big budget to get there.",
    sources: [
      { label: "NASA Curiosity", url: "https://science.nasa.gov/mission/msl-curiosity/" },
      { label: "NASA NSSDCA, Curiosity", url: "https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=2011-070A" },
    ],
  },
  {
    id: "perseverance",
    name: "Perseverance",
    where: "Mars",
    massKg: 1050,
    instruments: 8,
    power: "a radioisotope generator, 110 W nominal",
    length: "planned for at least one Martian year, 687 Earth days, and past its first five years",
    lesson: "Every instrument has to earn its mass, power, and data, even on the biggest rover.",
    sources: [{ label: "NASA NSSDCA, Perseverance", url: "https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=2020-052A" }],
  },
];

/** How far a design is from a mission, smaller is closer. An unknown mass counts as a middling gap, never as a match. */
export function distance(mission: RealMission, rover: { massKg: number; instruments: number }): number {
  const mass = mission.massKg === null ? 0.6 : Math.abs(Math.log(mission.massKg / rover.massKg));
  const instruments = mission.instruments === null ? 0.5 : Math.abs(mission.instruments - rover.instruments) * 0.15;
  return mass + instruments;
}

/** The real mission a design most resembles in size and in how many instruments it carries. */
export function closestMission(rover: { massKg: number; instruments: number }): RealMission {
  return realMissions.reduce((best, m) => (distance(m, rover) < distance(best, rover) ? m : best));
}
