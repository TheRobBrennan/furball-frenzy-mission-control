// Every mission a visitor can play, in the order they arrived. The Missions page and its tests read this.

export type Mission = { id: string; number: number; href: string; title: string; summary: string; action: string; image: { src: string; alt: string }; isNew?: boolean };

export const missions: Mission[] = [
  {
    id: "design",
    number: 1,
    href: "/missions/lunar-south-pole",
    title: "Design the mission",
    summary: "Pick a launcher, instruments, power, and an antenna for the elephants' rover to the lunar south pole.",
    action: "Start the mission",
    image: { src: "/images/american-space-program.jpg", alt: "The two Polish elephants and a pilot pig under an American Space Program sign" },
  },
  {
    id: "parade",
    number: 2,
    href: "/missions/parade/thanksgiving-2026",
    title: "Thanksgiving 2026 Parade",
    summary: "The first parade in Furball Frenzy history: marching bands, giant balloons, and the American Space Program bringing up the rear.",
    action: "Watch the parade",
    // The empty street, so the balloons stay a surprise.
    image: { src: "/images/parade/street.jpg", alt: "A city street roped off with barriers, crowds waiting for the parade" },
    isNew: true,
  },
];
