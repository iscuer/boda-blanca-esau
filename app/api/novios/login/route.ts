import { NextResponse } from "next/server";
import {
  isCorrectPassword,
  NOVIOS_COOKIE,
  sessionToken,
} from "@/lib/novios-auth";

export async function POST(request: Request) {
  const form = await request.formData();
  const password = form.get("password")?.toString() ?? "";

  if (!isCorrectPassword(password)) {
    return NextResponse.redirect(new URL("/novios?error=1", request.url), 303);
  }

  const response = NextResponse.redirect(new URL("/novios", request.url), 303);
  response.cookies.set(NOVIOS_COOKIE, sessionToken(), {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 12,
  });
  return response;
}
