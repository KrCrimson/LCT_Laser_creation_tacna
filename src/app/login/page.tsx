import { Metadata } from "next";
import { LoginForm } from "./login-form";
import { Layers } from "lucide-react";

export const metadata: Metadata = {
  title: "Login - Laser Creation Tacna",
  description: "Iniciar sesión en el sistema",
};

export default function LoginPage() {
  return (
    <div className="container relative min-h-screen flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      {/* Lado izquierdo (branding) */}
      <div className="relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex">
        <div className="absolute inset-0 bg-zinc-900" />
        <div className="relative z-20 flex items-center text-lg font-medium">
          <Layers className="mr-2 h-6 w-6" />
          Laser Creation Tacna
        </div>
        <div className="relative z-20 mt-auto">
          <blockquote className="space-y-2">
            <p className="text-lg">
              &ldquo;El motor de costeo y gestión de proformas para servicios de corte y grabado láser.
              Eficiencia, control de material y precisión en cada trabajo.&rdquo;
            </p>
          </blockquote>
        </div>
      </div>
      
      {/* Lado derecho (formulario) */}
      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              Bienvenido de nuevo
            </h1>
            <p className="text-sm text-muted-foreground">
              Ingresa tus credenciales para acceder al sistema
            </p>
          </div>
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
