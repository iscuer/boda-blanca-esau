"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { boda, fechaBoda } from "@/app/boda";

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
  const ventana = useRef<HTMLDivElement>(null);
  const hojaCentral = useRef<HTMLDivElement>(null);

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
    if (activo) {
      document.getElementById(activo)?.focus({ preventScroll: true });
      const vista = ventana.current;
      const centro = hojaCentral.current;
      if (vista && centro && vista.scrollWidth > vista.clientWidth) {
        const distancia = centro.getBoundingClientRect().left - vista.getBoundingClientRect().left;
        vista.scrollLeft += distancia - (vista.clientWidth - centro.clientWidth) / 2;
      }
    } else if (anterior.current) {
      abrir.current?.focus();
    }
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
        <p className="triptico-pista">Desliza hacia los lados para ver las solapas</p>
        <div className="triptico-ventana" ref={ventana}>
          <div className="invitacion-paneles">
            {izquierda}
            <div className="triptico-centro" ref={hojaCentral}>
              <section id="menu" tabIndex={-1} className="triptico-menu" hidden={activo !== "menu"}>
                <h2>Esaú <span>y</span> Blanca</h2>
                <time dateTime={fechaBoda.iso}>{fechaBoda.fecha} · {fechaBoda.hora}</time>
                <nav className="invitacion-indice" aria-label="Apartados de la invitación">
                  {apartados.map(({ id, nombre }) => (
                    <a className="invitacion-tarjeta" key={id} href={`#${id}`}>
                      <span className="invitacion-tarjeta-foto" aria-hidden="true">
                        <Image
                          src={boda.fotosMenu[id].src}
                          alt=""
                          fill
                          sizes="(max-width: 48rem) 30vw, 11rem"
                          style={{ objectPosition: boda.fotosMenu[id].encuadre }}
                        />
                      </span>
                      <span className="invitacion-tarjeta-titulo">{nombre}</span>
                    </a>
                  ))}
                </nav>
              </section>
              <div className="triptico-detalle" hidden={!activo || activo === "menu"}>
                <a className="triptico-volver" href="#menu">Volver al menú</a>
                <div className="triptico-contenido">{children}</div>
              </div>
            </div>
            {derecha}
          </div>
        </div>
      </div>
    </div>
  );
}
