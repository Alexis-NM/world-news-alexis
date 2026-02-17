import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // host: true → écoute sur 0.0.0.0 au lieu de localhost uniquement.
    // Nécessaire dans Docker : sans ça, le serveur Vite n'est accessible
    // que depuis l'intérieur du conteneur, pas depuis le navigateur de l'hôte.
    host: true,
    // Port 5174 pour ne pas entrer en conflit avec le Writer Frontend (5173).
    port: 5174,
  },
})
