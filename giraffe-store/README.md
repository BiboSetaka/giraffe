# Giraffe — Store + Admin (Next.js on Vercel)

A working backend for the Giraffe store: a Postgres-backed product catalog,
photo uploads via Vercel Blob, and a password-protected `/admin` page to
add, edit, and delete products — no code changes needed to list a new item.

Both the storefront (public pages) and the backend (API routes) run as one
Next.js app, which deploys as a single Vercel project. There's no separate
backend to host.

## What's included

- `app/page.jsx` — public storefront (grid + category filter)
- `app/product/[id]/page.jsx` — product detail page with an image slideshow
  and a WhatsApp "Order" button
- `app/admin` — password-protected dashboard to manage products
- `app/api/products` — REST API (GET is public, POST/PUT/DELETE require
  the admin session)
- `app/api/upload` — image upload endpoint, stores files on Vercel Blob
- `middleware.js` — blocks `/admin` and write requests without a valid
  admin session cookie
- `schema.sql` — the one table this needs

## 1. Create the project on Vercel

1. Push this folder to a GitHub repo.
2. In the Vercel dashboard: **Add New → Project**, import the repo.
3. Don't deploy yet — add the storage integrations first (next step),
   otherwise the first build will fail with missing env vars.

## 2. Add storage

Both are a few clicks, no external accounts needed:

1. Project → **Storage** tab → **Create Database** → **Postgres**
   (this provisions a Neon database — "Vercel Postgres" now runs on Neon
   under the hood). Vercel adds `DATABASE_URL` to your project automatically.
2. Project → **Storage** tab → **Create Database** → **Blob**.
   Vercel adds `BLOB_READ_WRITE_TOKEN` automatically.

## 3. Set the remaining env vars

Project → **Settings → Environment Variables**, add:

| Key             | Value                                  |
|-----------------|-----------------------------------------|
| `ADMIN_PASSWORD`| whatever password you'll log in with    |
| `AUTH_SECRET`   | a long random string — generate with `openssl rand -hex 32` |

## 4. Create the products table

Project → **Storage** → your Postgres database → **Query** tab → paste
the contents of `schema.sql` → run it. (One-time setup.)

## 5. Deploy

Trigger a deploy (push to the repo, or click **Redeploy** in Vercel).

## 6. Add your first products

Visit `https://your-app.vercel.app/admin`, log in with `ADMIN_PASSWORD`,
and add products — name, category, price, and one or more photos. They
show up on the storefront immediately, no redeploy needed.

## Local development

```bash
npm install
cp .env.example .env.local   # fill in the values from steps 2-3
npm run dev
```

`@neondatabase/serverless` and `@vercel/blob` both work fine against your
live Vercel storage from `localhost`, using the same env vars.

## Notes

- Before going live, put your real WhatsApp number into
  `WHATSAPP_NUMBER` in `app/product/[id]/page.jsx` (currently a
  placeholder: `26660000000`).
- The storefront here is intentionally simple. If you'd rather keep the
  fuller Giraffe design (the one built earlier as a Claude artifact),
  you can drop that HTML/CSS/JS into `app/page.jsx` as a client
  component and just point its product data at `fetch('/api/products')`
  instead of the hardcoded array — the API shape (`{id, name, tag,
  price, images}`) matches what that page already expects.
- Admin auth here is a single shared password — fine for one person
  managing the store. If more people need separate logins later, swap
  `lib/auth.js` for a real auth provider (e.g. NextAuth).
