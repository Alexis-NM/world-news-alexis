# World News

Application de presse en architecture microservices / microfrontends.

## Structure du projet

```
world-news/
  ms_reader/          Micro-app lecture (Frontend + Backend)
  ms_writer/          Micro-app redaction (Frontend + Backend)
  Db/                 Scripts SQL (init, schema, seed)
  Docs/               Diagrammes MCD / MLD
```

## Stack technique

- **Frontend** : React 19, Vite, TypeScript
- **Backend Reader** : Express 5, Prisma, PostgreSQL
- **Backend Writer** : Express 5, TypeORM, PostgreSQL
