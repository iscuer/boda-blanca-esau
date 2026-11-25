import { appendConfirmations, type Confirmation } from "@/lib/confirmations-sheets";

export const runtime = "nodejs";

function clean(value: unknown, maxLength: number) {
  return typeof value === "string"
    ? value.trim().slice(0, maxLength)
    : "";
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const nombre = clean(body.nombre, 150);
    const asiste = body.asiste === true;

    if (!nombre) {
      return Response.json({ error: "Falta el nombre." }, { status: 400 });
    }

    const grupoId = crypto.randomUUID();
    const filas: Confirmation[] = [
      {
        grupo_id: grupoId,
        tipo: "invitado",
        nombre,
        asiste,
        alergias: asiste ? clean(body.alergias, 500) || null : null,
        necesita_bus: asiste && body.necesitaBus === true,
        observaciones: clean(body.observaciones, 1000) || null,
      },
    ];

    if (asiste && body.tieneAcompanante === true) {
      const acompananteNombre = clean(body.acompananteNombre, 150);
      if (!acompananteNombre) {
        return Response.json(
          { error: "Falta el nombre del acompañante." },
          { status: 400 },
        );
      }

      filas.push({
        grupo_id: grupoId,
        tipo: "acompañante",
        nombre: acompananteNombre,
        asiste: true,
        alergias: clean(body.acompananteAlergias, 500) || null,
        necesita_bus: body.acompananteNecesitaBus === true,
        observaciones: null,
      });
    }

    await appendConfirmations(filas);
    return Response.json({ ok: true }, { status: 201 });
  } catch (error) {
    console.error("No se pudo guardar la confirmación", error);
    return Response.json(
      { error: "No hemos podido guardar la confirmación." },
      { status: 500 },
    );
  }
}
