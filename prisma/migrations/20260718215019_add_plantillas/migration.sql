-- AlterTable
ALTER TABLE "productos" ADD COLUMN     "categoria_plantilla" TEXT,
ADD COLUMN     "es_plantilla" BOOLEAN NOT NULL DEFAULT false;
