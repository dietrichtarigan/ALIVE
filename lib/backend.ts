import { siteConfig } from "@/config/site";

const { backend } = siteConfig;

const backendConfigured = Boolean(backend.baseUrl);

function buildUrl(path: string) {
  if (!backend.baseUrl) {
    throw new Error("Backend base URL is not configured. Pastikan NEXT_PUBLIC_ARCADE_BACKEND diarahkan ke /api.");
  }
  return `${backend.baseUrl}${path}`;
}

interface ProxyOptions {
  token?: string;
}

async function proxyRequest(
  path: string,
  init: RequestInit,
  options: ProxyOptions = {},
): Promise<{ status: number; data: unknown }> {
  if (!backend.baseUrl) {
    return {
      status: 501,
      data: {
        error: "ARCADE backend belum dikonfigurasi. Pastikan NEXT_PUBLIC_ARCADE_BACKEND mengarah ke /api dan Supabase aktif.",
      },
    };
  }

  const url = buildUrl(path);
  const headers = new Headers(init.headers ?? {});
  const isFormDataBody = typeof FormData !== "undefined" && init.body instanceof FormData;
  if (!headers.has("Content-Type") && !isFormDataBody) {
    headers.set("Content-Type", "application/json");
  }
  if (options.token) {
    headers.set("Authorization", `Bearer ${options.token}`);
  }

  const response = await fetch(url, {
    ...init,
    headers,
  });

  const text = await response.text();
  let data: unknown;
  try {
    data = text ? JSON.parse(text) : null;
  } catch (error) {
    data = { raw: text, parseError: (error as Error).message };
  }

  return { status: response.status, data };
}

export const backendClient = {
  isConfigured: () => backendConfigured,
  auth: {
    login: async (payload: unknown) =>
      proxyRequest(
        backend.auth.login,
        {
          method: "POST",
          body: JSON.stringify(payload),
        },
      ),
    logout: async (token?: string) =>
      proxyRequest(
        backend.auth.logout,
        {
          method: "POST",
        },
        { token },
      ),
    profile: async (token?: string) =>
      proxyRequest(
        backend.auth.profile,
        {
          method: "GET",
        },
        { token },
      ),
  },
  jobs: {
    list: async (token?: string) =>
      proxyRequest(
        backend.jobs.list,
        {
          method: "GET",
        },
        { token },
      ),
    create: async (payload: unknown, token?: string) =>
      proxyRequest(
        backend.jobs.create,
        {
          method: "POST",
          body: typeof FormData !== "undefined" && payload instanceof FormData ? payload : JSON.stringify(payload),
        },
        { token },
      ),
    update: async (payload: unknown, token?: string) =>
      proxyRequest(
        backend.jobs.update,
        {
          method: "PUT",
          body: typeof FormData !== "undefined" && payload instanceof FormData ? payload : JSON.stringify(payload),
        },
        { token },
      ),
    remove: async (payload: unknown, token?: string) =>
      proxyRequest(
        backend.jobs.remove,
        {
          method: "DELETE",
          body: JSON.stringify(payload),
        },
        { token },
      ),
  },
  stories: {
    list: async (token?: string) =>
      proxyRequest(
        backend.stories.list,
        {
          method: "GET",
        },
        { token },
      ),
    create: async (payload: unknown, token?: string) =>
      proxyRequest(
        backend.stories.create,
        {
          method: "POST",
          body: JSON.stringify(payload),
        },
        { token },
      ),
    update: async (payload: unknown, token?: string) =>
      proxyRequest(
        backend.stories.update,
        {
          method: "PUT",
          body: JSON.stringify(payload),
        },
        { token },
      ),
    remove: async (payload: unknown, token?: string) =>
      proxyRequest(
        backend.stories.remove,
        {
          method: "DELETE",
          body: JSON.stringify(payload),
        },
        { token },
      ),
  },
};
