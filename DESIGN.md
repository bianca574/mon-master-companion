# Choix d'architecture — MonMaster Companion

## Construction en versions

Le projet a été construit en trois étapes délibérées plutôt que tout d'un
bloc :

- **V1 (local-first)** : localStorage uniquement, pour valider rapidement
  l'expérience utilisateur sans la complexité d'un backend.
- **V2** : ajout de fonctionnalités (tags, journal, statistiques, score de
  préparation) toujours en local-first.
- **V3** : ajout d'un backend (API + PostgreSQL + authentification) une fois
  l'usage réel justifié — la synchronisation multi-appareils étant un besoin
  concret plutôt qu'une justification a posteriori.

## Structure des pages

Une page React par vue principale (`src/pages/`), chacune responsable de son
propre chargement de données via `src/utils/storage.js`. Pas de gestion
d'état globale (Redux, Context) : chaque page charge ce dont elle a besoin au
montage.

## Couche de données

`storage.js` expose les mêmes fonctions que la version localStorage
d'origine (`loadPrograms`, `createProgram`, etc.), mais chacune appelle
désormais l'API via `apiFetch` (`src/utils/api.js`), qui centralise l'ajout
du token d'authentification et la gestion des réponses `401`. Ce choix
permet de garder les pages inchangées dans leur logique, seul le
comportement asynchrone diffère.

## Design system

Variables CSS (`src/index.css`) pour les couleurs, le mode sombre/clair, la
typographie et les rayons de bordure — plutôt qu'une bibliothèque de
composants, pour garder un style distinctif et cohérent.

## Score de préparation

Le calcul (`src/utils/readiness.js`) reste côté frontend plutôt que côté
API : c'est une agrégation de données déjà chargées (documents, lettres,
recommandations), pas une source de vérité à synchroniser.
