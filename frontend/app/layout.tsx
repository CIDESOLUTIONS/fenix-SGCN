import "./globals.css";
import type { Metadata } from "next";
import { PreferencesProvider } from "../contexts/PreferencesContext";

export const metadata: Metadata = {
  title: "FENIX-SGCN",
  description:
    "Plataforma multi-tenant para la gestión de continuidad de negocio (ISO 22301 + complementos).",
  icons: {
    icon: "/icon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
        <PreferencesProvider>
          {children}
        </PreferencesProvider>
      </body>
    </html>
  );
}
