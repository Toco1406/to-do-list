# Specification de conception : starter Full Stack JS

## Objectif

Fournir aux etudiants de Master 1 un depot de demarrage lisible en quelques minutes pour realiser, au choix, TaskFlow, HabitLab ou BudgetFlow. Le depot doit fonctionner des son installation sans fournir de fonctionnalites metier.

## Architecture

Le depot contient deux applications JavaScript independantes pilotees depuis la racine par des scripts npm. `frontend` utilise React et Vite ; `backend` utilise Express. La racine utilise uniquement `concurrently` pour demarrer les deux processus en developpement.

Le frontend affiche une page unique dans un `Layout` compose de `Header`, contenu et `Footer`. Il ne contient ni routeur, ni donnees metier, ni formulaire. Vite redirige les requetes commencant par `/api` vers le backend local.

Le backend separe la creation de l'application (`src/app.js`) de son ecoute reseau (`src/server.js`). Il charge les variables d'environnement avec `dotenv`, applique `express.json()` et expose seulement `GET /api/health`, qui renvoie un objet JSON confirmant la disponibilite du service. Importer `app.js` ne demarre jamais de serveur.

## Contrat technique

- JavaScript uniquement : pas de TypeScript ni ORM.
- Node.js 20 ou plus recent et npm 10 ou plus recent.
- React 19, Vite 7, Express 5, dotenv 16 et concurrently 9 : versions stables compatibles declarees dans les fichiers `package.json`.
- Frontend : port 5173 par defaut.
- Backend : `PORT` lu dans l'environnement, avec 3000 comme valeur locale par defaut.
- `GET /api/health` repond avec le code 200 et `{ "status": "ok" }`.
- `.env.example` ne contient que `PORT=3000`.

## Experience et documentation

Le README, les libelles affiches et les commentaires eventuels sont en francais. Il explique installation, scripts, ports, URLs, arborescence, proxy Vite et les elements volontairement laisses aux etudiants : API metier, MongoDB, authentification, validation, tests et documentation applicative.

## Hors perimetre

Pas de CRUD, controleur ou service metier, MongoDB, Mongoose, JWT, Docker, CI/CD, cloud, bibliotheque UI, dashboard, barre laterale, authentification, fausses donnees ou formulaire metier.

## Verification

Une verification automatisee cible l'endpoint de sante sans demarrer le serveur via l'import d'application. La recette finale installe les dependances, execute le test cible, construit le frontend, demarre les deux applications, verifie l'endpoint direct et le passage par le proxy Vite.
