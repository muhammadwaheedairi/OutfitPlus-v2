# OutfitPlus — Premium Fashion Ecommerce Store

A full-stack, production-ready ecommerce store built with Next.js 16, Sanity CMS, and modern web technologies. Designed as a reusable template for fashion businesses.

![OutfitPlus](https://img.shields.io/badge/Next.js-16.1.6-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-38BDF8?style=for-the-badge&logo=tailwindcss)
![Sanity](https://img.shields.io/badge/Sanity-v5-F03E2F?style=for-the-badge&logo=sanity)

---

## Features

### Part 1 — Storefront (Complete ✅)
- **Home Page** — Hero, Featured Products, Product Banners, Blog Posts
- **Shop Page** — Category filters, price range, sort, search, pagination
- **Product Detail** — Image gallery, size selector, quantity, reviews & ratings
- **Cart** — Persistent cart drawer with localStorage
- **Wishlist** — Save products, move to cart
- **Blog** — List + detail pages with rich content
- **About & Contact** — Real contact info, WhatsApp, Google Maps
- **Checkout** — Multi-step form (Contact → Shipping → Review)
- **CMS** — Full Sanity Studio for products, posts, reviews

### Part 2 — Auth + Payments (Planned 🔜)
- Clerk v7 Authentication
- Neon Postgres + Drizzle ORM
- Stripe Payments
- Order History & Management
- Resend Email Notifications
- Admin Dashboard

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16.1.6 (App Router + Turbopack) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| CMS | Sanity v5 |
| Auth | Clerk v7 *(Part 2)* |
| Database | Neon Postgres + Drizzle ORM *(Part 2)* |
| Payments | Stripe *(Part 2)* |
| Emails | Resend *(Part 2)* |
| Deployment | Vercel |

---

## Getting Started

### Prerequisites
- Node.js 18+
- Sanity account
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/muhammadwaheed/OutfitPlus-v2.git
cd OutfitPlus-v2

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
```

### Environment Variables

```env
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2024-01-01
SANITY_API_TOKEN=your_token
```

### Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Sanity Studio

```bash
# Access CMS at
http://localhost:3000/studio
```

---

## Project Structure

```
outfit-plus-v2/
├── app/
│   ├── (store)/          # Store routes
│   │   ├── about/
│   │   ├── blog/
│   │   ├── checkout/
│   │   ├── contact/
│   │   ├── product/
│   │   └── wishlist/
│   ├── studio/           # Sanity Studio
│   └── page.tsx          # Home page
├── components/
│   ├── home/             # Hero, Banners, Featured sections
│   ├── shop/             # Product cards, filters
│   ├── product/          # Detail, images, reviews
│   ├── cart/             # Cart drawer
│   ├── checkout/         # Multi-step form
│   ├── blog/             # Blog cards, detail
│   ├── contact/          # Contact sections
│   ├── about/            # About sections
│   └── layout/           # Header, footer
├── context/              # Cart + Wishlist context
├── hooks/                # useCart hook
├── lib/                  # Utility functions
├── sanity/               # Sanity client + schemas
└── types/                # TypeScript types
```

---

## License

MIT — Free to use and modify.

---

Built by [Muhammad Waheed](https://github.com/muhammadwaheedairi)