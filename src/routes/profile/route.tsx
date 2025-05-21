import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { createLazyRoute, useNavigate } from "@tanstack/react-router";
import { Eye, EyeOff, Loader2, Lock, User } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { ApiResponse } from "types";
import { z } from "zod";
import { fetchWithInterceptor } from "../../lib/fetch-interceptor";
import { useAuthStore } from "../../stores/auth-store";

// Validation schemas
const BasicProfileInfoSchema = z.object({
	fullName: z
		.string()
		.trim()
		.min(1, {
			message: "Full name is required.",
		})
		.max(100, {
			message: "Full name must be at most 100 characters.",
		})
		.refine((value) => /^[a-zA-Z ]+$/.test(value), {
			message: "Full name must contain only alphabets.",
		}),
});

const PasswordSchema = z
	.object({
		currentPassword: z.string().min(1, "Current password is required."),
		newPassword: z
			.string()
			.min(8, "Password must contain at least 8 characters"),
		confirmNewPassword: z
			.string()
			.min(8, "Password must contain at least 8 characters"),
	})
	.superRefine(({ newPassword, confirmNewPassword }, ctx) => {
		if (newPassword !== confirmNewPassword) {
			ctx.addIssue({
				code: "custom",
				message: "New password and confirm password must match.",
				path: ["confirmNewPassword"],
			});
		}
	});

export const Route = createLazyRoute("/auth/profile")({
	component: Profile,
});

