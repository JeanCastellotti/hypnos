# Guide

## Documentation technique

Vous trouverez la documentation technique à la racine du dépôt Github.

## Charte graphique

Vous trouverez la charte graphique à la racine du dépôt Github.

## Manuel d'utilisation

Vous trouverez le manuel d'utilisation à la racine du dépôt Github.

## Outil de gestion de projet

Trello : https://trello.com/b/0dCPl19D/hypnos

## Déploiement en local

### Prérequis

Installer NodeJS (v14+):

- https://nodejs.org/en/
- [Homebrew](https://formulae.brew.sh/formula/node) (macOS)

Installer PostgreSQL:

- https://www.postgresql.org/download/
- [Homebrew](https://formulae.brew.sh/formula/postgresql) (macOS)

### Cloner le projet

```bash
git clone https://github.com/JeanDevFR/hypnos.git
```

### Installer les packages

```bash
cd hypnos
```

```bash
npm install
```

### Modifier les informations relatives à la base de données

Créer un fichier .env à partir du fichier .env.example et modifier les lignes suivantes :

```bash
PG_HOST=localhost
PG_PORT=5432
PG_USER=lucid
PG_PASSWORD=
PG_DB_NAME=lucid
```

### Exécuter les migrations

```bash
node ace migration:run
```

### Ajouter les roles dans la base de données

```bash
node ace db:seed
```

### Lancer l'application

```bash
node ace serve
```

ou

```bash
npm run dev
```

### Créer un administrateur

```bash
# Un seul administrateur peut être créé. Conservez-bien son mot de passe.
http://localhost:3333/admin
```

## The Server does not support SSL connections

Si une erreur du genre s'affiche, commentez les lignes suivantes dans le fichier config/database.ts :

```typescript
ssl: {
  rejectUnauthorized: false,
}
```
