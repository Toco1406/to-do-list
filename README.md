# To-Do List — Projet Full Stack JS

Application de gestion de tâches avec comptes utilisateurs. Chaque utilisateur s'inscrit, se connecte, puis crée, consulte, modifie et supprime **ses propres** tâches.

## Fonctionnalités

- Inscription, connexion et déconnexion (JWT stocké dans un cookie `httpOnly`).
- CRUD des tâches : titre, description, statut (`todo`, `doing`, `done`), échéance.
- Isolation des données : un utilisateur n'accède qu'à ses tâches (filtre par `ownerId`).
- Validation des données (Mongoose) et réponses d'erreur HTTP explicites.
- Interface React : pages d'accueil, d'authentification et de gestion des tâches (filtres, recherche, tri, modales).

## Stack technique

| Couche | Technologies |
| --- | --- |
| Front-end | React 19, React Router 7, Vite 7 |
| Back-end | Node.js 20+, Express 5 |
| Base de données | MongoDB, Mongoose 9 |
| Sécurité | bcrypt, jsonwebtoken, helmet, cors, cookie-parser |
| Tests | `node:test` (runner natif Node), supertest |

## Prérequis

- Node.js 20 ou plus récent
- npm 10 ou plus récent
- MongoDB en local (`mongodb://localhost:27017`) ou une base MongoDB Atlas

## Installation

```bash
npm install
cp backend/.env.example backend/.env
```

Puis renseigner `backend/.env` :

| Variable | Rôle | Exemple |
| --- | --- | --- |
| `PORT` | Port de l'API | `3000` |
| `MONGODB_URI` | Chaîne de connexion MongoDB | `mongodb://localhost:27017/to-do-list` |
| `JWT_SECRET` | Secret de signature des JWT (long et aléatoire) | `une-longue-chaine-aleatoire` |
| `JWT_EXPIRES_IN` | Durée de validité du token | `1h` |
| `CORS_ORIGIN` | Origine front autorisée par CORS | `http://localhost:5173` |

Le fichier `.env` est ignoré par Git : ne jamais le versionner.

## Lancement

```bash
npm run dev     # front (Vite) + back (Express) en même temps
npm run build   # construit le front
npm run start   # lance uniquement le back
npm test        # lance les tests du back
```

- Front : http://localhost:5173
- API : http://localhost:3000
- Santé : http://localhost:3000/api/health

En développement, Vite redirige toute requête `/api/...` vers Express (`http://localhost:3000`) : le front n'a pas besoin de connaître l'adresse du back.

## Architecture

```text
to-do-list/
├── frontend/
│   └── src/
│       ├── main.jsx            point d'entrée React
│       ├── App.jsx             Layout + routeur
│       ├── router/             routes (/, /auth, /tasks)
│       ├── components/         Header, Footer, Layout
│       ├── pages/              Home, AuthPage, TasksPage
│       └── CSS/                styles des pages
└── backend/
    ├── src/
    │   ├── server.js           connexion MongoDB puis démarrage
    │   ├── app.js              middlewares globaux et routes
    │   ├── config/             variables d'env, connexion DB
    │   ├── routes/             définition des URLs
    │   ├── middlewares/        authenticateToken (vérifie le JWT)
    │   ├── controllers/        logique HTTP, validation, erreurs
    │   ├── services/           accès aux données (Mongoose)
    │   └── models/             schémas User et Task
    └── test/                   tests automatisés
```

### Chemin d'une requête

Exemple : création d'une tâche.

```text
Utilisateur → React → POST /api/tasks → Express (app.js)
  → taskRoutes → authenticateToken (cookie JWT)
  → taskController.createTask → taskService.createTask
  → Mongoose (validation du schéma) → MongoDB
```

Chaque couche a une seule responsabilité : les routes déclarent les URLs, les contrôleurs gèrent HTTP et les erreurs, les services parlent à la base, les modèles décrivent et valident les données.

## API

Toutes les routes `/api/tasks` exigent d'être connecté (cookie `access_token`). Sans token valide, la réponse est `401`.

### Général

| Méthode | Route | Description |
| --- | --- | --- |
| GET | `/api/health` | Vérifie que l'API répond (`{ "status": "ok" }`) |

### Authentification

| Méthode | Route | Description | Codes |
| --- | --- | --- | --- |
| POST | `/api/auth/register` | Crée un compte et connecte l'utilisateur. Corps : `{ email, password }` | 201, 400, 409, 500 |
| POST | `/api/auth/login` | Connecte l'utilisateur. Corps : `{ email, password }` | 200, 401, 500 |
| POST | `/api/auth/logout` | Supprime le cookie d'authentification | 200 |
| GET | `/api/auth/me` | Renvoie l'utilisateur du token | 200, 401 |

### Tâches

| Méthode | Route | Description | Codes |
| --- | --- | --- | --- |
| GET | `/api/tasks/my` | Liste les tâches de l'utilisateur | 200, 401 |
| GET | `/api/tasks/:id` | Détail d'une tâche | 200, 400, 404 |
| POST | `/api/tasks` | Crée une tâche. Corps : `{ title, description?, status?, deadline? }` | 201, 400 |
| PATCH | `/api/tasks/:id` | Modifie une tâche (champs autorisés : `title`, `description`, `status`, `deadline`) | 200, 400, 404 |
| DELETE | `/api/tasks/:id` | Supprime une tâche | 204, 400, 404 |

Les erreurs de tâches renvoient `{ "error": "INVALID_INPUT" | "NOT_FOUND" | "UNAUTHORIZED" | "SERVER_ERROR" }`.

### Modèles de données

**User** : `email` (unique, minuscule), `passwordHash` (jamais renvoyé : `select: false`), `firstName`, `lastName`, `role` (`user` ou `admin`), dates de création et de modification.

**Task** : `title` (obligatoire, 120 caractères max), `description`, `status` (`todo` par défaut), `deadline`, `ownerId` (référence à `User`, indexé), dates de création et de modification.

## Sécurité

- Mots de passe hachés avec bcrypt (12 tours), jamais stockés en clair.
- JWT signé, expirant (1 h par défaut), transmis dans un cookie `httpOnly` (inaccessible au JavaScript), `sameSite: strict` et `secure` en production.
- Message d'erreur identique pour un email inconnu et un mauvais mot de passe (`Invalid credentials`).
- Filtre par `ownerId` sur toutes les requêtes de tâches.
- Liste blanche des champs modifiables lors d'un `PATCH` (impossible de changer `ownerId`).
- En-têtes de sécurité via `helmet`, origine front restreinte via CORS.

## Tests

```bash
npm test
```

Les tests utilisent le runner natif de Node (`node --test`) et supertest, qui appelle l'application Express sans ouvrir de port.

Test actuel : `GET /api/health` doit renvoyer le statut 200 et `{ status: "ok" }`.

## Limites connues et améliorations prévues

- Le front n'est pas encore connecté à l'API : les pages d'authentification et de tâches fonctionnent avec des données locales simulées.
- Couverture de tests à étendre : routes d'auth, accès sans token (401), isolation des tâches entre utilisateurs, validation des entrées.
- Pas de documentation Swagger/OpenAPI pour l'instant.
- Gestion d'erreurs à centraliser dans un middleware Express.
- Validation des entrées d'authentification à renforcer côté serveur (format de l'email, longueur du mot de passe).
