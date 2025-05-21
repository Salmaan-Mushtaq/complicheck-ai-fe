import { useNavigate } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";

import SidebarLogo from "@/assets/Complicheck.svg";
import sidebarSmLogo from "@/assets/logo.svg";
import { cn } from "@/lib/utils";
import { useSidebarStore } from "@/stores/sidebar-store";

interface SidebarProps {
	children: React.ReactNode;
}

export default function Sidebar({ children }: SidebarProps) {
	const { collapsed, toggle, setActiveGroup, activeGroup } = useSidebarStore();
	const navigate = useNavigate();

	return (
		<aside
			className={cn(
				"group table-shadow relative z-50 hidden h-screen flex-col transition-all duration-300 md:flex",
				collapsed ? "w-20" : "w-60",
			)}
		>
			<button
				type="button"
				className={cn(
					"flex h-20 items-center hover:cursor-pointer",
					collapsed ? "justify-center" : "pl-6",
				)}
				onClick={() => {
					setActiveGroup(null);
					navigate({ to: "/" });
				}}
			>
				{collapsed ? (
					<img src={SidebarLogo} alt="Complicheck logo" />
				) : (
					<img src={sidebarSmLogo} alt="complichek" />
				)}
			</button>
			<ChevronRight
				className={cn(
					"hover:bg-primary absolute top-5 left-16 z-50 rotate-0 cursor-pointer rounded-full bg-gray-500 p-1 text-white opacity-0 shadow-md transition-opacity duration-500 group-hover:opacity-100",
					!collapsed && "left-56 rotate-180",
				)}
				onClick={() => {
					toggle();
					setActiveGroup(activeGroup);
				}}
				size={30}
				aria-label="Expand Sidebar"
				aria-roledescription="button"
			/>
			<nav className="text-n-800 flex flex-1 flex-col gap-2 overflow-x-hidden px-4 pt-4">
				{children}
			</nav>
		</aside>
	);
}
