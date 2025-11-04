import { NextRequest, NextResponse } from "next/server";
import type { ZodIssue } from "zod";
import { ZodError } from "zod";
import { z } from "zod";

import { alumniStories } from "@/data/stories";
import { AdminAuthError, requireAdmin } from "@/lib/supabase/auth";
import { mapStoryRow } from "@/lib/supabase/mappers";
import { storyCreateSchema, storyUpdateSchema } from "@/lib/supabase/schemas";
import { getSupabaseServiceRoleClient, isSupabaseConfigured } from "@/lib/supabase/server-client";
import { StoryRow } from "@/lib/supabase/types";

const deleteSchema = z.object({
  id: z.string().uuid("ID cerita tidak valid."),
});

function asJson(response: unknown, status = 200) {
  return NextResponse.json(response, { status });
}

function formatValidationError(error: unknown) {
  if (error instanceof ZodError) {
    const zodError = error as ZodError;
    const issues = zodError.issues ?? [];
    return issues.map((issue: ZodIssue) => issue.message).join("; ");
  }

  return null;
}

function normaliseNullableString(value?: string) {
  if (typeof value !== "string") {
    return null;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

export async function GET() {
  if (!isSupabaseConfigured()) {
    return asJson({
      data: alumniStories,
      fallback: true,
      message: "Supabase belum dikonfigurasi. Menampilkan data contoh CeritaKita.",
    });
  }

  const supabase = getSupabaseServiceRoleClient();
  const { data, error } = await supabase
    .from("stories")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return asJson({ error: error.message }, 500);
  }

  const rows = (data as StoryRow[] | null) ?? [];
  const records = rows.map(mapStoryRow);
  return asJson({ data: records });
}

export async function POST(request: NextRequest) {
  if (!isSupabaseConfigured()) {
    return asJson({
      error: "Supabase belum dikonfigurasi. Set variabel lingkungan Supabase sebelum membuat cerita.",
    }, 503);
  }

  let payload;
  try {
    const body = await request.json();
    payload = storyCreateSchema.parse(body);
  } catch (error: unknown) {
    const message = formatValidationError(error) ?? "Payload tidak valid.";
    return asJson({ error: message }, 422);
  }

  let admin;
  try {
    admin = await requireAdmin(request);
  } catch (error: unknown) {
    if (error instanceof AdminAuthError) {
      return asJson({ error: error.message }, error.status);
    }
    return asJson({ error: "Autentikasi admin gagal." }, 401);
  }

  const supabase = getSupabaseServiceRoleClient();
  const { data, error } = await supabase
    .from("stories")
    .insert({
      slug: payload.slug,
      title: payload.title,
      name: payload.name,
      batch: payload.batch,
      role: payload.role,
      company: payload.company,
      location: payload.location,
      summary: payload.summary,
      tags: payload.tags,
      quote: payload.quote,
      body: payload.body,
      avatar_color: normaliseNullableString(payload.avatarColor),
      featured: payload.featured ?? false,
      created_by: admin.profile.id,
    })
    .select("*")
    .single();

  const row = (data as StoryRow | null) ?? null;

  if (error || !row) {
    return asJson({ error: error?.message ?? "Gagal menyimpan cerita." }, 500);
  }

  return asJson({
    data: mapStoryRow(row),
    message: "Cerita alumni berhasil disimpan.",
  }, 201);
}

export async function PUT(request: NextRequest) {
  if (!isSupabaseConfigured()) {
    return asJson({ error: "Supabase belum dikonfigurasi." }, 503);
  }

  let payload;
  try {
    const body = await request.json();
    payload = storyUpdateSchema.parse(body);
  } catch (error: unknown) {
    const message = formatValidationError(error) ?? "Payload tidak valid.";
    return asJson({ error: message }, 422);
  }

  try {
    await requireAdmin(request);
  } catch (error: unknown) {
    if (error instanceof AdminAuthError) {
      return asJson({ error: error.message }, error.status);
    }
    return asJson({ error: "Autentikasi admin gagal." }, 401);
  }

  const supabase = getSupabaseServiceRoleClient();
  const { data, error } = await supabase
    .from("stories")
    .update({
      slug: payload.slug,
      title: payload.title,
      name: payload.name,
      batch: payload.batch,
      role: payload.role,
      company: payload.company,
      location: payload.location,
      summary: payload.summary,
      tags: payload.tags,
      quote: payload.quote,
      body: payload.body,
      avatar_color: normaliseNullableString(payload.avatarColor),
      featured: payload.featured ?? false,
    })
    .eq("id", payload.id)
    .select("*")
    .single();

  if (error) {
    const status = error.code === "PGRST116" ? 404 : 500;
    const message = status === 404 ? "Cerita tidak ditemukan." : error.message;
    return asJson({ error: message }, status);
  }

  const row = (data as StoryRow | null) ?? null;

  if (!row) {
    return asJson({ error: "Cerita tidak ditemukan." }, 404);
  }

  return asJson({
    data: mapStoryRow(row),
    message: "Cerita alumni berhasil diperbarui.",
  });
}

export async function DELETE(request: NextRequest) {
  if (!isSupabaseConfigured()) {
    return asJson({ error: "Supabase belum dikonfigurasi." }, 503);
  }

  let payload;
  try {
    const id = request.nextUrl.searchParams.get("id");
    payload = deleteSchema.parse(id ? { id } : await request.json());
  } catch (error: unknown) {
    const message = formatValidationError(error) ?? "ID tidak valid.";
    return asJson({ error: message }, 422);
  }

  try {
    await requireAdmin(request);
  } catch (error: unknown) {
    if (error instanceof AdminAuthError) {
      return asJson({ error: error.message }, error.status);
    }
    return asJson({ error: "Autentikasi admin gagal." }, 401);
  }

  const supabase = getSupabaseServiceRoleClient();
  const { error } = await supabase
    .from("stories")
    .delete()
    .eq("id", payload.id);

  if (error) {
    const status = error.code === "PGRST116" ? 404 : 500;
    const message = status === 404 ? "Cerita tidak ditemukan." : error.message;
    return asJson({ error: message }, status);
  }

  return asJson({ message: "Cerita alumni berhasil dihapus." });
}
