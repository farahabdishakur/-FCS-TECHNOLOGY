# FCS Technology

Website for FCS Technology, a digital services business in Borama, Somaliland: websites, design, documents and automation.

Built with React, Vite and Tailwind CSS.

## Run locally

```bash
npm install
npm run dev
```

The site runs at http://localhost:8443.

## Build

```bash
npm run build
```

## Structure

- `src/pages` - Home, Services, ServiceDetail, Portfolio, Card3D, Admin
- `src/components` - Navbar, Footer, BusinessCard, ScrollFade
- `src/data/services.ts` - the list of services
- `src/data/dbStore.ts` - services and site settings saved in the browser's localStorage (edited from the admin dashboard)
- `public` - images, logo and the static CV pages
