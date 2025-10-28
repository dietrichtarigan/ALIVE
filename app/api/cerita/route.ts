import { NextRequest, NextResponse } from "next/server";

import { alumniStories } from "@/data/stories";
import { backendClient } from "@/lib/backend";

export async function GET() {
  if (!backendClient.isConfigured()) {
    return NextResponse.json(
      {
        data: alumniStories,
        fallback: true,
        message:
          "Backend belum dikonfigurasi (NEXT_PUBLIC_ARCADE_BACKEND). Menampilkan data cerita statis.",
      },
      { status: 200 },
    );
  }

  const { status, data } = await backendClient.stories.list();
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
          "Backend cerita belum aktif. Payload dikembalikan untuk pengecekan lokal.",
      },
      { status: 200 },
    );
  }

  const { status, data } = await backendClient.stories.create(payload);
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
          "Perubahan diabaikan karena backend cerita belum terhubung.",
      },
      { status: 200 },
    );
  }

  const { status, data } = await backendClient.stories.update(payload);
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
          "Penghapusan diabaikan karena backend cerita belum aktif.",
      },
      { status: 200 },
    );
  }

  const { status, data } = await backendClient.stories.remove(payload);
  return NextResponse.json(data ?? {}, { status });
}
