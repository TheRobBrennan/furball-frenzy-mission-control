import ExtLink from "@/components/ExtLink";
import LegalLinks from "@/components/LegalLinks";
import VersionLine from "@/components/VersionLine";

/** The footer card: who built this, the legal links, and the version. */
export default function SiteFooter() {
  return (
    <footer id="footer" className="mx-auto w-full max-w-6xl scroll-mt-20 px-4 pb-10 pt-6 sm:px-6 sm:pb-14">
      <div className="rounded-2xl border border-white/15 bg-space/90 px-5 py-4 text-[13px] shadow-xl shadow-black/25 sm:px-7">
        <div className="flex flex-col gap-1 md:flex-row md:items-center md:justify-between md:gap-6">
          <p className="leading-relaxed text-white/85">
            Built by one with a crew of furballs for the 2026{" "}
            <ExtLink href="https://www.spaceappschallenge.org/">NASA Space Apps Challenge</ExtLink> at{" "}
            <ExtLink href="https://www.spaceappsclt.org/">Space Apps Charlotte</ExtLink>.
          </p>
          <LegalLinks inline />
        </div>
        <VersionLine />
      </div>
    </footer>
  );
}
