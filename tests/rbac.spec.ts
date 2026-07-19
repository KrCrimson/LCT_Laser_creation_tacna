import { test, expect } from '@playwright/test';

test.describe('Role Based Access Control (RBAC)', () => {
  test('Redirects unauthenticated users to login', async ({ page }) => {
    // Si un usuario no logueado intenta ir a /materiales
    await page.goto('/materiales');
    
    // Debería ser redirigido al login
    await expect(page).toHaveURL(/.*\/login/);
  });

  // Nota: Para probar el login real se requiere crear un entorno de pruebas de DB (e.g. SQLite en memoria).
  // Aquí dejamos la base preparada para el futuro testing de usuarios nivel 1 vs nivel 2.
});
