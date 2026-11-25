"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

const apartados = [
  { id: "enlace", nombre: "El enlace" },
  { id: "mensajes", nombre: "Mensajes" },
  { id: "fotos", nombre: "Fotos" },
  { id: "hoteles", nombre: "Hoteles" },
  { id: "regalo", nombre: "Regalo" },
  { id: "confirmacion", nombre: "Asistencia" },
] as const;

type Apartado = (typeof apartados)[number]["id"];

export default function Triptico({
  portada, izquierda, derecha, children,
}: {
  portada: ReactNode;
  izquierda: ReactNode;
  derecha: ReactNode;
  children: ReactNode;
}) {
  const [activo, setActivo] = useState<Apartado | null>(null);
  const abrir = useRef<HTMLAnchorElement>(null);
  const anterior = useRef<Apartado | null>(null);

  useEffect(() => {
    function leerApartado() {
      const destino = window.location.hash.slice(1);
      setActivo(apartados.find(({ id }) => id === destino)?.id ?? null);
    }

    leerApartado();
    window.addEventListener("hashchange", leerApartado);
    return () => window.removeEventListener("hashchange", leerApartado);
  }, []);

  useEffect(() => {
    if (activo) document.getElementById(activo)?.focus({ preventScroll: true });
    else if (anterior.current) abrir.current?.focus();
    anterior.current = activo;
  }, [activo]);

  return (
    <div className="invitacion">
      <header className="invitacion-portada" hidden={activo !== null}>
        {portada}
        <a ref={abrir} className="invitacion-boton triptico-abrir" href="#enlace">
          Abrir invitación
        </a>
      </header>
      <div className="triptico-abierto" hidden={activo === null}>
        <div className="triptico-barra">
          <h1>Esaú <span>y</span> Blanca</h1>
          <a href="#inicio">Cerrar invitación</a>
        </div>
        <nav className="invitacion-indice" aria-label="Apartados de la invitación">
          {apartados.map(({ id, nombre }) => (
            <a key={id} href={`#${id}`} aria-current={activo === id ? "location" : undefined}>
              {nombre}
            </a>
          ))}
        </nav>
        <div className="invitacion-paneles">
          {izquierda}
          <div className="triptico-centro">{children}</div>
          {derecha}
        </div>
      </div>
    </div>
  );
}
