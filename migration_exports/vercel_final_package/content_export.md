# Content Export

Preserved page content from key routes. Copy preserved where accessible.

---

## Homepage (/)

**Source:** `app/page.tsx`

### Sections (in order)
1. Hero with video/image
2. Press Section (logo marquee)
3. New Arrivals Carousel
4. Material Palette Section
5. CTA Section

### Key Copy
- Hero: Brand tagline and introduction
- Press: "As Featured In" with publication logos
- Materials: Surface texture descriptions

---

## Atelier (/atelier)

**Source:** `app/atelier/page.tsx`

### Sections
1. Atelier Hero
2. The Space Section
3. The Humans Section
4. The Fabrication Section
5. Atelier CTA

### Components
- `components/atelier/atelier-hero.tsx`
- `components/atelier/the-space-section.tsx`
- `components/atelier/the-humans-section.tsx`
- `components/atelier/the-fabrication-section.tsx`
- `components/atelier/atelier-cta.tsx`

---

## Gallery (/gallery)

**Source:** `app/gallery/page.tsx`

### Structure
- Project grid with distorted card hover effects
- Uses `components/gallery/distorted-card.tsx`
- Uses `components/gallery/distortion-filter.tsx`

### Data
- Currently hardcoded project array
- Should migrate to CMS/database

---

## Collection (/collection)

**Source:** `app/collection/page.tsx`

### Features
- Category filter tabs
- Stock status filter
- Product grid
- Quick view modal
- Inquiry integration

### Data Dependencies
- `/api/products`
- `/api/categories`

---

## Contact (/contact)

**Source:** `app/contact/page.tsx`

### Structure
- Contact form
- Company information
- Location/hours

### Data Dependencies
- `/api/inquiry` for form submission

---

## FAQ (/faq)

**Source:** `app/faq/page.tsx`

### Structure
- Accordion component with Q&A pairs
- Uses `components/ui/accordion.tsx`

---

## Process (/process)

**Source:** `app/process/page.tsx`

### Structure
- Step-by-step rental process
- Visual timeline/flow

---

## Brand Pages

### /brand
Overview of brand identity

### /brand/guidelines
Brand guidelines and usage rules

### /brand/language
Voice, tone, and messaging

### /brand/typography
Font specimens and usage

### /brand/visual
Visual identity elements

---

## Studio (/studio)

**Source:** `app/studio/page.tsx`

### Status
Work in progress - moodboard canvas tool

### Components
- `components/studio/moodboard-canvas.tsx`
- `components/studio/konva-editor/image-editor.tsx`
- `components/studio/palette-extractor.tsx`

---

## Privacy (/privacy)

**Source:** `app/privacy/page.tsx`

### Structure
- Privacy policy text
- Static content

---

## Image References

### Placeholder Slots
- Hero backgrounds
- Gallery project images
- Atelier section images
- Material texture images

### Database-Driven
- Product images from `products.primary_image_url`
- Resolved via `/api/inventory-image`

---

## Notes

- Most page content is embedded in TSX files
- No separate CMS or content layer
- Gallery projects are hardcoded arrays
- Brand pages are static content
- Product content comes from database
