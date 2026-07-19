# Laser Creation Tacna - Reglas del Espacio de Trabajo (Workspace Rules)

Este archivo define las reglas estrictas de desarrollo y arquitectura que TODOS los agentes de inteligencia artificial deben seguir al trabajar en este proyecto.

## Reglas de Oro (DevSecOps)
1. **Calidad y Prevención:** El usuario exige estándares de alta calidad. Nunca asumas que las implementaciones "rápidas y sucias" (quick and dirty) son aceptables, a menos que se especifique expresamente.
2. **Husky y Pre-commits:** Las pruebas (`npm run test`) SIEMPRE deben correr de manera automatizada antes de realizar un `git commit`. No deshabilites ni evadas los hooks de Husky.
3. **CI/CD:** Todos los Pull Requests hacia `main` deben ser evaluados por las GitHub Actions configuradas en `.github/workflows/ci.yml`. No uses `git push origin main` con la bandera `--force` ignorando el CI.
4. **Dependabot:** El proyecto utiliza Dependabot para asegurar las vulnerabilidades de la cadena de suministro. 
5. **Monitoreo:** El proyecto utiliza Sentry para capturar excepciones en producción. Cualquier función crítica nueva (como APIs, integraciones de pago, o generación de PDFs) debe manejar los errores (try/catch) y registrarlos adecuadamente.

## Reglas de Arquitectura
- El proyecto utiliza Next.js 15+ (App Router).
- Se utiliza Prisma como ORM para base de datos PostgreSQL.
- Se utiliza shadcn/ui y Tailwind CSS para los estilos.
- El Control de Acceso Basado en Roles (RBAC) es crítico. Nunca expongas datos financieros, de costos o formularios administrativos a usuarios de nivel 1.

*Firma: Configurado por Antigravity a petición del Arquitecto del Sistema.*
