import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";

export const metadata: Metadata = { title: "Privacy | Furball Frenzy: Mission Control" };

export default function PrivacyPage() {
  return (
    <LegalPage title="Privacy" updated="2026-11-15">
      <p>
        Furball Frenzy: Mission Control is a small game built by one person over the 2026 NASA Space Apps Challenge weekend, with a crew of furballs based in North
        Carolina. This page says plainly what the site does with information about you.
      </p>
      <h2>What we do not collect</h2>
      <ul>
        <li>There are no accounts, so no names, emails, or passwords.</li>
        <li>We do not sell or share information about you with advertisers.</li>
        <li>The mission you design stays in your browser. The Clearance Desk and the story run on your device.</li>
      </ul>
      <h2>What stays on your device</h2>
      <p>The site remembers a few choices in your browser, nothing is sent anywhere:</p>
      <ul>
        <li>The story speed and whether sound is on.</li>
        <li>Whether you have already cleared the elephants from the case, so it does not ask again in the same visit.</li>
        <li>Your answer to the analytics question below.</li>
      </ul>
      <h2>Analytics and session replay, only if you say yes</h2>
      <p>
        To learn which parts of the game are fun and which are confusing, the site can use PostHog, a product analytics service. It is off until you choose Yes in the
        notice at the bottom of the page. If you choose No, nothing is recorded and the notice does not come back.
      </p>
      <ul>
        <li>If you choose Yes, PostHog records which pages you open and which mission events happen, such as a launch and its result.</li>
        <li>It may also record a replay of your session, how the page looked and where you clicked. Text you type into fields is masked and never recorded.</li>
        <li>We use it only to improve the game. You can change your mind at any time by clearing this site&apos;s data in your browser.</li>
      </ul>
      <h2>Children</h2>
      <p>The game is for everyone, and we ask for nothing personal from anyone.</p>
      <h2>Questions</h2>
      <p>Open an issue on the project&apos;s GitHub repository and ask. We will answer there.</p>
    </LegalPage>
  );
}
