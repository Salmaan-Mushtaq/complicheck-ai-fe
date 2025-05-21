import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}
export const getInitials = (fullName: string): string => {
	if (!fullName) return "";

	const nameParts = fullName.trim().split(" ");

	if (nameParts.length === 1) return nameParts[0].substring(0, 2).toUpperCase();

	return (nameParts[0][0] + nameParts[1][0]).toUpperCase();
};
