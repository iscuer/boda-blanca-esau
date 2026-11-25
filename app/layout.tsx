import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Blanca y Esaú | 19 de junio de 2026",
  description: "Invitación a la boda de Blanca y Esaú.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="es"><body>{children}</body></html>;
}
