type Hotel = { nombre: string; zona: string; url: string };
type Foto = { src: string; alt: string };

export const fechaBoda = {
  iso: "2027-06-19T13:00:00+02:00",
  fecha: "19 de junio de 2027",
  hora: "13:00 h",
};

export const boda = {
  fotosMenu: {
    enlace: "",
    mensajes: "",
    fotos: "",
    hoteles: "",
    regalo: "",
    confirmacion: "",
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
