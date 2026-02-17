# =============================================
# Dockerfile — Writer Frontend (développement)
# =============================================
#
# DIFFÉRENCE AVEC UN DOCKERFILE DE PRODUCTION
#
# En production, on utilise un "multi-stage build" :
#   1. Vite compile React → fichiers statiques (HTML/CSS/JS minifiés)
#   2. nginx (serveur web léger) sert ces fichiers statiques
#   → Pas besoin de Node.js au runtime, image très légère (~7 Mo).
#
# En développement, on utilise le SERVEUR DE DEV VITE avec HMR
# (Hot Module Replacement) : quand tu modifies un composant React,
# le navigateur met à jour UNIQUEMENT ce composant sans recharger la page.
# C'est quasi instantané et ça conserve l'état de l'application.
#
# Pour que ça fonctionne :
#   - Le code source est monté en volume (pas copié dans l'image)
#   - Vite dev server tourne dans le conteneur au lieu de nginx
#   - Le port HMR doit être exposé pour que le navigateur reçoive
#     les mises à jour en temps réel via WebSocket
#
# =============================================

FROM node:22-alpine

WORKDIR /app

# On copie les fichiers de dépendances en premier pour profiter du cache Docker.
COPY package*.json ./

# En dev, on installe TOUTES les dépendances (y compris devDependencies)
# car le serveur de dev Vite fait partie des devDeps.
RUN npm ci

# IMPORTANT : on ne copie PAS le code source ici.
# Le dossier entier est monté en volume par docker-compose.yml.
# Chaque modification de composant React déclenche un HMR instantané.

# Port 5173 = port par défaut du serveur de dev Vite.
EXPOSE 5173

# "npm run dev" lance "vite" (défini dans package.json).
# Le serveur de dev Vite :
#   - Sert les fichiers avec transformation à la volée (pas de build)
#   - Fournit le HMR via WebSocket pour les mises à jour instantanées
#   - Gère les imports, JSX, TypeScript, CSS modules, etc.
CMD ["npm", "run", "dev"]