function Profile() {
	const [showCurrentPassword, setShowCurrentPassword] = useState(false);
	const [showNewPassword, setShowNewPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const { loginInfo, logout } = useAuthStore();
	const navigate = useNavigate();

	// Form for basic profile information
	const profileForm = useForm<z.infer<typeof BasicProfileInfoSchema>>({
		resolver: zodResolver(BasicProfileInfoSchema),
		defaultValues: {
			fullName: "",
		},
	});

	// Form for password update
	const passwordForm = useForm<z.infer<typeof PasswordSchema>>({
		resolver: zodResolver(PasswordSchema),
		defaultValues: {
			currentPassword: "",
			newPassword: "",
			confirmNewPassword: "",
		},
	});

	// Set initial form values when loginInfo is available
	useEffect(() => {
		if (loginInfo?.fullName) {
			profileForm.reset({ fullName: loginInfo.fullName });
		}
	}, [loginInfo, profileForm]);

	// Profile update mutation
	const { mutate: updateProfile, isPending: isProfileUpdating } = useMutation({
		mutationFn: async (data: z.infer<typeof BasicProfileInfoSchema>) => {
			if (!loginInfo?.roleId) {
				throw new Error("User role is missing. Cannot update profile.");
			}

			const payload = {
				id: loginInfo.roleId.toString(),
				fullName: data.fullName,
			};

			const response: ApiResponse<null> = await fetchWithInterceptor(
				"User/UpdateUserName",
				{
					method: "PUT",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify(payload),
				},
			);

			if (!response.succeeded) {
				throw new Error(response.message || "Failed to update profile.");
			}

			return response;
		},
		onSuccess: (response, variables) => {
			toast.success(response.message || "Profile updated successfully!");
			useAuthStore.getState().updateFullName(variables.fullName);
			profileForm.reset();
		},
		onError: (error: Error) => {
			toast.error(error.message || "An unexpected error occurred.");
		},
	});

	// Password update mutation
	const { mutate: updatePassword, isPending: isPasswordUpdating } = useMutation(
		{
			mutationFn: async (data: z.infer<typeof PasswordSchema>) => {
				if (!loginInfo?.roleId) {
					throw new Error("User role is missing. Cannot update password.");
				}

				const payload = {
					id: loginInfo.roleId.toString(),
					currentPassword: data.currentPassword,
					newPassword: data.newPassword,
					confirmNewPassword: data.confirmNewPassword,
				};

				const response: ApiResponse<null> = await fetchWithInterceptor(
					"User/UpdatePassword",
					{
						method: "PUT",
						headers: {
							"Content-Type": "application/json",
						},
						body: JSON.stringify(payload),
					},
				);

				if (!response.succeeded) {
					throw new Error(response.message || "Failed to update password.");
				}

				return response;
			},
			onSuccess: (response) => {
				toast.success(response.message || "Password updated successfully!");
				passwordForm.reset();
				logout();
				navigate({ to: "/login" });
			},
			onError: (error: Error) => {
				toast.error(error.message || "An unexpected error occurred.");
			},
		},
	);

	return (
		<section className="px-6 py-8">
			<div className="grid grid-cols-1 gap-6">
				{/* <div>
					<h1 className="text-2xl font-bold">Account Settings</h1>
					<Separator className="my-4" />
				</div> */}

				{/* Profile Information Form */}
				<div className="table-shadow p-6 rounded-md">
					<h2 className="text-xl font-semibold mb-6 flex items-center">
						<User className="mr-2 h-5 w-5 text-primary" />
						Basic Profile Information
					</h2>
					<Form {...profileForm}>
						<form
							id="profile-form"
							onSubmit={profileForm.handleSubmit((values) =>
								updateProfile(values),
							)}
							className="space-y-6"
						>
							<FormField
								control={profileForm.control}
								name="fullName"
								render={({ field }) => (
									<FormItem>
										<div className="flex items-center w-full">
											<FormLabel className="text-gray-600 text-sm font-medium w-40">
												Full Name
											</FormLabel>
											<div className="relative w-full lg:w-1/2 xl:w-1/3">
												<FormControl>
													<Input
														{...field}
														type="text"
														className="w-full p-2 border text-sm rounded"
														placeholder="Enter your full name"
													/>
												</FormControl>
												<FormMessage className="text-red-500 text-xs font-medium mt-1" />
											</div>
										</div>
									</FormItem>
								)}
							/>
							<div className="pt-4 flex gap-2">
								<Button
									type="submit"
									disabled={isProfileUpdating || !profileForm.formState.isDirty}
									className="w-40"
								>
									{isProfileUpdating ? (
										<>
											<Loader2 className="mr-2 h-4 w-4 animate-spin" />
										</>
									) : (
										"Update Information"
									)}
								</Button>
								{profileForm.formState.isDirty && (
									<Button
										type="button"
										variant="outline"
										onClick={() => profileForm.reset()}
										className="w-24"
									>
										Cancel
									</Button>
								)}
							</div>
						</form>
					</Form>
				</div>

				{/* Password Change Form */}
				<div className="table-shadow p-6 rounded-md">
					<h2 className="text-xl font-semibold mb-6 flex items-center">
						<Lock className="mr-2 h-5 w-5 text-primary" />
						Change Password
					</h2>
					<Form {...passwordForm}>
						<form
							id="password-form"
							onSubmit={passwordForm.handleSubmit((values) =>
								updatePassword(values),
							)}
							className="space-y-6"
						>
							<div className="space-y-6">
								{/* Current Password Field */}
								<FormField
									control={passwordForm.control}
									name="currentPassword"
									render={({ field }) => (
										<FormItem>
											<div className="flex items-center gap-4 w-full">
												<FormLabel className="text-gray-600 text-sm font-medium w-40">
													Current Password
												</FormLabel>
												<div className="flex flex-col w-full lg:w-1/2 xl:w-1/3">
													<div className="relative">
														<FormControl>
															<div className="relative">
																<Lock className="absolute left-3 top-1/2 z-10 h-4 w-4 -translate-y-1/2 transform text-gray-500" />
																<Input
																	{...field}
																	type={
																		showCurrentPassword ? "text" : "password"
																	}
																	className="w-full p-2 pl-10 border text-sm rounded"
																	placeholder="Current Password"
																/>
																{showCurrentPassword ? (
																	<EyeOff
																		className="absolute right-3 top-1/2 z-10 h-4 w-4 -translate-y-1/2 transform cursor-pointer text-gray-500 hover:text-gray-700"
																		onClick={() =>
																			setShowCurrentPassword(false)
																		}
																	/>
																) : (
																	<Eye
																		className="absolute right-3 top-1/2 z-10 h-4 w-4 -translate-y-1/2 transform cursor-pointer text-gray-500 hover:text-gray-700"
																		onClick={() => setShowCurrentPassword(true)}
																	/>
																)}
															</div>
														</FormControl>
														<FormMessage className="text-red-500 text-xs font-medium mt-1" />
													</div>
												</div>
											</div>
										</FormItem>
									)}
								/>

								{/* New Password Field */}
								<FormField
									control={passwordForm.control}
									name="newPassword"
									render={({ field }) => (
										<FormItem>
											<div className="flex items-center gap-4 w-full">
												<FormLabel className="text-gray-600 text-sm font-medium w-40">
													New Password
												</FormLabel>
												<div className="flex flex-col w-full lg:w-1/2 xl:w-1/3">
													<div className="relative">
														<FormControl>
															<div className="relative">
																<Lock className="absolute left-3 top-1/2 z-10 h-4 w-4 -translate-y-1/2 transform text-gray-500" />
																<Input
																	{...field}
																	type={showNewPassword ? "text" : "password"}
																	className="w-full p-2 pl-10 border text-sm rounded"
																	placeholder="New Password"
																/>
																{showNewPassword ? (
																	<EyeOff
																		className="absolute right-3 top-1/2 z-10 h-4 w-4 -translate-y-1/2 transform cursor-pointer text-gray-500 hover:text-gray-700"
																		onClick={() => setShowNewPassword(false)}
																	/>
																) : (
																	<Eye
																		className="absolute right-3 top-1/2 z-10 h-4 w-4 -translate-y-1/2 transform cursor-pointer text-gray-500 hover:text-gray-700"
																		onClick={() => setShowNewPassword(true)}
																	/>
																)}
															</div>
														</FormControl>
														<FormMessage className="text-red-500 text-xs font-medium mt-1" />
													</div>
												</div>
											</div>
										</FormItem>
									)}
								/>

								{/* Confirm New Password Field */}
								<FormField
									control={passwordForm.control}
									name="confirmNewPassword"
									render={({ field }) => (
										<FormItem>
											<div className="flex items-center gap-4 w-full">
												<FormLabel className="text-gray-600 text-sm font-medium w-40">
													Confirm Password
												</FormLabel>
												<div className="flex flex-col w-full lg:w-1/2 xl:w-1/3">
													<div className="relative">
														<FormControl>
															<div className="relative">
																<Lock className="absolute left-3 top-1/2 z-10 h-4 w-4 -translate-y-1/2 transform text-gray-500" />
																<Input
																	{...field}
																	type={
																		showConfirmPassword ? "text" : "password"
																	}
																	className="w-full p-2 pl-10 border text-sm rounded"
																	placeholder="Confirm New Password"
																/>
																{showConfirmPassword ? (
																	<EyeOff
																		className="absolute right-3 top-1/2 z-10 h-4 w-4 -translate-y-1/2 transform cursor-pointer text-gray-500 hover:text-gray-700"
																		onClick={() =>
																			setShowConfirmPassword(false)
																		}
																	/>
																) : (
																	<Eye
																		className="absolute right-3 top-1/2 z-10 h-4 w-4 -translate-y-1/2 transform cursor-pointer text-gray-500 hover:text-gray-700"
																		onClick={() => setShowConfirmPassword(true)}
																	/>
																)}
															</div>
														</FormControl>
														<FormMessage className="text-red-500 text-xs font-medium mt-1" />
													</div>
												</div>
											</div>
										</FormItem>
									)}
								/>

								{/* Submit Button */}
								<div className="pt-4 flex gap-2">
									<Button
										type="submit"
										disabled={
											isPasswordUpdating || !passwordForm.formState.isDirty
										}
										className="w-40"
									>
										{isPasswordUpdating ? (
											<>
												<Loader2 className="mr-2 h-4 w-4 animate-spin" />
											</>
										) : (
											"Change Password"
										)}
									</Button>
									{passwordForm.formState.isDirty && (
										<Button
											type="button"
											variant="outline"
											onClick={() => passwordForm.reset()}
											className="w-24"
										>
											Cancel
										</Button>
									)}
								</div>
							</div>
						</form>
					</Form>
				</div>
			</div>
		</section>
	);
}
