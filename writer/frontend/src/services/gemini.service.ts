import { api } from "../api/api";

interface GeminiResponse {
	message: string;
	data: string;
}

export const geminiService = {
	generateTitle: async (
		body: string,
		signal?: AbortSignal,
	): Promise<GeminiResponse> => {
		return api.post<GeminiResponse>(
			"/gemini/generate-titre",
			{ body },
			{ signal },
		);
	},

	generateSubtitle: async (
		title: string,
		body: string,
		signal?: AbortSignal,
	): Promise<GeminiResponse> => {
		return api.post<GeminiResponse>(
			"/gemini/generate-sous-titre",
			{
				title,
				body,
			},
			{ signal },
		);
	},

	generateSubhead: async (
		body: string,
		signal?: AbortSignal,
	): Promise<GeminiResponse> => {
		return api.post<GeminiResponse>(
			"/gemini/generate-chapeau",
			{ body },
			{ signal },
		);
	},

	generateBody: async (
		body: string,
		signal?: AbortSignal,
	): Promise<GeminiResponse> => {
		return api.post<GeminiResponse>(
			"/gemini/generate-body",
			{ body },
			{ signal },
		);
	},
};
