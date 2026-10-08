import test from 'node:test';
import assert from 'node:assert/strict';
import jwt from 'jsonwebtoken';
import request from 'supertest';
import app from '../src/app.js';

const taskId = '507f1f77bcf86cd799439011';

function authenticatedCookie() {
  const token = jwt.sign(
    {
      userId: '507f1f77bcf86cd799439012',
      email: 'test@example.com',
    },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );

  return `access_token=${token}`;
}

test('GET / retourne le statut de l’API', async () => {
  const response = await request(app).get('/');

  assert.equal(response.status, 200);
  assert.deepEqual(response.body, { status: 'API - Cours Dev Full stack' });
});

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

test('POST /api/auth/register refuse les identifiants incomplets', async () => {
  const response = await request(app)
    .post('/api/auth/register')
    .send({ email: 'test@example.com' });

  assert.equal(response.status, 400);
  assert.deepEqual(response.body, {
    message: 'Email and password are required',
  });
});

test('POST /api/auth/logout supprime le cookie d’authentification', async () => {
  const response = await request(app).post('/api/auth/logout');

  assert.equal(response.status, 200);
  assert.deepEqual(response.body, { message: 'Logout successful' });
  assert.ok(
    response.headers['set-cookie']?.some((cookie) =>
      cookie.startsWith('access_token=;')
    )
  );
});

test('GET /api/auth/me refuse un cookie absent ou invalide', async () => {
  const withoutCookie = await request(app).get('/api/auth/me');
  const withInvalidCookie = await request(app)
    .get('/api/auth/me')
    .set('Cookie', 'access_token=not-a-jwt');

  assert.equal(withoutCookie.status, 401);
  assert.deepEqual(withoutCookie.body, { message: 'Authentication required' });
  assert.equal(withInvalidCookie.status, 401);
  assert.deepEqual(withInvalidCookie.body, {
    message: 'Invalid or expired token',
  });
});

test('GET /api/auth/me renvoie les informations du JWT valide', async () => {
  const response = await request(app)
    .get('/api/auth/me')
    .set('Cookie', authenticatedCookie());

  assert.equal(response.status, 200);
  assert.equal(response.body.user.userId, '507f1f77bcf86cd799439012');
  assert.equal(response.body.user.email, 'test@example.com');
  assert.equal(typeof response.body.user.iat, 'number');
  assert.equal(typeof response.body.user.exp, 'number');
});

test('les routes de tâches refusent les requêtes sans authentification', async () => {
  const responses = await Promise.all([
    request(app).get('/api/tasks'),
    request(app).get('/api/tasks/my'),
    request(app).post('/api/tasks').send({ title: 'Tâche' }),
    request(app).get(`/api/tasks/${taskId}`),
    request(app).patch(`/api/tasks/${taskId}`).send({ title: 'Modifiée' }),
    request(app).delete(`/api/tasks/${taskId}`),
  ]);

  for (const response of responses) {
    assert.equal(response.status, 401);
    assert.deepEqual(response.body, { message: 'Authentication required' });
  }
});

test('GET /api/tasks/:id refuse un identifiant invalide', async () => {
  const response = await request(app)
    .get('/api/tasks/not-an-object-id')
    .set('Cookie', authenticatedCookie());

  assert.equal(response.status, 400);
  assert.deepEqual(response.body, { error: 'INVALID_INPUT' });
});

test('PATCH /api/tasks/:id refuse un corps vide ou un champ interdit', async () => {
  const cookie = authenticatedCookie();
  const emptyBody = await request(app)
    .patch(`/api/tasks/${taskId}`)
    .set('Cookie', cookie)
    .send({});
  const forbiddenField = await request(app)
    .patch(`/api/tasks/${taskId}`)
    .set('Cookie', cookie)
    .send({ ownerId: '507f1f77bcf86cd799439013' });

  assert.equal(emptyBody.status, 400);
  assert.deepEqual(emptyBody.body, { error: 'INVALID_INPUT' });
  assert.equal(forbiddenField.status, 400);
  assert.deepEqual(forbiddenField.body, { error: 'INVALID_INPUT' });
});

test('DELETE /api/tasks/:id refuse un identifiant invalide', async () => {
  const response = await request(app)
    .delete('/api/tasks/not-an-object-id')
    .set('Cookie', authenticatedCookie());

  assert.equal(response.status, 400);
  assert.deepEqual(response.body, { error: 'INVALID_INPUT' });
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