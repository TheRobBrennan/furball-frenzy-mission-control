# Email sign-up with Flodesk

The "Stay updated" box lets folks join a Flodesk list for news about the Furball Frenzy and the adventures of the Polish elephants and family. It is on by default with the form id from Flodesk's embed code (`6afa20d07c61c44f4b4fe6cc`, public by design, in `apps/web/src/lib/updates.ts`).

## How it works
- The box sits just above the footer on the home page and under the builder on the mission page.
- Nothing loads from Flodesk until a visitor presses "Send me the updates". Then Flodesk's universal script loads from `assets.flodesk.com` (the same loader as Flodesk's header snippet) and the form appears inside the box.
- No email address ever touches this site, and just visiting sends nothing to Flodesk.

## Change or turn it off
Set `FLODESK_FORM_ID` when the web image is built to use another form, or `none` to hide the box.

## Style and the thank you
The form's look, fields, and welcome email are set in Flodesk. The box around it is the game's.

The thank you from the elephants and the crew is a page on the site, `/thanks`. In Flodesk, open the form, go to its Success step, choose to redirect to a URL, and enter the thank you page: `https://furball-frenzy.sploosh.ai/thanks` (and `https://furball-frenzy-nasa-space-apps-challenge-2026.sploosh.ai/thanks` if the form is only for the judging copy). Also point the form's Privacy policy link at the site's `/privacy` page.
