# Starter Full Stack JS

Point de départ minimal pour les projets étudiants du module Full Stack JS.

## Prérequis

- Node.js 20 ou plus récent ;
- npm 10 ou plus récent.

## Installation

Depuis ce dossier :

```bash
npm install
```

## Démarrage

```bash
npm run dev
```

Cette commande démarre le frontend Vite et le backend Express simultanément.

- Frontend : http://localhost:5173
- API santé : http://localhost:3000/api/health
- API santé via le proxy Vite : http://localhost:5173/api/health

Autres commandes :

```bash
npm run build
npm run start
npm test
```

`npm run build` construit le frontend. `npm run start` démarre uniquement le backend en mode production locale. `npm test` lance les tests backend.

## Structure

```text
frontend/     application React avec Vite
backend/      serveur Express
  src/app.js  création de l'application et route health
  src/server.js démarrage du serveur
```

## Proxy Vite

En développement, une requête frontend vers `/api/...` est transmise automatiquement à Express sur `http://localhost:3000`. Les composants React peuvent donc appeler `/api/health` sans coder l'adresse du backend.

## À développer pendant le cours

Ce starter ne contient volontairement pas :

- API métier et routes CRUD ;
- MongoDB et modèles de données ;
- authentification et autorisation ;
- validation ;
- tests de votre application métier ;
- documentation de votre application.

Vous concevrez ces éléments pour TaskFlow, HabitLab ou BudgetFlow.
