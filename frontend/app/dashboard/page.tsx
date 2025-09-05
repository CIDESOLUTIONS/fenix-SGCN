import React from "react";
import Layout from "../components/Layout";

export default function DashboardPage() {
  // En próximas iteraciones inyectaremos auth check y fetch de tenant
  return (
    <Layout>
      <h1 className="text-2xl font-semibold mb-4">Dashboard</h1>
      <p>Bienvenido. Aquí estará la vista principal con indicadores, accesos rápidos y estado del sistema.</p>
    </Layout>
  );
}
