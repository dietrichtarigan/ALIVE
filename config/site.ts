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
    updated: null as string | null,
    careerPosts: 0,
    alumniStories: 0,
    partnerCompanies: 0,
    communityMembers: "0",
    websiteTemplates: 0,
    appTemplates: 0,
    sections: 0,
    illustrations: 0,
    animations: 0,
    figma: 0,
    github: "0",
    cli: 0,
  },
};

export type SiteConfig = typeof siteConfig;
