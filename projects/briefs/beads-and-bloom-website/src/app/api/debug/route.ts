import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

export async function GET() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    return NextResponse.json({ error: "DATABASE_URL not set", envKeys: Object.keys(process.env).filter(k => k.startsWith("DATABASE") || k.startsWith("NEXT_PUBLIC") || k.startsWith("CLOUDINARY")) });
  }

  // Show masked URL for debugging
  const masked = url.replace(/:[^@]+@/, ":***@");

  try {
    const sql = neon(url);
    const result = await sql`SELECT count(*) as count FROM products`;
    return NextResponse.json({
      ok: true,
      maskedUrl: masked,
      productCount: result[0].count,
    });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    return NextResponse.json({
      ok: false,
      maskedUrl: masked,
      error: msg,
    });
  }
}
