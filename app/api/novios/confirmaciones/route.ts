import { hasNoviosSession } from "@/lib/novios-auth";
import { readConfirmations, updateConfirmation, type Confirmation } from "@/lib/confirmations-sheets";

export const runtime = "nodejs";

export async function PATCH(request: Request) {
  if (!(await hasNoviosSession())) return Response.json({ error: "La sesión ha caducado. Vuelve a entrar." }, { status: 401 });
  if (request.headers.get("origin") !== new URL(request.url).origin) return Response.json({ error: "Origen no permitido." }, { status: 403 });
  let body;
  try { body = await request.json(); } catch { return Response.json({ error: "Datos no válidos." }, { status: 400 }); }
  const { original, updated } = body ?? {};
  if (!original || !updated || typeof updated.nombre !== "string" || !updated.nombre.trim() || updated.nombre.length > 150 ||
    !["invitado", "acompañante"].includes(updated.tipo) || typeof updated.asiste !== "boolean" || typeof updated.necesita_bus !== "boolean" ||
    ![updated.alergias, updated.observaciones].every(v => v === null || typeof v === "string") ||
    (updated.alergias?.length ?? 0) > 500 || (updated.observaciones?.length ?? 0) > 1000) {
    return Response.json({ error: "Revisa el nombre y los campos de la respuesta." }, { status: 400 });
  }
  try {
    const current = (await readConfirmations()).find(row => row.id === original.id);
    const keys = ["fecha", "grupo_id", "nombre", "tipo", "asiste", "necesita_bus", "alergias", "observaciones"] as const;
    if (!current || keys.some(key => current[key] !== original[key])) return Response.json({ error: "Esta respuesta ha cambiado. Recarga la página antes de editarla." }, { status: 409 });
    const row: Confirmation = {
      grupo_id: current.grupo_id, nombre: updated.nombre.trim(), tipo: updated.tipo,
      asiste: updated.asiste, necesita_bus: updated.asiste && updated.necesita_bus,
      alergias: updated.alergias?.trim() || null, observaciones: updated.observaciones?.trim() || null,
    };
    const saved = await updateConfirmation(current, row);
    return Response.json({ row: saved });
  } catch (error) {
    console.error("No se pudo editar la confirmación", error);
    const detail = error instanceof Error ? error.message : "Error desconocido.";
    return Response.json({ error: `No se pudo guardar. ${detail} Comprueba que Apps Script tenga publicada la última versión.` }, { status: 502 });
  }
}
