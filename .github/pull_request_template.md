## What

## Screenshots

For anything a person can see, show it from the running app (`npr start`), before and after for a
change, linked by commit SHA. Include the phone width.

| Desktop | Phone (375 x 812) |
| --- | --- |
|  |  |

## Checklist

- [ ] Checked at phone width (375), tablet (768), and desktop, no horizontal scroll
- [ ] Tap targets are comfortable, text is readable without zooming
- [ ] Public text, alt text, filenames, and images say North Carolina, no town, street, or coordinates, and image metadata is stripped
- [ ] `npr test` passes
- [ ] Responsive pass at 320, 375, 768, and 1280: no sideways scroll, button rows on one line, screenshots looked at
- [ ] PostHog: events added, documented, tested, and privacy copy updated, or the PR says why none are needed
