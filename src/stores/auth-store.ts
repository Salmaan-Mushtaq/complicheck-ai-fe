import { redirect } from "@tanstack/react-router";
import { toast } from "sonner";
import type { ApiResponse } from "types";
import { create } from "zustand";
import { BASE_URL } from "../lib/constants";

interface LoginInfo {
	accessToken: string;
	email: string;
	fullName: string;
	roleId: number;
	roleName: string;
	userId: number;
}

interface LoginCredentials {
	email: string;
	password: string;
}
interface AuthState {
	loginInfo: LoginInfo | null;
	isPending: boolean;
	error: string | null;
	login: (credentials: LoginCredentials) => Promise<void>;
	logout: () => void;
	refreshAccessToken: () => Promise<void>;
	setPending: (isPending: boolean) => void;
	isAuthenticated: boolean;
	updateFullName: (fullName: string) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
	loginInfo: null,
	isPending: false,
	error: null,
	isAuthenticated: false,
	login: async (credentials: LoginCredentials) => {
		set({ isPending: true, error: null });

		const response = await fetch(`${BASE_URL}Account/login`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(credentials),
			credentials: "include",
		});
		const res = (await response.json()) as ApiResponse<LoginInfo>;

		if (!response.ok) {
			throw new Error(res.message);
		}

		if (res.data.roleId < 1 || res.data.roleId > 2) {
			throw new Error("You do not have permission to access this application.");
		}

		toast.success(res.message);
		set({
			loginInfo: res.data,
			isAuthenticated: true,
			isPending: false,
		});
	},

	setPending: (isPending: boolean) => set({ isPending }),

	logout: async () => {
		await fetch(`${BASE_URL}Account/logout`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			credentials: "include",
		});
		toast.success("Logged out successfully.");
		set({
			loginInfo: null,
			isAuthenticated: false,
			error: null,
			isPending: false,
		});
	},

	refreshAccessToken: async () => {
		try {
			const csrfResponse = await fetch(`${BASE_URL}Account/csrf-token`, {
				credentials: "include",
			});
			const { data } = await csrfResponse.json();

			const refreshResponse = await fetch(`${BASE_URL}Account/refresh-token`, {
				method: "POST",
				headers: {
					"X-CSRF-TOKEN": data.antiforgeryToken,
				},
				credentials: "include",
			});
			if (refreshResponse.status === 401) {
				const errorData = await refreshResponse.json();
				throw new Error(errorData.message);
			}
			if (!refreshResponse.ok) {
				throw new Error("Failed to refresh access token.");
			}

			const refreshData = await refreshResponse.json();

			set({
				loginInfo: refreshData.data,
				isAuthenticated: true,
			});
		} catch (error) {
			set({ isAuthenticated: false, loginInfo: null });
			const errorMessage =
				error instanceof Error
					? error.message
					: "Session expired. Please log in again.";
			toast.error(errorMessage);
			throw redirect({ to: "/login" });
		}
	},

	updateFullName: (fullName: string) =>
		set((state) => ({
			loginInfo: state.loginInfo ? { ...state.loginInfo, fullName } : null,
		})),
}));
