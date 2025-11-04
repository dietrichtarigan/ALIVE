"use client";

import { Image as ImageIcon, UploadCloud } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { backendClient } from "@/lib/backend";
import type { JobCategory } from "@/lib/domain/jobs";
import { cn } from "@/lib/utils";

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
  posterUrl?: string | null;
  posterPath?: string | null;
  removePoster?: boolean;
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
  posterUrl: null,
  posterPath: null,
  removePoster: false,
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

function formatFileSize(bytes: number) {
  if (!Number.isFinite(bytes) || bytes <= 0) {
    return "";
  }

  if (bytes < 1024) {
    return `${bytes} B`;
  }

  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }

  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function JobForm({ variant = "public", onSuccess, initialValues, authToken }: JobFormProps) {
  const [formState, setFormState] = useState<JobFormPayload>({
    ...defaultState,
    ...initialValues,
    requirements: initialValues?.requirements ?? defaultState.requirements,
    tags: initialValues?.tags ?? defaultState.tags,
    highlight: initialValues?.highlight ?? defaultState.highlight,
    posterUrl: initialValues?.posterUrl ?? defaultState.posterUrl,
    posterPath: initialValues?.posterPath ?? defaultState.posterPath,
    removePoster: false,
  });
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [message, setMessage] = useState<string>("");
  const [posterFile, setPosterFile] = useState<File | null>(null);
  const [posterPreview, setPosterPreview] = useState<string | null>(formState.posterUrl ?? null);
  const [posterRemovalRequested, setPosterRemovalRequested] = useState<boolean>(false);
  const [isPosterDragging, setIsPosterDragging] = useState<boolean>(false);
  const posterInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!posterFile) {
      setPosterPreview(formState.posterUrl ?? null);
      return;
    }

    const objectUrl = URL.createObjectURL(posterFile);
    setPosterPreview(objectUrl);

    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [posterFile, formState.posterUrl]);

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

  function clearPosterInput() {
    if (posterInputRef.current) {
      posterInputRef.current.value = "";
    }
  }

  function openPosterDialog() {
    posterInputRef.current?.click();
  }

  function applyPosterFile(file: File) {
    setPosterFile(file);
    setPosterRemovalRequested(false);
    setFormState((prev) => ({
      ...prev,
      removePoster: false,
    }));
  }

  function handlePosterKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openPosterDialog();
    }
  }

  function handlePosterDragOver(event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setIsPosterDragging(true);
  }

  function handlePosterDragLeave(event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setIsPosterDragging(false);
  }

  function handlePosterDrop(event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setIsPosterDragging(false);
    const file = event.dataTransfer.files?.[0] ?? null;
    if (!file) {
      return;
    }

    applyPosterFile(file);
    clearPosterInput();
  }

  function handlePosterChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] ?? null;
    if (!file) {
      return;
    }

    applyPosterFile(file);
    clearPosterInput();
  }

  function handlePosterRemove() {
    if (posterFile) {
      setPosterFile(null);
      setPosterRemovalRequested(false);
      setPosterPreview(formState.posterUrl ?? null);
      clearPosterInput();
      setFormState((prev) => ({
        ...prev,
        removePoster: false,
      }));
      return;
    }

    setPosterFile(null);
    setPosterRemovalRequested(true);
    setPosterPreview(null);
    clearPosterInput();
    setFormState((prev) => ({
      ...prev,
      posterUrl: null,
      posterPath: null,
      removePoster: true,
    }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setStatus("submitting");
    setMessage("");

    const payload: JobFormPayload = {
      ...formState,
      requirements: formState.requirements,
      tags: formState.tags,
      removePoster: posterRemovalRequested,
    };

    const requestBody = new FormData();
    requestBody.append("payload", JSON.stringify(payload));

    if (posterFile) {
      requestBody.append("poster", posterFile);
    }

    try {
      if (backendClient.isConfigured()) {
        const action = formState.id ? backendClient.jobs.update : backendClient.jobs.create;
        const { status, data } = await action(requestBody, authToken);

        if (status >= 400) {
          throw new Error(resolveMessage(data, "Gagal mengirim data ke backend INFOPROF."));
        }

        setStatus("success");
        setMessage(resolveMessage(data, "Info berhasil dikirim ke pipeline INFOPROF."));

        if (!formState.id) {
          setFormState(defaultState);
          setPosterFile(null);
          setPosterRemovalRequested(false);
          setPosterPreview(null);
          clearPosterInput();
        }

        onSuccess?.(payload, data);
        return;
      }

      const response = await fetch("/api/infoprof", {
        method: formState.id ? "PUT" : "POST",
        body: requestBody,
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
        setPosterFile(null);
        setPosterRemovalRequested(false);
        setPosterPreview(null);
        clearPosterInput();
      }

      onSuccess?.(payload, data);
    } catch (error) {
      setStatus("error");
      setMessage((error as Error).message || "Terjadi kesalahan saat mengirim data.");
    }
  }

  const hasExistingPoster = Boolean(formState.posterUrl);
  const posterFileSize = posterFile ? formatFileSize(posterFile.size) : "";
  const existingPosterName = formState.posterPath?.split("/").pop();
  const posterStatusText = posterRemovalRequested
    ? "Poster akan dihapus saat Anda menyimpan perubahan."
    : posterFile
      ? `${posterFile.name}${posterFileSize ? ` • ${posterFileSize}` : ""}`
      : hasExistingPoster
        ? existingPosterName
          ? `Poster aktif: ${existingPosterName}`
          : "Poster aktif akan tetap tampil sampai diganti."
        : "Unggah poster agar peluang terlihat lebih menarik.";
  const posterSecondaryNote = posterRemovalRequested
    ? null
    : posterFile && hasExistingPoster
      ? "Poster baru akan menggantikan file sebelumnya."
      : posterFile && !hasExistingPoster
        ? "Poster akan tampil setelah penyimpanan berhasil."
        : hasExistingPoster
          ? "Biarkan kosong bila Anda ingin mempertahankan poster yang sama."
          : "Format didukung: JPG, PNG, WEBP, GIF (maksimal 5 MB).";
  const dropZoneClasses = cn(
    "flex cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-border/60 bg-muted/10 p-6 text-center transition hover:border-primary/60 hover:bg-primary/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40",
    isPosterDragging && "border-primary/60 bg-primary/10",
  );
  const posterMetaClass = cn(
    "text-xs",
    posterRemovalRequested ? "font-medium text-amber-600" : "text-muted-foreground",
  );
  const showPosterPreview = Boolean(posterPreview);
  const showRemovePosterButton = Boolean(posterFile || hasExistingPoster);
  const submitLabel = status === "submitting" ? "Mengirim..." : formState.id ? "Simpan Perubahan" : "Kirim Info";
  const isSubmitting = status === "submitting";

  return (
    <form onSubmit={handleSubmit} className="space-y-8" id="kirim-info">
      <div className="space-y-1">
        <h3 className="text-xl font-semibold text-foreground">Kirim Info Karier Baru</h3>
        <p className="text-sm text-muted-foreground">{helperDescription}</p>
      </div>
      <Section
        title="Informasi Utama"
        description="Lengkapi detail inti agar peluang mudah dipahami oleh mahasiswa."
      >
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Judul" required>
            <input
              className="w-full rounded-xl border border-border/60 bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40"
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
              className="w-full rounded-xl border border-border/60 bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40"
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
              className="w-full rounded-xl border border-border/60 bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40"
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
              className="w-full rounded-xl border border-border/60 bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40"
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
              className="w-full rounded-xl border border-border/60 bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40"
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
              className="w-full rounded-xl border border-border/60 bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40"
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
              className="w-full rounded-xl border border-border/60 bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40"
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
              className="w-full rounded-xl border border-border/60 bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40"
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
              className="w-full rounded-xl border border-border/60 bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40"
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
      </Section>
      <Section
        title="Deskripsi & Persyaratan"
        description="Bagikan cerita lengkap mengenai peran dan kriteria kandidat."
      >
        <div className="space-y-5">
          <Field label="Deskripsi" required>
            <textarea
              className="min-h-40 w-full rounded-xl border border-border/60 bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40"
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
              className="min-h-40 w-full rounded-xl border border-border/60 bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40"
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
        </div>
      </Section>
      <Section
        title="Poster Lowongan"
        description="Poster membantu peluang Anda tampil lebih menonjol di papan INFOPROF."
      >
        <input ref={posterInputRef} type="file" accept="image/*" onChange={handlePosterChange} className="hidden" />
        <div
          className={dropZoneClasses}
          role="button"
          tabIndex={0}
          onClick={openPosterDialog}
          onKeyDown={handlePosterKeyDown}
          onDragOver={handlePosterDragOver}
          onDragLeave={handlePosterDragLeave}
          onDrop={handlePosterDrop}
          aria-label="Unggah poster lowongan"
        >
          <UploadCloud className="h-7 w-7 text-primary" aria-hidden />
          <div className="space-y-1">
            <p className="text-sm font-semibold text-foreground">Klik untuk pilih file atau seret poster ke sini</p>
            <p className={posterMetaClass}>{posterStatusText}</p>
          </div>
        </div>
        {posterSecondaryNote ? <p className="text-xs text-muted-foreground">{posterSecondaryNote}</p> : null}
        {showPosterPreview ? (
          <div className="overflow-hidden rounded-2xl border border-border/40 bg-background/80">
            {/* eslint-disable-next-line @next/next/no-img-element -- Poster preview uses dynamic storage/file source */}
            <img
              src={posterPreview ?? ""}
              alt="Preview poster lowongan"
              className="h-auto w-full max-h-80 object-cover"
            />
          </div>
        ) : (
          <div className="flex items-center gap-3 rounded-2xl border border-dashed border-border/40 bg-muted/20 p-4 text-xs text-muted-foreground">
            <ImageIcon className="h-5 w-5" aria-hidden />
            <span>Poster akan muncul di kartu detail peluang setelah disimpan.</span>
          </div>
        )}
        <div className="flex flex-wrap gap-3">
          <Button type="button" variant="outline" size="sm" onClick={openPosterDialog}>
            Pilih Poster
          </Button>
          {showRemovePosterButton ? (
            <Button type="button" variant="ghost" size="sm" onClick={handlePosterRemove}>
              {posterFile ? "Batalkan Poster Baru" : "Hapus Poster"}
            </Button>
          ) : null}
        </div>
      </Section>
      <div className="space-y-3 rounded-3xl border border-border/40 bg-background/80 p-6 shadow-sm">
        <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto">
          {submitLabel}
        </Button>
        {message ? (
          <p
            className={cn(
              "text-sm",
              status === "error"
                ? "text-destructive"
                : status === "success"
                  ? "text-primary"
                  : "text-muted-foreground",
            )}
          >
            {message}
          </p>
        ) : null}
        {!backendClient.isConfigured() ? (
          <p className="text-xs text-muted-foreground">
            Set variabel Supabase (<code>SUPABASE_URL</code>, <code>SUPABASE_SERVICE_ROLE_KEY</code>, dan <code>SUPABASE_ANON_KEY</code>) agar data langsung tersimpan.
          </p>
        ) : null}
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
    <label className="flex flex-col gap-1.5 text-sm text-foreground">
      <span className="text-sm font-semibold leading-snug text-foreground">
        {label}
        {required ? " *" : ""}
      </span>
      {children}
      {helper ? <span className="text-xs text-muted-foreground">{helper}</span> : null}
    </label>
  );
}

interface SectionProps {
  title: string;
  description?: string;
  children: React.ReactNode;
}

function Section({ title, description, children }: SectionProps) {
  return (
    <section className="space-y-5 rounded-3xl border border-border/40 bg-background/80 p-6 shadow-sm">
      <div className="space-y-1">
        <h4 className="text-base font-semibold text-foreground">{title}</h4>
        {description ? <p className="text-sm text-muted-foreground">{description}</p> : null}
      </div>
      {children}
    </section>
  );
}

export type { JobFormPayload };
