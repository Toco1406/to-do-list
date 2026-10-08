import test from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import app from '../src/app.js';

test('GET /api/health retourne 200 et le statut ok', async () => {
  const response = await request(app).get('/api/health');

  assert.equal(response.status, 200);
  assert.deepEqual(response.body, { status: 'ok' });
});

test('GET /api-docs sert la documentation Swagger', async () => {
  const response = await request(app).get('/api-docs/').redirects(1);

  assert.equal(response.status, 200);
  assert.match(response.text, /swagger-ui/i);
});

test('GET /api/tasks sans cookie retourne 401 (comme documenté dans Swagger)', async () => {
  const response = await request(app).get('/api/tasks');

  assert.equal(response.status, 401);
  assert.deepEqual(response.body, { message: 'Authentication required' });
});

test('La spec Swagger documente toutes les routes de tâches et d\'auth', async () => {
  const { swaggerSpec } = await import('../src/docs/swagger.js');
  const documented = Object.entries(swaggerSpec.paths).flatMap(([path, methods]) =>
    Object.keys(methods).map((method) => `${method.toUpperCase()} ${path}`)
  );

  for (const route of [
    'GET /api/health',
    'POST /api/auth/register',
    'POST /api/auth/login',
    'POST /api/auth/logout',
    'GET /api/auth/me',
    'GET /api/tasks',
    'GET /api/tasks/my',
    'POST /api/tasks',
    'GET /api/tasks/{id}',
    'PATCH /api/tasks/{id}',
    'DELETE /api/tasks/{id}',
  ]) {
    assert.ok(documented.includes(route), `route non documentée : ${route}`);
  }
});