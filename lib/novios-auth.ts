import "server-only";

import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

export const NOVIOS_COOKIE = "novios_sesion";

function configuredPassword() {
  return process.env.NOVIOS_PASSWORD ?? "";
}

export function isCorrectPassword(candidate: string) {
  const password = configuredPassword();
  if (!password) return false;

  const expected = Buffer.from(password);
  const received = Buffer.from(candidate);
  return (
    expected.length === received.length && timingSafeEqual(expected, received)
  );
}

export function sessionToken() {
  const password = configuredPassword();
  if (!password) return "";
  return createHmac("sha256", password).update("boda-maria-lucas").digest("hex");
}

export async function hasNoviosSession() {
  const current = (await cookies()).get(NOVIOS_COOKIE)?.value ?? "";
  const expected = sessionToken();
  if (!current || !expected) return false;

  const currentBuffer = Buffer.from(current);
  const expectedBuffer = Buffer.from(expected);
  return (
    currentBuffer.length === expectedBuffer.length &&
    timingSafeEqual(currentBuffer, expectedBuffer)
  );
}
