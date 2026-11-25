import ConfirmationsTable from "@/components/ConfirmationsTable";
import { hasNoviosSession } from "@/lib/novios-auth";
import { readConfirmations } from "@/lib/confirmations-sheets";

export const dynamic = "force-dynamic";

type PageProps = {
  searchParams: Promise<{ error?: string }>;
};

export default async function NoviosPage({ searchParams }: PageProps) {
  const authenticated = await hasNoviosSession();

  if (!authenticated) {
    const { error } = await searchParams;
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f7f5f0] px-6 text-[#222]">
        <div className="w-full max-w-md border border-neutral-300 bg-white p-8 md:p-12">
          <p className="text-center text-xs uppercase tracking-[0.35em] text-neutral-500">
            Zona privada
          </p>
          <h1 className="mt-4 text-center font-serif text-5xl">Los novios</h1>
          <form action="/api/novios/login" method="post" className="mt-10">
            <label htmlFor="password" className="mb-2 block text-sm">
              Contraseña
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
              className="w-full border-b border-neutral-400 bg-transparent px-1 py-3 outline-none focus:border-black"
            />
            {error && (
              <p className="mt-4 text-sm text-red-700">Contraseña incorrecta.</p>
            )}
            <button className="mt-8 w-full border border-neutral-800 py-4 text-sm uppercase tracking-[0.2em] transition hover:bg-neutral-800 hover:text-white">
              Entrar
            </button>
          </form>
        </div>
      </main>
    );
  }

  const confirmations = await readConfirmations();



  return (
    <main className="min-h-screen bg-[#f7f5f0] px-5 py-12 text-[#222] md:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-neutral-500">
              Zona privada
            </p>
            <h1 className="mt-3 font-serif text-5xl">Confirmaciones</h1>
          </div>
          <div className="flex flex-wrap gap-3">
            <a
              href="/api/novios/excel"
              className="border border-neutral-800 bg-neutral-800 px-5 py-3 text-xs uppercase tracking-[0.18em] text-white"
            >
              Descargar Excel
            </a>
            <form action="/api/novios/logout" method="post">
              <button className="border border-neutral-400 px-5 py-3 text-xs uppercase tracking-[0.18em]">
                Salir
              </button>
            </form>
          </div>
        </div>

        <ConfirmationsTable initialRows={confirmations} />
      </div>
    </main>
  );
}
