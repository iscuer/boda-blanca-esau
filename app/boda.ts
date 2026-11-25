type Hotel = { nombre: string; zona: string; url: string };
type Foto = { src: string; alt: string };

export const fechaBoda = {
  iso: "2027-06-19T13:00:00+02:00",
  fecha: "19 de junio de 2027",
  hora: "12:30 h",
};

export const boda = {
  fotosMenu: {
    enlace: { src: "/invitacion/menu/enlace.webp", encuadre: "50% 25%" },
    mensajes: { src: "/invitacion/menu/mensajes.webp", encuadre: "50% 58%" },
    fotos: { src: "/invitacion/menu/fotos.webp", encuadre: "50% 45%" },
    hoteles: { src: "/invitacion/menu/hoteles.webp", encuadre: "50% 55%" },
    regalo: { src: "/invitacion/menu/regalo.webp", encuadre: "50% 58%" },
    confirmacion: { src: "/invitacion/menu/confirmacion.webp", encuadre: "50% 54%" },
  },
  hoteles: [] as Hotel[],
  regalo: { texto: "", enlace: "" },
  mensajes: [
    { autor: "Blanca", texto: "" },
    { autor: "Esaú", texto: "" },
  ],
  fotos: [
    { src: "", alt: "" },
    { src: "", alt: "" },
    { src: "", alt: "" },
  ] satisfies Foto[],
};
