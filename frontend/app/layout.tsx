import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FENIX-SGCN",
  description: "Sistema de Gestión de la Continuidad del Negocio"
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className="bg-gray-100 text-gray-900">
        <div className="min-h-screen flex flex-col">
          <header className="bg-blue-900 text-white p-4 shadow">
            <h1 className="text-lg font-bold">FENIX-SGCN</h1>
          </header>
          <main className="flex-1 p-6">{children}</main>
          <footer className="bg-gray-200 text-center p-3 text-sm">
            © 2025 FENIX-SGCN. Todos los derechos reservados.
          </footer>
        </div>
      </body>
    </html>
  );
}
