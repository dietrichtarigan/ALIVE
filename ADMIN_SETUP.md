# CMS Admin Setup Guide

## 1️⃣ Run Database Migrations

Di Supabase SQL Editor, jalankan file berikut secara berurutan:

```sql
-- 1. Create tables
supabase/migrations/001_create_content_tables.sql

-- 2. Seed initial content
supabase/seed/001_initial_content.sql
```

## 2️⃣ Setup Environment Variables

### Lokal (.env.local)
```bash
NEXT_PUBLIC_SUPABASE_URL=https://iwjcvxsmaeeqvjxjmerm.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

Dapatkan keys dari: Supabase Dashboard → Settings → API

### Vercel
1. Buka project di Vercel Dashboard
2. Settings → Environment Variables
3. Tambahkan 3 variable di atas untuk Production + Preview

## 3️⃣ Setup Appsmith Admin Panel

### A. Buat Akun Appsmith
1. Kunjungi https://app.appsmith.com/
2. Sign up (gratis)
3. Buat workspace baru: "ALIVE CMS"

### B. Koneksi ke Supabase
1. Di Appsmith, klik "Create New" → "Datasources"
2. Pilih "PostgreSQL"
3. Isi form:
   - **Host**: `db.iwjcvxsmaeeqvjxjmerm.supabase.co`
   - **Port**: `5432`
   - **Database**: `postgres`
   - **Username**: `postgres`
   - **Password**: [dari Supabase → Settings → Database → password]
   - **SSL Mode**: `Require`
4. Test & Save

### C. Buat CRUD Screens

#### Hero Sections Page
1. Create New Page → "Hero Sections"
2. Tambah Table widget:
   - **Query**: 
   ```sql
   SELECT id, slug, title, subtitle, is_published, position, updated_at 
   FROM public.hero_sections 
   ORDER BY position;
   ```
3. Tambah Form widget untuk edit:
   - Bind ke selected row dari table
   - Fields: slug, title, subtitle, cta_primary_text, cta_primary_url, cta_secondary_text, cta_secondary_url, is_published, position
   - **Update Query**:
   ```sql
   UPDATE public.hero_sections
   SET 
     slug = {{Form1.data.slug}},
     title = {{Form1.data.title}},
     subtitle = {{Form1.data.subtitle}},
     cta_primary_text = {{Form1.data.cta_primary_text}},
     cta_primary_url = {{Form1.data.cta_primary_url}},
     cta_secondary_text = {{Form1.data.cta_secondary_text}},
     cta_secondary_url = {{Form1.data.cta_secondary_url}},
     is_published = {{Form1.data.is_published}},
     position = {{Form1.data.position}}
   WHERE id = {{Table1.selectedRow.id}};
   ```
4. Tambah "Add New" button → INSERT query

#### CTA Blocks Page
1. Create New Page → "CTA Blocks"
2. Table query:
   ```sql
   SELECT * FROM public.cta_blocks ORDER BY position;
   ```
3. Form untuk edit dengan fields: slug, title, description, cta_text, cta_url, is_published, position

#### FAQ Items Page
1. Create New Page → "FAQ Items"
2. Table query:
   ```sql
   SELECT * FROM public.faq_items ORDER BY category, position;
   ```
3. Form fields: slug, question, answer, category, is_published, position

#### Pricing Tiers Page
1. Create New Page → "Pricing Tiers"
2. Table query:
   ```sql
   SELECT * FROM public.pricing_tiers ORDER BY position;
   ```
3. Form fields: slug, name, price, currency, billing_period, description, features (JSON Editor), is_popular, is_published, position

#### Feature Items Page
1. Create New Page → "Feature Items"
2. Table query:
   ```sql
   SELECT * FROM public.feature_items ORDER BY category, position;
   ```
3. Form fields: slug, title, description, icon_name, category, is_published, position

### D. Setup Navigation
1. Klik "Pages" di sidebar
2. Drag-drop untuk reorder
3. Set "Hero Sections" sebagai homepage

## 4️⃣ Deploy ke Vercel

```bash
# Commit semua changes
git add .
git commit -m "feat: integrate Supabase CMS with dynamic content"
git push origin main
```

Vercel akan auto-deploy. Pastikan environment variables sudah diset.

## 5️⃣ Test Flow

1. **Edit konten di Appsmith**:
   - Buka Hero Sections
   - Klik row pertama
   - Ubah title → Save
   
2. **Verify di frontend**:
   - Buka https://alive.vercel.app
   - Refresh page
   - Title hero harusnya berubah

3. **Add FAQ baru**:
   - Di Appsmith FAQ page → Add New
   - Isi question, answer, set is_published = true
   - Save
   - Cek di frontend → section FAQ muncul

## 🎯 Cara Pakai Sehari-hari

### Update Hero Banner
1. Login Appsmith
2. Hero Sections page
3. Klik row → Edit form muncul
4. Ubah title/subtitle/CTA
5. Save → Auto update di website

### Tambah FAQ Baru
1. FAQ Items page → Add New
2. Isi form (slug harus unique)
3. Set is_published = true
4. Save → Langsung muncul di web

### Nonaktifkan Konten
- Set `is_published = false` → konten hilang dari web
- Tidak perlu delete, bisa diaktifkan lagi kapan saja

### Atur Urutan
- Ubah field `position` (0, 1, 2, dst)
- Semakin kecil = muncul duluan

## 📋 Checklist Deployment

- [ ] SQL migrations dijalankan di Supabase
- [ ] Seed data berhasil diinsert
- [ ] .env.local sudah diisi
- [ ] Vercel env variables sudah diset
- [ ] Appsmith datasource terkoneksi
- [ ] CRUD pages sudah dibuat di Appsmith
- [ ] Git push & Vercel deploy sukses
- [ ] Test edit konten & verify di frontend

## 🆘 Troubleshooting

**Frontend masih hardcoded?**
→ Cek apakah di `app/page.tsx` sudah pakai `<HeroSupabase />` bukan `<Hero />`

**Konten tidak muncul?**
→ Pastikan `is_published = true` di database

**Appsmith tidak bisa connect?**
→ Cek password database di Supabase Settings → Database

**Vercel error setelah deploy?**
→ Cek environment variables, pastikan keys valid

---

Sekarang kamu punya **no-code CMS** untuk manage semua konten website! 🎉
