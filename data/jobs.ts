export type JobCategory = "Kerja" | "Magang" | "Beasiswa";

export interface JobPosting {
  id: string;
  title: string;
  organization: string;
  location: string;
  category: JobCategory;
  description: string;
  requirements: string[];
  deadline: string;
  contact: string;
  link: string;
  tags: string[];
  highlight?: string;
}

export const jobPostings: JobPosting[] = [
  {
    id: "pln-graduate-development",
    title: "Graduate Development Program 2026",
    organization: "PLN Nusantara Power",
    location: "Jakarta & Surabaya",
    category: "Kerja",
    description:
      "Program akselerasi karier bagi lulusan S1 Fisika dan Teknik untuk menjadi Future Energy Specialist di PLN Nusantara Power.",
    requirements: [
      "Fresh graduate atau maksimal 2 tahun pengalaman kerja",
      "IPK minimal 3.20 dari skala 4.00",
      "Memiliki sertifikasi TOEFL/IELTS menjadi nilai tambah",
      "Bersedia ditempatkan pada unit PLN di seluruh Indonesia",
    ],
    deadline: "2025-11-15",
    contact: "talent.acquisition@pln.co.id",
    link: "https://careers.pln.co.id/graduate-program",
    tags: ["Energi", "Engineer", "Full-time"],
    highlight: "Batch rekrutmen terbaru untuk Future Energy Specialist.",
  },
  {
    id: "bppt-riset-energi",
    title: "Magang Riset Energi Terbarukan",
    organization: "BRIN - Pusat Riset Energi",
    location: "Serpong",
    category: "Magang",
    description:
      "Kesempatan magang penelitian selama 4 bulan berfokus pada teknologi fotovoltaik dan penyimpanan energi untuk mahasiswa tingkat akhir.",
    requirements: [
      "Mahasiswa S1 Fisika minimal semester 6",
      "Mengikuti mata kuliah Instrumentasi atau Fisika Material",
      "Mampu bekerja di laboratorium dan menulis laporan ilmiah",
    ],
    deadline: "2025-12-05",
    contact: "riset-energi@brin.go.id",
    link: "https://brin.go.id/magang",
    tags: ["Riset", "Energi Terbarukan"],
    highlight: "Kolaborasi resmi ARCADE dengan BRIN untuk batch Januari 2026.",
  },
  {
    id: "lpdp-riset-energi",
    title: "Beasiswa LPDP Riset Energi",
    organization: "LPDP x HIMAFI",
    location: "Nasional",
    category: "Beasiswa",
    description:
      "Skema pendanaan studi magister dan doktoral dengan fokus transisi energi dan instrumentasi industri bagi alumni HIMAFI.",
    requirements: [
      "Alumni HIMAFI maksimal usia 35 tahun",
      "Memiliki LoA bersyarat atau tanpa syarat",
      "Proposal penelitian sesuai prioritas energi nasional",
      "Surat rekomendasi dari dosen pembimbing atau atasan",
    ],
    deadline: "2025-12-20",
    contact: "info@lpdp.kemenkeu.go.id",
    link: "https://lpdp.kemenkeu.go.id/pendaftaran",
    tags: ["Beasiswa", "Riset", "Pasca Sarjana"],
    highlight: "Kuota khusus 5 awardee untuk alumni HIMAFI.",
  },
  {
    id: "gojek-data-analyst",
    title: "Data Analyst Intern",
    organization: "GoTo Group",
    location: "Hybrid - Jakarta",
    category: "Magang",
    description:
      "Tim Marketplace Analytics mencari mahasiswa dengan kapabilitas analitik untuk membantu eksperimen produk dan visualisasi data.",
    requirements: [
      "Mahasiswa tingkat akhir program S1",
      "Menguasai SQL dan Python (pandas) dasar",
      "Berpengalaman menggunakan Tableau atau PowerBI",
      "Minimal 3 bulan masa magang",
    ],
    deadline: "2025-11-08",
    contact: "campus@goto.com",
    link: "https://gotoimpact.id/internship",
    tags: ["Data", "Teknologi", "Analytics"],
  },
  {
    id: "pertamina-geothermal",
    title: "Reservoir Engineer Associate",
    organization: "Pertamina Geothermal Energy",
    location: "Bandung",
    category: "Kerja",
    description:
      "Peran strategis untuk memetakan performa reservoir panas bumi dengan kolaborasi lintas divisi eksplorasi dan produksi.",
    requirements: [
      "Lulusan S1/S2 Fisika atau Teknik Geofisika",
      "Pengalaman minimal 1 tahun di sektor energi",
      "Menguasai software reservoir simulation",
      "Bersedia penempatan lapangan hingga 30%",
    ],
    deadline: "2025-12-01",
    contact: "talent@pge.co.id",
    link: "https://pgejobs.id/openings",
    tags: ["Energi", "Engineer", "Geo"],
  },
  {
    id: "schneider-grant",
    title: "Schneider Electric Energy Fellowship",
    organization: "Schneider Electric Foundation",
    location: "Global (Hybrid)",
    category: "Beasiswa",
    description:
      "Program fellowship 6 bulan dengan kombinasi bootcamp, mentoring, dan pendanaan proyek energi terbarukan skala komunitas.",
    requirements: [
      "Mahasiswa atau alumni maksimal 3 tahun lulus",
      "Memiliki ide proyek energi terbarukan",
      "Komitmen mengikuti mentorship internasional",
    ],
    deadline: "2026-01-10",
    contact: "academy@se.com",
    link: "https://se.com/fellowship",
    tags: ["Energi", "Leadership", "Global"],
    highlight: "Akses mentoring global dan pendanaan hingga USD 10.000.",
  },
];
