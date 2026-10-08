# kevinbroadie.com

Source for [kevinbroadie.com](https://kevinbroadie.com), the KBCS design & technology partner site. Plain HTML, CSS and JavaScript with no build step, published with GitHub Pages.

```
index.html          home: hero, overview of what we do, engagements
audit.html          the audit: what we audit, fee and terms
accessibility.html  WCAG 2.1 AA, deadlines, no overlays
services.html       the five steps, training, presentations, advising
work.html           selected work
about.html          Kevin Broadie, how we work
contact.html        contact form
404.html            not-found page
styles.css          all styles (light and dark themes via prefers-color-scheme)
script.js           phone menu, scroll reveals, footer year, contact form
images/logo.png     KBCS mark (also the favicon)
images/kevin.jpg    founder photo
.nojekyll           tells GitHub Pages to serve the files as-is

Every page carries its own copy of the header (navigation) and footer. When you change one, change them all.
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
audit.html
accessibility.html
services.html
work.html
about.html
contact.html
404.html
styles.css
script.js
images/logo.png
images/kevin.jpg
```

The repo-only files (`README.md`, `.nojekyll`) aren't needed on the host.

## Contact form

The form validates the fields, then either:

- opens the visitor's email app with a pre-filled message to `CONTACT_EMAIL` (the default), or
- if `FORM_ENDPOINT` is set, sends the message directly to a form service such as [Formspree](https://formspree.io), and falls back to the email app if that fails.

Both settings are at the top of `script.js`. The budget and timeline options are in `contact.html`; adjust the budget ranges to match your pricing. Links such as `contact.html?interest=An+audit` pre-select the form's "Interested in" and "You are" options.

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
