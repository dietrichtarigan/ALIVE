import { Buffer } from "node:buffer";
import { randomUUID } from "node:crypto";

import { getSupabaseServiceRoleClient } from "@/lib/supabase/server-client";

const JOB_POSTER_BUCKET = process.env.NEXT_PUBLIC_SUPABASE_JOB_POSTER_BUCKET ?? "job-posters";

const fallbackMime = "image/jpeg";

function extractExtension(filename?: string | null) {
  if (!filename) {
    return null;
  }
  const parts = filename.split(".");
  if (parts.length < 2) {
    return null;
  }
  const extension = parts.pop();
  return extension ? extension.toLowerCase() : null;
}

function resolveExtension(file: File) {
  const extensionFromName = extractExtension(file.name);
  if (extensionFromName) {
    return extensionFromName;
  }

  if (file.type.includes("png")) {
    return "png";
  }
  if (file.type.includes("webp")) {
    return "webp";
  }
  if (file.type.includes("gif")) {
    return "gif";
  }
  if (file.type.includes("svg")) {
    return "svg";
  }

  return "jpg";
}

function resolveContentType(file: File) {
  if (file.type && file.type.trim().length > 0) {
    return file.type;
  }

  const extension = resolveExtension(file);
  switch (extension) {
    case "png":
      return "image/png";
    case "webp":
      return "image/webp";
    case "gif":
      return "image/gif";
    case "svg":
      return "image/svg+xml";
    default:
      return fallbackMime;
  }
}

function buildPosterPath(file: File) {
  const extension = resolveExtension(file);
  const filename = `${Date.now()}-${randomUUID()}.${extension}`;
  return `posters/${filename}`;
}

export async function uploadJobPoster(file: File) {
  const supabase = getSupabaseServiceRoleClient();
  const path = buildPosterPath(file);
  const buffer = Buffer.from(await file.arrayBuffer());
  const { error } = await supabase.storage.from(JOB_POSTER_BUCKET).upload(path, buffer, {
    cacheControl: "3600",
    upsert: false,
    contentType: resolveContentType(file),
  });

  if (error) {
    throw new Error(`Gagal mengunggah poster: ${error.message}`);
  }

  const { data } = supabase.storage.from(JOB_POSTER_BUCKET).getPublicUrl(path);

  if (!data || !data.publicUrl) {
    throw new Error("Gagal mendapatkan URL publik poster.");
  }

  return {
    path,
    publicUrl: data.publicUrl,
  };
}

export async function deleteJobPoster(path: string | null | undefined) {
  if (!path) {
    return;
  }

  const supabase = getSupabaseServiceRoleClient();
  const { error } = await supabase.storage.from(JOB_POSTER_BUCKET).remove([path]);

  if (error) {
    console.error(`[deleteJobPoster] Tidak dapat menghapus poster lama (${path}):`, error);
  }
}

export { JOB_POSTER_BUCKET };
