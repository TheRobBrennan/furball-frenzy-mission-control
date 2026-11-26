import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";

export const metadata: Metadata = { title: "Terms | Furball Frenzy: Mission Control" };

export default function TermsPage() {
  return (
    <LegalPage title="Terms" updated="2026-11-25">
      <p>By using this site you agree to these short terms. They are written for a small, friendly game.</p>
      <h2>What this is</h2>
      <p>
        Furball Frenzy: Mission Control is a game made for fun and for learning, built for the 2026 NASA Space Apps Challenge. It is not affiliated with, endorsed by,
        or sponsored by NASA or the Space Apps Challenge.
      </p>
      <h2>Content note</h2>
      <p>The game includes mild adult themes, including occasional depictions of characters drinking beer. The depictions are lighthearted and non-explicit.</p>
      <h2>It is a game, not engineering advice</h2>
      <p>
        The numbers in the mission builder are simplified and made up to teach how a mission trades mass, power, cost, and data. Do not use them to design a real
        spacecraft.
      </p>
      <h2>Use it kindly</h2>
      <ul>
        <li>Play, share, and enjoy it. Do not try to break it, overload it, or use it to harm anyone.</li>
        <li>The characters, art, and story belong to their creator. Please do not pass them off as yours.</li>
      </ul>
      <h2>No promises</h2>
      <p>The site is provided as it is, with no promise that it is always available or free of mistakes. It may change or go away.</p>
      <h2>Privacy</h2>
      <p>
        How the site handles information about you is on the <a href="/privacy" className="underline underline-offset-4">privacy page</a>.
      </p>
    </LegalPage>
  );
}
