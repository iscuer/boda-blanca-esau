"use client";

import { FormEvent, useState } from "react";

export default function RsvpForm() {
  const [asiste, setAsiste] = useState("si");
  const [tieneAcompanante, setTieneAcompanante] = useState(false);

  const [enviando, setEnviando] = useState(false);
  const [enviado, setEnviado] = useState(false);
  const [errorMensaje, setErrorMensaje] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setEnviando(true);
    setErrorMensaje("");

    const form = new FormData(e.currentTarget);

    const nombre = form.get("nombre")?.toString().trim();
    const alergias = form.get("alergias")?.toString().trim() || null;
    const bus = form.get("bus") === "si";
    const observaciones =
      form.get("observaciones")?.toString().trim() || null;

    if (!nombre) {
      setErrorMensaje("Introduce tu nombre y apellidos.");
      setEnviando(false);
      return;
    }

    let acompananteNombre = "";

    if (asiste === "si" && tieneAcompanante) {
      acompananteNombre = form
        .get("acompananteNombre")
        ?.toString()
        .trim() ?? "";

      if (!acompananteNombre) {
        setErrorMensaje(
          "Introduce el nombre y apellidos de tu acompañante."
        );
        setEnviando(false);
        return;
      }

    }

    const response = await fetch("/api/confirmaciones", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nombre,
        asiste: asiste === "si",
        alergias,
        necesitaBus: bus,
        observaciones,
        tieneAcompanante,
        acompananteNombre,
        acompananteAlergias:
          form.get("acompananteAlergias")?.toString().trim() || null,
        acompananteNecesitaBus: form.get("acompananteBus") === "si",
      }),
    }).catch(() => null);

    if (!response?.ok) {
      setErrorMensaje(
        "No hemos podido guardar la confirmación. Inténtalo de nuevo."
      );
      setEnviando(false);
      return;
    }

    setEnviado(true);
    setEnviando(false);
  }

  if (enviado) {
    return (
      <div className="mt-14 border border-neutral-300 px-8 py-12 text-center">
        <p className="font-serif text-4xl">
          ¡Gracias!
        </p>

        <p className="mt-5 leading-7 text-neutral-600">
          Hemos recibido vuestra confirmación correctamente.
        </p>

        <p className="mt-3 font-serif text-2xl">
          Confirmación de asistencia
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-14 space-y-10">

      <div>
        <label className="mb-2 block text-sm">
          Nombre y apellidos
        </label>

        <input
          type="text"
          name="nombre"
          required
          placeholder="Tu nombre completo"
          className="w-full border-b border-neutral-400 bg-transparent px-1 py-3 outline-none focus:border-black"
        />
      </div>

      <div>
        <label className="mb-3 block text-sm">
          ¿Podrás acompañarnos?
        </label>

        <div className="flex flex-wrap gap-8">

          <label className="flex cursor-pointer items-center gap-2">
            <input
              type="radio"
              name="asiste"
              value="si"
              checked={asiste === "si"}
              onChange={() => setAsiste("si")}
            />

            Sí, allí estaré
          </label>

          <label className="flex cursor-pointer items-center gap-2">
            <input
              type="radio"
              name="asiste"
              value="no"
              checked={asiste === "no"}
              onChange={() => {
                setAsiste("no");
                setTieneAcompanante(false);
              }}
            />

            No podré asistir
          </label>

        </div>
      </div>

      {asiste === "si" && (
        <>
          <div>
            <label className="mb-2 block text-sm">
              ¿Tienes alguna alergia o intolerancia?
            </label>

            <textarea
              name="alergias"
              rows={3}
              placeholder="Indícanos cuál. Si no tienes ninguna, déjalo en blanco."
              className="w-full border-b border-neutral-400 bg-transparent px-1 py-3 outline-none focus:border-black"
            />
          </div>

          <div>
            <label className="mb-3 block text-sm">
              ¿Necesitas autobús?
            </label>

            <select
              name="bus"
              className="w-full border-b border-neutral-400 bg-transparent py-3 outline-none"
            >
              <option value="no">No</option>
              <option value="si">Sí</option>
            </select>
          </div>

          <div>
            <label className="mb-3 block text-sm">
              ¿Vendrás acompañado/a?
            </label>

            <div className="flex gap-8">

              <label className="flex cursor-pointer items-center gap-2">
                <input
                  type="radio"
                  name="llevaAcompanante"
                  checked={!tieneAcompanante}
                  onChange={() => setTieneAcompanante(false)}
                />

                No
              </label>

              <label className="flex cursor-pointer items-center gap-2">
                <input
                  type="radio"
                  name="llevaAcompanante"
                  checked={tieneAcompanante}
                  onChange={() => setTieneAcompanante(true)}
                />

                Sí
              </label>

            </div>
          </div>

          {tieneAcompanante && (
            <div className="border-t border-neutral-300 pt-10">

              <p className="mb-8 font-serif text-3xl">
                Tu acompañante
              </p>

              <div className="space-y-10">

                <div>
                  <label className="mb-2 block text-sm">
                    Nombre y apellidos del acompañante
                  </label>

                  <input
                    type="text"
                    name="acompananteNombre"
                    required
                    placeholder="Nombre completo"
                    className="w-full border-b border-neutral-400 bg-transparent px-1 py-3 outline-none focus:border-black"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm">
                    ¿Tiene alguna alergia o intolerancia?
                  </label>

                  <textarea
                    name="acompananteAlergias"
                    rows={3}
                    placeholder="Indícanos cuál, si procede."
                    className="w-full border-b border-neutral-400 bg-transparent px-1 py-3 outline-none focus:border-black"
                  />
                </div>

                <div>
                  <label className="mb-3 block text-sm">
                    ¿Necesita autobús?
                  </label>

                  <select
                    name="acompananteBus"
                    className="w-full border-b border-neutral-400 bg-transparent py-3 outline-none"
                  >
                    <option value="no">No</option>
                    <option value="si">Sí</option>
                  </select>
                </div>

              </div>
            </div>
          )}
        </>
      )}

      <div>
        <label className="mb-2 block text-sm">
          ¿Quieres contarnos algo más?
        </label>

        <textarea
          name="observaciones"
          rows={3}
          placeholder="Observaciones"
          className="w-full border-b border-neutral-400 bg-transparent px-1 py-3 outline-none focus:border-black"
        />
      </div>

      {errorMensaje && (
        <p className="text-center text-sm text-red-700">
          {errorMensaje}
        </p>
      )}

      <button
        type="submit"
        disabled={enviando}
        className="w-full border border-neutral-800 py-4 text-sm uppercase tracking-[0.25em] transition hover:bg-neutral-800 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
      >
        {enviando ? "Enviando..." : "Enviar confirmación"}
      </button>

    </form>
  );
}
