# Torque & Tread — Motorcycle Service & Repair Website

Static HTML/CSS/JS site. No framework or build step: upload the folder to any web host, or open `index.html` locally.

## Pages
- `index.html` — Home layout 1
- `home-v2.html` — Home layout 2
- `about.html`, `services.html`, `service-details.html` (engine diagnostics), `brands.html`, `pricing.html`, `contact.html`, `404.html`, `coming-soon.html`

## Structure
```
assets/css/style.css   base styles (light theme, responsive)
assets/css/dark.css    dark mode overrides ([data-theme="dark"])
assets/css/rtl.css     right-to-left overrides ([dir="rtl"])
assets/js/main.js      menu, theme toggle, service picker, brand filter, form validation, countdown
assets/images/
  logo.png             full logo (footer)
  logo-header.png      logo without tagline (header, easier to read)
  photos/              workshop and repair photos
  brands/              brand logos (transparent PNG)
  team/, people/       team and customer photos
```

## Notes
- **Scrolling fix:** `overflow` is not set on `html`/`body` (setting it on both caused the double scrollbar). Only `body { overflow-x: clip }` is used.
- **Hero height:** every page uses the same `--hero-h` value at the top of `style.css`. Change it there to resize all heroes.
- **Services page:** link to a specific service with `services.html#<id>`, e.g. `services.html#brake-servicing`.
- **Booking links:** `contact.html?service=<id>` preselects that service in the form.
- **Brand logos** were extracted from the supplied brand banner. For the sharpest result, replace the files in `assets/images/brands/` with official logo files from each brand's press kit (same file names).
- Forms validate in the browser only. Connect them to your form handler or email service before going live.
- Fonts: Barlow Condensed (headings) and Barlow (body) from Google Fonts.
