# Page Structure

## index.html — Home (Layout 1)
1. Hero (headline, CTA pair, diagnostic-readout stat card)
2. Trust strip (4 animated stat counters on dark background)
3. Our Services (8 service cards, 2 featured variants)
4. About the Workshop (split image/text layout with experience badge)
5. Why Choose Us (icon + text value rows, not a repeated card grid)
6. Brands We Service (logo tile grid + link to full brands page)
7. Service Process (5-step connected timeline)
8. Customer Testimonials (slider with dot + arrow navigation)
9. Final CTA (dark banner with two calls to action)

A slim banner under the header links across to Home Layout 2 and back.

## home-v2.html — Home (Layout 2)
A structurally distinct alternate homepage — not just a re-skin:
1. Split hero (left content / right image panel with a spec-readout overlay
   and inline hero stats, instead of a full-bleed background hero)
2. Continuous service ticker (auto-scrolling marquee of all 8 services)
3. Quick Enquiry strip (inline 3-field callback form, orange band)
4. Featured Services (4 most-booked services, compact grid + "view all" link)
5. Why Choose Us (centered icon-grid cards instead of Layout 1's value rows)
6. How It Works (compact numbered list instead of Layout 1's full timeline)
7. Pricing Preview (3 compact package cards linking to the full pricing page)
8. Testimonial Spotlight (single large quote instead of Layout 1's slider)
9. Final CTA (light band, two calls to action)

## about.html — About Us
1. Page banner
2. Our Story (reversed split layout)
3. Workshop Facilities & Equipment (split image/text with an equipment checklist)
4. Certifications & Partnerships (4-card grid: technician certification, factory
   training, authorized parts suppliers, insurance partner network)
5. Workshop Statistics (stat strip, shared component)
6. Meet Our Experts (6 technician profile cards)
7. Why Riders Trust Us (numbered value rows)

## services.html — Services
Detailed alternating-layout rows (image left/right alternates per service)
for all 8 services, each with benefits list, time/recommendation meta, and
a booking CTA. Closing dark CTA band.

## brands.html — Brands Serviced
1. Page banner
2. Motorcycle categories (6 stat-style cards)
3. Filterable brand grid (JavaScript filter by category — All, Commuter,
   Sports, Cruiser, Adventure, Premium)
4. Closing CTA

## pricing.html — Pricing
1. Page banner
2. Three package cards (Basic / Standard / Premium) with the Standard
   package highlighted as most popular
3. Individual à la carte service rate table (converts to stacked cards on
   mobile, per the responsive requirement)
4. Pricing disclaimer note

## reviews.html — Customer Reviews
1. Page banner
2. Aggregate rating summary (score, stars, star-distribution bars)
3. Review card grid (9 reviews, 6 shown initially, "Load More" reveals the rest)

## contact.html — Contact
1. Page banner
2. Contact info cards + social links (left column) and the appointment
   booking form (right column), with full client-side validation
3. Map section with a clearly marked Google Maps API placeholder

## 404.html
Motorcycle-themed error page reusing the hero layout with a "wrong turn"
message and two recovery CTAs.

## coming-soon.html
Standalone page (own minimal header) with logo, live countdown timer,
email subscription form, and social links.

## service-details.html
Deep-dive template for a single service (Engine Diagnostics is used as the
example) — duplicate this file per service and update the content for a
dedicated URL per service if desired.
