import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FENIX-SGCN",
  description:
    "Plataforma multi-tenant para la gestión de continuidad de negocio (ISO 22301 + complementos).",
  icons: {
    icon: "/icon.png", // favicon
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="bg-gray-50 text-gray-900">{children}</body>
    </html>
  );
}
