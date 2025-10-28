export type StoryTag =
  | "Riset"
  | "Industri"
  | "Akademik"
  | "Teknologi"
  | "Kewirausahaan"
  | "Energi";

export interface AlumniStory {
  id: string;
  slug: string;
  title: string;
  name: string;
  batch: string;
  role: string;
  company: string;
  location: string;
  summary: string;
  tags: StoryTag[];
  quote: string;
  body: string[];
  avatarColor: string;
  featured?: boolean;
}

export const alumniStories: AlumniStory[] = [
  {
    id: "nadine-quantum",
    slug: "menjembatani-dunia-kuantum",
    title: "Menjembatani Dunia Kuantum dan Bisnis",
    name: "Nadine Lestari",
    batch: "HIMAFI 2016",
    role: "Quantum Product Strategist",
    company: "Qubita Lab",
    location: "Singapore",
    summary:
      "Bagaimana Nadine mengubah riset kuantum menjadi solusi bisnis konkret untuk industri logistik Asia Tenggara.",
    tags: ["Teknologi", "Riset"],
    quote:
      "Jangan hanya puas bisa menjelaskan persamaan, kita perlu memahami siapa yang akan terbantu oleh solusi fisika kita.",
    body: [
      "Nadine memulai kariernya sebagai peneliti kuantum di Singapura sebelum akhirnya menyadari bahwa banyak hasil riset tidak pernah menyentuh pengguna akhir.",
      "Melalui program akselerator, ia belajar mengemas algoritma kuantum menjadi layanan optimasi rute untuk perusahaan logistik.",
      "Kini, Qubita Lab menangani 12 klien enterprise dengan tim multidisiplin yang sebagian besar alumni HIMAFI dan STEI.",
    ],
    avatarColor: "bg-gradient-to-br from-[#1b365d] to-[#4b7bec]",
    featured: true,
  },
  {
    id: "reza-geothermal",
    slug: "meracik-fisika-untuk-panase",
    title: "Meracik Fisika untuk Pembangkit Panas Bumi",
    name: "Reza Prayoga",
    batch: "HIMAFI 2013",
    role: "Reservoir Engineer",
    company: "Pertamina Geothermal",
    location: "Bandung",
    summary:
      "Reza membangun tim subsurface yang memadukan machine learning dan data logging untuk memprediksi performa reservoir.",
  tags: ["Industri", "Energi"],
    quote: "Jaringan alumni adalah pintu pertama. Setelah itu, performamu yang akan menjaganya tetap terbuka.",
    body: [
      "Selepas lulus, Reza menempuh studi magister di Selandia Baru dan kembali dengan misi memajukan panas bumi Indonesia.",
      "Ia menginisiasi proyek predictive maintenance yang menurunkan downtime turbin sebesar 18% dalam 6 bulan.",
      "Reza aktif sebagai mentor LivingLink dan membuka jalur magang reguler untuk massa HIMAFI.",
    ],
    avatarColor: "bg-gradient-to-br from-[#f2aa1f] to-[#f97316]",
  },
  {
    id: "maya-education",
    slug: "fisika-untuk-kesetaraan",
    title: "Fisika untuk Kesetaraan Akses Pendidikan",
    name: "Maya Putri",
    batch: "HIMAFI 2012",
    role: "Founder & CEO",
    company: "Photon Academy",
    location: "Yogyakarta",
    summary:
      "Mengembangkan platform edukasi berbasis eksperimen sederhana untuk sekolah-sekolah di luar Pulau Jawa.",
    tags: ["Kewirausahaan", "Akademik"],
    quote:
      "Cerita alumni harus menunjukkan banyak wajah. Anak fisika bisa jadi pendidik, wirausahawan, atau peneliti, selama kita mau belajar ulang.",
    body: [
      "Photon Academy lahir dari keresahan Maya melihat minimnya fasilitas laboratorium di sekolah pinggiran.",
      "Dengan pendekatan low-cost experiment kit, kini lebih dari 9.000 siswa merasakan praktikum fisika interaktif.",
      "Maya memanfaatkan jaringan ARCADE untuk memperluas kolaborasi CSR dan mencari mentor kurikulum.",
    ],
    avatarColor: "bg-gradient-to-br from-[#ec4899] to-[#a855f7]",
    featured: true,
  },
  {
    id: "dimas-research",
    slug: "riset-partikel-ke-cern",
    title: "Dari Labtek ke CERN",
    name: "Dimas Priambodo",
    batch: "HIMAFI 2014",
    role: "Postdoctoral Researcher",
    company: "CERN",
    location: "Geneva",
    summary:
      "Perjalanan Dimas mengejar mimpi riset partikel dan bagaimana ia membangun network riset internasional.",
    tags: ["Riset", "Akademik"],
    quote:
      "Kalau kamu punya rasa penasaran besar, ARCADE membantu memberimu struktur untuk melangkah tahap demi tahap.",
    body: [
      "Dimas memulai sebagai asisten peneliti di LIPI sebelum melanjutkan doktoral di EPFL dengan topik neutrino.",
      "Melalui ARCADE, ia sering membagikan catatan fellowship dan template proposal riset.",
      "Ia mendorong mahasiswa HIMAFI untuk lebih aktif mengikuti konferensi dan kompetisi global.",
    ],
    avatarColor: "bg-gradient-to-br from-[#0ea5e9] to-[#22d3ee]",
  },
];
