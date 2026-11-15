# Email sign-up with Flodesk

The "Stay updated" box lets folks join a Flodesk list for news about the Furball Frenzy and the adventures of the Polish elephants and family. It shows only when a form link is set. No email address ever touches this site, the box opens Flodesk's own hosted form in a new tab.

## Turn it on
1. In Flodesk, create a form (Audience, Forms, New form) for a segment such as "Furball Frenzy updates". Write the form's own text, and turn on a double opt-in welcome email if you want one.
2. Publish it and copy the form's **Share** link, it looks like `https://my.flodesk.com/xxxxxxxx`.
3. Set it where the image is built:
   - Locally: `FLODESK_FORM_URL=https://my.flodesk.com/... make build`
   - On the VM: add `FLODESK_FORM_URL=https://my.flodesk.com/...` to `.env.deploy`, then deploy. For the frozen copy, set it in `.env.deploy.nasa-2026` before the final tag deploy.
4. Open the site, the box appears above the footer and after a mission debrief.

Only an https link on `flodesk.com` is accepted, anything else is ignored.
