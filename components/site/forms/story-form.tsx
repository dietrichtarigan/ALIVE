"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { StoryTag } from "@/data/stories";
import { backendClient } from "@/lib/backend";

interface StoryFormProps {
  variant?: "public" | "admin";
  onSuccess?: (payload: StoryFormPayload, response: unknown) => void;
  initialValues?: Partial<StoryFormPayload>;
  authToken?: string;
}

interface StoryFormPayload {
  id?: string;
  slug: string;
  title: string;
  name: string;
  batch: string;
  role: string;
  company: string;
  location: string;
  summary: string;
  tags: StoryTag[];
  quote: string;
  body: string[];
  avatarColor?: string;
  featured?: boolean;
}

const storyTags: StoryTag[] = ["Riset", "Industri", "Akademik", "Teknologi", "Kewirausahaan", "Energi"];

const defaultState: StoryFormPayload = {
  slug: "",
  title: "",
  name: "",
  batch: "",
  role: "",
  company: "",
  location: "",
  summary: "",
  tags: [],
  quote: "",
  body: [],
  avatarColor: "",
  featured: false,
};

function normaliseSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-");
}

function fromTextarea(value: string) {
  return value
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);
}

function toTextarea(value: string[]) {
  return value.join("\n\n");
}

function fromTagInput(value: string) {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter((item): item is StoryTag => storyTags.includes(item as StoryTag));
}

function toTagInput(tags: StoryTag[]) {
  return tags.join(", ");
}

