# =============================================
# Étape 1 : Build (conteneur temporaire)
# =============================================
# On utilise Node 22 Alpine pour compiler l'application React.
# Cette étape produit des fichiers HTML/CSS/JS statiques dans dist/.
FROM node:22-alpine AS build

WORKDIR /app

# On copie les fichiers de dépendances en premier pour profiter du cache Docker.
# Tant que package.json ne change pas, Docker réutilise le cache du npm ci.
COPY package*.json ./
RUN npm ci

# On copie tout le code source (composants React, config Vite, TypeScript...).
COPY . .

# On passe l'URL de l'API en argument de build.
# ARG déclare une variable disponible uniquement pendant le build (pas au runtime).
# Vite remplace les VITE_* dans le code par leurs valeurs au moment du build,
# c'est pourquoi on ne peut pas utiliser une variable d'environnement classique ici.
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

# "tsc -b" vérifie les types TypeScript, puis "vite build" produit les fichiers
# statiques optimisés (HTML, CSS, JS minifiés) dans le dossier dist/.
RUN npm run build

# =============================================
# Étape 2 : Production (image finale)
# =============================================
# Pour servir des fichiers statiques, on n'a plus besoin de Node.js.
# On utilise nginx, un serveur web léger et performant, parfait pour ça.
# L'image Alpine de nginx pèse ~7 Mo contre ~180 Mo pour Node Alpine.
FROM nginx:alpine

# On copie les fichiers statiques générés par Vite dans le dossier
# que nginx utilise par défaut pour servir les fichiers.
COPY --from=build /app/dist /usr/share/nginx/html

# On remplace la configuration par défaut de nginx par la nôtre.
# Cette config gère notamment le routing côté client (React Router) :
# quand l'utilisateur accède à /articles/3, nginx doit renvoyer index.html
# et laisser React Router gérer la route, au lieu de chercher un fichier /articles/3.
COPY nginx.conf /etc/nginx/conf.d/default.conf

# nginx écoute sur le port 80 par défaut.
EXPOSE 80

# Lancement de nginx au premier plan (obligatoire dans Docker,
# sinon le conteneur s'arrête immédiatement car le processus principal se termine).
CMD ["nginx", "-g", "daemon off;"]
