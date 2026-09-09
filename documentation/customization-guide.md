# Customization Guide

## Changing Colors

All colors are defined as CSS custom properties at the top of
`assets/css/style.css`, inside `:root`:

```css
:root {
  --ink: #0b0c0e;        /* primary dark background */
  --accent: #C1121F;     /* racing orange accent */
  --accent-deep: #c53107;/* accent hover state */
  --paper: #f1f2f3;      /* light background */
  ...
}
```

Change a variable once and it updates everywhere it's used — buttons,
links, borders, icons, and section backgrounds. Do not hardcode new colors
directly in component rules; add or edit a variable instead so dark mode
and RTL overrides continue to work correctly.

## Changing Fonts

Two font families are used, set as variables:

```css
--font-heading: 'Rajdhani', sans-serif;
--font-body: 'Inter', sans-serif;
```

To swap either typeface, update the Google Fonts `<link>` in the `<head>`
of every page (search for `fonts.googleapis.com`) and change the variable
value to match.

## Replacing Images

All imagery ships as custom SVG illustrations under `assets/images/`,
organized by purpose:

- `hero/` — full-width hero and banner backgrounds
- `workshop/` — about/story section imagery
- `services/` — one illustration per service
- `team/` — technician portraits (about.html)
- `testimonials/` — customer portraits (home + reviews.html)

Replace any `.svg` with a `.jpg`/`.webp`/`.png` of the same name (updating
the `<img src>` extension in the relevant HTML file), or keep the SVGs and
simply re-color the shapes by editing the fill/stroke values inside them.

## Updating the Logo

The logo is text-based, defined in the header markup of every page:

```html
<a href="index.html" class="brand">
  <span class="brand-mark">T</span>
  <span>Torque &amp; Tread<span class="brand-sub">Motorcycle Service Center</span></span>
</a>
```

To use an image logo instead, replace the `<span class="brand-mark">T</span>`
with an `<img>` tag and adjust `.brand-mark` sizing in `style.css`.

## Editing Navigation

Navigation links live in the `<ul class="nav-links">` inside the header of
each page, and again in the footer's "Quick Links" column. Add, remove, or
reorder `<li><a href="...">Label</a></li>` entries as needed — remember to
update all pages for consistency.

## Changing Content

Every page is standalone HTML with realistic placeholder copy (services,
pricing, testimonials, team bios). Search for the section you want to edit
directly in the relevant `.html` file and replace the text in place.

## Configuring Dark Mode

Dark mode is toggled by adding `data-theme="dark"` to the `<html>` element,
handled automatically by `assets/js/main.js` (`initThemeToggle`), which:

1. Reads the visitor's saved preference from `localStorage` (`torque-tread-theme`)
2. Falls back to the OS-level `prefers-color-scheme` if nothing is saved
3. Toggles the attribute and saves the choice when the header's moon/sun
   button is clicked

`assets/css/dark-mode.css` (loaded after `style.css`) carries the
remaining Bootstrap component overrides. Most component color rules live
directly in `style.css` using `[data-theme='dark']` selectors.

## Enabling RTL Mode

For Arabic, Hebrew, or other right-to-left languages:

1. Set `<html lang="ar" dir="rtl">` (or the relevant language code) on
   every page.
2. Add `<link rel="stylesheet" href="assets/css/rtl.css">` after
   `dark-mode.css` in the `<head>`.
3. Translate the page copy as needed.

`rtl.css` flips directional spacing, icon mirroring, and floated elements
so the layout reads correctly right-to-left.
