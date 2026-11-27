// Parade Day, the second mission's first slice: a show to watch. The American Space Program closes the
// parade, in the spot where Santa would arrive. Pure data, so the player only has to show what is here.

export type ParadeSound = "fanfare" | "drums" | "cheer" | "radio" | "giggle";

export type ParadeScene = {
  id: string;
  title: string;
  caption: string;
  alt: string;
  width: number;
  height: number;
  ms: number;
  sound: ParadeSound;
};

const tall = { width: 1194, height: 1600 };

export const paradeScenes: ParadeScene[] = [
  { id: "whole-parade", title: "Parade Day", caption: "Every furball showed up. Even the duck.", alt: "The whole furball Thanksgiving parade, marching bands in front and giant balloons behind", width: 1600, height: 893, ms: 6000, sound: "fanfare" },
  { id: "band-sports", title: "Here come the bands", caption: "The hawk takes the baton, and the Zamboni carries the big drum.", alt: "A marching band of hockey bears, hawk mascots, and a plush Zamboni", ...tall, ms: 5500, sound: "drums" },
  { id: "band-friends", title: "And the friends", caption: "The rooster leads. Nobody argues with the rooster.", alt: "A marching band of plush pigs, a rooster and chick, a bear, a purple dog, and a unicorn", width: 1600, height: 1194, ms: 5500, sound: "drums" },
  { id: "piggy-hamley", title: "Piggy and Hamley", caption: "Big brother and little brother, leading the charge.", alt: "Giant balloons of Piggy in a purple cardigan and Hamley in a rainbow coat", ...tall, ms: 5500, sound: "cheer" },
  { id: "bunnies", title: "Mister Bunny and Little Bunny", caption: "His favorite hat, from his first adventure to Kauai.", alt: "Giant balloons of Mister Bunny in a safari hat and Little Bunny holding a football", ...tall, ms: 5500, sound: "cheer" },
  { id: "kraken-mankind", title: "Kraken Bear and Mankind", caption: "Se-at-tle KRA-ken BEARRRRRrrrrr!!!!", alt: "Giant balloons of Kraken Bear in a white hoodie and his little buddy Mankind", ...tall, ms: 5500, sound: "fanfare" },
  { id: "carolina", title: "The Carolina crew", caption: "The elephants brought a flag, and their tag.", alt: "Giant balloons of the gray elephant, the two Polish elephants, Blue Bear, a pink duck, and a race car", width: 1199, height: 1600, ms: 6000, sound: "cheer" },
  { id: "torrent", title: "Torrent Bear and friends", caption: "Torrent Bear, the Unicorn, and two small friends.", alt: "Giant balloons of Torrent Bear, a unicorn, a little unicorn, and a husky puppy", ...tall, ms: 5500, sound: "cheer" },
  { id: "space-program", title: "The American Space Program", caption: "No sleigh this year. The rover is bringing up the rear.", alt: "Giant balloons of the Polish elephants stacked on their rover, with Hamlet and Little Bear", ...tall, ms: 6500, sound: "radio" },
  { id: "moon-float", title: "One last thing from Little Bear", caption: "“Careful up there. Safety and silliness first!”", alt: "A Moon float where the elephants drive their rover while Little Bear giggles", ...tall, ms: 8000, sound: "giggle" },
];

export const paradeImage = (scene: ParadeScene) => `/images/parade/${scene.id}.jpg`;

/** The scene after this one, or the same one at the end of the parade. */
export const nextScene = (index: number) => Math.min(index + 1, paradeScenes.length - 1);
export const previousScene = (index: number) => Math.max(index - 1, 0);
