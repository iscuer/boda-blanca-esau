"use client";

import { useState } from "react";
import type { SavedConfirmation } from "@/lib/confirmations-sheets";

const fieldClass = "w-full border border-neutral-300 bg-white px-3 py-2 text-sm";
const buttonClass = "border border-neutral-400 px-4 py-2 text-sm disabled:opacity-50";
const normalize = (value: string) => value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

export default function ConfirmationsTable({ initialRows }: { initialRows: SavedConfirmation[] }) {
  const [rows, setRows] = useState(initialRows);
  const [search, setSearch] = useState("");
  const [attendance, setAttendance] = useState("");
  const [bus, setBus] = useState("");
  const [type, setType] = useState("");
  const [allergies, setAllergies] = useState("");
  const [draft, setDraft] = useState<SavedConfirmation | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const filtered = rows.filter(row =>
    normalize([row.nombre, row.alergias, row.observaciones].join(" ")).includes(normalize(search.trim())) &&
    (!attendance || String(row.asiste) === attendance) && (!bus || String(row.necesita_bus) === bus) &&
    (!type || row.tipo === type) && (!allergies || String(Boolean(row.alergias?.trim())) === allergies));

  async function save(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!draft || saving) return;
    setSaving(true); setMessage("");
    try {
      const response = await fetch("/api/novios/confirmaciones", {
        method: "PATCH", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ original: rows.find(row => row.id === draft.id), updated: draft }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "No se pudo guardar.");
      setRows(rows.map(row => row.id === draft.id ? data.row : row));
      setDraft(null); setMessage("Cambios guardados en Google Sheets.");
    } catch (error) { setMessage(error instanceof Error ? error.message : "No se pudo guardar. Comprueba la conexión."); }
    finally { setSaving(false); }
  }

  return (
    <>
      <div className="mt-10 grid gap-4 sm:grid-cols-3">
        {[["Respuestas", rows.length], ["Asistentes", rows.filter(row => row.asiste).length], ["Necesitan autobús", rows.filter(row => row.necesita_bus).length]].map(([label, value]) => (
          <div key={label} className="border border-neutral-300 bg-white p-6"><p className="text-sm text-neutral-500">{label}</p><p className="mt-2 font-serif text-4xl">{value}</p></div>
        ))}
      </div>
      <div className="mt-8 border border-neutral-300 bg-white p-5">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <label className="text-sm">Buscar<input className={fieldClass} value={search} onChange={e => setSearch(e.target.value)} placeholder="Nombre, alergias, notas" /></label>
          <label className="text-sm">Asistencia<select className={fieldClass} value={attendance} onChange={e => setAttendance(e.target.value)}><option value="">Todas</option><option value="true">Asisten</option><option value="false">No asisten</option></select></label>
          <label className="text-sm">Autobús<select className={fieldClass} value={bus} onChange={e => setBus(e.target.value)}><option value="">Todos</option><option value="true">Sí</option><option value="false">No</option></select></label>
          <label className="text-sm">Tipo<select className={fieldClass} value={type} onChange={e => setType(e.target.value)}><option value="">Todos</option><option value="invitado">Invitado</option><option value="acompañante">Acompañante</option></select></label>
          <label className="text-sm">Alergias<select className={fieldClass} value={allergies} onChange={e => setAllergies(e.target.value)}><option value="">Todas</option><option value="true">Con alergias o intolerancias</option><option value="false">Sin alergias indicadas</option></select></label>
        </div>
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3"><p className="text-sm" aria-live="polite">Mostrando {filtered.length} de {rows.length} respuestas. Los contadores y el Excel incluyen todas.</p><button className={buttonClass} onClick={() => { setSearch(""); setAttendance(""); setBus(""); setType(""); setAllergies(""); }}>Limpiar filtros</button></div>
      </div>
      {draft && (
        <form onSubmit={save} className="mt-6 border border-neutral-400 bg-white p-6" aria-label="Editar confirmación">
          <h2 className="font-serif text-3xl">Editar respuesta</h2>
          <fieldset disabled={saving} className="mt-5 grid gap-4 md:grid-cols-2">
            <label>Nombre<input required maxLength={150} className={fieldClass} value={draft.nombre} onChange={e => setDraft({ ...draft, nombre: e.target.value })} /></label>
            <label>Tipo<select className={fieldClass} value={draft.tipo} onChange={e => setDraft({ ...draft, tipo: e.target.value as SavedConfirmation["tipo"] })}><option value="invitado">Invitado</option><option value="acompañante">Acompañante</option></select></label>
            <label className="flex items-center gap-2"><input type="checkbox" checked={draft.asiste} onChange={e => setDraft({ ...draft, asiste: e.target.checked, necesita_bus: e.target.checked && draft.necesita_bus })} />Asiste</label>
            <label className="flex items-center gap-2"><input type="checkbox" disabled={!draft.asiste} checked={draft.necesita_bus} onChange={e => setDraft({ ...draft, necesita_bus: e.target.checked })} />Necesita autobús</label>
            <label>Alergias o intolerancias<textarea maxLength={500} className={fieldClass} value={draft.alergias ?? ""} onChange={e => setDraft({ ...draft, alergias: e.target.value })} /></label>
            <label>Observaciones<textarea maxLength={1000} className={fieldClass} value={draft.observaciones ?? ""} onChange={e => setDraft({ ...draft, observaciones: e.target.value })} /></label>
            <div className="flex gap-3"><button className={buttonClass} type="submit">{saving ? "Guardando…" : "Guardar cambios"}</button><button className={buttonClass} type="button" onClick={() => { setDraft(null); setMessage(""); }}>Cancelar</button></div>
          </fieldset>
        </form>
      )}
      <p role="status" className="mt-4 text-sm">{message}</p>
      <div className="mt-4 overflow-x-auto border border-neutral-300 bg-white">
        <table className="w-full min-w-[1000px] text-left text-sm">
          <thead className="bg-[#9b6b45] text-white"><tr>{["Nombre", "Tipo", "Asiste", "Autobús", "Alergias", "Observaciones", "Acciones"].map(heading => <th scope="col" key={heading} className="px-4 py-3 font-medium">{heading}</th>)}</tr></thead>
          <tbody>{filtered.map(row => (
            <tr key={row.id} className="border-t border-neutral-200">
              <td className="px-4 py-3 font-medium">{row.nombre}</td><td className="px-4 py-3">{row.tipo}</td><td className="px-4 py-3">{row.asiste ? "Sí" : "No"}</td><td className="px-4 py-3">{row.necesita_bus ? "Sí" : "No"}</td><td className="max-w-xs break-words px-4 py-3">{row.alergias || "—"}</td><td className="max-w-xs break-words px-4 py-3">{row.observaciones || "—"}</td>
              <td className="px-4 py-3"><button className={buttonClass} disabled={Boolean(draft)} aria-label={"Editar respuesta de " + row.nombre} onClick={() => { setDraft({ ...row }); setMessage(""); }}>Editar</button></td>
            </tr>
          ))}{!filtered.length && <tr><td colSpan={7} className="px-4 py-12 text-center text-neutral-500">{rows.length ? "No hay respuestas con estos filtros." : "Todavía no hay confirmaciones."}</td></tr>}</tbody>
        </table>
      </div>
    </>
  );
}
