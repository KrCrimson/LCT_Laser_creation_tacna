import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { HelpCircle, Info } from "lucide-react";

export default function AyudaPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Manual de Usuario (Ayuda)</h2>
      </div>

      <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HelpCircle className="h-5 w-5" />
                Guía Interactiva
              </CardTitle>
              <CardDescription>
                Despliega los temas a continuación para entender cómo usar cada módulo del sistema de Laser Creation Tacna.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion className="w-full">
                <AccordionItem value="dashboard">
                  <AccordionTrigger>Dashboard (Panel Principal)</AccordionTrigger>
                  <AccordionContent>
                    El Dashboard te ofrece una vista resumida y rápida del negocio. 
                    Aquí podrás ver métricas importantes como las ventas recientes, cantidad de clientes y proformas activas.
                    Solo los administradores pueden ver métricas financieras confidenciales.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="clientes">
                  <AccordionTrigger>Gestión de Clientes</AccordionTrigger>
                  <AccordionContent>
                    En el módulo de Clientes, puedes guardar la información de contacto y el historial de compras de las personas o empresas que te compran.
                    <br/><br/>
                    <strong>Tip:</strong> Mantener esta base de datos actualizada te permitirá enviarles promociones y cotizaciones más rápidas en el futuro.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="productos">
                  <AccordionTrigger>Productos y Cálculo de Corte Láser (SVG)</AccordionTrigger>
                  <AccordionContent>
                    Este es el corazón del sistema. Al subir un archivo vectorial (SVG), el sistema extraerá automáticamente el <strong>tiempo de corte</strong> y las <strong>dimensiones</strong>.
                    <br/><br/>
                    Al crear un producto, podrás asignarle materiales (MDF, Acrílico, etc.) y calcular automáticamente su costo final basado en tu margen de ganancia.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="proformas">
                  <AccordionTrigger>Proformas y Reportes PDF</AccordionTrigger>
                  <AccordionContent>
                    Cuando tengas un cliente y un producto listo, puedes generar una <strong>Proforma (Cotización)</strong>.
                    <br/><br/>
                    En esta sección podrás exportar un documento PDF con aspecto profesional que incluye tu logo, los datos del cliente, los productos cotizados y el total a pagar, listo para enviarse por WhatsApp o Correo.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="materiales">
                  <AccordionTrigger>Materiales y Gastos (Solo Admin)</AccordionTrigger>
                  <AccordionContent>
                    Como administrador, puedes definir cuánto cuesta el minuto de láser, el precio de la plancha de MDF, acrílico, y otros gastos adicionales (pintura, empaquetado, horas de diseño).
                    Esto asegura que los empleados no puedan modificar precios base ni márgenes, y solo coticen con lo que tú hayas configurado.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className="bg-primary/5 border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-primary">
                <Info className="h-5 w-5" />
                Información del Sistema
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <p>
                Este sistema ha sido diseñado con estándares profesionales de <strong>DevSecOps</strong> y <strong>Arquitectura Limpia</strong> para garantizar la seguridad y rapidez de tu negocio.
              </p>
              <ul className="list-disc pl-4 space-y-2">
                <li>Roles y Permisos integrados (RBAC)</li>
                <li>Monitoreo de errores en tiempo real</li>
                <li>Cálculo vectorial (SVG) automatizado</li>
                <li>Exportación nativa de PDFs comerciales</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
