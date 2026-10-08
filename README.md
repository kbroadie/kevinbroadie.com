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

## Publishing (GitHub Pages)

One-time setup: in the repo go to **Settings → Pages**, set **Source** to *Deploy from a branch*, then pick `main` and `/ (root)`. Every push to `main` then publishes to https://kbroadie.github.io/kevinbroadie.com/ within a minute or two.

### Moving kevinbroadie.com onto GitHub Pages

When the preview looks right:

1. In **Settings → Pages → Custom domain**, enter `kevinbroadie.com` and save. GitHub commits a `CNAME` file to `main`.
2. At your domain registrar, point the domain at GitHub Pages:
   - `A` records for `@`: `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
   - `CNAME` record for `www`: `kbroadie.github.io`
3. Once the DNS check passes, tick **Enforce HTTPS**.

## Contact form

The form doesn't post anywhere. It validates the fields and opens the visitor's email app with a pre-filled message. The recipient is `CONTACT_EMAIL` at the top of `script.js`.
