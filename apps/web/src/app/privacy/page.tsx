import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";

export const metadata: Metadata = { title: "Privacy | Furball Frenzy: Mission Control" };

export default function PrivacyPage() {
  return (
    <LegalPage title="Privacy" updated="2026-11-25">
      <p>
        Furball Frenzy: Mission Control is a small game built by one person over the 2026 NASA Space Apps Challenge weekend, with a crew of furballs based in North
        Carolina. This page says plainly what the site does with information about you.
      </p>
      <h2>What we do not collect</h2>
      <ul>
        <li>There are no accounts, so no names, emails, or passwords.</li>
        <li>We do not sell or share information about you with advertisers.</li>
        <li>The mission you design stays in your browser. Anything you type to convince the elephants stays on your device.</li>
      </ul>
      <h2>What stays on your device</h2>
      <p>The site remembers a few choices in your browser, these choices stay on your device:</p>
      <ul>
        <li>The story speed and whether sound is on.</li>
        <li>Whether you have already cleared the elephants from the case, so it does not ask again in the same visit.</li>
      </ul>
      <h2>Analytics</h2>
      <p>
        On the live site, anonymous page views and mission progress events are enabled by default when analytics is configured. PostHog receives the page path,
        progress such as reaching launch or viewing the debrief, and random IDs kept in browser memory until you reload or close the page.
        Your part selections stay on your device. We respect Do Not Track and use no analytics cookies or session recordings.
        Use Settings to turn analytics off or on. Your choice is saved in this browser for future visits.
      </p>
      <h2>Updates by email, only if you sign up</h2>
      <p>
        If a Stay updated box is shown and you use it, your email address goes to Flodesk, the email service we use, and is used only to send you updates about the
        Furball Frenzy and the adventures of the Polish elephants and family. This site never sees or stores your address. Flodesk&apos;s script and form load only when you press the sign-up button, so just visiting the site sends nothing to Flodesk. Unsubscribe from any email, any time.
      </p>
      <h2>Children</h2>
      <p>The game is for everyone, and we ask for nothing personal from anyone.</p>
      <h2>Questions</h2>
      <p>Open an issue on the project&apos;s GitHub repository and ask. We will answer there.</p>
    </LegalPage>
  );
}
