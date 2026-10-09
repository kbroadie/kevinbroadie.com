# kevinbroadie.com

Source for [kevinbroadie.com](https://kevinbroadie.com), the KBCS design & technology partner site. Plain HTML, CSS and JavaScript with no build step, published with GitHub Pages.

```
index.html            home: hero, client logos, overview, featured work, engagements
audit.html            the audit: what we audit, fee and terms, "build your request" picker
accessibility.html    WCAG 2.1 AA, deadlines, no overlays, live contrast checker
services.html         the five steps, training, presentations, advising
work.html             case notes, filterable project gallery, clients by industry
about.html            Kevin Broadie, how we work
contact.html          contact form
404.html              not-found page
offline.html          shown when a visitor is offline and the page isn't saved yet
styles.css            all styles (light and dark themes)
script.js             tab bar sheet, theme switch, gallery, tools, contact form
sw.js                 service worker: offline support
manifest.webmanifest  lets phones add the site to the home screen as an app
images/logo.png       KBCS mark (also the favicon)
images/kevin.jpg      founder photo
images/icons/         home-screen icons
images/logos/         client and publication logos (one-color WebP silhouettes)
images/photos/        stock photos (credits below)
images/work/          project images
.nojekyll             tells GitHub Pages to serve the files as-is
```

Every page carries its own copy of the shared parts: the header, the footer (with the Auto / Light / Dark theme switch), the phone tab bar, and the "More" sheet. When you change one, change them all.

## How it behaves like an app

- **Phones and tablets** get a bottom tab bar (Home, Services, Audit, Work, More). "More" opens a sheet with the other pages and the theme switch. Desktops keep the header navigation.
- **Theme:** Auto follows the device setting; Light or Dark is remembered in the browser.
- **Page transitions** fade between pages in browsers that support them. Animations are skipped for visitors who turn on reduced motion.
- **Swipe between sections** on touch screens, in tab bar order: Home, Services, Audit, Work, Accessibility, About, Contact. A label shows where the swipe leads, and the page slides in from that side. Swipes are ignored on form fields, the Work filters and image carousels, the contrast checker, and the survey demo, and within 24 pixels of the screen edge (left to the phone's own back gesture). The tab bar does the same job for anyone who doesn't swipe. First-time phone visitors get a one-line tip.
- **Custom apps demo:** the Services page has a working pairwise survey (ten head-to-head questions, then a ranked result), labeled as a demo with made-up options.
- **Work:** the gallery filters by industry, and each project opens in a sheet with swipeable images. Links like `work.html#grounded` open a project directly.
- **Offline and home screen:** `sw.js` saves pages as they're visited so they open without a connection, and `manifest.webmanifest` lets visitors add the site to their home screen. **Bump `VERSION` at the top of `sw.js` whenever you upload changes**, so returning visitors get the new files.
- The client logo strip scrolls slowly and has a Pause button. It sits still when the logos fit, and for visitors who prefer reduced motion.

## Preview locally

```sh
python3 -m http.server 8000
```

Then open http://localhost:8000.

## GitHub Pages

Every push to `main` publishes the site to https://kbroadie.github.io/kevinbroadie.com/, a working copy for reviewing changes. One-time setup: **Settings → Pages**, set **Source** to *Deploy from a branch*, then pick `main` and `/ (root)`.

The page's canonical link points at https://kevinbroadie.com/, so search engines treat the GitHub copy as a duplicate rather than a competing site.

## Updating the live site

kevinbroadie.com is served by a separate web host. To publish, upload these to the site's root folder there:

```
index.html
audit.html
accessibility.html
services.html
work.html
about.html
contact.html
404.html
offline.html
styles.css
script.js
sw.js
manifest.webmanifest
images/   (the whole folder: logo.png, kevin.jpg, icons/, logos/, photos/, work/)
```

The repo-only files (`README.md`, `.nojekyll`) aren't needed on the host.

## Contact form

The form validates the fields, then either:

- opens the visitor's email app with a pre-filled message to `CONTACT_EMAIL` (kbroadie+kbcs@gmail.com, the default), or
- if `FORM_ENDPOINT` is set, sends the message directly to a form service such as [Formspree](https://formspree.io), and falls back to the email app if that fails.

Both settings are at the top of `script.js`. The same address and the phone number (760-409-6303) appear in every page's footer and "More" sheet, on the contact page, and in the home page's structured data. The choices ("You are", "Interested in", budget, timeline) are tap-to-select pills in `contact.html`; adjust the budget ranges to match your pricing. Links such as `contact.html?interest=An+audit` pre-select the matching pills, and the audit page's "build your request" picker carries the chosen areas into the message.

## Pricing and terms

The published prices are starting points set from market benchmarks for comparable services (October 2026). Change them to suit:

| Item | On the site | Benchmark |
|---|---|---|
| Audit (digital, print, systems, copy) | from $3,500, about two weeks; fee set before starting | Fixed-price UX audits start around $1,500–2,000; paid roadmapping or discovery runs $1,500–5,000 over 1–3 weeks. Scope varies with what is audited. |
| Fee credit | 30 days | Common pattern: the discovery fee comes off the first invoice if the client continues within 30 days. |
| Partner retainer | from $5,000 / month | Fractional creative direction starts around $5,000–7,000 a month; commodity white-label hours run $500–5,000. |
| Projects | from $10,000 | Discovery is typically 5–10% of a project; matches the "Under $10k" budget option in the form. |
| Reply time | two business days | |

Prices appear on the home, audit and contact pages; search the HTML files for `$` to find them all.

The founder section comes from Kevin's LinkedIn profile; keep it in step with it. Also check that the audit description and the agency promises match how you actually work. The accessibility deadlines are current as of October 2026.

A partner quote block is commented out in the selected-work section. Add a real quote, with permission, when you have one.

## Images and credits

Stock photos are public domain or CC0 from Flickr, so no credit is required; they're listed here for the record.

| File | Photo | By |
|---|---|---|
| `photos/wind-farm` | [Palm Springs Windmills](https://www.flickr.com/photos/51314820@N00/15914534007) | Henrique Vicente (CC0) |
| `photos/joshua-tree` | [Joshua tree sunset](https://www.flickr.com/photos/115357548@N08/52013517656) | Joshua Tree National Park (public domain) |
| `photos/keyboard` | [Keys on a Keyboard](https://www.flickr.com/photos/132795455@N08/17596421283) | Image Catalog (CC0) |
| `photos/type-case` | [Type face for printing press](https://www.flickr.com/photos/59809888@N06/6873457237) | South Australian History Network (CC0) |
| `photos/laptop` | [Hands Typing on Laptop Keyboard](https://www.flickr.com/photos/132795455@N08/21713977623) | Image Catalog (CC0) |

Project images in `images/work/` are from the published case studies for those clients. Logos in `images/logos/` belong to their owners, made one-color so they sit together; dark mode inverts them. The Palm Springs Life logo comes from the magazine's own site, by way of its Internet Archive copy. Clients without a usable logo (Babe's Barbecue, Bootlegger Tiki, The Draughtsman, Persimmon, Arroyos at Desert Princess) appear as text until a logo is supplied.

Logos are sized by visual weight, not by box: each `<img>` carries `--s` (a scale, from its proportions and how much ink it has) and sometimes `--y` (a small vertical nudge toward its visual center). A wide, light wordmark gets more height than a compact, heavy badge, so the row reads evenly. When you add a logo, trim it tight, make it one color on transparent, and start from `--s:1`, then adjust by eye.

Photos are WebP, sized for where they appear. Each photo band has a phone version (640 pixels wide) and a desktop version pre-cropped to the band's 21:9 shape (`-wide`), so no screen downloads pixels it won't show. Bands weigh 6–45 KB on phones and 10–85 KB on desktops. Keep new images in the same range: compress them, and never ship one image to every screen size.
