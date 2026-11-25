export type Confirmation = {
  grupo_id: string;
  tipo: "invitado" | "acompañante";
  nombre: string;
  asiste: boolean;
  alergias: string | null;
  necesita_bus: boolean;
  observaciones: string | null;
};
