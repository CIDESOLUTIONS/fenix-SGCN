import type { Metadata } from "next";
import "./globals.css"; // Crearemos este archivo a continuación

export const metadata: Metadata = {
  title: "Fénix SGCN",
  description: "Plataforma de Gestión de Continuidad de Negocio",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
