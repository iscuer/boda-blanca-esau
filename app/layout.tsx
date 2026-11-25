import type { Metadata } from "next";
import { fechaBoda } from "./boda";
import "./globals.css";

export const metadata: Metadata = {
  title: `Blanca y Esaú | ${fechaBoda.fecha}`,
  description: "Invitación a la boda de Blanca y Esaú.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="es"><body>{children}</body></html>;
}
