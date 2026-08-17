"use client";

import { useState, useEffect } from "react";
import { 
  Sparkles, 
  ArrowRight, 
  ArrowLeft, 
  X, 
  LayoutDashboard, 
  Users, 
  Layers, 
  Settings, 
  FileText, 
  ShieldCheck,
  HelpCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface Step {
  title: string;
  category: string;
  icon: React.ElementType;
  general: string;
  specifics: string[];
}

const tourSteps: Step[] = [
  {
    category: "Visión General",
    title: "Bienvenido a Laser Creation Tacna",
    icon: Sparkles,
    general: "Sistema inteligente de costeo y presupuestos para corte y grabado láser en tiempo real.",
    specifics: [
      "Calcula costos exactos basados en el área milimétrica de corte.",
      "Genera cotizaciones y proformas listas para entregar al cliente en PDF.",
      "Gestiona materiales, complementos y gastos operativos sin pérdidas."
    ]
  },
  {
    category: "Módulo Principal",
    title: "Dashboard y Métricas",
    icon: LayoutDashboard,
    general: "Tu centro de control para supervisar el rendimiento del taller.",
    specifics: [
      "Visualiza el total de proformas generadas y ventas concretadas.",
      "Monitorea el inventario de materiales y costos actualizados de planchas 90×60.",
      "Acceso directo a las acciones más frecuentes del día a día."
    ]
  },
  {
    category: "Gestión de Contactos",
    title: "Directorio de Clientes",
    icon: Users,
    general: "Registro centralizado de clientes particulares y empresas.",
    specifics: [
      "Crea, edita o busca clientes por nombre, teléfono o domicilio.",
      "Asocia clientes directamente a nuevas proformas con un solo clic.",
      "Eliminación en cascada segura para mantener la base de datos limpia."
    ]
  },
  {
    category: "Catálogo de Insumos",
    title: "Materiales y Planchas",
    icon: Layers,
    general: "Administración de planchas (Acrílicos, MDF, Metales, etc.) y cálculo de rendimiento.",
    specifics: [
      "Ingresa el precio de compra, flete y corte de la plancha entera.",
      "El motor calcula automáticamente el 'Costo 90×60' dividiendo la inversión total.",
      "Este costo 90×60 es el núcleo para calcular cualquier producto milimétrico."
    ]
  },
  {
    category: "Motor de Costeo",
    title: "Productos & Piezas Láser",
    icon: Settings,
    general: "Crea piezas personalizadas o plantillas reutilizables.",
    specifics: [
      "Ingresa dimensiones en milímetros (Largo × Ancho) y el material deseado.",
      "Añade complementos (llaveros, pernos, bases) y gastos adicionales (% de desgaste).",
      "El sistema calcula el costo de producción exacto al centavo."
    ]
  },
  {
    category: "Ventas y Cotizaciones",
    title: "Proformas y Exportación PDF",
    icon: FileText,
    general: "Elabora cotizaciones formales con márgenes de ganancia configurables.",
    specifics: [
      "Agrega múltiples productos a una misma cotización.",
      "Ajusta el margen de utilidad comercial deseado.",
      "Descarga o imprime un PDF formal para entregar al cliente al instante."
    ]
  },
  {
    category: "Seguridad y Roles",
    title: "Administración de Usuarios",
    icon: ShieldCheck,
    general: "Gestión jerárquica con permisos estrictos por nivel.",
    specifics: [
      "Super Admin (admin): Capacidad de crear y gestionar tanto Administradores como Usuarios.",
      "Administradores: Pueden registrar y gestionar únicamente Usuarios comunes.",
      "Usuarios: Acceso enfocado en atención, cotizaciones y consulta de catálogo."
    ]
  }
];

export function TutorialTour() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const hasSeenTour = localStorage.getItem("laser_tour_completed");
    if (!hasSeenTour) {
      setIsOpen(true);
    }
  }, []);

  const handleNext = () => {
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleComplete = () => {
    localStorage.setItem("laser_tour_completed", "true");
    setIsOpen(false);
  };

  const handleReopen = () => {
    setCurrentStep(0);
    setIsOpen(true);
  };

  const step = tourSteps[currentStep];
  const IconComponent = step.icon;

  return (
    <>
      {/* Botón flotante para reabrir el tour en cualquier momento */}
      <button
        onClick={handleReopen}
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2.5 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all text-xs font-semibold"
        title="Ver Guía Rápida / Tutorial"
      >
        <HelpCircle className="h-4 w-4" />
        <span>Guía del Sistema</span>
      </button>

      {/* Modal interactivo de Viñetas */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg rounded-2xl border bg-card p-6 shadow-2xl space-y-5 animate-in zoom-in-95 duration-200">
            
            {/* Header del paso */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <IconComponent className="h-5 w-5" />
                </div>
                <div>
                  <span className="text-xs font-semibold tracking-wider text-primary uppercase">
                    {step.category} • Paso {currentStep + 1} de {tourSteps.length}
                  </span>
                  <h3 className="text-lg font-bold text-card-foreground leading-tight">
                    {step.title}
                  </h3>
                </div>
              </div>
              <button 
                onClick={handleComplete}
                className="text-muted-foreground hover:text-foreground p-1 rounded-lg hover:bg-accent transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Contenido General */}
            <div className="p-3.5 rounded-xl bg-muted/50 border text-sm text-foreground leading-relaxed">
              {step.general}
            </div>

            {/* Viñetas Específicas */}
            <div className="space-y-2">
              <span className="text-xs font-semibold text-muted-foreground">Funciones Específicas:</span>
              <ul className="space-y-2">
                {step.specifics.map((spec, index) => (
                  <li key={index} className="flex items-start gap-2 text-xs text-muted-foreground leading-snug">
                    <span className="inline-block h-1.5 w-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                    <span>{spec}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Barra de Progreso */}
            <div className="w-full bg-muted h-1.5 rounded-full overflow-hidden">
              <div 
                className="bg-primary h-full transition-all duration-300 rounded-full"
                style={{ width: `${((currentStep + 1) / tourSteps.length) * 100}%` }}
              />
            </div>

            {/* Botones de Navegación */}
            <div className="flex items-center justify-between pt-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handlePrev}
                disabled={currentStep === 0}
                className="text-xs"
              >
                <ArrowLeft className="h-3.5 w-3.5 mr-1" />
                Anterior
              </Button>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleComplete}
                  className="text-xs"
                >
                  Saltar
                </Button>
                <Button
                  size="sm"
                  onClick={handleNext}
                  className="text-xs"
                >
                  {currentStep === tourSteps.length - 1 ? "Comenzar" : "Siguiente"}
                  <ArrowRight className="h-3.5 w-3.5 ml-1" />
                </Button>
              </div>
            </div>

          </div>
        </div>
      )}
    </>
  );
}
