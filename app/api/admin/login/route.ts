import { NextRequest, NextResponse } from "next/server";
import type { ZodIssue } from "zod";
import { z } from "zod";

import { AdminAuthError, signInAdmin } from "@/lib/supabase/auth";
import { isSupabaseConfigured } from "@/lib/supabase/server-client";

const loginSchema = z.object({
  email: z.string().trim().email("Email tidak valid."),
  password: z.string().min(6, "Kata sandi minimal 6 karakter."),
});

function formatValidationError(error: unknown) {
  if (error instanceof z.ZodError) {
    const issues = (error as z.ZodError).issues ?? [];
    return issues.map((issue: ZodIssue) => issue.message).join("; ");
  }

  return null;
}

export async function POST(request: NextRequest) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json(
      {
        error: "Supabase belum dikonfigurasi. Set SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, dan SUPABASE_ANON_KEY.",
      },
      { status: 503 },
    );
  }

  let credentials;
  try {
    credentials = loginSchema.parse(await request.json());
  } catch (error: unknown) {
    const message = formatValidationError(error) ?? "Data login tidak valid.";
    return NextResponse.json({ error: message }, { status: 422 });
  }

  try {
    const { profile, session } = await signInAdmin(credentials.email, credentials.password);

    return NextResponse.json(
      {
        token: session.access_token,
        refreshToken: session.refresh_token,
        expiresAt: session.expires_at,
        data: {
          user: profile,
        },
        message: "Login admin berhasil.",
      },
      { status: 200 },
    );
  } catch (error: unknown) {
    if (error instanceof AdminAuthError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }

    return NextResponse.json({ error: "Autentikasi admin gagal." }, { status: 401 });
  }
}
