# World News

Application de presse en architecture microservices / microfrontends.

## Structure du projet

```
world-news/
  reader/             Micro-app lecture (frontend + backend)
  writer/             Micro-app redaction (frontend + backend)
  db/                 Scripts SQL (init, schema, seed)
  docs/               Diagrammes MCD / MLD
```

## Stack technique

- **Frontend** : React 19, Vite, TypeScript
- **Backend Reader** : Express 5, Prisma, PostgreSQL
- **Backend Writer** : Express 5, TypeORM, PostgreSQL
