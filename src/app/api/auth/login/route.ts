import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { createSession } from "@/lib/server/auth";
import { query } from "@/lib/server/db";

type LoginRow = { id: string; name: string; email: string; language: "en"; created_at: Date; password_hash: string };

export async function POST(request: Request) {
  try {
    const body = await request.json() as { email?: string; password?: string };
    const email = body.email?.trim().toLowerCase() ?? "";
    const password = body.password ?? "";
    if (!email || !password) return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
    const result = await query<LoginRow>("SELECT id, name, email, language, created_at, password_hash FROM users WHERE email = $1", [email]);
    const user = result.rows[0];
    if (!user || !(await bcrypt.compare(password, user.password_hash))) return NextResponse.json({ error: "Email or password is incorrect." }, { status: 401 });
    await createSession(user.id);
    return NextResponse.json({ user: { id: user.id, name: user.name, email: user.email, language: user.language, createdAt: user.created_at.toISOString() } });
  } catch (error) {
    console.error("Login failed", error);
    return NextResponse.json({ error: "Could not log in. Please try again." }, { status: 500 });
  }
}
