"use client";

import Link from "next/link";
import { useState } from "react";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm fixed top-0 left-0 w-full z-50">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-sky-700">
          FENIX SGCN
        </Link>

        {/* Desktop links */}
        <nav className="hidden md:flex items-center space-x-6 text-sm">
          <a href="#features" className="hover:text-sky-600">Funcionalidades</a>
          <a href="#metrics" className="hover:text-sky-600">Métricas</a>
          <a href="#benefits" className="hover:text-sky-600">Beneficios</a>
          <a href="#pricing" className="hover:text-sky-600">Planes</a>
          <a href="#cta" className="hover:text-sky-600">Contacto</a>
        </nav>

        {/* Right actions */}
        <div className="hidden md:flex items-center space-x-3">
          <Link href="/auth/signin" className="text-sm">Iniciar sesión</Link>
          <Link
            href="/auth/signup"
            className="bg-sky-600 text-white px-4 py-2 rounded-md text-sm"
          >
            Crear cuenta
          </Link>
        </div>

        {/* Mobile button */}
        <button
          className="md:hidden p-2 rounded-md focus:outline-none"
          aria-label="Abrir menú"
          onClick={() => setOpen((s) => !s)}
        >
          {/* simple hamburger */}
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden
          >
            <path
              d="M4 6h16M4 12h16M4 18h16"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      <div className={`md:hidden ${open ? "block" : "hidden"} bg-white border-t`}>
        <div className="px-6 py-4 space-y-3">
          <a href="#features" className="block">Funcionalidades</a>
          <a href="#metrics" className="block">Métricas</a>
          <a href="#benefits" className="block">Beneficios</a>
          <a href="#pricing" className="block">Planes</a>
          <a href="#cta" className="block">Contacto</a>
          <div className="pt-2 border-t mt-2">
            <Link href="/auth/signin" className="block py-2">Iniciar sesión</Link>
            <Link href="/auth/signup" className="block py-2 font-semibold">Crear cuenta</Link>
          </div>
        </div>
      </div>
    </header>
  );
}
