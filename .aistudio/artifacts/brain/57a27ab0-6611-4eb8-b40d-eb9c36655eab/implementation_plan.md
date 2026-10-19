# Payload CMS Enterprise E-Commerce & Admin Studio

An integrated full-stack Payload CMS studio and e-commerce storefront featuring a fully interactive Payload admin panel (Collections manager with custom fields, Rich block & page builder, Media library, Globals & navigation manager, and REST API explorer) paired with a live responsive storefront that instantly renders CMS content and blocks in real time.

## User Review & Critical Decisions

> [!IMPORTANT]
> The application integrates a fully functional Payload CMS admin studio directly alongside a high-end editorial e-commerce website. Any changes made in the CMS admin panel (such as adding/editing products, changing global announcement banners, or building custom page layouts with blocks) immediately reflect on the live storefront.

- **Confirmed Decision 1**: E-commerce store with product catalog and clean editorial minimal aesthetic with warm neutrals.
- **Confirmed Decision 2**: Fully interactive Payload CMS admin panel including Collection Manager, Rich Block & Page Builder, Media Library, Globals Manager, and Live REST API Explorer.

---

## 1. Overview & Core Concept

- **What It Does**: Provides both a professional Payload CMS admin experience and a high-end editorial e-commerce frontend in one seamless web app. Users can toggle between the **Admin Dashboard** and the **Live Storefront** to experience how headless CMS content management drives a production website in real time.
- **Target Audience**: Developers, content managers, and e-commerce shoppers looking for a pristine Payload CMS architecture demonstration.
- **Key Value**: Demonstrates an authentic headless CMS workflow with block building, collection management, global settings, and real-time frontend reactivity without broken stubs or mock data dead ends.

---

## 2. User Experience & Visual Design

- **Aesthetic Direction**: Clean editorial minimal with warm neutrals (`bg-[#FDFBF7]`, warm stone borders `#E7E5E4`, rich charcoal `#1C1917` text, and terracotta/ochre accent `#B45309`).
- **Typography**: Display font (`Plus Jakarta Sans` or `Fraunces` editorial serif for headings) paired with clean body prose (`Inter` / `DM Sans` / `Plus Jakarta Sans`) and tabular numerals (`font-mono tabular-nums`).
- **Key Flows**:
  1. **Storefront Mode**: Browse products, filter by CMS categories, view product detail modals, add items to cart, and complete checkout.
  2. **CMS Admin Mode**: Access the Payload CMS sidebar (Dashboard, Collections / Products, Collections / Categories, Block Page Builder, Media Library, Globals, API Docs). Create or edit documents with custom fields and draft/published states.
  3. **Live Preview Sync**: Watch changes made in the CMS immediately update the storefront layout and product catalog.

---

## 3. Technical Architecture & Data Strategy

```
┌─────────────────────────────────────────────────────────────┐
│                    Payload CMS Core Engine                  │
│  (LocalStorage Persistence & In-Memory State Management)   │
└───────┬───────────────────────────┬─────────────────────────┘
        │                           │
        ▼                           ▼
┌──────────────┐            ┌────────────────┐
│ CMS Admin    │◄──────────►│ Live Storefront│
│ Dashboard    │            │ Website        │
├──────────────┤            ├────────────────┤
│ • Products   │            │ • Hero Banner  │
│ • Categories │            │ • Product Grid │
│ • Page Blocks│            │ • Cart & PDP   │
│ • Globals    │            │ • Checkout     │
└──────────────┘            └────────────────┘
```

- **Data State**: Initialized with seed Payload collections (`Products`, `Categories`, `Pages`, `Globals`) and stored in `localStorage` so changes persist across page reloads.
- **Block Builder**: Supports dynamic blocks (Hero, ProductGrid, EditorialBanner, Testimonials, FAQ) configurable via the CMS.
- **API Explorer**: Built-in mock REST API browser showing live JSON payloads (`/api/products`, `/api/globals`, `/api/pages`) to demonstrate Payload's headless architecture.
