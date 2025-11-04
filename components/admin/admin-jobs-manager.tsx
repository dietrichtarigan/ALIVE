"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import { useAdminSession } from "@/components/admin/admin-session-provider";
import { JobForm, JobFormPayload } from "@/components/site/forms/job-form";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { jobPostings } from "@/data/jobs";
import { backendClient } from "@/lib/backend";
import type { JobPosting } from "@/lib/domain/jobs";

interface StatusMessage {
  type: "success" | "error" | "info";
  message: string;
}

function extractArray<T>(data: unknown): T[] {
  if (Array.isArray(data)) {
    return data as T[];
  }

  if (data && typeof data === "object") {
    const record = data as Record<string, unknown>;
    if (Array.isArray(record.data)) {
      return record.data as T[];
    }
  }

  return [];
}

function resolveMessage(data: unknown, fallback: string) {
  if (data && typeof data === "object") {
    const record = data as Record<string, unknown>;
    const message = record.message ?? record.status ?? record.error;
    if (typeof message === "string" && message.trim().length > 0) {
      return message;
    }
  }
  return fallback;
}

export function AdminJobsManager() {
  const [jobs, setJobs] = useState<JobPosting[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [status, setStatus] = useState<StatusMessage | null>(null);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [selectedJob, setSelectedJob] = useState<JobPosting | null>(null);
  const { token } = useAdminSession();

  const formKey = useMemo(() => `${formMode}-${selectedJob?.id ?? "new"}`, [formMode, selectedJob?.id]);

  const loadJobs = useCallback(async () => {
    setLoading(true);

    try {
      const { status: httpStatus, data } = await backendClient.jobs.list(token);

      if (httpStatus >= 400) {
        throw new Error(resolveMessage(data, "Gagal memuat data karier dari backend."));
      }

  const records = extractArray<JobPosting>(data);
  const fallback = Boolean(data && typeof data === "object" && (data as Record<string, unknown>).fallback);
      const message = resolveMessage(data, "");

  setJobs(fallback ? jobPostings : records);
      setStatus(
        fallback
          ? {
              type: "info",
              message: message || "Supabase belum dikonfigurasi. Menampilkan data contoh.",
            }
          : null,
      );
    } catch (error) {
      setStatus({
        type: "error",
        message: (error as Error).message || "Gagal memuat data karier.",
      });
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    void loadJobs();
  }, [loadJobs]);

  async function handleDelete(job: JobPosting) {
    const confirmation = window.confirm(`Hapus info "${job.title}" dari INFOPROF?`);
    if (!confirmation) {
      return;
    }

    try {
      const { status: httpStatus, data } = await backendClient.jobs.remove({ id: job.id }, token);
      if (httpStatus >= 400) {
        throw new Error(resolveMessage(data, "Gagal menghapus info karier."));
      }

      await loadJobs();
      setStatus({
        type: "success",
        message: resolveMessage(data, "Info karier berhasil dihapus."),
      });
    } catch (error) {
      setStatus({
        type: "error",
        message: (error as Error).message || "Terjadi kesalahan saat menghapus info.",
      });
    }
  }

  function handleEdit(job: JobPosting) {
    setFormMode("edit");
    setSelectedJob(job);
  }

  function handleCreate() {
    setFormMode("create");
    setSelectedJob(null);
  }

  async function handleSuccess(payload: JobFormPayload, response: unknown) {
    if (formMode === "edit") {
      setSelectedJob(null);
      setFormMode("create");
    }

    await loadJobs();
    setStatus({
      type: "success",
      message: resolveMessage(response, `Info ${payload.title} berhasil disimpan.`),
    });
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1.75fr_1.25fr]">
      <Card className="border-border/40">
        <CardHeader>
          <CardTitle className="text-lg">Daftar Info Karier</CardTitle>
          <CardDescription>Kelola lowongan, magang, dan peluang beasiswa untuk massa HIMAFI.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {status && (
            <div
              className={`rounded-md border px-3 py-2 text-sm ${
                status.type === "success"
                  ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                  : status.type === "error"
                    ? "border-destructive/30 bg-destructive/10 text-destructive"
                    : "border-primary/30 bg-primary/10 text-primary"
              }`}
            >
              {status.message}
            </div>
          )}
          <div className="overflow-x-auto rounded-lg border border-border/40">
            <table className="min-w-full divide-y divide-border/40 text-sm">
              <thead className="bg-muted/40 text-xs uppercase tracking-wide text-muted-foreground">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold">Judul</th>
                  <th className="px-4 py-3 text-left font-semibold">Organisasi</th>
                  <th className="px-4 py-3 text-left font-semibold">Kategori</th>
                  <th className="px-4 py-3 text-left font-semibold">Deadline</th>
                  <th className="px-4 py-3 text-right font-semibold">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40 bg-background/60">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-6 text-center text-muted-foreground">
                      Memuat data karier...
                    </td>
                  </tr>
                ) : jobs.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-6 text-center text-muted-foreground">
                      Belum ada data karier. Tambahkan info baru menggunakan form di samping.
                    </td>
                  </tr>
                ) : (
                  jobs.map((job) => (
                    <tr key={job.id} className="transition-colors hover:bg-muted/30">
                      <td className="px-4 py-3 font-medium text-foreground">
                        <div>
                          <p>{job.title}</p>
                          <p className="text-xs text-muted-foreground">{job.link}</p>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">{job.organization}</td>
                      <td className="px-4 py-3">
                        <Badge variant="outline">{job.category}</Badge>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">{job.deadline}</td>
                      <td className="flex items-center justify-end gap-2 px-4 py-3">
                        <Button size="sm" variant="outline" onClick={() => handleEdit(job)}>
                          Edit
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => handleDelete(job)}>
                          Hapus
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
      <Card className="border-primary/30 bg-gradient-to-br from-primary/10 via-background to-background">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg">
                {formMode === "edit" ? "Perbarui Info" : "Tambah Info Karier"}
              </CardTitle>
              <CardDescription>
                {formMode === "edit"
                  ? "Perbarui detail peluang sebelum dipublikasikan."
                  : "Masukkan info baru yang akan diverifikasi oleh tim INFOPROF."}
              </CardDescription>
            </div>
            {formMode === "edit" && (
              <Button size="sm" variant="outline" onClick={handleCreate}>
                Buat Baru
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <JobForm
            key={formKey}
            variant="admin"
            initialValues={selectedJob ? { ...selectedJob, highlight: selectedJob.highlight ?? undefined } : undefined}
            onSuccess={handleSuccess}
            authToken={token}
          />
        </CardContent>
      </Card>
    </div>
  );
}
