import { defineConfig } from "@playwright/test";

export default defineConfig({
	testDir: "e2e",
	use: {
		baseURL: "http://localhost:5174",
		headless: true,
	},
	projects: [
		{
			name: "chromium",
			use: { browserName: "chromium" },
		},
	],
	webServer: {
		command: "npm run dev",
		url: "http://localhost:5174",
		reuseExistingServer: true,
	},
});
