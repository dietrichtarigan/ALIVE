export interface RoadmapPhase {
  title: string;
  period: string;
  focus: string;
  deliverables: string[];
  status: "done" | "in-progress" | "upcoming";
}

export const roadmapPhases: RoadmapPhase[] = [
  {
    title: "Tahap 1",
    period: "Okt 2025",
    focus: "Rancang konsep & UI",
    deliverables: [
      "Landing page statis",
      "Wireframe halaman program",
      "Brand guideline ARCADE",
    ],
    status: "done",
  },
  {
    title: "Tahap 2",
    period: "Jan 2026",
    focus: "Integrasi Supabase & dashboard admin",
    deliverables: [
      "CRUD Info Karier",
      "CMS Cerita Alumni",
      "Sinkronisasi Supabase ↔ data statis",
    ],
    status: "in-progress",
  },
  {
    title: "Tahap 3",
    period: "Apr 2026",
    focus: "LivingLink & autentikasi admin",
    deliverables: [
      "Portal alumni untuk update data",
      "Single sign-on HIMAFI",
      "Automasi newsletter",
    ],
    status: "upcoming",
  },
  {
    title: "Tahap 4",
    period: "Jul 2026",
    focus: "Deploy Vercel & integrasi data eksternal",
    deliverables: [
      "Deploy Vercel + domain",
      "Integrasi LinkedIn insight",
      "Dashboard analitik",
    ],
    status: "upcoming",
  },
];
