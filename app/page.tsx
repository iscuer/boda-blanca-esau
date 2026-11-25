import Image from "next/image";
import RsvpForm from "@/components/RsvpForm";
import { boda } from "./boda";

export default function Home() {
  return (
    <main>
      <nav className="boda-nav" aria-label="Secciones de la boda">
        <a href="#mensajes">Mensajes</a>
        <a href="#fotos">Fotos</a>
        <a href="#hoteles">Hoteles</a>
        <a href="#regalo">Regalo</a>
        <a href="#confirmacion">Asistencia</a>
      </nav>
      <header className="invite">
        <p>Invitación de boda</p>
        <h1>Blanca y Esaú</h1>
        <time dateTime="2026-06-19">19 de junio de 2026</time>
        <a href="#confirmacion">Confirmar asistencia</a>
      </header>
      <section id="mensajes" className="boda-section" aria-labelledby="titulo-mensajes">
        <h2 id="titulo-mensajes">Unas palabras nuestras</h2>
        <div className="mensajes-grid">
          {boda.mensajes.map(({ autor, texto }) => (
            <article key={autor}>
              <h3>{autor}</h3>
              <p>{texto || "Mensaje pendiente."}</p>
            </article>
          ))}
        </div>
      </section>
      <section id="fotos" className="boda-section" aria-labelledby="titulo-fotos">
        <h2 id="titulo-fotos">Nuestro álbum</h2>
        <div className="fotos-grid">
          {boda.fotos.map(({ src, alt }, index) => (
            <figure key={src || index} className="foto">
              {src ? (
                <Image src={src} alt={alt} fill sizes="(max-width: 600px) 90vw, 30vw" />
              ) : (
                <span>Foto pendiente</span>
              )}
            </figure>
          ))}
        </div>
      </section>
      <section id="hoteles" className="boda-section" aria-labelledby="titulo-hoteles">
        <h2 id="titulo-hoteles">Dónde alojarse</h2>
        {boda.hoteles.length ? (
          <ul className="hoteles-lista">
            {boda.hoteles.map(({ nombre, zona, url }) => (
              <li key={url}>
                <a href={url}>{nombre}</a>
                <p>{zona}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p>Las recomendaciones de alojamiento están pendientes.</p>
        )}
      </section>
      <section id="regalo" className="boda-section regalo" aria-labelledby="titulo-regalo">
        <h2 id="titulo-regalo">Regalo de boda</h2>
        <p>{boda.regalo.texto || "El detalle del regalo está pendiente."}</p>
        {boda.regalo.enlace && <a href={boda.regalo.enlace}>Ver información del regalo</a>}
      </section>
      <section id="confirmacion" className="mx-auto max-w-xl px-6 py-20">
        <h2 className="text-center font-serif text-5xl">¿Nos acompañas?</h2>
        <RsvpForm />
      </section>
      <footer className="px-6 py-8 text-center text-sm">
        <a href="/novios" className="underline underline-offset-4">Zona privada</a>
      </footer>
    </main>
  );
}
