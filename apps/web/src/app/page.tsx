import MissionNav from "@/components/MissionNav";
import Image from "next/image";
import ClearanceDesk from "@/components/ClearanceDesk";
import HomeBases from "@/components/fleet/HomeBases";
import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";
import StarDivider from "@/components/StarDivider";
import HeroPolaroid from "@/components/HeroPolaroid";
import ExtLink from "@/components/ExtLink";
import MissionPatch from "@/components/MissionPatch";
import MissionStatus from "@/components/MissionStatus";
import VersionLine from "@/components/VersionLine";

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

const meeting = [
  {
    src: "/images/piggy-meets-hamley-1.jpg",
    alt: "Piggy, a big pink pig with large eyes, with Hamley, a small pink Steiff pig, tucked in front of him",
    caption: "Piggy meets Hamley for the first time",
  },
  {
    src: "/images/piggy-meets-hamley-2.jpg",
    alt: "Piggy and Hamley seen from behind on a windowsill, looking out over trees and a lake",
    caption: "Taking in the view together",
  },
  {
    src: "/images/piggy-meets-hamley-3.jpg",
    alt: "Hamley and Piggy side by side on a windowsill next to a houndstooth curtain",
    caption: "Window seats",
  },
];

export default function Home() {
  return (
    <>
    <MissionNav />
    <main
      id="top"
      tabIndex={-1}
      className="relative isolate flex-1 overflow-hidden bg-gradient-to-b from-space via-space-2 to-space outline-none"
    >
      <div className="starfield absolute inset-0 -z-10 opacity-70" aria-hidden="true" />

      <div
        className="glow-planet pointer-events-none absolute -right-24 -top-24 -z-10 h-72 w-72 rounded-full sm:h-96 sm:w-96"
        aria-hidden="true"
      />

      <section className="relative mx-auto grid max-w-6xl items-center gap-8 px-6 pb-12 pt-8 lg:grid-cols-2 lg:gap-12 lg:pb-20 lg:pt-20">
        <div className="relative order-1 mx-auto w-full max-w-[19rem] sm:max-w-sm lg:order-2 lg:max-w-md">
          <HeroPolaroid />
          <MissionPatch className="patch-wobble pointer-events-none absolute -left-4 -top-6 z-10 h-24 w-24 drop-shadow-[0_6px_10px_rgba(0,0,0,0.55)] sm:-left-8 sm:-top-8 sm:h-28 sm:w-28" />
        </div>

        <div className="order-2 text-center lg:order-1 lg:text-left">
          <p className="mb-3 font-mono text-[0.65rem] uppercase tracking-[0.15em] text-ice sm:text-xs sm:tracking-[0.25em]">
            <ExtLink href="https://www.spaceappschallenge.org/">Space Apps 2026</ExtLink> &middot; Mostly classified
          </p>
          <h1 className="text-[clamp(1.75rem,8.5vw,2.25rem)] font-black leading-[1.1] tracking-tight sm:text-6xl lg:text-5xl xl:text-6xl">
            Furball Frenzy:{" "}
            <span className="whitespace-nowrap bg-gradient-to-r from-amber to-ember bg-clip-text text-transparent">
              Mission Control
            </span>
          </h1>
          <p className="mt-5 text-balance text-lg text-white/85 sm:text-xl">
            Two Polish elephants, one lifelong dream: shining in the American Space
            Program. Design the mission that gets them to the Moon.
          </p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:justify-center lg:justify-start">
            <a
              href="/mission"
              className="inline-flex min-h-12 items-center justify-center rounded-full bg-amber px-6 font-bold text-space shadow-lg shadow-amber/20 transition hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              Start the mission
            </a>
            <a
              href="#meet-the-crew"
              className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/30 px-6 font-bold text-white transition hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              Meet the crew
            </a>
          </div>
          <div className="mt-6 flex justify-center lg:justify-start">
            <MissionStatus />
          </div>
        </div>
      </section>

      <div className="binder">
        <div className="binder-inner">
      <StarDivider />

      <Reveal as="section" id="the-brief" className="mx-auto max-w-3xl scroll-mt-20 px-6 py-14 text-center sm:py-20">
        <SectionHeading eyebrow="The mission brief" />
        <blockquote className="mt-8 rounded-3xl border border-white/10 bg-white/5 p-6 text-left text-lg leading-relaxed text-white/90 shadow-2xl shadow-black/40 backdrop-blur sm:p-8 sm:text-center sm:text-2xl">
          The true heroes of our game follow the adventures, and the misadventures, of
          two space-enthusiast Polish elephants who want nothing more than to be part of
          the American Space Program and to shine as its international members.{" "}
          <span className="font-bold text-amber">Their lifelong dream!</span>
        </blockquote>
      </Reveal>

      <StarDivider />

      <Reveal as="section" id="classified" aria-label="Classified files" className="mx-auto max-w-3xl scroll-mt-20 px-6 py-14 text-left sm:py-20 sm:text-center">
        <SectionHeading eyebrow="Clearance required" title="Classified, by the elephants">
          <p>
            The Polish elephants keep a few things classified, just for the fun of it. A bit of
            humor, a good argument, or the right credentials will do. They love cameras,
            drawings, and every kind of media, and nothing makes them happier than bringing
            an idea or a conversation to life.
          </p>
        </SectionHeading>
        <div className="mt-8">
          <ClearanceDesk />
        </div>
      </Reveal>

      <Reveal
        as="section"
        aria-label="The Polish elephants"
        className="reveal-stagger mx-auto grid max-w-6xl gap-10 px-6 py-10 sm:grid-cols-2 sm:py-14 lg:grid-cols-3"
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
      </Reveal>

      <StarDivider />

      <HomeBases />

      <Reveal
        as="section"
        id="origin-stories"
        aria-label="The quest for the perfect home"
        className="mx-auto grid scroll-mt-20 max-w-6xl items-center gap-10 px-6 py-10 sm:py-16 lg:grid-cols-2"
      >
        <figure
          className="polaroid mx-auto w-full max-w-xs rounded-md bg-white p-3 pb-5 shadow-2xl shadow-black/60 lg:max-w-sm"
          style={{ ["--tilt" as string]: "-2deg" }}
        >
          <Image
            src="/images/elephants-at-the-meetup.jpg"
            alt="A Polish elephant in a white swm t-shirt on a wooden table next to a pint of beer and two Software Mansion coins"
            width={1200}
            height={1600}
            className="aspect-[3/4] w-full rounded-sm object-cover"
            sizes="(min-width: 1024px) 384px, 320px"
          />
          <figcaption className="mt-4 text-center font-mono text-xs font-semibold text-space sm:text-sm">
            A Polish elephant shares expertise over a delicious beverage at the{" "}
            <ExtLink href="https://ti.to/swm/react-native-seattle-meetup" onLight>
              React Native Seattle Meetup
            </ExtLink>
            , presented by{" "}
            <ExtLink href="https://swmansion.com/" onLight>
              Software Mansion
            </ExtLink>
          </figcaption>
        </figure>
        <div className="space-y-4 text-left">
          <SectionHeading eyebrow="Origin story" title="The quest for the perfect home" align="left">
            <p>
              The Polish elephants were on a quest to find a suitable home for their dreams
              and aspirations. They traveled all the way from Poland to share their application
              development and technical expertise at a <ExtLink href="https://reactnative.dev/">React Native</ExtLink>{" "}
              meetup hosted by <ExtLink href="https://swmansion.com/">Software Mansion</ExtLink> at{" "}
              <ExtLink href="https://www.stoupbrewing.com/">Stoup Brewing</ExtLink>, and to find a
              delicious beverage to enjoy. Back home,
              the elephants hail from Software Mansion in Kraków, Poland.
            </p>
            <p className="mt-4">
              After a beer, the shy elephant happily flagged down his brother to make sure
              the two of them, and their coins, could travel together safely and meet their
              new family in Seattle.
            </p>
          </SectionHeading>
        </div>
      </Reveal>

      <StarDivider />

      <Reveal
        as="section"
        aria-label="Piggy at the Puyallup Fair"
        className="mx-auto grid max-w-6xl items-center gap-10 px-6 py-10 sm:py-16 lg:grid-cols-2"
      >
        <div className="order-2 space-y-4 text-left lg:order-1">
          <SectionHeading eyebrow="Origin story" title="Piggy and the fair" align="left">
            <p>
              Piggy came from the Puyallup Fair in 2014, and he was enjoying an adult beverage
              when he was picked up. Big eyes, big ears, and a very good straw.
            </p>
          </SectionHeading>
        </div>
        <figure
          className="polaroid order-1 mx-auto w-full max-w-xs rounded-md bg-white p-3 pb-5 shadow-2xl shadow-black/60 lg:order-2 lg:max-w-sm"
          style={{ ["--tilt" as string]: "2.5deg" }}
        >
          <Image
            src="/images/piggy-at-the-fair-2014.jpg"
            alt="Piggy, a pink plush pig with big eyes and big ears, sipping a red drink through a straw from a red cup"
            width={900}
            height={1275}
            className="aspect-[3/4] w-full rounded-sm object-cover"
            sizes="(min-width: 1024px) 384px, 320px"
          />
          <figcaption className="mt-4 text-center font-mono text-xs font-semibold text-space sm:text-sm">
            Piggy in 2014, fresh from the fair
          </figcaption>
        </figure>
      </Reveal>

      <StarDivider />

      <Reveal
        as="section"
        aria-label="How Piggy met Hamley"
        className="mx-auto my-6 max-w-5xl px-4 sm:px-6"
      >
        <div className="tie-dye rounded-3xl px-6 py-12 text-left sm:py-16 sm:text-center">
          <SectionHeading eyebrow="Family" title="How Piggy met Hamley">
            <p>
              Hamley flew in from Hamleys toy store in London, England, with his new family, excited to know he would be
              meeting his big brother for the first time. Piggy and Hamley met in Chicago, over
              three nights of the{" "}
              <ExtLink href="https://en.wikipedia.org/wiki/Fare_Thee_Well:_Celebrating_50_Years_of_the_Grateful_Dead">
                Fare Thee Well Grateful Dead concerts
              </ExtLink>{" "}
              at <ExtLink href="https://www.soldierfield.com/">Soldier Field</ExtLink>.
              Hamley has looked up to him ever since.
            </p>
          </SectionHeading>
          <div className="reveal-stagger mt-8 grid gap-6 sm:grid-cols-3">
            {meeting.map((photo) => (
              <figure
                key={photo.src}
                className="mx-auto w-full max-w-xs overflow-hidden rounded-xl border border-white/10 bg-white/5 shadow-xl shadow-black/40 sm:max-w-none"
              >
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  width={1200}
                  height={1600}
                  className="aspect-[3/4] w-full object-cover"
                  sizes="(min-width: 640px) 30vw, 80vw"
                />
                <figcaption className="p-3 font-mono text-xs text-white/70">
                  {photo.caption}
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </Reveal>

        </div>
      </div>

      <footer id="footer" className="mx-auto max-w-5xl scroll-mt-20 text-balance px-6 pb-12 text-center font-mono text-xs text-white/50">
        <span className="block">
          Built over the 2026 <ExtLink href="https://www.spaceappschallenge.org/">NASA Space Apps Challenge</ExtLink> weekend at
          the local event hosted by <ExtLink href="https://www.spaceappsclt.org/">Space Apps Charlotte</ExtLink>.
        </span>
        <span className="mt-1 block">A team of one with a crew of curious and playful furballs.</span>
        <VersionLine />
      </footer>
    </main>
    </>
  );
}
