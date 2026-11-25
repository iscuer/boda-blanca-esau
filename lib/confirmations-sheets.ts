import "server-only";
import ExcelJS from "exceljs";
import type { Confirmation } from "./confirmation";
export type { Confirmation } from "./confirmation";

export type SavedConfirmation = Confirmation & { id: string; fecha: string };

async function sheetsRequest(action: "append" | "read" | "update", rows?: Confirmation[], update?: { original: SavedConfirmation; updated: Confirmation }) {
  const url = process.env.GOOGLE_SHEETS_WEB_APP_URL;
  const secret = process.env.GOOGLE_SHEETS_SECRET;
  if (!url || !secret) throw new Error("Falta configurar Google Sheets en el servidor.");
  const parsed = new URL(url);
  if (parsed.origin !== "https://script.google.com" || !parsed.pathname.endsWith("/exec")) {
    throw new Error("La URL debe ser una aplicación de Google Apps Script publicada.");
  }
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ secret, action, rows, ...update }),
    cache: "no-store",
    // Apps Script can take longer to start, especially when exporting responses.
    signal: AbortSignal.timeout(60000),
  });
  if (!response.ok) throw new Error("Google Sheets no está disponible.");
  const result = await response.json();
  if (result.ok !== true) {
    const detail = typeof result.error === "string" ? ` ${result.error}` : "";
    throw new Error(`Google Sheets no ha confirmado la operación.${detail}`);
  }
  return result;
}

export async function appendConfirmations(rows: Confirmation[]) {
  await sheetsRequest("append", rows);
}

export async function updateConfirmation(original: SavedConfirmation, updated: Confirmation) {
  await sheetsRequest("update", undefined, { original, updated });

  const saved = (await readConfirmations()).find((row) => row.id === original.id);
  if (!saved) throw new Error("La fila editada ya no existe en Google Sheets.");

  const fields = ["nombre", "tipo", "asiste", "necesita_bus", "alergias", "observaciones"] as const;
  const matches = fields.every((field) => (saved[field] ?? null) === (updated[field] ?? null));
  if (!matches) throw new Error("Google Sheets no ha reflejado todos los cambios.");

  return saved;
}

export async function readConfirmations(): Promise<SavedConfirmation[]> {
  const result = await sheetsRequest("read");
  if (!Array.isArray(result.rows)) throw new Error("Respuesta de Google Sheets no válida.");
  return result.rows.reverse();
}

export async function downloadConfirmations() {
  const rows = (await readConfirmations()).reverse();
  const workbook = new ExcelJS.Workbook();
  workbook.creator = "Nuestra boda";
  const sheet = workbook.addWorksheet("Confirmaciones", { views: [{ state: "frozen", ySplit: 1 }] });
  sheet.columns = [
    { header: "Fecha", width: 24 }, { header: "Nombre y apellidos", width: 34 },
    { header: "Tipo", width: 16 }, { header: "Asiste", width: 12 },
    { header: "Autobús", width: 12 }, { header: "Alergias o intolerancias", width: 38 },
    { header: "Observaciones", width: 45 }, { header: "Grupo", width: 38 },
  ];
  for (const row of rows) sheet.addRow([row.fecha, row.nombre, row.tipo, row.asiste ? "Sí" : "No", row.necesita_bus ? "Sí" : "No", row.alergias || "", row.observaciones || "", row.grupo_id]);
  sheet.getRow(1).font = { bold: true };
  sheet.autoFilter = "A1:H1";
  sheet.eachRow((row) => { row.alignment = { vertical: "top", wrapText: true }; });
  return Buffer.from(await workbook.xlsx.writeBuffer());
}
