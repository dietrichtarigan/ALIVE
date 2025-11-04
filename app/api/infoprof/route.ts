import { NextRequest, NextResponse } from "next/server";
import type { ZodIssue } from "zod";
import { z } from "zod";

import { jobPostings } from "@/data/jobs";
import { AdminAuthError, requireAdmin } from "@/lib/supabase/auth";
import { mapJobRow } from "@/lib/supabase/mappers";
import { jobCreateSchema, jobUpdateSchema } from "@/lib/supabase/schemas";
import { getSupabaseServiceRoleClient, isSupabaseConfigured } from "@/lib/supabase/server-client";
import { deleteJobPoster, uploadJobPoster } from "@/lib/supabase/storage";
import { JobRow } from "@/lib/supabase/types";

const deleteSchema = z.object({
  id: z.string().uuid("ID lowongan tidak valid."),
});

function asJson(response: unknown, status = 200) {
  return NextResponse.json(response, { status });
}

function normaliseHighlight(value?: string) {
  if (typeof value !== "string") {
    return null;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function normalisePosterValue(value?: string | null) {
  if (typeof value !== "string") {
    return null;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function isPosterFile(value: unknown): value is File {
  return typeof File !== "undefined" && value instanceof File && value.size > 0;
}

interface ParsedJobRequest {
  body: unknown;
  posterFile: File | null;
}

async function parseJobRequest(request: NextRequest): Promise<ParsedJobRequest> {
  const contentType = request.headers.get("content-type") ?? "";

  if (contentType.includes("multipart/form-data")) {
    const formData = await request.formData();
    const raw = formData.get("payload") ?? formData.get("data");

    if (typeof raw !== "string") {
      throw new Error("Payload tidak valid.");
    }

    let parsed: unknown;
    try {
      parsed = JSON.parse(raw);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      throw new Error(`Payload tidak valid: ${message}`);
    }

    const posterCandidate = formData.get("poster");
    const posterFile = isPosterFile(posterCandidate) ? posterCandidate : null;

    return { body: parsed, posterFile };
  }

  const body = await request.json();
  return { body, posterFile: null };
}

function formatValidationError(error: unknown) {
  if (error instanceof z.ZodError) {
    return error.issues.map((issue: ZodIssue) => issue.message).join("; ");
  }

  return null;
}

export async function GET() {
  if (!isSupabaseConfigured()) {
    return asJson(
      {
        data: jobPostings,
        fallback: true,
        message: "Supabase belum dikonfigurasi. Menampilkan data contoh INFOPROF.",
      },
    );
  }

  const supabase = getSupabaseServiceRoleClient();
  const { data, error } = await supabase
    .from("jobs")
    .select("*")
    .order("deadline", { ascending: true });

  if (error) {
    return asJson({ error: error.message }, 500);
  }

  const rows = (data as JobRow[] | null) ?? [];
  const records = rows.map(mapJobRow);
  return asJson({ data: records });
}

export async function POST(request: NextRequest) {
  if (!isSupabaseConfigured()) {
    return asJson({
      error: "Supabase belum dikonfigurasi. Set SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, dan SUPABASE_ANON_KEY.",
    }, 503);
  }

  let payload;
  let posterFile: File | null = null;
  try {
    const parsedRequest = await parseJobRequest(request);
    posterFile = parsedRequest.posterFile;
    payload = jobCreateSchema.parse(parsedRequest.body);
  } catch (error: unknown) {
    const message = formatValidationError(error) ?? (error instanceof Error ? error.message : "Payload tidak valid.");
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

  let posterUrl = normalisePosterValue(payload.posterUrl);
  let posterPath = normalisePosterValue(payload.posterPath);

  if (payload.removePoster) {
    posterUrl = null;
    posterPath = null;
  }

  if (posterFile) {
    try {
      const uploadResult = await uploadJobPoster(posterFile);
      posterUrl = uploadResult.publicUrl;
      posterPath = uploadResult.path;
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Gagal mengunggah poster.";
      return asJson({ error: message }, 500);
    }
  }

  const supabase = getSupabaseServiceRoleClient();
  const { data, error } = await supabase
    .from("jobs")
    .insert({
      title: payload.title,
      organization: payload.organization,
      location: payload.location,
      category: payload.category,
      description: payload.description,
      requirements: payload.requirements,
      deadline: payload.deadline,
      contact: payload.contact,
      link: payload.link,
      tags: payload.tags,
      highlight: normaliseHighlight(payload.highlight),
      poster_url: posterUrl,
      poster_path: posterPath,
      created_by: admin.profile.id,
    })
    .select("*")
    .single();

  const row = (data as JobRow | null) ?? null;

  if (error || !row) {
    return asJson({ error: error?.message ?? "Gagal menyimpan data karier." }, 500);
  }

  return asJson({
    data: mapJobRow(row),
    message: "Info karier berhasil disimpan.",
  }, 201);
}

export async function PUT(request: NextRequest) {
  if (!isSupabaseConfigured()) {
    return asJson({
      error: "Supabase belum dikonfigurasi.",
    }, 503);
  }

  let payload;
  let posterFile: File | null = null;
  try {
    const parsedRequest = await parseJobRequest(request);
    posterFile = parsedRequest.posterFile;
    payload = jobUpdateSchema.parse(parsedRequest.body);
  } catch (error: unknown) {
    const message = formatValidationError(error) ?? (error instanceof Error ? error.message : "Payload tidak valid.");
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

  let posterUrl = normalisePosterValue(payload.posterUrl);
  let posterPath = normalisePosterValue(payload.posterPath);

  if (payload.removePoster) {
    if (posterPath) {
      await deleteJobPoster(posterPath);
    }
    posterUrl = null;
    posterPath = null;
  }

  if (posterFile) {
    if (posterPath) {
      await deleteJobPoster(posterPath);
    }

    try {
      const uploadResult = await uploadJobPoster(posterFile);
      posterUrl = uploadResult.publicUrl;
      posterPath = uploadResult.path;
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Gagal mengunggah poster.";
      return asJson({ error: message }, 500);
    }
  }

  const supabase = getSupabaseServiceRoleClient();
  const { data, error } = await supabase
    .from("jobs")
    .update({
      title: payload.title,
      organization: payload.organization,
      location: payload.location,
      category: payload.category,
      description: payload.description,
      requirements: payload.requirements,
      deadline: payload.deadline,
      contact: payload.contact,
      link: payload.link,
      tags: payload.tags,
      highlight: normaliseHighlight(payload.highlight),
      poster_url: posterUrl,
      poster_path: posterPath,
    })
    .eq("id", payload.id)
    .select("*")
    .single();

  if (error) {
    const status = error.code === "PGRST116" ? 404 : 500;
    const message = status === 404 ? "Data karier tidak ditemukan." : error.message;
    return asJson({ error: message }, status);
  }

  const row = (data as JobRow | null) ?? null;

  if (!row) {
    return asJson({ error: "Data karier tidak ditemukan." }, 404);
  }

  return asJson({
    data: mapJobRow(row),
    message: "Info karier berhasil diperbarui.",
  });
}

export async function DELETE(request: NextRequest) {
  if (!isSupabaseConfigured()) {
    return asJson({
      error: "Supabase belum dikonfigurasi.",
    }, 503);
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
  const { data, error } = await supabase
    .from("jobs")
    .delete()
    .eq("id", payload.id)
    .select("poster_path")
    .single();

  if (error) {
    const status = error.code === "PGRST116" ? 404 : 500;
    const message = status === 404 ? "Data karier tidak ditemukan." : error.message;
    return asJson({ error: message }, status);
  }

  const row = (data as { poster_path: string | null } | null) ?? null;
  if (row?.poster_path) {
    await deleteJobPoster(row.poster_path);
  }

  return asJson({ message: "Info karier berhasil dihapus." });
}
