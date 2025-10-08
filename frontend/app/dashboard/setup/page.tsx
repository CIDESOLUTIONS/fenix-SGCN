"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, Circle } from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost';

export default function OnboardingSetupPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Step 1: Profile
  const [profileData, setProfileData] = useState({
    industry: "",
    companySize: "",
    country: "Colombia"
  });

  // Step 2: Initial Processes
  const [processes, setProcesses] = useState<string[]>([]);
  const [newProcess, setNewProcess] = useState("");

  // Step 3: Team Members
  const [teamMembers, setTeamMembers] = useState<Array<{ email: string; role: string }>>([]);
  const [newMember, setNewMember] = useState({ email: "", role: "USER" });

  const steps = [
    { id: 1, name: "Perfil", icon: "👤" },
    { id: 2, name: "Procesos", icon: "📋" },
    { id: 3, name: "Equipo", icon: "👥" },
    { id: 4, name: "Listo", icon: "✅" }
  ];

  const handleSkip = () => {
    router.push("/dashboard");
  };

  const handleNext = async () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    } else {
      // Final step - complete onboarding
      await completeOnboarding();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const addProcess = () => {
    if (newProcess.trim()) {
      setProcesses([...processes, newProcess.trim()]);
      setNewProcess("");
    }
  };

  const removeProcess = (index: number) => {
    setProcesses(processes.filter((_, i) => i !== index));
  };

  const addTeamMember = () => {
    if (newMember.email.trim()) {
      setTeamMembers([...teamMembers, { ...newMember }]);
      setNewMember({ email: "", role: "USER" });
    }
  };

  const removeTeamMember = (index: number) => {
    setTeamMembers(teamMembers.filter((_, i) => i !== index));
  };

  const completeOnboarding = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      
      // Save profile data
      await fetch(`${API_URL}/api/tenants/profile`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(profileData)
      });

      // Create initial processes
      if (processes.length > 0) {
        await fetch(`${API_URL}/api/business-processes/bulk`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify({ 
            processes: processes.map(name => ({ name, description: `Proceso: ${name}` }))
          })
        });
      }

      // Invite team members
      if (teamMembers.length > 0) {
        await fetch(`${API_URL}/api/users/invite-bulk`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify({ members: teamMembers })
        });
      }

      router.push("/dashboard?onboarding=completed");
    } catch (error) {
      console.error("Error completing onboarding:", error);
      alert("Error al guardar la configuración. Puedes completarlo después.");
      router.push("/dashboard");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-8">
          <h1 className="text-3xl font-bold mb-2">¡Bienvenido a Fenix-SGCN!</h1>
          <p className="text-indigo-100">Configuremos tu cuenta en 4 pasos rápidos</p>
        </div>

        {/* Progress Bar */}
        <div className="px-8 py-6 border-b dark:border-gray-700">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center flex-1">
                <div className="flex flex-col items-center">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl ${
                    currentStep >= step.id
                      ? "bg-indigo-600 text-white"
                      : "bg-gray-200 dark:bg-gray-700 text-gray-500"
                  }`}>
                    {step.icon}
                  </div>
                  <span className={`mt-2 text-sm font-medium ${
                    currentStep >= step.id ? "text-indigo-600 dark:text-indigo-400" : "text-gray-500"
                  }`}>
                    {step.name}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div className={`flex-1 h-1 mx-4 ${
                    currentStep > step.id ? "bg-indigo-600" : "bg-gray-200 dark:bg-gray-700"
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-8">
          {/* Step 1: Profile */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Perfil de la Empresa</h2>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Industria
                </label>
                <select
                  value={profileData.industry}
                  onChange={(e) => setProfileData({ ...profileData, industry: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="">Selecciona...</option>
                  <option value="Financiero">Financiero</option>
                  <option value="Salud">Salud</option>
                  <option value="Tecnología">Tecnología</option>
                  <option value="Manufactura">Manufactura</option>
                  <option value="Retail">Retail</option>
                  <option value="Gobierno">Gobierno</option>
                  <option value="Otro">Otro</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Tamaño de la Empresa
                </label>
                <select
                  value={profileData.companySize}
                  onChange={(e) => setProfileData({ ...profileData, companySize: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="">Selecciona...</option>
                  <option value="1-10">1-10 empleados</option>
                  <option value="11-50">11-50 empleados</option>
                  <option value="51-200">51-200 empleados</option>
                  <option value="201-500">201-500 empleados</option>
                  <option value="500+">500+ empleados</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  País
                </label>
                <input
                  type="text"
                  value={profileData.country}
                  onChange={(e) => setProfileData({ ...profileData, country: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>
          )}

          {/* Step 2: Processes */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Procesos Iniciales</h2>
              <p className="text-gray-600 dark:text-gray-400">Agrega algunos procesos críticos de tu empresa (opcional)</p>
              
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newProcess}
                  onChange={(e) => setNewProcess(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addProcess())}
                  placeholder="Ej: Nómina, Ventas Online, Soporte TI..."
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                />
                <button
                  onClick={addProcess}
                  className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                >
                  Agregar
                </button>
              </div>

              {processes.length > 0 && (
                <div className="space-y-2">
                  {processes.map((process, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <span className="text-gray-900 dark:text-white">{process}</span>
                      <button
                        onClick={() => removeProcess(index)}
                        className="text-red-600 hover:text-red-800"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Step 3: Team */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Invitar Equipo</h2>
              <p className="text-gray-600 dark:text-gray-400">Invita colaboradores (opcional)</p>
              
              <div className="flex gap-2">
                <input
                  type="email"
                  value={newMember.email}
                  onChange={(e) => setNewMember({ ...newMember, email: e.target.value })}
                  placeholder="email@empresa.com"
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                />
                <select
                  value={newMember.role}
                  onChange={(e) => setNewMember({ ...newMember, role: e.target.value })}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="USER">Usuario</option>
                  <option value="MANAGER">Manager</option>
                  <option value="AUDITOR">Auditor</option>
                </select>
                <button
                  onClick={addTeamMember}
                  className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                >
                  Invitar
                </button>
              </div>

              {teamMembers.length > 0 && (
                <div className="space-y-2">
                  {teamMembers.map((member, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div>
                        <span className="text-gray-900 dark:text-white">{member.email}</span>
                        <span className="ml-3 text-sm text-gray-500">({member.role})</span>
                      </div>
                      <button
                        onClick={() => removeTeamMember(index)}
                        className="text-red-600 hover:text-red-800"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Step 4: Ready */}
          {currentStep === 4 && (
            <div className="text-center space-y-6">
              <div className="text-6xl">🎉</div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">¡Todo Listo!</h2>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                Tu cuenta está configurada. Comienza a construir tu SGCN ahora.
              </p>
              <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto mt-8">
                <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
                  <div className="text-3xl mb-2">📊</div>
                  <p className="text-sm font-medium">Dashboard</p>
                </div>
                <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <div className="text-3xl mb-2">📋</div>
                  <p className="text-sm font-medium">BIA</p>
                </div>
                <div className="p-4 bg-pink-50 dark:bg-pink-900/20 rounded-lg">
                  <div className="text-3xl mb-2">🛡️</div>
                  <p className="text-sm font-medium">Riesgos</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-8 py-6 bg-gray-50 dark:bg-gray-900 border-t dark:border-gray-700 flex justify-between">
          <button
            onClick={handleSkip}
            className="px-6 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition"
          >
            Saltar configuración
          </button>
          
          <div className="flex gap-3">
            {currentStep > 1 && currentStep < 4 && (
              <button
                onClick={handleBack}
                className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition"
              >
                Atrás
              </button>
            )}
            
            <button
              onClick={handleNext}
              disabled={loading}
              className="px-8 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition disabled:opacity-50"
            >
              {loading ? "Guardando..." : currentStep === 4 ? "Ir al Dashboard" : "Siguiente"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
