// =============================================================================
// Setup global des tests — Reader Backend
// =============================================================================
//
// Le reader est en lecture seule : il consulte une vue matérialisée
// (reader.v_articles) alimentée par les scripts SQL d'initialisation.
// Pas besoin de TRUNCATE entre les tests — on ne modifie jamais les données.
//
// On se contente d'ouvrir et fermer la connexion Prisma.
// =============================================================================

import prisma from "../../lib/prisma.js";

beforeAll(async () => {
	await prisma.$connect();
});

afterAll(async () => {
	await prisma.$disconnect();
});
