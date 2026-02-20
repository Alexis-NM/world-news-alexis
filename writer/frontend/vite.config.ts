import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
	plugins: [react()],
	server: {
		// host: true → écoute sur 0.0.0.0 au lieu de localhost uniquement.
		// Nécessaire dans Docker : sans ça, le serveur Vite n'est accessible
		// que depuis l'intérieur du conteneur, pas depuis le navigateur de l'hôte.
		host: true,
		port: 5173,
	},
});
