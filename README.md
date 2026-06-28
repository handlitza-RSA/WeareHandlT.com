# HandlT UI package

This is a ready-to-run static front-end for HandlT.

## Pages included

- `index.html` - mobile-first landing page with announcement banner, menu, hero, five event cards, CTA, bottom review strip, WhatsApp button and quote modal.
- `quote.html` - full quote form page for direct links or menu clicks.
- `services.html` - simple service overview page.
- `reviews.html` - review placeholder page. Replace the placeholder copy with real reviews only.
- `contact.html` - WhatsApp, email and social contact page.

## Files included

- `styles.css` - full responsive design system and layout.
- `app.js` - menu drawer, quote modal, event pre-select, form capture and WhatsApp message generation.
- `assets/` - HandlT logo, chat bubble and collage-style SVG event artwork.

## How to preview

Open `index.html` in a browser.

For a better local preview, run:

```bash
python3 -m http.server 8080
```

Then open:

```text
http://localhost:8080
```

## How the quote form works

The form does not require a database. On submit it:

1. Captures the event details.
2. Saves the last quote locally in the browser as `handlt:lastQuote`.
3. Opens WhatsApp to `+27 73 088 2155` with the event details pre-filled.

## Google Form or CRM connection

The current version is set up for a frictionless WhatsApp flow. To connect it to Google Forms, Base44, Supabase, Airtable, HubSpot or another CRM, replace the submit logic inside `app.js` in the `data-quote-form` submit handler.

The form field names are:

- `eventType`
- `eventDate`
- `location`
- `guests`
- `needs`
- `name`
- `phone`
- `notes`
- `inspiration`
- `venue`

## Replace collage artwork with real cut-out PNGs

The included SVG files create the correct layout and visual direction. For the closest AnyVan-style feeling, replace these with transparent PNG cut-outs from your actual event inventory or Canva exports:

- `assets/birthday-collage.svg`
- `assets/wedding-collage.svg`
- `assets/corporate-collage.svg`
- `assets/religious-collage.svg`
- `assets/other-collage.svg`
- `assets/sound-collage.svg`

Keep the same file names or update the image paths in the HTML.

## Brand tokens

```css
--handlt-black: #111111;
--handlt-charcoal: #1e1e1e;
--handlt-cream: #f7f1e8;
--handlt-white: #ffffff;
--handlt-yellow: #ffd33d;
--handlt-red: #e94b35;
--handlt-muted: #6b6b6b;
```

## Main copy

Hero:

```text
You bring the crowd.
We'll HandlT.
```

CTA:

```text
Get my quote
```

Trust strip:

```text
Real setups. Real events. Real feedback.
```

## Important note

The layout intentionally matches the UX structure you described: banner, header, hero, visual service cards, CTA, trust strip, floating chat and slide-out menu. It does not use AnyVan assets, AnyVan branding or copied imagery.
