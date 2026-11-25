"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { boda } from "@/app/boda";

const apartados = [
  { id: "enlace", nombre: "El enlace" },
  { id: "mensajes", nombre: "Mensajes" },
  { id: "fotos", nombre: "Fotos" },
  { id: "hoteles", nombre: "Hoteles" },
  { id: "regalo", nombre: "Regalo" },
  { id: "confirmacion", nombre: "Asistencia" },
] as const;

type Apartado = "menu" | (typeof apartados)[number]["id"];

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
      setActivo(destino === "menu" ? "menu" : apartados.find(({ id }) => id === destino)?.id ?? null);
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
    <div className="invitacion" data-abierta={activo !== null}>
      <header className="invitacion-portada" inert={activo !== null}>
        {portada}
        <a ref={abrir} className="invitacion-boton triptico-abrir" href="#menu" aria-controls="triptico-interior" aria-expanded={activo !== null}>
          Abrir invitación
        </a>
      </header>
      <div id="triptico-interior" className="triptico-abierto" inert={activo === null}>
        <div className="triptico-barra">
          <h1>Esaú <span>y</span> Blanca</h1>
          <a href="#inicio">Cerrar invitación</a>
        </div>
        <div className="invitacion-paneles">
          {izquierda}
          <div className="triptico-centro">
            <nav id="menu" tabIndex={-1} className="invitacion-indice" aria-label="Apartados de la invitación">
              {apartados.map(({ id, nombre }) => (
                <a className="invitacion-tarjeta" key={id} href={`#${id}`} aria-current={activo === id ? "location" : undefined}>
                  <span className="invitacion-tarjeta-foto" aria-hidden="true">
                    {boda.fotosMenu[id] && (
                      <Image src={boda.fotosMenu[id]} alt="" fill sizes="(max-width: 48rem) 28vw, 10rem" />
                    )}
                  </span>
                  <span className="invitacion-tarjeta-titulo">{nombre}</span>
                </a>
              ))}
            </nav>
            {children}
            {activo && activo !== "menu" && (
              <a className="triptico-volver" href="#menu">Volver al menú</a>
            )}
          </div>
          {derecha}
        </div>
      </div>
    </div>
  );
}
