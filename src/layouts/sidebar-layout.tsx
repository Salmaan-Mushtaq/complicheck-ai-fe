import SideNavItem from "@/components/sidebar/side-nav-item";
import { cn } from "@/lib/utils";
import { useSidebarStore } from "@/stores/sidebar-store";
import { useNavigate, useRouterState } from "@tanstack/react-router";
import { FolderOpenDot, Users } from "lucide-react";
import MainLayout from "./main-layout";

export default function SidebarLayout() {
	const { location } = useRouterState();
	const { collapsed, hidden, setActiveGroup } = useSidebarStore();
	const navigate = useNavigate();
	const pathName = location.pathname.split("/")[1];
	return (
		<MainLayout>
			<SideNavItem
				active={pathName === "projects"}
				onClick={() => {
					navigate({
						to: "/projects",
					});
					setActiveGroup("projects");
				}}
				to="/projects"
				show={true}
				className={cn(
					"flex w-full cursor-pointer items-center gap-2 rounded-md border-l-4 border-transparent p-2 text-sm font-medium hover:bg-blue-50",
					pathName === "projects" && "border-blue-600",
					collapsed && hidden && "justify-center border-l-0 bg-transparent",
				)}
			>
				<FolderOpenDot
					size={collapsed && hidden ? 20 : 16}
					color={
						pathName === "projects"
							? "oklch(0.5 0.2 240)"
							: "oklch(0.4 0.05 240)"
					}
				/>
				<span
					className={cn(
						"text-lg font-normal",
						pathName === "projects" ? "text-blue-600" : "text-blue-800/70",
						collapsed && "hidden",
					)}
				>
					Projects
				</span>
			</SideNavItem>
			<SideNavItem
				active={pathName === "users"}
				onClick={() => {
					navigate({
						to: "/users",
					});
					setActiveGroup("users");
				}}
				to="/users"
				show={true}
				className={cn(
					"flex w-full cursor-pointer items-center gap-2 rounded-md border-l-4 border-transparent p-2 text-sm font-medium hover:bg-blue-50",
					pathName === "users" && "border-blue-600",
					collapsed && hidden && "justify-center border-l-0 bg-transparent",
				)}
			>
				<Users
					size={collapsed && hidden ? 20 : 16}
					color={
						pathName === "users" ? "oklch(0.5 0.2 240)" : "oklch(0.4 0.05 240)"
					}
				/>
				<span
					className={cn(
						"text-lg font-normal",
						pathName === "users" ? "text-blue-600" : "text-blue-800/70",
						collapsed && "hidden",
					)}
				>
					User Management
				</span>
			</SideNavItem>
		</MainLayout>
	);
}
