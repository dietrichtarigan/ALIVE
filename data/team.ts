export interface TeamMember {
  name: string;
  role: string;
  focus: string;
  contact?: string;
}

export const teamStructure: TeamMember[] = [
  {
    name: "Dietrich Tarigan",
    role: "Kepala Divisi ARCADE",
    focus: "Strategi ekosistem alumni dan kemitraan industri",
    contact: "mailto:arcade.himafi@gmail.com",
  },
  {
    name: "Alya Rahmania",
    role: "Koordinator INFOPROF",
    focus: "Kurasi peluang karier, magang, dan beasiswa",
  },
  {
    name: "Hafizh Ramadhan",
    role: "Koordinator SINERGI",
    focus: "Program event alumni, company visit, dan kolaborasi komunitas",
  },
  {
    name: "Dhea Kartika",
    role: "Koordinator CeritaKita",
    focus: "Produksi konten cerita alumni dan newsletter",
  },
  {
    name: "Raden Iqbal",
    role: "Koordinator ALIVE",
    focus: "Pengembangan database LivingLink dan analitik alumni",
  },
  {
    name: "Nisrina Zahra",
    role: "Staff Riset & Insight",
    focus: "Mapping kebutuhan massa, survei, dan laporan kuartalan",
  },
];
