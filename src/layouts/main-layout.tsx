import Header from "@/components/Header";
import Sidebar from "@/components/sidebar/sidebar";
import SidebarMobile from "@/components/sidebar/sidebar-mobile";
import { cn } from "@/lib/utils";
import { useSidebarStore } from "@/stores/sidebar-store";
import { ContentLayout } from "./content-layout";

export default function MainLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const { collapsed } = useSidebarStore();

	return (
		<main className="flex">
			<SidebarMobile>{children}</SidebarMobile>

			<Sidebar>{children}</Sidebar>
			<section
				className={cn(
					"h-screen w-screen overflow-y-auto bg-white transition-all duration-300",
					collapsed ? "md:w-[calc(100vw-6rem)]" : "md:w-[calc(100vw-15rem)]",
				)}
			>
				<article className="mb-20">
					<Header />
				</article>
				<ContentLayout />
			</section>
		</main>
	);
}
