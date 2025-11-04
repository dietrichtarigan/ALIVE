"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import { useAdminSession } from "@/components/admin/admin-session-provider";
import { StoryForm, StoryFormPayload } from "@/components/site/forms/story-form";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { alumniStories } from "@/data/stories";
import { backendClient } from "@/lib/backend";
import type { AlumniStory } from "@/lib/domain/stories";

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

export function AdminStoriesManager() {
  const [stories, setStories] = useState<AlumniStory[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [status, setStatus] = useState<StatusMessage | null>(null);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [selectedStory, setSelectedStory] = useState<AlumniStory | null>(null);
  const { token, status: sessionStatus } = useAdminSession();
  const isSessionReady = sessionStatus === "authenticated";

  const formKey = useMemo(() => `${formMode}-${selectedStory?.id ?? "new"}`, [formMode, selectedStory?.id]);

  const loadStories = useCallback(async () => {
    setLoading(true);

    if (!isSessionReady) {
      setLoading(false);
      return;
    }

    try {
      const { status: httpStatus, data } = await backendClient.stories.list(token);

      if (httpStatus >= 400) {
        throw new Error(resolveMessage(data, "Gagal memuat cerita dari backend."));
      }

  const records = extractArray<AlumniStory>(data);
  const fallback = Boolean(data && typeof data === "object" && (data as Record<string, unknown>).fallback);
      const message = resolveMessage(data, "");

  setStories(fallback ? alumniStories : records);
      setStatus(
        fallback
          ? {
              type: "info",
              message: message || "Supabase belum dikonfigurasi. Menampilkan cerita contoh.",
            }
          : null,
      );
    } catch (error) {
      setStatus({
        type: "error",
        message: (error as Error).message || "Gagal memuat data cerita.",
      });
    } finally {
      setLoading(false);
    }
  }, [token, isSessionReady]);

  useEffect(() => {
    void loadStories();
  }, [loadStories]);

  async function handleDelete(story: AlumniStory) {
    const confirmation = window.confirm(`Hapus cerita "${story.title}" dari CeritaKita?`);
    if (!confirmation) {
      return;
    }

    try {
      const { status: httpStatus, data } = await backendClient.stories.remove({ id: story.id }, token);
      if (httpStatus >= 400) {
        throw new Error(resolveMessage(data, "Gagal menghapus cerita."));
      }

      await loadStories();
      setStatus({
        type: "success",
        message: resolveMessage(data, "Cerita alumni berhasil dihapus."),
      });
    } catch (error) {
      setStatus({
        type: "error",
        message: (error as Error).message || "Terjadi kesalahan saat menghapus cerita.",
      });
    }
  }

  function handleEdit(story: AlumniStory) {
    setFormMode("edit");
    setSelectedStory(story);
  }

  function handleCreate() {
    setFormMode("create");
    setSelectedStory(null);
  }

  async function handleSuccess(payload: StoryFormPayload, response: unknown) {
    if (formMode === "edit") {
      setSelectedStory(null);
      setFormMode("create");
    }

    await loadStories();
    setStatus({
      type: "success",
      message: resolveMessage(response, `Cerita ${payload.title} berhasil disimpan.`),
    });
  }

  return (
    <div className="space-y-6">
      <Card className="border-border/40">
        <CardHeader>
          <CardTitle className="text-lg">Daftar Cerita Alumni</CardTitle>
          <CardDescription>Kurasi naskah CeritaKita sebelum dipublikasikan ke halaman publik.</CardDescription>
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
                  <th className="px-4 py-3 text-left font-semibold">Alumni</th>
                  <th className="px-4 py-3 text-left font-semibold">Tag</th>
                  <th className="px-4 py-3 text-left font-semibold">Status</th>
                  <th className="px-4 py-3 text-right font-semibold">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40 bg-background/60">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-6 text-center text-muted-foreground">
                      Memuat data cerita...
                    </td>
                  </tr>
                ) : stories.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-6 text-center text-muted-foreground">
                      Belum ada naskah cerita. Tambahkan melalui form di bawah.
                    </td>
                  </tr>
                ) : (
                  stories.map((story) => (
                    <tr key={story.id} className="transition-colors hover:bg-muted/30">
                      <td className="px-4 py-3 font-medium text-foreground">
                        <div>
                          <p>{story.title}</p>
                          <p className="text-xs text-muted-foreground">/{story.slug}</p>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        <div className="space-y-1">
                          <p className="font-medium text-foreground/90">{story.name}</p>
                          <p className="text-xs">{story.role}</p>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-1">
                          {story.tags?.map((tag) => (
                            <Badge key={tag} variant="outline">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {story.featured ? (
                          <span className="text-xs font-semibold uppercase text-primary">Featured</span>
                        ) : (
                          <span className="text-xs uppercase">Draft</span>
                        )}
                      </td>
                      <td className="flex items-center justify-end gap-2 px-4 py-3">
                        <Button size="sm" variant="outline" onClick={() => handleEdit(story)}>
                          Edit
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => handleDelete(story)}>
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
                {formMode === "edit" ? "Perbarui Cerita" : "Tambah Cerita"}
              </CardTitle>
              <CardDescription>
                {formMode === "edit"
                  ? "Perbarui naskah sebelum didorong ke halaman publik."
                  : "Kurasi cerita alumni baru dan kirim ke backend CeritaKita."}
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
          {isSessionReady ? (
            <StoryForm
              key={formKey}
              variant="admin"
              initialValues={
                selectedStory
                  ? {
                      ...selectedStory,
                      featured:
                        typeof selectedStory.featured === "boolean"
                          ? selectedStory.featured
                          : undefined,
                    }
                  : undefined
              }
              onSuccess={handleSuccess}
              authToken={token}
            />
          ) : (
            <p className="text-sm text-muted-foreground">Sesi admin belum aktif. Masuk kembali melalui halaman login.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
