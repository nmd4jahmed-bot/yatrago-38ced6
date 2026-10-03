# Demo

A thoughtfully designed travel discovery website with a tropical editorial feel, independently branded as **Demo**. The responsive homepage brings flights, hotels, holiday packages, buses, and visa planning into a single search experience.

## Features

- Service-specific search forms, city suggestions, journey types, return dates, cabin selection, and special-fare choices.
- Input validation, location swapping, and search-summary previews.
- Destination photography and sample itinerary dialogs for Bali, Kashmir, Dubai, and Thailand.
- Illustrative promotions with copyable offer codes.
- Keyboard-accessible dialogs, help FAQs, mobile navigation, and reduced-motion support.

This project is a **demonstration**, not a live booking service. Prices and promotions are examples. No travel inventory, payment processing, reservations, user accounts, or visa applications are connected. Searches are not stored. Demo is not affiliated with Skywale or a travel supplier. The reference website was unavailable during implementation, so the design is an original travel-focused interpretation rather than an exact reproduction.

## Technologies

React 19, TypeScript, TanStack Start, TanStack Router, Vite, Tailwind CSS, Lucide icons, and Netlify. Local photographs are delivered through Netlify Image CDN. The static hero photograph was generated using Netlify AI Gateway; the website does not require AI inference at runtime. Destination photographs were downloaded from Unsplash. Fonts are served by Google Fonts.

## Run locally

Use Node.js 22 and pnpm.

```sh
pnpm install
pnpm dev
```

The Vite development server uses port 3000. To include Netlify Image CDN emulation, use Netlify CLI instead:

```sh
netlify dev --port 8889
```

Open `http://localhost:8889` when using Netlify CLI. No application-specific API keys are needed. Direct Vite development does not emulate the Netlify image endpoint.

## Project structure

- `src/routes/index.tsx` — homepage, travel searches, and preview interactions.
- `src/routes/__root.tsx` — document shell and share metadata.
- `src/styles.css` — design tokens, component styles, and responsive behavior.
- `public/img/` — static travel photographs.
- `netlify.toml` — Netlify build and development configuration.

Deploy to Netlify for the server-rendered application and optimized images. The platform runs the production build from the existing configuration.
