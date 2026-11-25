import Image from "next/image";
import RsvpForm from "@/components/RsvpForm";
import { boda, fechaBoda } from "./boda";
import panorama from "@/public/invitacion/panorama.webp";
import colegial from "@/public/invitacion/colegial.webp";

export default function Home() {
  return (
    <main id="inicio">
      <div className="invitacion">
        <header className="invitacion-portada">
          <p className="invitacion-lema">Nos casamos</p>
          <div className="invitacion-adorno" aria-hidden="true">✦</div>
          <h1>Esaú García Villalba <span>y</span> Blanca González Romo</h1>
          <Image src={panorama} alt="" preload sizes="(max-width: 72rem) 95vw, 70rem" />
        </header>
        <nav className="invitacion-indice" aria-label="Secciones de la invitación">
          <a href="#enlace">El enlace</a>
          <a href="#mensajes">Mensajes</a>
          <a href="#fotos">Fotos</a>
          <a href="#hoteles">Hoteles</a>
          <a href="#regalo">Regalo</a>
          <a href="#confirmacion">Asistencia</a>
        </nav>
        <div className="invitacion-paneles">
          <section className="invitacion-panel invitacion-historia" aria-labelledby="titulo-historia">
            <h2 id="titulo-historia">Nuestra historia</h2>
            <Image src={colegial} alt="" sizes="(max-width: 48rem) 80vw, 22rem" />
            <p>Entre la brisa de Cádiz, el azahar de Sevilla y la solera de Talavera, hemos decidido unir nuestros caminos.</p>
            <div className="invitacion-enlaces">
              <a href="#mensajes">Leer nuestros mensajes</a>
              <a href="#fotos">Ver el álbum</a>
            </div>
          </section>
          <section id="enlace" className="invitacion-panel invitacion-enlace" aria-labelledby="titulo-enlace">
            <h2 id="titulo-enlace">El enlace</h2>
            <p>Tenemos el placer de invitarte a celebrar nuestro enlace.</p>
            <time dateTime={fechaBoda.iso}>
              <strong>{fechaBoda.fecha}</strong>
              <span>{fechaBoda.hora}</span>
            </time>
            <div className="invitacion-adorno" aria-hidden="true">✦</div>
            <p><strong>Iglesia Santa María la Mayor</strong><br />(La Colegial)<br />Talavera de la Reina</p>
            <p>Después celebraremos el banquete en <strong>Finca La Hacienda</strong>.</p>
            <div className="invitacion-enlaces">
              <a href="#hoteles">Dónde alojarse</a>
            </div>
          </section>
          <section className="invitacion-panel invitacion-asistencia" aria-labelledby="titulo-asistencia">
            <h2 id="titulo-asistencia">Confirma tu asistencia</h2>
            <div className="invitacion-adorno" aria-hidden="true">✦</div>
            <p>El comienzo de nuestra historia más bonita juntos.</p>
            <a className="invitacion-boton" href="#confirmacion">Confirmar asistencia</a>
            <div className="invitacion-enlaces">
              <a href="#regalo">Regalo de boda</a>
            </div>
          </section>
        </div>
      </div>
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
        <a href="#inicio" className="mr-5 underline underline-offset-4">Volver a la invitación</a>
        <a href="/novios" className="underline underline-offset-4">Zona privada</a>
      </footer>
    </main>
  );
}
