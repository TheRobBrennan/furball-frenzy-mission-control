// Parade Day, the second mission's first slice: a show to watch. Piggy leads, and the American Space Program
// closes the parade, in the spot where Santa would arrive. Pure data, so the player only has to show what is here.

// Real recordings, see public/audio/parade/CREDITS.md. Scenes that share a track play on through it.
export type ParadeTrack = "liberty-bell" | "drum-cadence" | "anchors-aweigh" | "zarathustra";

export type ParadeScene = {
  id: string;
  title: string;
  caption: string;
  alt: string;
  width: number;
  height: number;
  ms: number;
  track: ParadeTrack;
  /** Little Bear laughs over the music. */
  giggle?: boolean;
};

const tall = { width: 1194, height: 1600 };

export const paradeScenes: ParadeScene[] = [
  { id: "piggy-hamley", title: "Piggy and Hamley", caption: "Big brother and little brother, leading the charge.", alt: "Giant balloons of Piggy in a purple cardigan and Hamley in a rainbow coat", ...tall, ms: 6500, track: "liberty-bell" },
  { id: "bunnies", title: "Mister Bunny and Little Bunny", caption: "His favorite hat, from his first adventure to Kauai.", alt: "Giant balloons of Mister Bunny in a safari hat and Little Bunny holding a football", ...tall, ms: 5500, track: "liberty-bell" },
  { id: "kraken-mankind", title: "Kraken Bear and Mankind", caption: "Se-at-tle KRA-ken BEARRRRRrrrrr!!!!", alt: "Giant balloons of Kraken Bear in a white hoodie and his little buddy Mankind", ...tall, ms: 5500, track: "liberty-bell" },
  { id: "band-sports", title: "Strike up the band", caption: "The hawk takes the baton, and the Zamboni carries the big drum.", alt: "A marching band of hockey bears, hawk mascots, and a plush Zamboni", ...tall, ms: 5500, track: "drum-cadence" },
  { id: "torrent", title: "Torrent Bear and friends", caption: "Torrent Bear, the Unicorn, and two small friends.", alt: "Giant balloons of Torrent Bear, a unicorn, a little unicorn, and a husky puppy", ...tall, ms: 5500, track: "drum-cadence" },
  { id: "band-friends", title: "Another band", caption: "The rooster leads. Nobody argues with the rooster.", alt: "A marching band of plush pigs, a rooster and chick, a bear, a purple dog, and a unicorn", width: 1600, height: 1194, ms: 5500, track: "anchors-aweigh" },
  { id: "carolina", title: "The Carolina crew", caption: "The elephants brought a flag, and their tag.", alt: "Giant balloons of the gray elephant, the two Polish elephants, Blue Bear, a pink duck, and a race car", width: 1199, height: 1600, ms: 6000, track: "anchors-aweigh" },
  { id: "space-program", title: "The American Space Program", caption: "No sleigh this year. The rover is bringing up the rear.", alt: "Giant balloons of the Polish elephants stacked on their rover, with Hamlet and Little Bear", ...tall, ms: 9000, track: "zarathustra" },
  { id: "moon-float", title: "One last thing from Little Bear", caption: "“Careful up there. Safety and silliness first!”", alt: "A Moon float where the waving elephants drive their rover while Little Bear giggles", ...tall, ms: 10000, track: "zarathustra", giggle: true },
];

export const paradeImage = (scene: ParadeScene) => `/images/parade/${scene.id}.jpg`;

/** The scene after this one, or the same one at the end of the parade. */
export const nextScene = (index: number) => Math.min(index + 1, paradeScenes.length - 1);
export const previousScene = (index: number) => Math.max(index - 1, 0);

export const paradeAudio = (track: ParadeTrack) => `/audio/parade/${track}.mp3`;