export function StoryForm({ variant = "public", onSuccess, initialValues, authToken }: StoryFormProps) {
  const [formState, setFormState] = useState<StoryFormPayload>({
    ...defaultState,
    ...initialValues,
    tags: initialValues?.tags ?? defaultState.tags,
    body: initialValues?.body ?? defaultState.body,
  });
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [message, setMessage] = useState<string>("");

  const helperText =
    variant === "public"
      ? "Bagikan kisah perjalanan kariermu. Tim CeritaKita akan melakukan kurasi editorial sebelum tayang."
      : "Tambahkan atau perbarui cerita alumni langsung ke Supabase CeritaKita.";

  function resolveMessage(data: unknown, fallback: string) {
    if (data && typeof data === "object") {
      const record = data as Record<string, unknown>;
      const message = record.message ?? record.status ?? record.detail ?? record.error;
      if (typeof message === "string" && message.trim().length > 0) {
        return message;
      }
    }
    return fallback;
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setStatus("submitting");
    setMessage("");

    const payload: StoryFormPayload = {
      ...formState,
      body: formState.body,
      tags: formState.tags,
      slug: formState.slug || normaliseSlug(formState.title),
    };

    try {
      if (backendClient.isConfigured()) {
        const action = formState.id ? backendClient.stories.update : backendClient.stories.create;
        const { status, data } = await action(payload, authToken);

        if (status >= 400) {
          throw new Error(resolveMessage(data, "Gagal mengirim cerita ke backend CeritaKita."));
        }

  setStatus("success");
  setMessage(resolveMessage(data, "Cerita berhasil dikirim ke pipeline CeritaKita."));

        if (!formState.id) {
          setFormState(defaultState);
        }

        onSuccess?.(payload, data);
        return;
      }

      const response = await fetch("/api/cerita", {
        method: formState.id ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error((data && (data.message || data.error)) || "Gagal mengirim cerita ke backend CeritaKita.");
      }

      setStatus("success");
      setMessage(
        data?.message ||
          (data?.fallback
            ? "Supabase cerita belum aktif. Data tersimpan lokal untuk pengecekan."
            : "Cerita berhasil dikirim ke pipeline CeritaKita."),
      );

      if (!formState.id) {
        setFormState(defaultState);
      }

      onSuccess?.(payload, data);
    } catch (error) {
      setStatus("error");
      setMessage((error as Error).message || "Terjadi kesalahan saat mengirim cerita.");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6" id="kirim-cerita">
      <div className="space-y-2">
        <h3 className="text-xl font-semibold text-foreground">Kirim Cerita Alumni</h3>
        <p className="text-sm text-muted-foreground">{helperText}</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Judul Cerita" required>
          <input
            className="w-full rounded-md border border-border/60 bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40"
            value={formState.title}
            onChange={(event) =>
              setFormState((prev) => ({
                ...prev,
                title: event.target.value,
                slug: normaliseSlug(event.target.value),
              }))
            }
            placeholder="Judul menarik yang mencerminkan isi cerita"
            required
          />
        </Field>
        <Field label="Slug URL" helper="Optional, otomatis digenerate dari judul">
          <input
            className="w-full rounded-md border border-border/60 bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40"
            value={formState.slug}
            onChange={(event) =>
              setFormState((prev) => ({
                ...prev,
                slug: normaliseSlug(event.target.value),
              }))
            }
            placeholder="contoh: menjembatani-dunia-kuantum"
          />
        </Field>
        <Field label="Nama" required>
          <input
            className="w-full rounded-md border border-border/60 bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40"
            value={formState.name}
            onChange={(event) =>
              setFormState((prev) => ({
                ...prev,
                name: event.target.value,
              }))
            }
            required
          />
        </Field>
        <Field label="Angkatan" required>
          <input
            className="w-full rounded-md border border-border/60 bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40"
            value={formState.batch}
            onChange={(event) =>
              setFormState((prev) => ({
                ...prev,
                batch: event.target.value,
              }))
            }
            placeholder="HIMAFI 2016"
            required
          />
        </Field>
        <Field label="Peran" required>
          <input
            className="w-full rounded-md border border-border/60 bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40"
            value={formState.role}
            onChange={(event) =>
              setFormState((prev) => ({
                ...prev,
                role: event.target.value,
              }))
            }
            placeholder="Posisi saat ini"
            required
          />
        </Field>
        <Field label="Perusahaan / Institusi" required>
          <input
            className="w-full rounded-md border border-border/60 bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40"
            value={formState.company}
            onChange={(event) =>
              setFormState((prev) => ({
                ...prev,
                company: event.target.value,
              }))
            }
            required
          />
        </Field>
        <Field label="Lokasi" required>
          <input
            className="w-full rounded-md border border-border/60 bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40"
            value={formState.location}
            onChange={(event) =>
              setFormState((prev) => ({
                ...prev,
                location: event.target.value,
              }))
            }
            placeholder="Kota atau negara"
            required
          />
        </Field>
        <Field label="Tag (pisahkan koma)" helper="Pilih dari daftar: Riset, Industri, Akademik, Teknologi, Kewirausahaan, Energi">
          <input
            className="w-full rounded-md border border-border/60 bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40"
            value={toTagInput(formState.tags)}
            onChange={(event) =>
              setFormState((prev) => ({
                ...prev,
                tags: fromTagInput(event.target.value),
              }))
            }
            placeholder="Riset, Industri"
          />
        </Field>
      </div>
      <Field label="Ringkasan" required>
        <textarea
          className="min-h-32 w-full rounded-md border border-border/60 bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40"
          value={formState.summary}
          onChange={(event) =>
            setFormState((prev) => ({
              ...prev,
              summary: event.target.value,
            }))
          }
          placeholder="Ringkasan 2-3 kalimat tentang inti cerita"
          required
        />
      </Field>
      <Field label="Kutipan" required>
        <textarea
          className="min-h-24 w-full rounded-md border border-border/60 bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40"
          value={formState.quote}
          onChange={(event) =>
            setFormState((prev) => ({
              ...prev,
              quote: event.target.value,
            }))
          }
          placeholder="Kalimat atau pesan utama dari alumni"
          required
        />
      </Field>
      <Field label="Isi Cerita" required helper="Pisahkan paragraf dengan baris kosong">
        <textarea
          className="min-h-48 w-full rounded-md border border-border/60 bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40"
          value={toTextarea(formState.body)}
          onChange={(event) =>
            setFormState((prev) => ({
              ...prev,
              body: fromTextarea(event.target.value),
            }))
          }
          placeholder={"Ceritakan perjalananmu..."}
          required
        />
      </Field>
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Warna Avatar" helper="Opsional, format tailwind gradient / hex">
          <input
            className="w-full rounded-md border border-border/60 bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40"
            value={formState.avatarColor ?? ""}
            onChange={(event) =>
              setFormState((prev) => ({
                ...prev,
                avatarColor: event.target.value,
              }))
            }
            placeholder="bg-gradient-to-br from-[#1b365d] to-[#4b7bec]"
          />
        </Field>
        <Field label="Tandai sebagai cerita unggulan">
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              className="size-4 rounded border border-border/60 text-primary focus:ring-primary/40"
              checked={Boolean(formState.featured)}
              onChange={(event) =>
                setFormState((prev) => ({
                  ...prev,
                  featured: event.target.checked,
                }))
              }
            />
            <span className="text-sm text-muted-foreground">Munculkan pada highlight CeritaKita</span>
          </div>
        </Field>
      </div>
      <div className="flex flex-col gap-2">
        <Button type="submit" disabled={status === "submitting"}>
          {status === "submitting" ? "Mengirim..." : formState.id ? "Simpan Perubahan" : "Kirim Cerita"}
        </Button>
        {message && (
          <p
            className={`text-sm ${status === "error" ? "text-destructive" : status === "success" ? "text-primary" : "text-muted-foreground"}`}
          >
            {message}
          </p>
        )}
        {!backendClient.isConfigured() && (
          <p className="text-xs text-muted-foreground">
            Set variabel Supabase agar data langsung tersimpan di backend CeritaKita.
          </p>
        )}
      </div>
    </form>
  );
}

interface FieldProps {
  label: string;
  helper?: string;
  required?: boolean;
  children: React.ReactNode;
}

function Field({ label, helper, required, children }: FieldProps) {
  return (
    <label className="flex flex-col gap-2 text-sm text-foreground/90">
      <span className="font-semibold">
        {label}
        {required ? " *" : ""}
      </span>
      {children}
      {helper && <span className="text-xs text-muted-foreground">{helper}</span>}
    </label>
  );
}

export type { StoryFormPayload };
