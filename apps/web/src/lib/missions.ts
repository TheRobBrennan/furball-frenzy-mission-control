// Every mission a visitor can play, in the order they arrived. The Missions page and its tests read this.

export type Mission = { id: string; number: number; href: string; title: string; summary: string; action: string; isNew?: boolean };

export const missions: Mission[] = [
  {
    id: "design",
    number: 1,
    href: "/mission",
    title: "Design the mission",
    summary: "Pick a launcher, instruments, power, and an antenna for the elephants' rover to the lunar south pole.",
    action: "Start the mission",
  },
  {
    id: "parade",
    number: 2,
    href: "/parade/thanksgiving-2026",
    title: "Thanksgiving 2026 Parade",
    summary: "The first parade in Furball Frenzy history: marching bands, giant balloons, and the American Space Program bringing up the rear.",
    action: "Watch the parade",
    isNew: true,
  },
];
