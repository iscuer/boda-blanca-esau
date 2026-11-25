type Hotel = { nombre: string; zona: string; url: string };
type Foto = { src: string; alt: string };

export const boda = {
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
