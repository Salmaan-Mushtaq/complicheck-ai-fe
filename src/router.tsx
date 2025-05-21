import type { QueryClient } from "@tanstack/react-query";
import {
	Outlet,
	createRootRouteWithContext,
	createRoute,
	redirect,
} from "@tanstack/react-router";
import { z } from "zod";
import SidebarLayout from "./layouts/sidebar-layout";
import { useAuthStore } from "./stores/auth-store";
import { useHeaderStore } from "./stores/header-store";

type RouterContext = {
	queryClient: QueryClient;
};
const rootRoute = createRootRouteWithContext<RouterContext>()({
	component: Outlet,
});

const login = createRoute({
	getParentRoute: () => rootRoute,
	path: "/login",
}).lazy(() => import("./routes/login/route").then((d) => d.Route));

const forgotPassword = createRoute({
	getParentRoute: () => rootRoute,
	path: "/forgot-password",
}).lazy(() => import("./routes/forgot-password/route").then((d) => d.Route));

const resetPasswordSchema = z.object({
	email: z.string(),
	token: z.string(),
});

const resetPassword = createRoute({
	validateSearch: resetPasswordSchema.parse,
	getParentRoute: () => rootRoute,
	path: "/set-password",
}).lazy(() => import("./routes/set-password/route").then((d) => d.Route));

const authLayout = createRoute({
	getParentRoute: () => rootRoute,
	component: SidebarLayout,
	id: "auth",
	beforeLoad: async () => {
		const { isAuthenticated, refreshAccessToken } = useAuthStore.getState();
		if (!isAuthenticated) {
			try {
				await refreshAccessToken();
			} catch {
				throw redirect({ to: "/login" });
			}
		}
	},
});

const index = createRoute({
	getParentRoute: () => authLayout,
	path: "/",
	beforeLoad: () => {
		throw redirect({ to: "/projects" });
	},
});
const projects = createRoute({
	getParentRoute: () => authLayout,
	path: "/projects",
	beforeLoad: () => {
		useHeaderStore.setState({ pageTitle: "Projects" });
		useHeaderStore.setState({
			breadCrumbs: [],
		});
	},
}).lazy(() => import("./routes/projects/project-list").then((d) => d.Route));

const profile = createRoute({
	getParentRoute: () => authLayout,
	path: "/profile",
	beforeLoad: () => {
		useHeaderStore.setState({ pageTitle: "Profile" });
		useHeaderStore.setState({
			breadCrumbs: [],
		});
	},
}).lazy(() => import("./routes/profile/route").then((d) => d.Route));

const users = createRoute({
	getParentRoute: () => authLayout,
	path: "/users",
	beforeLoad: () => {
		useHeaderStore.setState({ pageTitle: "Users" });
		useHeaderStore.setState({
			breadCrumbs: [],
		});
	},
}).lazy(() =>
	import("./routes/user-management/user-list").then((d) => d.Route),
);

export const routeTree = rootRoute.addChildren([
	login,
	forgotPassword,
	resetPassword,
	authLayout.addChildren([index, projects, profile, users]),
]);
