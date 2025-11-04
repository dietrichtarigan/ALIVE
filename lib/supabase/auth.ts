import { NextRequest } from "next/server";

import { getSupabaseAnonClient, getSupabaseServiceRoleClient, isSupabaseConfigured } from "./server-client";
import { AdminUserProfile } from "./types";

const allowedAdminEmailSet = new Set(
  (process.env.ADMIN_ALLOWED_EMAILS ?? "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter((email) => email.length > 0),
);

function isAllowedAdminEmail(email: string | null | undefined) {
  if (!email) {
    return false;
  }

  return allowedAdminEmailSet.has(email.trim().toLowerCase());
}

class AdminAuthError extends Error {
  status: number;

  constructor(message: string, status = 401) {
    super(message);
    this.status = status;
  }
}

function extractToken(request: NextRequest) {
  const header = request.headers.get("authorization") ?? request.headers.get("Authorization");

  if (!header) {
    return undefined;
  }

  const match = header.match(/^Bearer\s+(.*)$/i);
  return match ? match[1].trim() : undefined;
}

function resolveRole(user: Record<string, unknown>) {
  const appMetadata = (user.app_metadata ?? {}) as Record<string, unknown>;
  const userMetadata = (user.user_metadata ?? {}) as Record<string, unknown>;
  const email = typeof user.email === "string" ? user.email : undefined;

  const directRole = appMetadata.role ?? userMetadata.role;

  if (typeof directRole === "string" && directRole.trim().length > 0) {
    return directRole.trim();
  }

  const roles = appMetadata.roles ?? userMetadata.roles;
  if (Array.isArray(roles)) {
    const adminRole = roles.find((role) => typeof role === "string" && role.toLowerCase() === "admin");
    if (adminRole) {
      return adminRole;
    }
  }

  if (userMetadata.is_admin === true) {
    return "admin";
  }

  if (isAllowedAdminEmail(email)) {
    return "admin";
  }

  return undefined;
}

function resolveName(user: Record<string, unknown>) {
  const userMetadata = (user.user_metadata ?? {}) as Record<string, unknown>;
  const candidates = [
    userMetadata.full_name,
    userMetadata.name,
    userMetadata.display_name,
  ].filter((value): value is string => typeof value === "string" && value.trim().length > 0);

  return candidates[0];
}

export async function signInAdmin(email: string, password: string) {
  if (!isSupabaseConfigured()) {
    throw new AdminAuthError("Supabase belum dikonfigurasi untuk autentikasi.", 503);
  }

  const supabase = getSupabaseAnonClient();
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error || !data?.session || !data.user) {
    throw new AdminAuthError(error?.message ?? "Kredensial admin tidak valid.", 401);
  }

  const role = resolveRole(data.user as unknown as Record<string, unknown>);

  if (!role || role.toLowerCase() !== "admin") {
    throw new AdminAuthError("Pengguna tidak memiliki hak admin.", 403);
  }

  const profile: AdminUserProfile = {
    id: data.user.id,
    email: data.user.email ?? email,
    name: resolveName(data.user as unknown as Record<string, unknown>) ?? (data.user.email ?? "Administrator"),
    role,
  };

  return {
    profile,
    session: data.session,
  };
}

export async function requireAdmin(request: NextRequest) {
  if (!isSupabaseConfigured()) {
    throw new AdminAuthError("Supabase belum dikonfigurasi untuk autentikasi.", 503);
  }

  const token = extractToken(request);

  if (!token) {
    throw new AdminAuthError("Token autentikasi tidak ditemukan.");
  }

  const supabase = getSupabaseServiceRoleClient();
  const { data, error } = await supabase.auth.getUser(token);

  if (error || !data?.user) {
    throw new AdminAuthError(error?.message ?? "Token admin tidak valid.");
  }

  const role = resolveRole(data.user as unknown as Record<string, unknown>);

  if (!role || role.toLowerCase() !== "admin") {
    const email = typeof data.user.email === "string" ? data.user.email : undefined;
    if (!isAllowedAdminEmail(email)) {
      throw new AdminAuthError("Pengguna tidak memiliki hak admin.", 403);
    }
  }

  const profile: AdminUserProfile = {
    id: data.user.id,
    email: data.user.email ?? "",
    name: resolveName(data.user as unknown as Record<string, unknown>) ?? data.user.email ?? "Administrator",
    role,
  };

  return {
    token,
    profile,
  };
}

export async function signOutAdmin(userId: string) {
  if (!isSupabaseConfigured()) {
    throw new AdminAuthError("Supabase belum dikonfigurasi.", 503);
  }

  const supabase = getSupabaseServiceRoleClient();
  const { error } = await supabase.auth.admin.signOut(userId);

  if (error) {
    throw new AdminAuthError(error.message, 500);
  }
}

export { AdminAuthError };
