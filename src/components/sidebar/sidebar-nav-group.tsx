import { ChevronRight } from "lucide-react";

import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useSidebarStore } from "@/stores/sidebar-store";
import { type ReactNode, isValidElement, useRef, useState } from "react";

interface SidebarNavGroupProps {
	title?: string;
	icon?: React.ReactNode;
	children: React.ReactNode;
	id: string;
}

const getHasActiveChild = (children: ReactNode): boolean => {
	if (!children) return false;

	const validChildren = Array.isArray(children) ? children : [children];

	return validChildren.some(
		(child) =>
			isValidElement<{ active?: boolean }>(child) &&
			child.props.active === true,
	);
};

export default function SidebarNavGroup({
	title,
	icon,
	children,
	id,
}: SidebarNavGroupProps) {
	const { collapsed, hidden, activeGroup, setActiveGroup } = useSidebarStore();
	const [popoverOpen, setPopoverOpen] = useState(false);

	const hasActiveChild = getHasActiveChild(children);
	const isOpen = activeGroup === id;
	const contentRef = useRef<HTMLDivElement>(null);

	// Toggle function - open/close this dropdown
	const handleToggle = () => {
		// If already open, close it
		if (isOpen) {
			setActiveGroup(null);
		} else {
			// Otherwise open this one (which will automatically close any other open one)
			setActiveGroup(id);
		}
	};

	if (collapsed && hidden) {
		return (
			<Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
				<PopoverTrigger asChild>
					<div
						onMouseEnter={() => setPopoverOpen(true)}
						onMouseLeave={() => setPopoverOpen(false)}
					>
						<button
							type="button"
							className={cn(
								"flex w-full items-center justify-center rounded-md p-2 text-sm font-medium hover:bg-[#EBECEF]",
								hasActiveChild && "text-primary",
							)}
						>
							{icon}
						</button>
					</div>
				</PopoverTrigger>
				<PopoverContent
					side="right"
					align="start"
					className="w-48 rounded-md border bg-white p-1 shadow-lg"
					sideOffset={4}
					onMouseEnter={() => setPopoverOpen(true)}
					onMouseLeave={() => setPopoverOpen(false)}
				>
					<div className="space-y-1 py-1.5">{children}</div>
				</PopoverContent>
			</Popover>
		);
	}

	return (
		<div className="space-y-1 text-[#39465f]">
			<button
				type="button"
				onClick={handleToggle}
				className={cn(
					"m-0 flex w-full cursor-pointer items-center justify-between gap-3 rounded-md border-l-4 border-transparent p-2 text-sm font-medium hover:bg-[#EBECEF]",
					isOpen && "bg-secondary hover:bg-secondary",
					collapsed && hidden && "justify-center",
				)}
			>
				<span
					className={cn(
						"flex items-center gap-2 text-left",
						isOpen ? "text-primary" : "#39465f",
					)}
				>
					{icon}
					{title && <span>{title}</span>}
				</span>
				<ChevronRight
					className={cn(
						"h-4 w-4 transition-transform",
						isOpen && "rotate-90",
						collapsed && "md:hidden",
					)}
					color={isOpen ? "oklch(58.6% 0.1116 288.66)" : "#39465f"}
				/>
			</button>

			<div
				ref={contentRef}
				style={{
					maxHeight: isOpen ? contentRef.current?.scrollHeight : 0,
				}}
				className="overflow-hidden px-4 transition-all duration-300 ease-in-out"
			>
				<div className="space-y-1 py-1">{children}</div>
			</div>
		</div>
	);
}
