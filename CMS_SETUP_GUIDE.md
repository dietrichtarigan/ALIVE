# CMS Setup Guide - Built-in Admin Panel dengan Supabase

## 📋 Overview
Admin panel CMS yang terintegrasi langsung di website, tanpa perlu tools eksternal. Semua konten dapat dikelola secara no-code melalui interface yang user-friendly.

## 🗂️ Content Management
Admin panel dapat mengelola:
- **Hero Sections** - Banner utama homepage dengan metrics dan spotlight
- **Program Items** - 4 program inti ARCADE (INFOPROF, SINERGI, CeritaKita, ALIVE)
- **Spotlight Items** - Highlight untuk kategori Karier, Event, dan Cerita
- **Ecosystem Cards** - Kartu integrasi media sosial, pipeline data, dan notifikasi
- **Roadmap Phases** - Timeline pengembangan dengan milestones
- **CTA Blocks** - Call-to-action sections
- **FAQ Items** - Pertanyaan yang sering diajukan

## 🚀 Langkah Setup

### 1️⃣ Setup Supabase Project

1. **Buat project baru di Supabase**
   - Kunjungi [https://supabase.com](https://supabase.com)
   - Klik "New Project"
   - Isi nama project, password database, dan region
   - Tunggu hingga project selesai dibuat (~2 menit)

2. **Salin environment variables**
   - Buka project settings → API
   - Salin nilai berikut:
     - `Project URL` → untuk `NEXT_PUBLIC_SUPABASE_URL`
     - `anon/public key` → untuk `NEXT_PUBLIC_SUPABASE_ANON_KEY`
     - `service_role key` → untuk `SUPABASE_SERVICE_ROLE_KEY` ⚠️ RAHASIA!

### 2️⃣ Setup Environment Variables

1. **Buat file `.env.local`** di root folder project
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

2. **Setup di Vercel** (untuk production)
   - Buka Vercel project → Settings → Environment Variables
   - Tambahkan 3 variables di atas
   - Environment: Production, Preview, Development (pilih semua)

### 3️⃣ Setup Database Schema

1. **Buka SQL Editor di Supabase**
   - Dashboard Supabase → SQL Editor → New query

2. **Jalankan migration schema**
   - Copy isi file `supabase/migrations/001_create_content_tables.sql`
   - Paste di SQL Editor
   - Klik "Run" atau tekan `Ctrl/Cmd + Enter`
   - Pastikan muncul pesan "Success. No rows returned"
   
   - **PENTING:** Juga jalankan `supabase/migrations/002_arcade_content_tables.sql`
   - Ini akan membuat tabel untuk Program Items, Spotlight, Ecosystem, dan Roadmap

3. **Jalankan seed data (opsional)**
   - Copy isi file `supabase/seed/001_initial_content.sql`
   - Paste di SQL Editor (query baru)
   - Klik "Run"
   - Lalu jalankan juga `supabase/seed/002_arcade_initial_content.sql`
   - Ini akan membuat konten contoh ARCADE untuk testing

### 4️⃣ Buat Admin User

1. **Buka Authentication di Supabase**
   - Dashboard Supabase → Authentication → Users

2. **Klik "Add user" → "Create new user"**
   - Email: `admin@yourdomain.com` (ganti dengan email Anda)
   - Password: Buat password kuat (minimal 8 karakter)
   - ✅ Centang "Auto Confirm User"

3. **Klik "Create user"**

### 5️⃣ Deploy ke Vercel

1. **Commit semua perubahan**
   ```bash
   git add .
   git commit -m "Add CMS with built-in admin panel"
   git push origin main
   ```

2. **Deploy di Vercel**
   - Jika sudah connected ke GitHub, Vercel akan auto-deploy
   - Atau manual: `vercel --prod`

3. **Verifikasi environment variables**
   - Pastikan 3 env vars sudah tersetting di Vercel
   - Redeploy jika perlu: Settings → Deployments → Redeploy

### 6️⃣ Testing Admin Panel

1. **Login ke admin panel**
   ```
   https://yourdomain.vercel.app/admin/login
   ```

2. **Gunakan email/password yang dibuat di Step 4**

3. **Test setiap section:**
   - `/admin/hero` - Hero sections manager
   - `/admin/programs` - Program items manager (INFOPROF, SINERGI, etc)
   - `/admin/spotlight` - Spotlight highlights manager
   - `/admin/ecosystem` - Ecosystem cards manager
   - `/admin/roadmap` - Roadmap phases manager
   - `/admin/cta` - CTA blocks manager
   - `/admin/faq` - FAQ items manager

4. **Buat content baru:**
   - Klik form di atas setiap halaman
   - Isi semua field yang diperlukan (marked dengan *)
   - Centang "Published" agar muncul di frontend
   - Klik "Create"

5. **Edit content:**
   - Klik "Edit" pada item yang ingin diubah
   - Form akan terisi otomatis
   - Ubah data yang diperlukan
   - Klik "Update"

6. **Delete content:**
   - Klik "Delete" pada item
   - Konfirmasi penghapusan

## 📊 Database Tables

### `hero_sections`
- Mengelola hero banners
- Fields: slug, title, subtitle, cta_buttons, image_url

### `program_items`
- Mengelola 4 program inti ARCADE
- Fields: program_code (INFOPROF/SINERGI/CeritaKita/ALIVE), title, description, icon, link

### `spotlight_items`
- Mengelola highlight content
- Fields: category (Karier/Event/Cerita), title, description, link, meta, cta_text

### `ecosystem_cards`
- Mengelola ecosystem integration cards
- Fields: title, description

### `roadmap_phases`
- Mengelola development roadmap
- Fields: phase_name, period, title, description, status, milestones (array)

### `cta_blocks`
- Mengelola call-to-action sections
- Fields: slug, title, description, button configs

### `faq_items`
- Mengelola FAQ
- Fields: question, answer, category

## 🔒 Security (Row Level Security)

Semua tables dilindungi dengan RLS policies:

**Public (Frontend):**
- ✅ Hanya bisa **READ** content yang `is_published = true`
- ❌ Tidak bisa create/update/delete

**Service Role (Backend/API):**
- ✅ Full access: create, read, update, delete
- Hanya digunakan oleh server-side functions

**Admin Panel:**
- Menggunakan browser client dengan anon key
- Perlu autentikasi via Supabase Auth
- Protected by middleware di `/admin/*` routes

## 🛠️ Maintenance

### Backup Database
```sql
-- Export via Supabase Dashboard
-- Project → Database → Backups → Download
```

### Update Schema
1. Buat file migration baru: `002_add_feature.sql`
2. Jalankan di SQL Editor
3. Commit ke repository

### Manage Users
- Supabase Dashboard → Authentication → Users
- Tambah/hapus/edit admin users

## 🚨 Troubleshooting

### Error: "Failed to load items"
- Cek environment variables di Vercel/local
- Cek koneksi internet
- Cek Supabase project status (dashboard)

### Error: "Invalid JWT"
- Logout dan login kembali
- Clear browser cookies/cache
- Cek service role key di env vars

### Error: "RLS policy violation"
- Pastikan user sudah login
- Cek RLS policies di Supabase (Database → Policies)

### Content tidak muncul di frontend
- Pastikan `is_published = true`
- Cek `display_order` untuk urutan
- Cek query di component (slug harus match)

## 📞 Support

- Supabase Docs: https://supabase.com/docs
- Next.js Docs: https://nextjs.org/docs
- Vercel Docs: https://vercel.com/docs

## ✅ Checklist Setup

- [ ] Supabase project created
- [ ] Environment variables configured (.env.local & Vercel)
- [ ] Database schema migrated (001_create_content_tables.sql)
- [ ] Seed data inserted (optional)
- [ ] Admin user created
- [ ] Deployed to Vercel
- [ ] Admin login tested
- [ ] Content CRUD tested (Create, Read, Update, Delete)
- [ ] Frontend display verified

---

**Selamat! CMS dengan admin panel built-in sudah siap digunakan! 🎉**

Semua konten sekarang dapat dikelola langsung dari:
`https://yourdomain.vercel.app/admin`
