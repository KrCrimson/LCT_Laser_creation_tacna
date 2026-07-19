import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { formatCurrency, formatDate } from "./utils";

export interface PDFData {
  descripcion: string;
  largo: number;
  ancho: number;
  materialNombre: string;
  costoMaterial: number;
}

export function generarProformaPDF(data: PDFData) {
  // Inicializamos un documento tamaño A4
  const doc = new jsPDF();

  // Color principal corporativo (Laser Creation - Asumiendo un tono rojo oscuro/borgoña)
  const colorPrimario: [number, number, number] = [180, 20, 20];
  const colorGris: [number, number, number] = [100, 100, 100];

  // ================= TÍTULO Y HEADER =================
  doc.setFontSize(22);
  doc.setTextColor(...colorPrimario);
  doc.setFont("helvetica", "bold");
  doc.text("LASER CREATION TACNA", 14, 25);

  doc.setFontSize(12);
  doc.setTextColor(...colorGris);
  doc.setFont("helvetica", "normal");
  doc.text("Reporte de Cotización / Proforma", 14, 32);
  doc.text(`Fecha de Emisión: ${formatDate(new Date())}`, 14, 38);

  // Línea separadora
  doc.setDrawColor(...colorPrimario);
  doc.setLineWidth(0.5);
  doc.line(14, 45, 196, 45);

  // ================= TABLA DE DATOS =================
  autoTable(doc, {
    startY: 55,
    head: [["Propiedad", "Detalle"]],
    body: [
      ["Producto / Descripción", data.descripcion || "Sin descripción"],
      ["Dimensiones", `${data.largo} mm x ${data.ancho} mm`],
      ["Material Base", data.materialNombre || "No especificado"],
      ["Costo del Material", formatCurrency(data.costoMaterial)],
    ],
    headStyles: {
      fillColor: colorPrimario,
      textColor: 255,
      fontStyle: "bold",
    },
    styles: {
      fontSize: 11,
      cellPadding: 5,
    },
    alternateRowStyles: {
      fillColor: [245, 245, 245],
    },
    theme: "striped",
  });

  // ================= FOOTER =================
  const finalY = (doc as any).lastAutoTable.finalY || 100;
  
  doc.setFontSize(10);
  doc.setTextColor(...colorGris);
  doc.text("Este documento es de uso interno o referencial.", 14, finalY + 15);
  doc.text("Generado automáticamente por el Sistema LCT.", 14, finalY + 20);

  // Guardar/Descargar el PDF
  doc.save(`Proforma_${data.descripcion || "Producto"}_${Date.now()}.pdf`);
}
