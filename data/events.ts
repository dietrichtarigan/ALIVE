export type EventCategory = "Talkshow" | "Workshop" | "Company Visit" | "Networking";

export interface ArcadeEvent {
  id: string;
  title: string;
  category: EventCategory;
  description: string;
  date: string;
  location: string;
  registrationLink?: string;
  documentationLink?: string;
  posterColor: string;
  host: string;
  isUpcoming: boolean;
  tags: string[];
}

export const arcadeEvents: ArcadeEvent[] = [
  {
    id: "quantum-career-bridges",
    title: "Quantum Career Bridges",
    category: "Talkshow",
    description:
      "Diskusi panel bersama 3 alumni HIMAFI yang bekerja di bidang kuantum computing dan data science.",
    date: "2025-11-09T13:30:00+07:00",
    location: "Aula Labtek VI, ITB",
    registrationLink: "https://bit.ly/quantum-bridges",
    posterColor: "from-[#1b365d] via-[#27468a] to-[#f2aa1f]",
    host: "Program SINERGI",
    isUpcoming: true,
    tags: ["Alumni", "Karier", "Hybrid"],
  },
  {
    id: "livinglink-kickoff",
    title: "LivingLink Kickoff Meetup",
    category: "Networking",
    description:
      "Pertemuan perdana alumni dan massa HIMAFI untuk membangun database LivingLink dan mentorship batch 2026.",
    date: "2025-11-23T09:00:00+07:00",
    location: "Coworking Space, Bandung",
    registrationLink: "https://bit.ly/livinglink-kickoff",
    posterColor: "from-[#082032] via-[#2c394b] to-[#f2aa1f]",
    host: "Program ALIVE",
    isUpcoming: true,
    tags: ["Mentoring", "Community"],
  },
  {
    id: "company-visit-stmkg",
    title: "Company Visit: STMKG Weather Lab",
    category: "Company Visit",
    description:
      "Eksplorasi laboratorium cuaca dan instrumentasi BMKG untuk mengenal potensi karier instrumentasi atmosfer.",
    date: "2025-12-14T08:00:00+07:00",
    location: "STMKG, Tangerang",
    registrationLink: "https://bit.ly/arcade-stmkg",
    posterColor: "from-[#012a4a] via-[#013a63] to-[#2a6f97]",
    host: "Program SINERGI",
    isUpcoming: true,
    tags: ["Instrumentasi", "Lapangan"],
  },
  {
    id: "career-design-sprint",
    title: "Career Design Sprint",
    category: "Workshop",
    description:
      "Workshop intensif 2 hari menyusun peta karier dan portofolio profesional untuk massa HIMAFI.",
    date: "2025-10-05T09:00:00+07:00",
    location: "Aula HIMAFI",
    documentationLink: "https://drive.google.com/careersprint2025",
    posterColor: "from-[#1f2937] via-[#111827] to-[#f3f4f6]",
    host: "Program INFOPROF",
    isUpcoming: false,
    tags: ["Karier", "Portfolio"],
  },
  {
    id: "alumni-fireside-tech",
    title: "Fireside Chat: Physics in Tech",
    category: "Talkshow",
    description:
      "Cerita alumni HIMAFI yang berkarier sebagai Product Manager, Data Scientist, dan Hardware Engineer di startup teknologi.",
    date: "2025-09-12T19:00:00+07:00",
    location: "Zoom Webinar",
    documentationLink: "https://youtu.be/arcade-fireside-tech",
    posterColor: "from-[#0f172a] via-[#1e293b] to-[#38bdf8]",
    host: "Program CeritaKita",
    isUpcoming: false,
    tags: ["Alumni", "Teknologi", "Online"],
  },
];
