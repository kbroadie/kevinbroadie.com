# kevinbroadie.com

Source for [kevinbroadie.com](https://kevinbroadie.com), the KBCS design & technology partner site. A static site with no build step.

```
index.html        page markup
styles.css        all styles
script.js         scroll reveals, footer year, contact form
images/logo.png   KBCS mark (also used as the favicon)
```

## Preview locally

Any static file server works, for example:

```sh
python3 -m http.server 8000
```

Then open http://localhost:8000.

## Contact form

The form doesn't post anywhere. It validates the fields and opens the visitor's email app with a pre-filled message. The recipient is `CONTACT_EMAIL` at the top of `script.js`.
