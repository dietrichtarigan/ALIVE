-- Initial content for ARCADE HIMAFI

-- Program Items (4 core programs)
INSERT INTO program_items (program_code, title, description, icon, link, display_order)
SELECT 'INFOPROF', 'Info Karier & Beasiswa', 'Kurasi peluang kerja, magang, dan beasiswa yang relevan bagi massa HIMAFI dengan catatan deadline dan kontak mentor.', 'BriefcaseBusiness', '/karier', 1
WHERE NOT EXISTS (SELECT 1 FROM program_items WHERE program_code = 'INFOPROF');

INSERT INTO program_items (program_code, title, description, icon, link, display_order)
SELECT 'SINERGI', 'Event & Forum Alumni', 'Talkshow, company visit, dan forum diskusi untuk mempertemukan alumni lintas industri dengan mahasiswa.', 'CalendarDays', '/events', 2
WHERE NOT EXISTS (SELECT 1 FROM program_items WHERE program_code = 'SINERGI');

INSERT INTO program_items (program_code, title, description, icon, link, display_order)
SELECT 'CeritaKita', 'Cerita Alumni', 'Artikel narasi dan newsletter yang merekam perjalanan alumni HIMAFI di berbagai bidang profesi.', 'Sparkles', '/cerita', 3
WHERE NOT EXISTS (SELECT 1 FROM program_items WHERE program_code = 'CeritaKita');

INSERT INTO program_items (program_code, title, description, icon, link, display_order)
SELECT 'ALIVE', 'Database Alumni', 'Portal LivingLink untuk memetakan sebaran alumni, bidang kerja, dan membuka jalur mentoring berkelanjutan.', 'Database', '/alumni', 4
WHERE NOT EXISTS (SELECT 1 FROM program_items WHERE program_code = 'ALIVE');

INSERT INTO spotlight_items (category, title, description, link, meta, cta_text, display_order)
SELECT 'Karier', 'Data Scientist - Tech Company', 'Peluang posisi data scientist untuk fresh graduate dengan background fisika komputasi', '/karier', 'PT Maju Bersama · Batas 31 Des 2024', 'Lihat di INFOPROF', 1
WHERE NOT EXISTS (
  SELECT 1 FROM spotlight_items WHERE category = 'Karier' AND title = 'Data Scientist - Tech Company'
);

INSERT INTO spotlight_items (category, title, description, link, meta, cta_text, display_order)
SELECT 'Event', 'Alumni Talkshow: Career in Tech', 'Diskusi bersama alumni yang bekerja di industri teknologi tentang transisi karier dari fisika ke tech', '/events', '15 Jan 2025 · Ruang Seminar FMIPA', 'Lihat agenda', 2
WHERE NOT EXISTS (
  SELECT 1 FROM spotlight_items WHERE category = 'Event' AND title = 'Alumni Talkshow: Career in Tech'
);

INSERT INTO spotlight_items (category, title, description, link, meta, cta_text, display_order)
SELECT 'Cerita', 'Dari Fisika ke Industri Energi', 'Perjalanan alumni HIMAFI yang membangun karier di sektor energi terbarukan', '/cerita/energi-terbarukan', 'Dr. Ahmad Rizki · Energy Consultant', 'Baca kisahnya', 3
WHERE NOT EXISTS (
  SELECT 1 FROM spotlight_items WHERE category = 'Cerita' AND title = 'Dari Fisika ke Industri Energi'
);

INSERT INTO ecosystem_cards (title, description, display_order)
SELECT 'Integrasi Media Sosial', 'Sinkron konten CeritaKita dan highlight event ke Instagram @careerhimafi agar informasi selalu sampai ke massa.', 1
WHERE NOT EXISTS (SELECT 1 FROM ecosystem_cards WHERE title = 'Integrasi Media Sosial');

INSERT INTO ecosystem_cards (title, description, display_order)
SELECT 'Pipeline Data Alumni', 'Kolaborasi Google Form, Spreadsheet, dan rencana migrasi ke database MySQL untuk LivingLink.', 2
WHERE NOT EXISTS (SELECT 1 FROM ecosystem_cards WHERE title = 'Pipeline Data Alumni');

INSERT INTO ecosystem_cards (title, description, display_order)
SELECT 'Notifikasi & Newsletter', 'Rencana automasi email bulanan yang merangkum peluang karier dan cerita alumni terbaru.', 3
WHERE NOT EXISTS (SELECT 1 FROM ecosystem_cards WHERE title = 'Notifikasi & Newsletter');

INSERT INTO roadmap_phases (phase_name, period, title, description, status, milestones, display_order)
SELECT 'Phase 1', 'Q4 2024', 'Foundation & Data Collection', 'Membangun infrastruktur dasar dan mengumpulkan data alumni', 'completed',
ARRAY[
  'Setup website & admin panel',
  'Migrasi data alumni dari spreadsheet',
  'Launch Instagram @careerhimafi',
  'Publikasi 5 cerita alumni pertama'
], 1
WHERE NOT EXISTS (SELECT 1 FROM roadmap_phases WHERE phase_name = 'Phase 1');

INSERT INTO roadmap_phases (phase_name, period, title, description, status, milestones, display_order)
SELECT 'Phase 2', 'Q1 2025', 'Content & Community Building', 'Memperkuat konten dan membangun engagement komunitas', 'in_progress',
ARRAY[
  'Kurasi 20+ lowongan karier per bulan',
  'Hosting 3 alumni talkshow',
  'Newsletter bulanan untuk 200+ subscribers',
  'Database alumni mencapai 300+ profiles'
], 2
WHERE NOT EXISTS (SELECT 1 FROM roadmap_phases WHERE phase_name = 'Phase 2');

INSERT INTO roadmap_phases (phase_name, period, title, description, status, milestones, display_order)
SELECT 'Phase 3', 'Q2-Q3 2025', 'Automation & Scale', 'Otomasi proses dan scaling layanan', 'planned',
ARRAY[
  'Email automation untuk job alerts',
  'Mobile app untuk alumni network',
  'Partnership dengan 10+ perusahaan',
  'Mentoring program matching system'
], 3
WHERE NOT EXISTS (SELECT 1 FROM roadmap_phases WHERE phase_name = 'Phase 3');
