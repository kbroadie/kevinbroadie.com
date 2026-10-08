# kevinbroadie.com

Source for [kevinbroadie.com](https://kevinbroadie.com), the KBCS design & technology partner site. Plain HTML, CSS and JavaScript with no build step, published with GitHub Pages.

```
index.html        page markup
styles.css        all styles (light and dark themes via prefers-color-scheme)
script.js         scroll reveals, footer year, contact form
404.html          not-found page
images/logo.png   KBCS mark (also the favicon)
images/kevin.jpg  founder photo
.nojekyll         tells GitHub Pages to serve the files as-is
```

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
styles.css
script.js
404.html
images/logo.png
images/kevin.jpg
```

The repo-only files (`README.md`, `.nojekyll`) aren't needed on the host.

## Contact form

The form validates the fields, then either:

- opens the visitor's email app with a pre-filled message to `CONTACT_EMAIL` (the default), or
- if `FORM_ENDPOINT` is set, sends the message directly to a form service such as [Formspree](https://formspree.io), and falls back to the email app if that fails.

Both settings are at the top of `script.js`. The budget and timeline options are in `index.html`; adjust the budget ranges to match your pricing.

## Before going live: placeholders

Anything not yet known is wrapped in `<span class="todo">[...]</span>` and shows up highlighted with a dashed pink outline. To list them all:

```sh
grep -n 'class="todo"' index.html
```

They cover:

- **Prices:** audit fee and timeframe, partner retainer and project minimums (these appear in the audit card, the engagement cards, and the contact section).
- **Audit terms:** QA scope and how long the fee credit lasts.
- **Partner quote** in the selected-work section. Use a real quote, with permission, or delete the `<figure class="quote">`.
- **Contact:** reply time.

The founder section and case notes come from Kevin's LinkedIn profile; keep them in step with it. Also check that the audit description and the agency promises match how you actually work. The accessibility deadlines are current as of October 2026.
