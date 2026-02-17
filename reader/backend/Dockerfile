# =============================================
# Dockerfile — Reader Backend (développement)
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
# l'image Docker. Pour ça :
#   - Une seule étape (pas de compilation, tsx exécute le TS directement)
#   - Le code source est monté en volume par docker-compose.yml
#     (→ les fichiers de ta machine sont partagés avec le conteneur)
#   - tsx watch surveille les changements et redémarre le serveur
#
# =============================================

FROM node:22-alpine

WORKDIR /app

# On copie les fichiers de dépendances en premier pour profiter du cache Docker.
# Tant que package.json ne change pas, Docker réutilise le cache du npm ci.
COPY package*.json ./

# On copie le schema Prisma AVANT npm ci car le script "postinstall"
# de package.json exécute automatiquement "prisma generate".
# Cette commande génère le client Prisma (le code qui permet de communiquer
# avec la base de données). Sans le schema, le postinstall échouerait.
COPY prisma ./prisma

# npm ci installe TOUTES les dépendances (y compris devDependencies)
# car en dev on a besoin de tsx, typescript, prisma CLI, etc.
RUN npm ci

# IMPORTANT : on ne copie PAS le code source ici.
# Le dossier src/ sera monté en volume par docker-compose.yml.
# C'est ce qui permet le hot reload : quand tu modifies un fichier sur
# ta machine, le changement est instantanément visible dans le conteneur,
# et tsx watch redémarre le serveur automatiquement.

EXPOSE 3001

# "npm run dev" exécute "tsx watch src/index.ts" (défini dans package.json).
# tsx exécute le TypeScript directement, sans étape de compilation.
CMD ["npm", "run", "dev"]
