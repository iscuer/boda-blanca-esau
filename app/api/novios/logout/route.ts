import { NextResponse } from "next/server";
import { NOVIOS_COOKIE } from "@/lib/novios-auth";

export async function POST(request: Request) {
  const response = NextResponse.redirect(new URL("/novios", request.url), 303);
  response.cookies.delete(NOVIOS_COOKIE);
  return response;
}
