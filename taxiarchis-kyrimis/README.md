# Ταξιάρχης Κυρίμης — Ιατρός Ενδοκρινολόγος

Greek-language website for an endocrinology practice in Piraeus, built on the same template as stavrosflamouridis.gr, in a black, white and grey palette: grey hero, portrait area, rounded service cards, expandable qualifications and an appointment request form.

## Development

The site is static HTML, CSS and JavaScript. All fonts and images are included in `assets/`.

Run from the repository root:

```sh
python -m http.server 4173 --bind 127.0.0.1
```

Open http://127.0.0.1:4173/. Edit `index.html`, `styles.css`, `script.js` and `contact.js`, then refresh the browser.

## Before going live

- **Email:** replace `iatreio@example.com` in `index.html` with the practice's address (search for `example.com`). `contact.js` reads it from the form's `data-email` attribute.
- **Portrait:** `assets/portrait-placeholder.svg` is a placeholder. Add a portrait with a transparent background (2:3, e.g. 1024×1536 `.webp`) and point the hero `<img>` and the `preload` link in `index.html` to it.
- **Placeholders:** fill in every block marked `ΠΡΟΣ ΣΥΜΠΛΗΡΩΣΗ` (studies, specialty training, experience, memberships, opening hours), then remove the `todo` spans.
- **Details:** confirm the address and phone numbers with the doctor. They come from public directory listings.
- **Domain:** add a `CNAME` file, and the `canonical` and `og:url` tags, once the domain is chosen.

## Publishing

GitHub Pages publishes the repository root from the `main` branch. Push changes to `main` to update the website. `.nojekyll` keeps the static files unchanged during publishing.

The appointment form opens an email draft addressed to the practice. The visitor reviews and sends it in their own email application; it does not automatically send messages or create calendar bookings. The practice confirms each appointment by phone.

Manrope's font license is included in `assets/fonts/OFL-Manrope.txt`.
