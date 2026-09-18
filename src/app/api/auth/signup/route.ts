import { randomUUID } from "node:crypto";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { createSession } from "@/lib/server/auth";
import { transaction } from "@/lib/server/db";

export async function POST(request: Request) {
  try {
    const body = await request.json() as { name?: string; email?: string; password?: string };
    const name = body.name?.trim() ?? "";
    const email = body.email?.trim().toLowerCase() ?? "";
    const password = body.password ?? "";
    if (name.length < 2 || name.length > 120) return NextResponse.json({ error: "Enter a valid name." }, { status: 400 });
    if (!/^\S+@\S+\.\S+$/.test(email) || email.length > 320) return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
    if (password.length < 8 || password.length > 128) return NextResponse.json({ error: "Password must be between 8 and 128 characters." }, { status: 400 });

    const id = randomUUID();
    const passwordHash = await bcrypt.hash(password, 12);
    const user = await transaction(async (client) => {
      const result = await client.query<{ id: string; name: string; email: string; language: "en"; created_at: Date }>(
        "INSERT INTO users (id, name, email, password_hash) VALUES ($1, $2, $3, $4) RETURNING id, name, email, language, created_at",
        [id, name, email, passwordHash],
      );
      await client.query("INSERT INTO profiles (user_id, display_name) VALUES ($1, $2)", [id, name]);
      return result.rows[0];
    });
    await createSession(id);
    return NextResponse.json({ user: { id: user.id, name: user.name, email: user.email, language: user.language, createdAt: user.created_at.toISOString() } }, { status: 201 });
  } catch (error) {
    if ((error as { code?: string }).code === "23505") return NextResponse.json({ error: "An account with this email already exists." }, { status: 409 });
    console.error("Signup failed", error);
    return NextResponse.json({ error: "Could not create the account. Please try again." }, { status: 500 });
  }
}
