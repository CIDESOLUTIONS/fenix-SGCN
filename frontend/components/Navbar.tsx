"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import SettingsMenu from "./settings/SettingsMenu";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm fixed top-0 left-0 w-full z-50 border-b border-gray-100 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <Image 
            src="/fenix-logo.png" 
            alt="Fenix-SGCN" 
            width={50} 
            height={50}
            className="w-12 h-12"
          />
          <div>
            <div className="text-lg font-bold text-indigo-600 dark:text-indigo-400">Fenix-SGCN</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">by CIDE SAS</div>
          </div>
        </Link>

        {/* Desktop navigation */}
        <nav className="hidden md:flex items-center space-x-8 text-sm font-medium">
          <a href="#caracteristicas" className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition">Características</a>
          <a href="#modulos" className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition">Módulos</a>
          <a href="#planes" className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition">Planes</a>
          <a href="#demo" className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition">Demo</a>
        </nav>

        {/* Right actions */}
        <div className="hidden md:flex items-center space-x-4">
          <SettingsMenu />
          <Link 
            href="/auth/login" 
            className="px-5 py-2 text-indigo-600 dark:text-indigo-400 border-2 border-indigo-600 dark:border-indigo-400 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition font-medium"
          >
            Iniciar Sesión
          </Link>
          <Link
            href="/auth/register"
            className="px-5 py-2 bg-gradient-to-r from-indigo-600 to-emerald-500 text-white rounded-lg shadow-lg hover:shadow-xl transition transform hover:-translate-y-0.5 font-medium"
          >
            Prueba Gratuita
          </Link>
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden p-2 rounded-md text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 focus:outline-none"
          aria-label="Abrir menú"
          onClick={() => setOpen((s) => !s)}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      <div className={`md:hidden ${open ? "block" : "hidden"} bg-white dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700`}>
        <div className="px-6 py-4 space-y-3">
          <a href="#caracteristicas" className="block py-2 text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400">Características</a>
          <a href="#modulos" className="block py-2 text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400">Módulos</a>
          <a href="#planes" className="block py-2 text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400">Planes</a>
          <a href="#demo" className="block py-2 text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400">Demo</a>
          <div className="pt-4 border-t mt-2 space-y-3">
            <div className="flex justify-center">
              <SettingsMenu />
            </div>
            <Link href="/auth/login" className="block py-2 text-indigo-600 dark:text-indigo-400 font-medium">Iniciar Sesión</Link>
            <Link href="/auth/register" className="block py-2 px-4 bg-gradient-to-r from-indigo-600 to-emerald-500 text-white rounded-lg text-center font-medium">
              Prueba Gratuita
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
