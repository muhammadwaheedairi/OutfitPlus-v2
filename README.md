# OutfitPlus — Premium Fashion Ecommerce Store

A production-ready, full-stack fashion ecommerce template built with Next.js 16, Sanity CMS, Clerk Auth, Neon Postgres, Stripe Payments, and Resend Emails. Designed to be sold to local fashion businesses as a complete, working solution.

---

## 🚀 Live Demo

**Production:** [outfit-plus-v2.vercel.app](https://outfit-plus-v2.vercel.app)  
**Sanity Studio:** [outfit-plus-v2.vercel.app/studio](https://outfit-plus-v2.vercel.app/studio)

---

## 🧱 Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16.1.6 (Turbopack) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| CMS | Sanity v5 |
| Auth | Clerk v7 |
| Database | Neon Postgres + Drizzle ORM |
| Payments | Stripe |
| Emails | Resend |
| Deployment | Vercel |

---

## ✨ Features

### Store
- 🛍️ Product listing with filters (category, price range, search, sort)
- 📦 Product detail page with size selector, quantity stepper, reviews
- 🛒 Cart drawer with quantity management
- ❤️ Wishlist (localStorage for guests, Neon DB for logged-in users)
- ⭐ Reviews system (Clerk auth required to submit)
- 📝 Blog with Medium-style article pages

### Checkout & Orders
- 💳 Multi-step checkout (Contact → Shipping → Review)
- 🔒 Stripe hosted payment (test + live ready)
- 📧 Order confirmation email via Resend
- 📋 Order history page for logged-in users

### Admin
- 📊 Admin dashboard with revenue, orders, pending stats
- 🔄 Order status management (Pending → Shipped → Delivered → Cancelled)
- 🔐 Admin-only access via Clerk userId

### CMS
- 🖼️ Sanity Studio for product, blog, review management
- 🏷️ Product tags (featured, editors-pick, featured-banner, sale, etc.)
- 📰 Blog post management with rich text

---

## 📁 Project Structure

```
outfit-plus-v2/
├── app/
│   ├── (store)/
│   │   ├── about/
│   │   ├── blog/[id]/
│   │   ├── checkout/
│   │   │   └── success/
│   │   ├── contact/
│   │   ├── orders/
│   │   ├── product/[id]/
│   │   ├── product/
│   │   └── wishlist/
│   ├── admin/
│   ├── api/
│   │   ├── admin/orders/
│   │   ├── checkout/
│   │   ├── reviews/
│   │   └── wishlist/
│   └── studio/[[...tool]]/
├── components/
│   ├── admin/
│   ├── blog/
│   ├── cart/
│   ├── checkout/
│   ├── contact/
│   ├── home/
│   ├── layout/
│   ├── product/
│   └── shop/
├── context/
│   ├── cart-context.tsx
│   └── wishlist-context.tsx
├── hooks/
│   └── use-cart.ts
├── lib/
│   ├── db/
│   │   ├── index.ts
│   │   └── schema.ts
│   └── email/
│       └── order-email.tsx
├── sanity/
│   ├── lib/
│   │   ├── client.ts
│   │   └── image.ts
│   └── schemaTypes/
│       ├── product.ts
│       └── post.ts
└── proxy.ts
```

---

## ⚙️ Environment Variables

Create a `.env.local` file in the root:

```env
# Sanity
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2025-01-19
SANITY_API_TOKEN=your_sanity_token

# Clerk Auth
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxxxx
CLERK_SECRET_KEY=sk_test_xxxxx

# Neon Postgres
DATABASE_URL=postgresql://user:password@host/db?sslmode=require

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxxxx
STRIPE_SECRET_KEY=sk_test_xxxxx

# Resend Email
RESEND_API_KEY=re_xxxxx

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Admin
ADMIN_USER_ID=user_xxxxx
```

---

## 🛠️ Local Setup

### Prerequisites
- Node.js 18+
- npm or yarn
- Git

### Steps

**1. Clone the repository**
```bash
git clone https://github.com/yourusername/outfit-plus-v2.git
cd outfit-plus-v2
```

**2. Install dependencies**
```bash
npm install
```

**3. Set up environment variables**
```bash
cp .env.example .env.local
# Fill in all values
```

**4. Push database schema**
```bash
DATABASE_URL="your_neon_url" npx drizzle-kit push
```

**5. Run development server**
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

**6. Open Sanity Studio**

Navigate to [http://localhost:3000/studio](http://localhost:3000/studio) to manage content.

---

## 🗄️ Database Schema

### Tables (Neon Postgres via Drizzle ORM)

**orders**
```
id, userId, email, firstName, lastName, phone,
address, city, state, zip, country, shipping,
subtotal, shippingCost, total, status,
stripeSessionId, createdAt
```

**order_items**
```
id, orderId, productId, name, price, quantity, image
```

**wishlist**
```
id, userId, productId, name, price, image, category, createdAt
```

**reviews**
```
id, productId, userId, userName, rating, comment, createdAt
```

---

## 🧩 Sanity CMS

### Product Schema Fields
| Field | Type | Notes |
|---|---|---|
| name | string | Required |
| image | image | With hotspot |
| price | number | Required, positive |
| discount | number | 0–100, default 0 |
| description | text | — |
| category | string | Men's/Women's/Kid's/Accessories |
| rating | number | 0–5 |
| stock | number | Default 99 |
| tags | array | featured, editors-pick, featured-banner, etc. |

### Special Tags
- `featured` — shown in Featured Products section
- `editors-pick` — shown in Editor's Picks section
- `featured-banner` — shown in Home Banner 1 (green section)
- `featured-banner-2` — shown in Home Banner 2 (white section)

---

## 💳 Stripe Integration

### Test Cards
| Card Number | Scenario |
|---|---|
| `4242 4242 4242 4242` | Success |
| `4000 0000 0000 9995` | Declined |

Expiry: any future date. CVV: any 3 digits.

### Payment Flow
```
Cart → Checkout Form → /api/checkout (create session)
→ Stripe Hosted Page → Payment
→ /checkout/success?session_id=xxx
→ Save order to Neon DB
→ Send email via Resend
```

---

## 👤 Auth Flow (Clerk)

### Protected Routes
```
/checkout  → Login required
/orders    → Login required
/wishlist  → Login required (guests use localStorage)
/admin     → Admin only (ADMIN_USER_ID match)
```

### Get Your Admin User ID
1. Login to your app
2. Go to [clerk.com](https://clerk.com) → Dashboard → Users
3. Click your user → Copy `user_xxxxx` ID
4. Add to `.env.local` as `ADMIN_USER_ID`

---

## 📧 Email Setup (Resend)

### Development
Emails only go to the Resend account owner email (free tier limitation).

### Production
1. Go to [resend.com](https://resend.com) → Domains
2. Add your custom domain
3. Add DNS records
4. After verification, update `from` in `lib/email/order-email.tsx` to `outfitplus@yourdomain.com`
5. Customer confirmation emails will start working

---

## 🚀 Deployment (Vercel)

### Steps
1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com) → New Project → Import repo
3. Add all environment variables from `.env.local`
4. Update `NEXT_PUBLIC_APP_URL` to your production URL
5. Deploy

### Post-Deploy Checklist
- [ ] Update `NEXT_PUBLIC_APP_URL` in Vercel env vars
- [ ] Add production URL to Sanity CORS origins
- [ ] Add production URL to Clerk allowed domains
- [ ] Add Stripe webhook endpoint (production)
- [ ] Verify Resend domain for customer emails
- [ ] Switch Stripe to live mode when ready

---

## 🔧 Scripts

```bash
npm run dev        # Start development server
npm run build      # Production build
npm run start      # Start production server
npm run lint       # Run ESLint
```

---

## 📱 Responsive Design

Fully responsive across all screen sizes:
- **Mobile** (< 640px) — stacked layouts, collapsible elements
- **Tablet** (640px – 1024px) — 2-column grids
- **Desktop** (> 1024px) — full layouts with sidebars

---

## 🏗️ Architecture Decisions

### Why Sanity for Products?
Products are managed via Sanity Studio — no code changes needed when adding/editing products. Client can self-manage inventory.

### Why Neon + Drizzle for Orders?
Orders, reviews, and wishlists need relational data with user associations. Sanity is not designed for transactional data.

### Why Clerk?
Fastest auth setup with pre-built UI components, social login support, and easy user management dashboard.

### Why Stripe Hosted Page?
Most secure option — card data never touches our server. PCI compliant out of the box.

---

## 👨‍💻 Author

**Muhammad Waheed**  
Full-Stack Developer | Agentic AI Engineeer  
[LinkedIn](https://linkedin.com/in/muhammadwaheedairi) · [GitHub](https://github.com/muhammadwaheedairi)

---

## 📄 License

This project is a commercial template. All rights reserved.