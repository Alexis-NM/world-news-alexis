const API_BASE_URL = import.meta.env.VITE_API_URL;

interface RequestOptions extends RequestInit {
	params?: Record<string, string | number>;
}

class ApiService {
	private baseURL: string;

	constructor(baseURL: string) {
		this.baseURL = baseURL;
	}

	private async request<T>(
		endpoint: string,
		options: RequestOptions = {},
	): Promise<T> {
		const { params, ...fetchOptions } = options;

		let url = `${this.baseURL}${endpoint}`;

		if (params) {
			const searchParams = new URLSearchParams(
				Object.entries(params).map(([key, value]) => [key, String(value)]),
			);
			url += `?${searchParams.toString()}`;
		}

		const config: RequestInit = {
			...fetchOptions,
			headers: {
				"Content-Type": "application/json",
				...fetchOptions.headers,
			},
		};

		const response = await fetch(url, config);

		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}

		return await response.json();
	}

	async get<T>(
		endpoint: string,
		params?: Record<string, string | number>,
		options?: { signal?: AbortSignal },
	): Promise<T> {
		return this.request<T>(endpoint, { method: "GET", params, ...options });
	}

	async post<T>(endpoint: string, data: unknown): Promise<T> {
		return this.request<T>(endpoint, {
			method: "POST",
			body: JSON.stringify(data),
		});
	}

	async put<T>(endpoint: string, data: unknown): Promise<T> {
		return this.request<T>(endpoint, {
			method: "PUT",
			body: JSON.stringify(data),
		});
	}

	async patch<T>(endpoint: string, data: unknown): Promise<T> {
		return this.request<T>(endpoint, {
			method: "PATCH",
			body: JSON.stringify(data),
		});
	}

	async delete<T>(endpoint: string): Promise<T> {
		return this.request<T>(endpoint, { method: "DELETE" });
	}
}

export const api = new ApiService(API_BASE_URL);
