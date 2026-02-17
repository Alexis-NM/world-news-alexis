# =============================================
# Étape 1 : Build (conteneur temporaire)
# =============================================
# On utilise une image légère (Alpine) avec Node 22.
# "AS build" donne un nom à cette étape pour pouvoir y faire référence plus tard.
FROM node:22-alpine AS build

WORKDIR /app

# On copie les fichiers de dépendances en premier, séparément du code source.
# Pourquoi ? Docker met en cache chaque étape. Si package.json n'a pas changé,
# Docker réutilise le cache et skip le npm ci → build beaucoup plus rapide.
COPY package*.json ./

# npm ci installe les versions exactes du package-lock.json (contrairement à
# npm install qui peut résoudre des versions différentes). Ça garantit un
# build reproductible à chaque fois.
# Note : le script "postinstall" dans package.json exécute automatiquement
# "prisma generate" après l'installation. Cette commande génère le client
# Prisma (le code qui permet de communiquer avec la base de données).
# Pour que ça fonctionne, Prisma a besoin du fichier schema.prisma,
# c'est pourquoi on le copie AVANT le npm ci.
COPY prisma ./prisma
RUN npm ci

# On copie ensuite le code source et on compile TypeScript → JavaScript.
# Le résultat de la compilation est placé dans le dossier dist/.
COPY tsconfig.json ./
COPY src ./src
RUN npm run build

# =============================================
# Étape 2 : Production (image finale)
# =============================================
# On repart d'une image vierge. Tout ce qui existait dans l'étape 1
# (code source TS, devDependencies, fichiers intermédiaires) est jeté.
# Seule cette étape constitue l'image finale.
FROM node:22-alpine

WORKDIR /app

# On réinstalle uniquement les dépendances de production (--omit=dev).
# Là aussi, Prisma a besoin du schema pour générer le client,
# donc on copie le dossier prisma avant l'installation.
COPY package*.json ./
COPY prisma ./prisma
RUN npm ci --omit=dev

# On récupère le dossier dist/ depuis l'étape 1 (nommée "build").
# C'est le seul lien entre les deux étapes : on ne prend que le JavaScript compilé.
COPY --from=build /app/dist ./dist

# Documente le port exposé par le conteneur (informatif, ne fait pas de mapping).
# Le mapping réel se fera dans docker-compose.yml ou via docker run -p.
EXPOSE 3001

# Commande exécutée au démarrage du conteneur.
CMD ["node", "dist/index.js"]
