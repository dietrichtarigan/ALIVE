import { z } from "zod";

const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

export const jobPayloadSchema = z.object({
  title: z.string().trim().min(3, "Judul wajib diisi."),
  organization: z.string().trim().min(2, "Organisasi wajib diisi."),
  location: z.string().trim().min(2, "Lokasi wajib diisi."),
  category: z.enum(["Kerja", "Magang", "Beasiswa"], {
    required_error: "Kategori harus dipilih.",
    invalid_type_error: "Kategori tidak valid.",
  }),
  description: z.string().trim().min(20, "Deskripsi minimal 20 karakter."),
  requirements: z.array(z.string().trim().min(1)).min(1, "Minimal satu persyaratan."),
  deadline: z
    .string()
    .trim()
    .refine((value: string) => dateRegex.test(value), {
      message: "Gunakan format tanggal YYYY-MM-DD.",
    }),
  contact: z.string().trim().min(5, "Kontak wajib diisi."),
  link: z.string().trim().url("Tautan harus berupa URL yang valid."),
  tags: z.array(z.string().trim().min(1)).default([]),
  highlight: z.string().trim().max(200).optional().or(z.literal("")),
});

export const jobCreateSchema = jobPayloadSchema;
export const jobUpdateSchema = jobPayloadSchema.extend({
  id: z.string().uuid("ID lowongan tidak valid."),
});

const storyBaseSchema = z.object({
  id: z.string().uuid().optional(),
  slug: z.string().trim().optional(),
  title: z.string().trim().min(5, "Judul cerita minimal 5 karakter."),
  name: z.string().trim().min(2, "Nama wajib diisi."),
  batch: z.string().trim().min(2, "Angkatan wajib diisi."),
  role: z.string().trim().min(2, "Peran wajib diisi."),
  company: z.string().trim().min(2, "Perusahaan wajib diisi."),
  location: z.string().trim().min(2, "Lokasi wajib diisi."),
  summary: z.string().trim().min(20, "Ringkasan minimal 20 karakter."),
  tags: z.array(z.string().trim().min(1)).default([]),
  quote: z.string().trim().min(10, "Kutipan minimal 10 karakter."),
  body: z.array(z.string().trim().min(1)).min(1, "Isi cerita wajib diisi."),
  avatarColor: z.string().trim().optional(),
  featured: z.boolean().optional(),
});

export type StoryPayloadInput = z.infer<typeof storyBaseSchema>;

const applyStorySlugTransform = <T extends StoryPayloadInput>(value: T) => {
  const slugSource = value.slug && value.slug.trim().length > 0 ? value.slug : value.title;
  const slug = slugSource
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-");

  return {
    ...value,
    slug,
  };
};

export const storyPayloadSchema = storyBaseSchema.transform(applyStorySlugTransform);

export const storyCreateSchema = storyPayloadSchema;
export const storyUpdateSchema = storyBaseSchema
  .extend({
    id: z.string().uuid("ID cerita tidak valid."),
  })
  .transform(applyStorySlugTransform);
