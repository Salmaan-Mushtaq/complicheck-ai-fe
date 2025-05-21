import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Link, createLazyRoute } from "@tanstack/react-router";
import { ArrowLeft, Loader2, User } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { fetchWithInterceptor } from "../../lib/fetch-interceptor";

import ForgetGif from "@/assets/forget-pass.gif";
import Logo from "@/assets/logo-complicheck.svg";
import type { ApiResponse } from "types";

export interface ForgotPasswordInfo {
	email: string;
}

export const Route = createLazyRoute("/forgot-password")({
	component: ForgotPassword,
});

const formSchema = z.object({
	email: z
		.string()
		.nonempty({ message: "Email address is required" })
		.email({ message: "Invalid email address" })
		.max(100, {
			message: "Email address must be at most 100 characters long.",
		}),
});

type FormValues = z.infer<typeof formSchema>;

export default function ForgotPassword() {
	const navigate = Route.useNavigate();
	const form = useForm<FormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			email: "",
		},
	});

	const { isPending, mutate } = useMutation<
		ApiResponse<ForgotPasswordInfo>,
		Error,
		FormValues
	>({
		mutationFn: async (data: FormValues) => {
			const response = await fetchWithInterceptor<
				ApiResponse<ForgotPasswordInfo>
			>("Account/forgot-password", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(data),
			});

			if (!response.succeeded) {
				throw new Error(response.message || "Failed to send recovery email");
			}

			return response;
		},
		onSuccess: (data) => {
			toast.success(
				data.message || "Email sent successfully. Please check your inbox.",
			);
			form.reset();
			navigate({ to: "/login" });
		},
		onError: (error: Error) => {
			toast.error(
				error.message || "Failed to send recovery email. Please try again.",
			);
		},
	});

	const onSubmit = (values: FormValues) => {
		mutate(values);
	};

	return (
		<section className="flex min-h-screen flex-col md:flex-row">
			{/* Image section - hidden on mobile */}
			<div className="hidden relative bg-white md:flex md:w-1/2 items-center justify-center">
				<img
					src={Logo}
					alt="Company Logo"
					className="absolute top-4 left-4 h-12 object-contain"
				/>
				<div className="flex items-center justify-center p-6">
					<img
						src={ForgetGif}
						alt="Forgot Password Illustration"
						className="max-w-md w-full h-auto object-contain"
					/>
				</div>
			</div>

			{/* Form section - full width on mobile */}
			<div className="flex flex-1 flex-col bg-primary p-6 md:p-0">
				{/* Mobile logo (only visible on small screens) */}
				<div className="flex items-center mb-6 md:hidden">
					<img src={Logo} alt="Company Logo" className="h-10 object-contain" />
				</div>

				<div className="flex flex-1 flex-col items-center justify-center">
					<div className="table-shadow w-full max-w-md rounded-lg bg-white p-8">
						<div className="mb-8 text-center">
							<h2 className="text-2xl font-bold text-gray-800 mb-2">
								Forgot Password?
							</h2>
							<p className="text-gray-600 text-sm">
								Enter your email address to receive a password reset link
							</p>
						</div>

						<Form {...form}>
							<form
								onSubmit={form.handleSubmit(onSubmit)}
								className="space-y-6"
							>
								<FormField
									control={form.control}
									name="email"
									render={({ field, fieldState }) => (
										<FormItem>
											<FormControl>
												<div className="relative w-full">
													<User className="absolute left-3 top-1/2 z-10 h-5 w-5 -translate-y-1/2 transform text-gray-400" />
													<Input
														placeholder="Email address"
														{...field}
														className={`pl-10 py-6 bg-gray-50 rounded-md w-full focus-visible:ring-1 focus-visible:ring-primary transition-colors ${
															fieldState.invalid
																? "border-red-500 focus-visible:border-red-500"
																: "border-gray-200 focus-visible:border-primary"
														}`}
													/>
												</div>
											</FormControl>
											<FormMessage className="text-red-500 text-xs mt-1 font-medium" />
										</FormItem>
									)}
								/>

								<Button
									type="submit"
									className="bg-primary hover:bg-primary/90 w-full py-6 font-medium text-white rounded-md transition-colors"
									disabled={isPending}
								>
									{isPending ? (
										<div className="flex items-center justify-center">
											<Loader2 className="mr-2 h-4 w-4 animate-spin" />
											<span>Sending...</span>
										</div>
									) : (
										"Send Reset Link"
									)}
								</Button>

								<div className="pt-4">
									<Link
										to="/login"
										className="flex items-center text-sm text-primary hover:text-primary/80 transition-colors"
									>
										<ArrowLeft className="mr-1 h-4 w-4" />
										Back to login
									</Link>
								</div>
							</form>
						</Form>
					</div>
				</div>
			</div>
		</section>
	);
}
