import { appendConfirmations, type Confirmation } from "@/lib/confirmations-sheets";
import { MAX_EDAD_NINO, MAX_NINOS } from "@/lib/ninos-rsvp";

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

    let infoNinos = "";
    if (asiste && body.llevaNinos === true) {
      const { cantidadNinos, edadesNinos } = body;
      if (!Number.isInteger(cantidadNinos) || cantidadNinos < 1 || cantidadNinos > MAX_NINOS ||
          !Array.isArray(edadesNinos) || edadesNinos.length !== cantidadNinos ||
          edadesNinos.some((edad) => !Number.isInteger(edad) || edad < 0 || edad > MAX_EDAD_NINO)) {
        return Response.json({ error: "Indica la edad de cada niño." }, { status: 400 });
      }
      infoNinos = `Niños: ${cantidadNinos}. Edades (años): ${edadesNinos.join(", ")}.`;
    } else if (asiste && body.llevaNinos === false) {
      infoNinos = "Niños: no.";
    }
    const observaciones = [infoNinos, clean(body.observaciones, 1000 - infoNinos.length - (infoNinos ? 1 : 0))]
      .filter(Boolean).join("\n") || null;

    const grupoId = crypto.randomUUID();
    const filas: Confirmation[] = [
      {
        grupo_id: grupoId,
        tipo: "invitado",
        nombre,
        asiste,
        alergias: asiste ? clean(body.alergias, 500) || null : null,
        necesita_bus: asiste && body.necesitaBus === true,
        observaciones,
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
