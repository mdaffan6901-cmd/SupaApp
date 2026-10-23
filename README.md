# SupaApp 🚀

A full-featured web application built with **Supabase** as the sole backend — no Node.js, no Express, no build step required.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/YOUR_USERNAME/YOUR_REPO)

---

## 🗂️ Project Structure

```
SupaApp/
├── index.html          ← Login / Register / Forgot Password
├── dashboard.html      ← Main app shell (protected)
├── vercel.json         ← Vercel deployment config
├── src/
│   ├── css/
│   │   └── style.css   ← All styles (no framework)
│   └── js/
│       ├── config.js   ← Supabase URL + anon key
│       └── supabase.js ← Supabase client + all helpers
└── .gitignore
```

---

## ✅ Features

| Feature | Details |
|---------|---------|
| **Authentication** | Email + Password sign up / sign in / forgot password |
| **Auto Profile** | Trigger creates `profiles` row on signup |
| **Posts** | Create, read, delete — with realtime live feed |
| **Storage** | Avatar upload + post images via Supabase Storage |
| **Realtime** | Live post feed via Supabase Realtime (postgres_changes) |
| **RLS** | Row Level Security enforced on all tables |
| **Responsive** | Mobile-friendly layout |

---

## 🚀 Deploy to Vercel

1. Push this repository to GitHub
2. Go to [vercel.com](https://vercel.com) → **New Project** → Import your repo
3. Framework Preset: **Other** (no build needed)
4. Click **Deploy** — done! ✅

> **No environment variables needed** — the Supabase `anon` key is intentionally public.  
> Security is enforced via Supabase Row Level Security (RLS) policies.

---

## 💻 Run Locally

No install needed. Just serve the files with any static server:

```bash
# Python 3 (built-in)
python3 -m http.server 3000

# Node.js (npx)
npx serve .

# VS Code: use Live Server extension
```

Then open: **http://localhost:3000**

---

## 🗄️ Supabase Setup

### Tables

```sql
-- profiles (auto-created via trigger on auth.users)
CREATE TABLE profiles (
  id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username    TEXT UNIQUE NOT NULL,
  full_name   TEXT,
  bio         TEXT,
  avatar_url  TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- posts
CREATE TABLE posts (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID REFERENCES profiles(id) ON DELETE CASCADE,
  title       TEXT NOT NULL,
  content     TEXT,
  image_url   TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);
```

### Storage

- **Bucket**: `user-content` (public)
  - `profile-pictures/<uid>/` — avatars
  - `posts/<uid>/` — post images
  - `misc/<uid>/` — anything else

---

## 📦 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Vanilla HTML + CSS + ES Modules |
| Backend | [Supabase](https://supabase.com) |
| Auth | Supabase Auth |
| Database | PostgreSQL (via Supabase) |
| Storage | Supabase Storage |
| Realtime | Supabase Realtime |
| SDK | `@supabase/supabase-js@2` via CDN (esm.sh) |
| Hosting | [Vercel](https://vercel.com) |

---

## 🔑 Security Notes

- The `anon` key in `config.js` is **intentionally public** — it is safe to commit.
- All data access is protected by **Row Level Security (RLS)** policies in Supabase.
- To rotate credentials: update `config.js` and redeploy.
- Never commit a `service_role` key — it bypasses RLS.

---

## 📄 License

MIT
