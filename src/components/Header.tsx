import { cn } from "@/lib/utils";
import { useHeaderStore } from "@/stores/header-store";
import { useSidebarStore } from "@/stores/sidebar-store";
import { Link } from "@tanstack/react-router";
import { ChevronRight, Menu } from "lucide-react";
import { NavUser } from "./sidebar/nav-user";

export default function Header() {
	const { pageTitle, breadCrumbs } = useHeaderStore();
	const { switchHidden, collapsed, hidden, setActiveGroup } = useSidebarStore();
	return (
		<header
			className={cn(
				"fixed z-40 flex h-20 w-full items-center gap-4 bg-white px-4 shadow-sm transition-all duration-300",
				"md:justify-between md:gap-0 md:px-9",
				collapsed && hidden
					? "md:w-[calc(100vw-80px)]"
					: "md:w-[calc(100vw-240px)]",
			)}
		>
			<Menu
				size={28}
				onClick={() => switchHidden(false)}
				className="text-primary cursor-pointer md:hidden"
			/>

			<section>
				<h1 className="font-bold text-black/90 md:pb-1 md:text-[26px]">
					{pageTitle}
				</h1>
				<div className="flex items-center text-sm">
					<Link
						to="/"
						className={cn(
							breadCrumbs.length < 1
								? "cursor-default font-semibold text-gray-800 hover:text-gray-800"
								: "hover:text-primary text-gray-600",
						)}
						onClick={() => setActiveGroup("projects")}
					>
						Projects
					</Link>
					{breadCrumbs.length > 0 && (
						<ChevronRight size={16} className="mx-1 text-gray-400" />
					)}
					{breadCrumbs.map((item, index) => (
						<div key={item.to} className="flex items-center">
							<Link
								to={item.to}
								className={cn(
									"hover:text-primary text-gray-600",
									index === breadCrumbs.length - 1 &&
										"cursor-default font-semibold text-gray-800 hover:text-gray-800",
								)}
							>
								{item.name}
							</Link>
							{index < breadCrumbs.length - 1 && (
								<ChevronRight size={16} className="mx-1 text-gray-400" />
							)}
						</div>
					))}
				</div>
			</section>
			<div className="ms-auto flex items-center gap-4">
				<NavUser />
			</div>
		</header>
	);
}
