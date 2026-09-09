# Changelog

## Version 1.1.0

- Added `home-v2.html`, a structurally distinct second homepage (split
  hero, service ticker, quick-enquiry callback form, compact pricing
  preview, single testimonial spotlight). A small banner on both
  homepages links across to the other.
- `about.html`: replaced the Mission & Vision section with two new
  sections — Workshop Facilities & Equipment and Certifications &
  Partnerships.

## Version 1.0.0
Initial Release

- 10 pages: Home, About, Services, Brands Serviced, Pricing, Reviews,
  Contact, 404, Coming Soon, Service Details
- Full design system in `assets/css/style.css` (CSS variables, 17
  organized sections)
- Light/dark mode with `localStorage` persistence (`assets/css/dark-mode.css`)
- RTL stylesheet (`assets/css/rtl.css`)
- Vanilla JS module set in `assets/js/main.js`: sticky header, mobile nav,
  theme toggle, scroll reveal, smooth scroll, testimonial slider, brand
  filter, form validation, newsletter form, countdown timer, load-more
  reviews, animated stat counters
- Custom inline SVG illustration and icon set (no external image licensing)
- SEO: unique titles/descriptions per page, Open Graph tags, JSON-LD
  `AutomotiveBusiness` structured data, `sitemap.xml`, `robots.txt`
- Accessibility: skip link, semantic landmarks, visible focus states,
  `prefers-reduced-motion` support, ARIA labeling on interactive controls
