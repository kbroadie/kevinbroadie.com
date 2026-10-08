# kevinbroadie.com

Source for [kevinbroadie.com](https://kevinbroadie.com), the KBCS design & technology partner site. Plain HTML, CSS and JavaScript with no build step, published with GitHub Pages.

```
index.html        page markup
styles.css        all styles (light and dark themes via prefers-color-scheme)
script.js         scroll reveals, footer year, contact form
404.html          not-found page
images/logo.png   KBCS mark (also the favicon)
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
```

The repo-only files (`README.md`, `.nojekyll`) aren't needed on the host.

## Contact form

The form doesn't post anywhere. It validates the fields and opens the visitor's email app with a pre-filled message. The recipient is `CONTACT_EMAIL` at the top of `script.js`.
