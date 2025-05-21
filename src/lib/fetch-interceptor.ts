import { redirect } from "@tanstack/react-router";

import { useAuthStore } from "@/stores/auth-store";
import { BASE_URL } from "./constants";

let isRefreshing = false;

const handleFetchError = async (response: Response): Promise<string> => {
	try {
		const clonedResponse = response.clone();
		const errorJson = await clonedResponse.json();
		return errorJson.message || "An unexpected error occurred.";
	} catch {
		const clonedResponse = response.clone();
		return await clonedResponse.text();
	}
};

/**
 * A reusable function to make authenticated fetch requests.
 * Automatically adds authorization headers and handles errors.
 *
 * @param endpoint - The API endpoint (relative to BASE_URL).
 * @param options - The `RequestInit` options for the fetch request.
 * @returns The parsed response of type `T`.
 */
export const fetchWithInterceptor = async <T>(
	endpoint: string,
	options: RequestInit & { responseType?: "json" | "text" } = {},
): Promise<T> => {
	const { loginInfo, refreshAccessToken, logout } = useAuthStore.getState();
	const isFormData = options.body instanceof FormData;
	const headers = {
		...(isFormData ? {} : { "Content-Type": "application/json" }),
		...(loginInfo?.accessToken && {
			Authorization: `Bearer ${loginInfo.accessToken}`,
		}),
		...options.headers,
	};

	const response = await fetch(`${BASE_URL}${endpoint}`, {
		...options,
		headers,
	});
	if (response.status === 401) {
		logout();
		throw redirect({ to: "/login" });
	}
	if (response.status === 403 && !isRefreshing) {
		isRefreshing = true;
		try {
			await refreshAccessToken();

			// Update headers with the new token after refreshing
			const refreshedUser = useAuthStore.getState().loginInfo; // Get the updated user
			const updatedHeaders = {
				...(isFormData ? {} : { "Content-Type": "application/json" }),
				...(refreshedUser?.accessToken && {
					Authorization: `Bearer ${refreshedUser.accessToken}`,
				}),
				...options.headers,
			};

			// Retry the request with updated headers
			const retryResponse = await fetch(`${BASE_URL}${endpoint}`, {
				...options,
				headers: updatedHeaders,
			});
			if (!retryResponse.ok) {
				throw new Error(await handleFetchError(retryResponse));
			}

			isRefreshing = false;
			return (await retryResponse.json()) as T;
		} catch (error) {
			isRefreshing = false;
			throw error;
		}
	}
	if (!response.ok) {
		const errorMessage = await handleFetchError(response);
		throw new Error(errorMessage);
	}
	// Handle response type
	if (options.responseType === "text") {
		return (await response.text()) as T;
	}

	return (await response.json()) as T;
};
