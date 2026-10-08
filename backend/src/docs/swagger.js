const errorResponse = (description, code) => ({
  description,
  content: {
    'application/json': {
      schema: { $ref: '#/components/schemas/Error' },
      example: { error: code },
    },
  },
})

// Réponse réelle du middleware authenticateToken (renvoyée avant les contrôleurs)
const authRequired = {
  description: 'Non authentifié : cookie access_token absent, invalide ou expiré',
  content: {
    'application/json': {
      schema: { $ref: '#/components/schemas/Message' },
      examples: {
        absent: { value: { message: 'Authentication required' } },
        invalide: { value: { message: 'Invalid or expired token' } },
      },
    },
  },
}

const serverError = {
  description: 'Erreur serveur non interceptée (réponse 500 par défaut d\'Express)',
}

const idParam = {
  name: 'id',
  in: 'path',
  required: true,
  description: "Identifiant MongoDB de la tâche (ObjectId)",
  schema: { type: 'string', example: '665f1c2e8a1b2c3d4e5f6a7b' },
}

const secured = [{ cookieAuth: [] }]

export const swaggerSpec = {
  openapi: '3.0.3',
  info: {
    title: 'To-Do List API',
    version: '1.0.0',
    description:
      "API REST de gestion de tâches avec authentification JWT (cookie httpOnly). " +
      "Les routes /api/tasks exigent d'être connecté : appelez d'abord /api/auth/login.",
  },
  servers: [{ url: '/', description: 'Serveur courant (même origine que cette page)' }],
  tags: [
    { name: 'Health', description: 'État du serveur' },
    { name: 'Auth', description: 'Inscription, connexion, déconnexion' },
    { name: 'Tasks', description: "CRUD des tâches de l'utilisateur connecté" },
  ],
  components: {
    securitySchemes: {
      cookieAuth: {
        type: 'apiKey',
        in: 'cookie',
        name: 'access_token',
        description: "Cookie posé par /api/auth/login ou /register. Dans Swagger UI, le navigateur l'envoie automatiquement après connexion : aucun bouton Authorize n'est nécessaire.",
      },
    },
    schemas: {
      Error: {
        type: 'object',
        properties: { error: { type: 'string', example: 'INVALID_INPUT' } },
      },
      Message: {
        type: 'object',
        properties: { message: { type: 'string' } },
      },
      Credentials: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
          email: { type: 'string', format: 'email', example: 'ayman@example.com' },
          password: { type: 'string', format: 'password', example: 'motdepasse123' },
        },
      },
      User: {
        type: 'object',
        properties: {
          id: { type: 'string', example: '665f1c2e8a1b2c3d4e5f6a7b' },
          email: { type: 'string', example: 'ayman@example.com' },
        },
      },
      TaskInput: {
        type: 'object',
        required: ['title'],
        properties: {
          title: { type: 'string', maxLength: 120, example: 'Préparer la soutenance' },
          description: { type: 'string', example: 'Revoir le chemin de requête' },
          status: { type: 'string', enum: ['todo', 'doing', 'done'], default: 'todo' },
          deadline: { type: 'string', format: 'date-time' },
        },
      },
      TaskUpdate: {
        type: 'object',
        minProperties: 1,
        properties: {
          title: { type: 'string', maxLength: 120 },
          description: { type: 'string' },
          status: { type: 'string', enum: ['todo', 'doing', 'done'] },
          deadline: { type: 'string', format: 'date-time' },
        },
      },
      Task: {
        type: 'object',
        properties: {
          _id: { type: 'string', example: '665f1c2e8a1b2c3d4e5f6a7b' },
          title: { type: 'string' },
          description: { type: 'string' },
          status: { type: 'string', enum: ['todo', 'doing', 'done'] },
          deadline: { type: 'string', format: 'date-time' },
          ownerId: { type: 'string' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
    },
  },
  paths: {
    '/api/health': {
      get: {
        tags: ['Health'],
        summary: "Vérifie que l'API répond",
        responses: {
          200: {
            description: 'API disponible',
            content: { 'application/json': { example: { status: 'ok' } } },
          },
        },
      },
    },
    '/api/auth/register': {
      post: {
        tags: ['Auth'],
        summary: 'Crée un compte et connecte l\'utilisateur',
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/Credentials' } } },
        },
        responses: {
          201: {
            description: 'Compte créé, cookie access_token posé',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    message: { type: 'string' },
                    user: { $ref: '#/components/schemas/User' },
                  },
                },
              },
            },
          },
          400: { description: 'Email ou mot de passe manquant', content: { 'application/json': { schema: { $ref: '#/components/schemas/Message' } } } },
          409: { description: 'Utilisateur déjà existant', content: { 'application/json': { schema: { $ref: '#/components/schemas/Message' } } } },
          500: { description: 'Erreur serveur', content: { 'application/json': { schema: { $ref: '#/components/schemas/Message' } } } },
        },
      },
    },
    '/api/auth/login': {
      post: {
        tags: ['Auth'],
        summary: "Connecte l'utilisateur (pose le cookie access_token)",
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/Credentials' } } },
        },
        responses: {
          200: {
            description: 'Connexion réussie',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    message: { type: 'string' },
                    user: { $ref: '#/components/schemas/User' },
                  },
                },
              },
            },
          },
          401: { description: 'Identifiants invalides', content: { 'application/json': { schema: { $ref: '#/components/schemas/Message' } } } },
          500: { description: 'Erreur serveur', content: { 'application/json': { schema: { $ref: '#/components/schemas/Message' } } } },
        },
      },
    },
    '/api/auth/logout': {
      post: {
        tags: ['Auth'],
        summary: 'Supprime le cookie d\'authentification',
        responses: {
          200: { description: 'Déconnecté', content: { 'application/json': { schema: { $ref: '#/components/schemas/Message' } } } },
        },
      },
    },
    '/api/auth/me': {
      get: {
        tags: ['Auth'],
        summary: 'Renvoie le contenu du token (utilisateur connecté)',
        security: secured,
        responses: {
          200: {
            description: 'Contenu décodé du JWT',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    user: {
                      type: 'object',
                      properties: {
                        userId: { type: 'string', example: '665f1c2e8a1b2c3d4e5f6a7b' },
                        email: { type: 'string', example: 'ayman@example.com' },
                        iat: { type: 'integer', description: 'Date d\'émission (timestamp)' },
                        exp: { type: 'integer', description: 'Date d\'expiration (timestamp)' },
                      },
                    },
                  },
                },
              },
            },
          },
          401: { description: 'Token absent, invalide ou expiré', content: { 'application/json': { schema: { $ref: '#/components/schemas/Message' } } } },
        },
      },
    },
    '/api/tasks/my': {
      get: {
        tags: ['Tasks'],
        summary: "Liste les tâches de l'utilisateur connecté",
        security: secured,
        responses: {
          200: {
            description: 'Liste des tâches',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: { items: { type: 'array', items: { $ref: '#/components/schemas/Task' } } },
                },
              },
            },
          },
          401: authRequired,
        },
      },
    },
    '/api/tasks': {
      get: {
        tags: ['Tasks'],
        summary: "Liste les tâches de l'utilisateur connecté (format { message, tasks })",
        description: 'Même résultat que GET /api/tasks/my, mais avec un format de réponse différent.',
        security: secured,
        responses: {
          200: {
            description: 'Liste des tâches',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    message: { type: 'string', example: 'Todos récupérées : ' },
                    tasks: { type: 'array', items: { $ref: '#/components/schemas/Task' } },
                  },
                },
              },
            },
          },
          401: authRequired,
          500: serverError,
        },
      },
      post: {
        tags: ['Tasks'],
        summary: 'Crée une tâche',
        security: secured,
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/TaskInput' } } },
        },
        responses: {
          201: { description: 'Tâche créée', content: { 'application/json': { schema: { $ref: '#/components/schemas/Task' } } } },
          400: errorResponse('Données invalides (titre manquant, statut inconnu...)', 'INVALID_INPUT'),
          401: authRequired,
          500: errorResponse('Erreur serveur', 'SERVER_ERROR'),
        },
      },
    },
    '/api/tasks/{id}': {
      get: {
        tags: ['Tasks'],
        summary: "Détail d'une tâche",
        security: secured,
        parameters: [idParam],
        responses: {
          200: { description: 'Tâche trouvée', content: { 'application/json': { schema: { $ref: '#/components/schemas/Task' } } } },
          400: errorResponse('Identifiant invalide', 'INVALID_INPUT'),
          401: authRequired,
          404: errorResponse('Tâche introuvable', 'NOT_FOUND'),
        },
      },
      patch: {
        tags: ['Tasks'],
        summary: 'Modifie une tâche',
        description: 'Champs autorisés : title, description, status, deadline. Tout autre champ est refusé.',
        security: secured,
        parameters: [idParam],
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/TaskUpdate' } } },
        },
        responses: {
          200: { description: 'Tâche modifiée', content: { 'application/json': { schema: { $ref: '#/components/schemas/Task' } } } },
          400: errorResponse('Identifiant ou données invalides, champ interdit', 'INVALID_INPUT'),
          401: authRequired,
          404: errorResponse('Tâche introuvable', 'NOT_FOUND'),
          500: serverError,
        },
      },
      delete: {
        tags: ['Tasks'],
        summary: 'Supprime une tâche',
        security: secured,
        parameters: [idParam],
        responses: {
          204: { description: 'Tâche supprimée (pas de contenu)' },
          400: errorResponse('Identifiant invalide', 'INVALID_INPUT'),
          401: authRequired,
          404: errorResponse('Tâche introuvable', 'NOT_FOUND'),
          500: serverError,
        },
      },
    },
  },
}