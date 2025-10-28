"use client";

import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { backendClient } from "@/lib/backend";

type AdminSessionStatus = "loading" | "unauthenticated" | "authenticated";

interface AdminUser {
  id?: string;
  name: string;
  email: string;
  role?: string;
}

interface AdminSessionState {
  status: AdminSessionStatus;
  token?: string;
  user?: AdminUser;
  error?: string;
}

interface AdminLoginPayload {
  email: string;
  password: string;
}

interface AdminSessionContextValue extends AdminSessionState {
  login: (payload: AdminLoginPayload) => Promise<{ ok: boolean; message?: string }>;
  logout: () => Promise<void>;
  refresh: (token?: string) => Promise<void>;
}

const AdminSessionContext = createContext<AdminSessionContextValue | null>(null);

const STORAGE_KEY = "arcade-admin-token";

function toAdminUser(value: unknown): AdminUser | undefined {
  if (!value || typeof value !== "object") {
    return undefined;
  }

  const record = value as Record<string, unknown>;
  const id = record.id;
  const name = record.name ?? record.full_name ?? record.username;
  const email = record.email ?? record.username ?? record.contact;
  const role = record.role ?? record.permission ?? record.level;

  const resolvedName = typeof name === "string" && name.trim().length > 0 ? name.trim() : undefined;
  const resolvedEmail = typeof email === "string" && email.trim().length > 0 ? email.trim() : undefined;

  if (!resolvedName && !resolvedEmail) {
    return undefined;
  }

  return {
    id:
      typeof id === "string"
        ? id
        : typeof id === "number"
          ? String(id)
          : undefined,
    name: resolvedName ?? "Administrator",
    email: resolvedEmail ?? "admin@arcade.local",
    role: typeof role === "string" ? role : undefined,
  };
}

function parseAuthResponse(data: unknown) {
  if (!data || typeof data !== "object") {
    return { token: undefined, user: undefined, message: undefined };
  }

  const record = data as Record<string, unknown>;
  const nested =
    record.data && typeof record.data === "object"
      ? (record.data as Record<string, unknown>)
      : undefined;

  const candidates = [
    record.token,
    record.access_token,
    record.sessionToken,
    nested?.token,
    nested?.access_token,
  ];
  const token = candidates.find((value): value is string => typeof value === "string");

  const userCandidate = [
    record.user,
    record.profile,
    nested?.user,
    nested?.profile,
  ].find((value) => value && typeof value === "object");

  const messageCandidate = [
    record.message,
    nested?.message,
    record.error,
    nested?.error,
    record.status,
  ].find((value): value is string => typeof value === "string" && value.trim().length > 0);

  return {
    token,
    user: toAdminUser(userCandidate),
    message: messageCandidate,
  };
}

export function AdminSessionProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AdminSessionState>({ status: "loading" });

  const refresh = useCallback(async (providedToken?: string) => {
    const token = providedToken ?? localStorage.getItem(STORAGE_KEY) ?? undefined;

    if (!token) {
      setState({ status: "unauthenticated" });
      return;
    }

    if (!backendClient.isConfigured()) {
      setState({
        status: "authenticated",
        token,
        user: { name: "Demo Admin", email: "admin@arcade.local" },
      });
      return;
    }

    try {
      const { status, data } = await backendClient.auth.profile(token);

      if (status >= 400) {
        const { message } = parseAuthResponse(data);
        throw new Error(message ?? "Sesi admin tidak valid atau kedaluwarsa.");
      }

      const { user } = parseAuthResponse(data);

      setState({
        status: "authenticated",
        token,
        user: user ?? { name: "Administrator", email: "admin@arcade.local" },
      });
    } catch (error) {
      localStorage.removeItem(STORAGE_KEY);
      setState({
        status: "unauthenticated",
        error: (error as Error).message,
      });
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const storedToken = localStorage.getItem(STORAGE_KEY);
    if (!storedToken) {
      setState((prev) => (prev.status === "loading" ? { status: "unauthenticated" } : prev));
      return;
    }

    refresh(storedToken);
  }, [refresh]);

  const login = useCallback(
    async (payload: AdminLoginPayload) => {
      setState({ status: "loading" });

      try {
        if (!backendClient.isConfigured()) {
          const demoToken = `dev-${Date.now()}`;
          localStorage.setItem(STORAGE_KEY, demoToken);
          setState({
            status: "authenticated",
            token: demoToken,
            user: { name: "Demo Admin", email: payload.email },
          });
          return {
            ok: true,
            message: "Backend belum aktif. Mode demo diaktifkan.",
          };
        }

        const { status, data } = await backendClient.auth.login(payload);
        const parsed = parseAuthResponse(data);

        if (status >= 400) {
          throw new Error(parsed.message ?? "Autentikasi admin gagal.");
        }

        if (!parsed.token) {
          throw new Error("Backend tidak mengembalikan token autentikasi.");
        }

        localStorage.setItem(STORAGE_KEY, parsed.token);
        setState({
          status: "authenticated",
          token: parsed.token,
          user:
            parsed.user ?? {
              name: payload.email,
              email: payload.email,
            },
        });

        return { ok: true, message: parsed.message };
      } catch (error) {
        const message = (error as Error).message || "Gagal melakukan login.";
        setState({ status: "unauthenticated", error: message });
        return { ok: false, message };
      }
    },
    [],
  );

  const logout = useCallback(async () => {
    const token = localStorage.getItem(STORAGE_KEY) ?? state.token;

    try {
      if (backendClient.isConfigured() && token) {
        await backendClient.auth.logout(token);
      }
    } catch (error) {
      console.warn("Gagal memanggil logout backend:", error);
    }

    localStorage.removeItem(STORAGE_KEY);
    setState({ status: "unauthenticated" });
  }, [state.token]);

  const value = useMemo<AdminSessionContextValue>(
    () => ({
      ...state,
      login,
      logout,
      refresh,
    }),
    [state, login, logout, refresh],
  );

  return <AdminSessionContext.Provider value={value}>{children}</AdminSessionContext.Provider>;
}

export function useAdminSession() {
  const context = useContext(AdminSessionContext);

  if (!context) {
    throw new Error("useAdminSession harus digunakan di dalam AdminSessionProvider.");
  }

  return context;
}
