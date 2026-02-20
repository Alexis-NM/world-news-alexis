import { defineConfig } from "vitest/config";

export default defineConfig({
	test: {
		globals: true,
		environment: "node",
		include: ["src/__tests__/**/*.test.ts"],
		setupFiles: ["src/__tests__/setup/test-setup.ts"],
		env: {
			NODE_ENV: "test",
			DATABASE_URL: [
				"postgresql://",
				"postgres:postgres",
				"@localhost:5433",
				"/worldnews_test",
			].join(""),
		},
	},
});
