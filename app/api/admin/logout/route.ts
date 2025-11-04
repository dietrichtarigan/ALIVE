import { NextRequest, NextResponse } from "next/server";

import { AdminAuthError, requireAdmin, signOutAdmin } from "@/lib/supabase/auth";
import { isSupabaseConfigured } from "@/lib/supabase/server-client";

export async function POST(request: NextRequest) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json(
      {
        error: "Supabase belum dikonfigurasi.",
      },
      { status: 503 },
    );
  }

  try {
    const { profile } = await requireAdmin(request);
    await signOutAdmin(profile.id);

    return NextResponse.json({ message: "Logout berhasil." }, { status: 200 });
  } catch (error: unknown) {
    if (error instanceof AdminAuthError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }

    return NextResponse.json({ error: "Autentikasi admin gagal." }, { status: 401 });
  }
}
