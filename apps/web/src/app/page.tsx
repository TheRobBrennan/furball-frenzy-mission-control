import Image from "next/image";
import MissionStatus from "@/components/MissionStatus";

const photos = [
  {
    src: "/images/elephants-at-the-window.jpg",
    alt: "The two Polish elephants in white swm t-shirts with two pig plushies at an airplane window",
    width: 1500,
    height: 2000,
    tilt: "-3deg",
    caption: "Cleared for takeoff",
  },
  {
    src: "/images/american-space-program.jpg",
    alt: "An illustration of two elephants and a pilot pig in an aviator cap under an American Space Program sign",
    width: 1024,
    height: 1024,
    tilt: "2deg",
    caption: "Reporting to the American Space Program",
  },
  {
    src: "/images/elephants-on-green.jpg",
    alt: "The two Polish elephants in white swm t-shirts sitting side by side on a green blanket",
    width: 1500,
    height: 2000,
    tilt: "-1.5deg",
    caption: "Suited up and ready",
  },
];

const crew = {
  "Rockingham, NC": [
    "The Polish Elephants",
    "Captain Piggy",
    "Hamley",
    "Blue Bear",
  ],
  "Seattle WA": [
    "Hamlet",
    "Little Bear",
    "Little Bunny",
    "Kraken Bear",
    "Fuzzy Black Bear",
  ],
};

export default function Home() {
  return (
    <main className="relative isolate flex-1 overflow-hidden bg-gradient-to-b from-space via-space-2 to-space">
      <div className="starfield absolute inset-0 -z-10 opacity-70" aria-hidden="true" />

      <section className="mx-auto flex max-w-5xl flex-col items-center px-6 pb-16 pt-20 text-center">
        <p className="mb-4 font-mono text-xs uppercase tracking-[0.35em] text-ice">
          NASA Space Apps Challenge 2026 &middot; Space Mission Design Game
        </p>
        <h1 className="text-5xl font-black leading-tight tracking-tight sm:text-7xl">
          Furball Frenzy:{" "}
          <span className="bg-gradient-to-r from-amber to-ember bg-clip-text text-transparent">
            Mission Control
          </span>
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-white/80 sm:text-xl">
          Design a space mission. Balance the mass, the power, and the budget. Get the
          elephants to the Moon.
        </p>
        <p className="mt-3 font-mono text-sm text-amber">
          A web game anyone can play, launching soon
        </p>
        <div className="mt-8">
          <MissionStatus />
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-6 pb-12 text-center">
        <blockquote className="rounded-3xl border border-white/10 bg-white/5 p-8 text-xl leading-relaxed text-white/90 shadow-2xl shadow-black/40 backdrop-blur sm:text-2xl">
          The true heroes of our game follow the adventures, and the misadventures, of
          two space-enthusiast Polish elephants who want nothing more than to be part of
          the American Space Program and to shine as its international members.{" "}
          <span className="font-bold text-amber">Their lifelong dream!</span>
        </blockquote>
      </section>

      <section
        aria-label="The Polish elephants"
        className="mx-auto grid max-w-6xl gap-10 px-6 py-12 sm:grid-cols-2 lg:grid-cols-3"
      >
        {photos.map((photo) => (
          <figure
            key={photo.src}
            className="polaroid mx-auto w-full max-w-sm rounded-md bg-white p-3 pb-5 shadow-2xl shadow-black/60"
            style={{ ["--tilt" as string]: photo.tilt }}
          >
            <Image
              src={photo.src}
              alt={photo.alt}
              width={photo.width}
              height={photo.height}
              className="aspect-[4/5] w-full rounded-sm object-cover"
              sizes="(min-width: 1024px) 384px, (min-width: 640px) 45vw, 90vw"
            />
            <figcaption className="mt-4 text-center font-mono text-sm font-semibold text-space">
              {photo.caption}
            </figcaption>
          </figure>
        ))}
      </section>

      <section
        aria-label="The Rockingham crew"
        className="mx-auto grid max-w-6xl items-center gap-10 px-6 py-12 lg:grid-cols-2"
      >
        <figure
          className="polaroid mx-auto w-full max-w-xl rounded-md bg-white p-3 pb-5 shadow-2xl shadow-black/60"
          style={{ ["--tilt" as string]: "1.5deg" }}
        >
          <Image
            src="/images/rockingham-crew.jpg"
            alt="Blue Bear, the two Polish elephants, a larger elephant, a pink rubber duck, and a NASCAR race car piled together on a bed"
            width={2000}
            height={1500}
            className="aspect-[4/3] w-full rounded-sm object-cover"
            sizes="(min-width: 1024px) 576px, 90vw"
          />
          <figcaption className="mt-4 text-center font-mono text-sm font-semibold text-space">
            The Rockingham crew, gathering before launch
          </figcaption>
        </figure>
        <div className="space-y-4 text-center lg:text-left">
          <h2 className="text-3xl font-black sm:text-4xl">Launch site: classified</h2>
          <p className="text-lg text-white/80">
            The Rockingham crew launches from an undisclosed location. All we can say
            is that it is a lake, and it is right out in their backyard.
          </p>
          <p className="font-mono text-sm text-ice">
            Coordinates withheld by order of Mission Control
          </p>
        </div>
      </section>

      <section
        aria-label="The Seattle crew"
        className="mx-auto max-w-4xl px-6 py-12 text-center"
      >
        <h2 className="text-3xl font-black sm:text-4xl">Meanwhile, in Seattle</h2>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-white/80">
          The Seattle crew is bopping around town between missions, keeping tabs on
          Mission Control from the Space Needle, Pike Place Market, and Climate Pledge
          Arena, the Kraken Bear&apos;s favorite.
        </p>
        <ul className="mt-6 flex flex-wrap justify-center gap-3 font-mono text-sm">
          {["Space Needle", "Pike Place Market", "Climate Pledge Arena"].map((place) => (
            <li
              key={place}
              className="rounded-full border border-white/15 bg-white/5 px-4 py-2"
            >
              {place}
            </li>
          ))}
        </ul>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-16">
        <h2 className="text-center text-3xl font-black sm:text-4xl">The crew</h2>
        <p className="mx-auto mt-3 max-w-xl text-center text-white/70">
          Everyone is in the game, wherever they are. More furballs join along the way.
        </p>
        <div className="mt-10 grid gap-8 sm:grid-cols-2">
          {Object.entries(crew).map(([place, names]) => (
            <div
              key={place}
              className="rounded-2xl border border-white/10 bg-white/5 p-6"
            >
              <h3 className="font-mono text-sm uppercase tracking-widest text-ice">
                {place}
              </h3>
              <ul className="mt-4 space-y-2 text-lg">
                {names.map((name) => (
                  <li key={name} className="flex items-center gap-3">
                    <span className="text-amber" aria-hidden="true">
                      &#9733;
                    </span>
                    {name}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <footer className="mx-auto max-w-5xl px-6 pb-12 text-center font-mono text-xs text-white/50">
        Built over the 2026 NASA Space Apps Challenge weekend, Charlotte, NC local
        event. A team of one with a crew of plush explorers.
      </footer>
    </main>
  );
}
