import { NextRequest, NextResponse } from "next/server";

import { jobPostings } from "@/data/jobs";
import { backendClient } from "@/lib/backend";

export async function GET() {
  if (!backendClient.isConfigured()) {
    return NextResponse.json(
      {
        data: jobPostings,
        fallback: true,
        message:
          "Backend belum dikonfigurasi (NEXT_PUBLIC_ARCADE_BACKEND). Menampilkan data statis untuk pengembangan.",
      },
      { status: 200 },
    );
  }

  const { status, data } = await backendClient.jobs.list();
  return NextResponse.json(data ?? {}, { status });
}

export async function POST(request: NextRequest) {
  const payload = await request.json();

  if (!backendClient.isConfigured()) {
    return NextResponse.json(
      {
        fallback: true,
        submitted: payload,
        message:
          "Tidak ada backend terhubung. Payload dikembalikan untuk pengecekan lokal.",
      },
      { status: 200 },
    );
  }

  const { status, data } = await backendClient.jobs.create(payload);
  return NextResponse.json(data ?? {}, { status });
}

export async function PUT(request: NextRequest) {
  const payload = await request.json();

  if (!backendClient.isConfigured()) {
    return NextResponse.json(
      {
        fallback: true,
        submitted: payload,
        message:
          "Update diabaikan karena backend belum dikonfigurasi. Payload dikembalikan.",
      },
      { status: 200 },
    );
  }

  const { status, data } = await backendClient.jobs.update(payload);
  return NextResponse.json(data ?? {}, { status });
}

export async function DELETE(request: NextRequest) {
  const id = request.nextUrl.searchParams.get("id");
  const payload = id ? { id } : await request.json().catch(() => ({}));

  if (!backendClient.isConfigured()) {
    return NextResponse.json(
      {
        fallback: true,
        submitted: payload,
        message:
          "Penghapusan diabaikan karena backend belum aktif. Payload dikembalikan.",
      },
      { status: 200 },
    );
  }

  const { status, data } = await backendClient.jobs.remove(payload);
  return NextResponse.json(data ?? {}, { status });
}
