"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { JobCategory } from "@/data/jobs";
import { backendClient } from "@/lib/backend";

interface JobFormProps {
  variant?: "public" | "admin";
  onSuccess?: (payload: JobFormPayload, response: unknown) => void;
  initialValues?: Partial<JobFormPayload>;
  authToken?: string;
}

interface JobFormPayload {
  id?: string;
  title: string;
  organization: string;
  location: string;
  category: JobCategory;
  description: string;
  requirements: string[];
  deadline: string;
  contact: string;
  link: string;
  tags: string[];
  highlight?: string;
}

const categories: JobCategory[] = ["Kerja", "Magang", "Beasiswa"];

const defaultState: JobFormPayload = {
  title: "",
  organization: "",
  location: "",
  category: "Kerja",
  description: "",
  requirements: [],
  deadline: "",
  contact: "",
  link: "",
  tags: [],
  highlight: "",
};

function toTextareaValue(values: string[]) {
  return values.join("\n");
}

function fromTextareaValue(value: string) {
  return value
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);
}

function fromTagsInput(value: string) {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function toTagsInput(values: string[]) {
  return values.join(", ");
}

export function JobForm({ variant = "public", onSuccess, initialValues, authToken }: JobFormProps) {
  const [formState, setFormState] = useState<JobFormPayload>({
    ...defaultState,
    ...initialValues,
    requirements: initialValues?.requirements ?? defaultState.requirements,
    tags: initialValues?.tags ?? defaultState.tags,
    highlight: initialValues?.highlight ?? defaultState.highlight,
  });
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [message, setMessage] = useState<string>("");

  const helperDescription =
    variant === "public"
      ? "Isi form berikut untuk mengajukan info INFOPROF. Tim ARCADE akan memverifikasi sebelum tayang."
      : "Tambahkan data karier baru ke papan INFOPROF dan simpan langsung ke Supabase.";

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

    const payload: JobFormPayload = {
      ...formState,
      requirements: formState.requirements,
      tags: formState.tags,
    };

    try {
      if (backendClient.isConfigured()) {
        const action = formState.id ? backendClient.jobs.update : backendClient.jobs.create;
        const { status, data } = await action(payload, authToken);

        if (status >= 400) {
          throw new Error(resolveMessage(data, "Gagal mengirim data ke backend INFOPROF."));
        }

  setStatus("success");
  setMessage(resolveMessage(data, "Info berhasil dikirim ke pipeline INFOPROF."));

        if (!formState.id) {
          setFormState(defaultState);
        }

        onSuccess?.(payload, data);
        return;
      }

      const response = await fetch("/api/infoprof", {
        method: formState.id ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error((data && (data.message || data.error)) || "Gagal mengirim data ke backend INFOPROF.");
      }

      setStatus("success");
      setMessage(
        data?.message ||
          (data?.fallback
            ? "Supabase belum aktif. Data tersimpan lokal untuk pengecekan sementara."
            : "Info berhasil dikirim ke pipeline INFOPROF."),
      );

      if (!formState.id) {
        setFormState(defaultState);
      }

      onSuccess?.(payload, data);
    } catch (error) {
      setStatus("error");
      setMessage((error as Error).message || "Terjadi kesalahan saat mengirim data.");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6" id="kirim-info">
      <div className="space-y-2">
        <h3 className="text-xl font-semibold text-foreground">Kirim Info Karier Baru</h3>
        <p className="text-sm text-muted-foreground">{helperDescription}</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Judul" required>
          <input
            className="w-full rounded-md border border-border/60 bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40"
            name="title"
            value={formState.title}
            onChange={(event) =>
              setFormState((prev) => ({
                ...prev,
                title: event.target.value,
              }))
            }
            placeholder="Contoh: Graduate Development Program"
            required
          />
        </Field>
        <Field label="Organisasi" required>
          <input
            className="w-full rounded-md border border-border/60 bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40"
            name="organization"
            value={formState.organization}
            onChange={(event) =>
              setFormState((prev) => ({
                ...prev,
                organization: event.target.value,
              }))
            }
            placeholder="Nama perusahaan atau lembaga"
            required
          />
        </Field>
        <Field label="Lokasi" required>
          <input
            className="w-full rounded-md border border-border/60 bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40"
            name="location"
            value={formState.location}
            onChange={(event) =>
              setFormState((prev) => ({
                ...prev,
                location: event.target.value,
              }))
            }
            placeholder="Lokasi / Remote"
            required
          />
        </Field>
        <Field label="Kategori" required>
          <select
            className="w-full rounded-md border border-border/60 bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40"
            name="category"
            value={formState.category}
            onChange={(event) =>
              setFormState((prev) => ({
                ...prev,
                category: event.target.value as JobCategory,
              }))
            }
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Deadline" required>
          <input
            type="date"
            className="w-full rounded-md border border-border/60 bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40"
            name="deadline"
            value={formState.deadline}
            onChange={(event) =>
              setFormState((prev) => ({
                ...prev,
                deadline: event.target.value,
              }))
            }
            required
          />
        </Field>
        <Field label="Kontak" required helper="Email atau nomor yang bisa dihubungi administrator">
          <input
            className="w-full rounded-md border border-border/60 bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40"
            name="contact"
            value={formState.contact}
            onChange={(event) =>
              setFormState((prev) => ({
                ...prev,
                contact: event.target.value,
              }))
            }
            placeholder="contoh: talent.acquisition@company.com"
            required
          />
        </Field>
        <Field label="Tautan Pendaftaran" required>
          <input
            type="url"
            className="w-full rounded-md border border-border/60 bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40"
            name="link"
            value={formState.link}
            onChange={(event) =>
              setFormState((prev) => ({
                ...prev,
                link: event.target.value,
              }))
            }
            placeholder="https://..."
            required
          />
        </Field>
        <Field label="Highlight Singkat">
          <input
            className="w-full rounded-md border border-border/60 bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40"
            name="highlight"
            value={formState.highlight ?? ""}
            onChange={(event) =>
              setFormState((prev) => ({
                ...prev,
                highlight: event.target.value,
              }))
            }
            placeholder="Opsional: sorotan utama peluang"
          />
        </Field>
        <Field label="Tag (pisahkan dengan koma)">
          <input
            className="w-full rounded-md border border-border/60 bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40"
            name="tags"
            value={toTagsInput(formState.tags)}
            onChange={(event) =>
              setFormState((prev) => ({
                ...prev,
                tags: fromTagsInput(event.target.value),
              }))
            }
            placeholder="Energi, Internship, Remote"
          />
        </Field>
      </div>
      <Field label="Deskripsi" required>
        <textarea
          className="min-h-32 w-full rounded-md border border-border/60 bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40"
          name="description"
          value={formState.description}
          onChange={(event) =>
            setFormState((prev) => ({
              ...prev,
              description: event.target.value,
            }))
          }
          placeholder="Jelaskan peran, budaya tim, atau manfaat utama."
          required
        />
      </Field>
      <Field label="Persyaratan (pisahkan baris)" required>
        <textarea
          className="min-h-32 w-full rounded-md border border-border/60 bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40"
          name="requirements"
          value={toTextareaValue(formState.requirements)}
          onChange={(event) =>
            setFormState((prev) => ({
              ...prev,
              requirements: fromTextareaValue(event.target.value),
            }))
          }
          placeholder={"Contoh:\n• Mahasiswa tingkat akhir\n• Sertakan portofolio projek"}
          required
        />
      </Field>
      <div className="flex flex-col gap-2">
        <Button type="submit" disabled={status === "submitting"}>
          {status === "submitting" ? "Mengirim..." : formState.id ? "Simpan Perubahan" : "Kirim Info"}
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
            Set variabel Supabase (<code>SUPABASE_URL</code>, <code>SUPABASE_SERVICE_ROLE_KEY</code>, dan <code>SUPABASE_ANON_KEY</code>) agar data langsung tersimpan.
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

export type { JobFormPayload };
