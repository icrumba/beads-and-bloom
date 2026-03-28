"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function loginAction(
  _prevState: { error?: string } | null,
  formData: FormData
) {
  const password = formData.get("password") as string;

  if (!password || password !== process.env.ADMIN_PASSWORD) {
    return { error: "Wrong password" };
  }

  // Set session cookie -- 7-day expiry, httpOnly for security
  (await cookies()).set("admin_session", process.env.ADMIN_SESSION_SECRET!, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: "/",
  });

  redirect("/admin/orders");
}

export async function logoutAction() {
  (await cookies()).delete("admin_session");
  redirect("/admin/login");
}
