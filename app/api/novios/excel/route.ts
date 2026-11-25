import { hasNoviosSession } from "@/lib/novios-auth";
import { downloadConfirmations } from "@/lib/confirmations-sheets";
export const runtime = "nodejs";
export async function GET() {
  if (!(await hasNoviosSession())) return new Response("No autorizado", { status: 401 });
  try {
    const buffer = await downloadConfirmations();
    return new Response(new Uint8Array(buffer), { headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": 'attachment; filename="confirmaciones-boda.xlsx"',
      "Cache-Control": "no-store",
    }});
  } catch (error) {
    console.error("No se pudo leer el Excel", error);
    return new Response("No se pudo leer el Excel", { status: 500 });
  }
}
