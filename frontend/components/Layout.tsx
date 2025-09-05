import React from "react";
import Link from "next/link";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white shadow-sm">
        <div className="container flex items-center justify-between h-16">
          <Link href="/" className="font-bold text-primary">FENIX SGCN</Link>
          <nav className="space-x-4">
            <Link href="/auth/login" className="text-sm text-muted">Login</Link>
            <Link href="/auth/register" className="text-sm text-muted">Register</Link>
          </nav>
        </div>
      </header>
      <main className="flex-1 container py-8">{children}</main>
      <footer className="bg-white border-t py-6">
        <div className="container text-sm text-muted">© {new Date().getFullYear()} FENIX SGCN</div>
      </footer>
    </div>
  );
}
