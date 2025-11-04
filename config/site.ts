export const siteConfig = {
  name: "ARCADE HIMAFI",
  url: "https://arcade.himafi.id",
  getStartedUrl: "https://arcade.himafi.id",
  ogImage:
    "https://dummyimage.com/1200x630/1b365d/ffffff&text=ARCADE+HIMAFI",
  description:
    "Platform karier HIMAFI yang menghubungkan mahasiswa dengan alumni, industri, dan peluang pengembangan diri.",
  links: {
    instagram: "https://instagram.com/careerhimafi",
    email: "mailto:arcade.himafi@gmail.com",
    linkedin: "https://www.linkedin.com/company/himafi-itb",
    github: "https://github.com/himafi",
  },
  resources: {
    infoSubmission: "/karier#kirim-info",
    storySubmission: "/cerita#kirim-cerita",
    adminDashboard: "/admin",
  },
  pricing: {
    pro: "https://arcade.himafi.id/produk/pro",
    team: "https://arcade.himafi.id/produk/team",
  },
  backend: {
    baseUrl:
      process.env.NEXT_PUBLIC_ARCADE_BACKEND?.replace(/\/$/, "") || "/api",
    auth: {
      login:
        process.env.NEXT_PUBLIC_ARCADE_AUTH_LOGIN_ENDPOINT ||
        "/admin/login",
      logout:
        process.env.NEXT_PUBLIC_ARCADE_AUTH_LOGOUT_ENDPOINT ||
        "/admin/logout",
      profile:
        process.env.NEXT_PUBLIC_ARCADE_AUTH_PROFILE_ENDPOINT ||
        "/admin/profile",
    },
    jobs: {
      list:
        process.env.NEXT_PUBLIC_ARCADE_JOBS_LIST_ENDPOINT ||
        "/infoprof",
      create:
        process.env.NEXT_PUBLIC_ARCADE_JOBS_CREATE_ENDPOINT ||
        "/infoprof",
      update:
        process.env.NEXT_PUBLIC_ARCADE_JOBS_UPDATE_ENDPOINT ||
        "/infoprof",
      remove:
        process.env.NEXT_PUBLIC_ARCADE_JOBS_DELETE_ENDPOINT ||
        "/infoprof",
    },
    stories: {
      list:
        process.env.NEXT_PUBLIC_ARCADE_STORIES_LIST_ENDPOINT ||
        "/cerita",
      create:
        process.env.NEXT_PUBLIC_ARCADE_STORIES_CREATE_ENDPOINT ||
        "/cerita",
      update:
        process.env.NEXT_PUBLIC_ARCADE_STORIES_UPDATE_ENDPOINT ||
        "/cerita",
      remove:
        process.env.NEXT_PUBLIC_ARCADE_STORIES_DELETE_ENDPOINT ||
        "/cerita",
    },
  },
  stats: {
    updated: "27 Oct 2025",
    careerPosts: 48,
    alumniStories: 32,
    partnerCompanies: 18,
    communityMembers: "400+",
    websiteTemplates: 1,
    appTemplates: 0,
    sections: 12,
    illustrations: 6,
    animations: 4,
    figma: 7600,
    github: "120+",
    cli: 5400,
  },
};

export type SiteConfig = typeof siteConfig;
