// import { AvatarImage } from "@radix-ui/react-avatar";
import { useNavigate } from "@tanstack/react-router";
import { LogOut, User2 } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getInitials } from "@/lib/utils";
import { useAuthStore } from "@/stores/auth-store";

export function NavUser() {
	const navigate = useNavigate();
	const { logout, loginInfo } = useAuthStore();
	return (
		<section className="ms-auto">
			<DropdownMenu>
				<DropdownMenuTrigger className="w-full cursor-pointer rounded-sm p-2 outline-none focus-visible:ring-2">
					<div className="flex items-center justify-center gap-2 text-left text-sm">
						<Avatar className="ring-primary h-12 w-12 rounded-full ring-2 ring-offset-2">
							{/* {loginInfo?.imageUrl ? (
								<AvatarImage src={loginInfo.imageUrl} alt="profile-img" />
							) : ( */}
							<AvatarFallback>
								{getInitials(loginInfo?.fullName || "UN")}
							</AvatarFallback>
						</Avatar>
						<div className="grid flex-1 leading-none">
							<div className="text-muted-foreground text-xs">
								{loginInfo?.roleName ?? "Role"}
							</div>
							<div className="font-medium capitalize">
								{loginInfo?.fullName ?? "User Name"}
							</div>
						</div>
					</div>
				</DropdownMenuTrigger>
				<DropdownMenuContent
					className="w-46 py-2 text-[#39465f]"
					align="end"
					side="top"
					sideOffset={4}
				>
					<DropdownMenuGroup>
						<DropdownMenuItem
							className="flex gap-2  cursor-pointer"
							onClick={() => navigate({ to: "/profile" })}
						>
							<User2 className="h-4 w-4" />
							<span>Profile</span>
						</DropdownMenuItem>
					</DropdownMenuGroup>
					<DropdownMenuSeparator />
					<DropdownMenuItem
						className="gap-2  cursor-pointer"
						onClick={() => {
							logout();
							navigate({ to: "/login" });
						}}
					>
						<LogOut className="h-4 w-4" />
						<span>Log Out</span>
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</section>
	);
}
