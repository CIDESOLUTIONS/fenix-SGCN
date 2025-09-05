"use client";
import React, { useState } from "react";
import Layout from "../../../components/Layout";
import Input from "../../../components/ui/Input";
import Button from "../../../components/ui/Button";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [tenant, setTenant] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, tenantName: tenant })
      });
      if (!res.ok) throw new Error("Error al registrar");
      window.location.href = "/dashboard";
    } catch (err: any) {
      alert(err.message ?? "Error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Layout>
      <div className="max-w-md mx-auto bg-white p-6 rounded-md shadow">
        <h2 className="text-2xl font-semibold mb-4">Registro</h2>
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="block text-sm mb-1">Nombre organización (tenant)</label>
            <Input value={tenant} onChange={(e) => setTenant(e.target.value)} required />
          </div>
          <div>
            <label className="block text-sm mb-1">Correo</label>
            <Input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required />
          </div>
          <div>
            <label className="block text-sm mb-1">Contraseña</label>
            <Input value={password} onChange={(e) => setPassword(e.target.value)} type="password" required />
          </div>
          <Button type="submit" disabled={loading}>{loading ? "Registrando..." : "Crear cuenta"}</Button>
        </form>
      </div>
    </Layout>
  );
}
