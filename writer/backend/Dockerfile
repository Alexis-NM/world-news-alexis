# =============================================
# Dockerfile — Writer Backend (développement)
# =============================================
#
# DIFFÉRENCE AVEC UN DOCKERFILE DE PRODUCTION
#
# En production, on utilise un "multi-stage build" :
#   1. Une étape compile TypeScript → JavaScript
#   2. Une étape finale ne contient que le JS compilé + les deps de prod
#   → Image légère, sécurisée, optimisée.
#
# En développement, on veut du HOT RELOAD : que le serveur redémarre
# automatiquement à chaque modification de fichier, sans reconstruire
# l'image Docker. Pour ça, on utilise une approche différente :
#   - Une seule étape (pas de compilation, tsx exécute le TS directement)
#   - Le code source n'est PAS copié dans l'image : il est monté en
#     volume par docker-compose.yml (→ les fichiers de ta machine sont
#     partagés en temps réel avec le conteneur)
#   - tsx watch surveille les changements et redémarre le serveur
#
# =============================================

FROM node:22-alpine

WORKDIR /app

# On copie les fichiers de dépendances en premier pour profiter du cache Docker.
# Tant que package.json ne change pas, Docker réutilise le cache du npm ci
# → pas besoin de réinstaller les dépendances à chaque rebuild.
COPY package*.json ./

# npm ci installe les versions exactes du package-lock.json.
# En dev, on installe TOUTES les dépendances (y compris devDependencies)
# car on a besoin de tsx, typescript, et les autres outils de développement.
# En production, on ferait "npm ci --omit=dev" pour exclure les devDeps.
RUN npm ci

# IMPORTANT : on ne copie PAS le code source ici.
# Le dossier src/ sera monté en volume par docker-compose.yml.
# C'est ce qui permet le hot reload : quand tu modifies un fichier sur
# ta machine, le changement est instantanément visible dans le conteneur,
# et tsx watch redémarre le serveur automatiquement.

# Documente le port exposé (informatif uniquement).
# Le mapping réel est fait dans docker-compose.yml via "ports:".
EXPOSE 3000

# "npm run dev" exécute "tsx watch src/index.ts" (défini dans package.json).
# tsx = exécuteur TypeScript qui n'a pas besoin de compiler en JS d'abord.
# watch = surveille les fichiers et redémarre à chaque modification.
CMD ["npm", "run", "dev"]
