import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useAuthStore } from "../../stores/auth-store";

import { Link, createLazyRoute } from "@tanstack/react-router";
import { Eye, EyeOff, Loader2, User } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import loginGif from "../../assets/login.gif";
import logo from "../../assets/logo.svg";

import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

export const Route = createLazyRoute("/login")({
	component: () => <Login />,
});

const formSchema = z.object({
	email: z
		.string()
		.nonempty({ message: "Email address is required" })
		.email({ message: "Invalid email address" })
		.max(100, { message: "Email must be at most 100 characters." }),

	password: z
		.string()
		.nonempty({ message: "Password is required" })
		.min(8, "Password must contain at least 8 characters")
		.max(50, { message: "Password must be at most 50 characters." })
		.regex(/[A-Z]/, "Password must contain at least one uppercase letter")
		.regex(/[a-z]/, "Password must contain at least one lowercase letter")
		.regex(/[0-9]/, "Password must contain at least one number")
		.regex(
			/[!@#$%^&*(),.?":{}|<>]/,
			"Password must contain at least one special character",
		),
});

export default function Login() {
	const { login, isPending, setPending } = useAuthStore();
	const navigate = Route.useNavigate();
	const [showPassword, setShowPassword] = useState(false);

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			email: "",
			password: "",
		},
	});
	const onSubmit = async (data: z.infer<typeof formSchema>) => {
		await login(data)
			.then(() => {
				navigate({ to: "/" });
			})
			.catch((err) => {
				toast.error(err.message);
				setPending(false);
			});
	};
	return (
		<section className="flex h-screen gap-0">
			<div className="min-h-screen md:flex items-center justify-center w-2/4 bg-white relative hidden">
				<img src={logo} alt="" className="absolute top-0 left-0 p-8" />
				<img src={loginGif} alt="" />
			</div>
			<article className="flex h-full w-full flex-col items-center justify-center p-4 md:w-1/2 lg:w-1/2 bg-primary">
				<div className="table-shadow w-full max-w-md rounded-sm bg-white px-8 py-6 text-black/90 ">
					<h2 className="mb-2 text-center text-3xl font-bold text-primary">
						Log In
					</h2>

					<p className="mb-8 text-center text-sm">
						Please enter your details to log in
					</p>
					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
							<FormField
								control={form.control}
								name="email"
								render={({ field }) => (
									<FormItem>
										<FormControl>
											<div className="relative w-full">
												<Input
													placeholder="Email address"
													{...field}
													className="placeholder-accent w-full rounded-sm border bg-white px-4 py-6 pe-10 text-black"
												/>
												<User className="absolute top-1/2 right-3 z-10 h-5 w-5 -translate-y-1/2 transform text-black" />
											</div>
										</FormControl>
										<FormMessage className="text-destructive text-xs" />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="password"
								render={({ field }) => (
									<FormItem>
										<FormControl>
											<div className="relative w-full">
												<Input
													type={showPassword ? "text" : "password"}
													placeholder="Password"
													{...field}
													className="placeholder-accent w-full rounded-sm border bg-white px-4 py-6 pe-10 text-black"
												/>
												{showPassword ? (
													<EyeOff
														className="text-primary absolute top-1/2 right-3 z-10 h-5 w-5 -translate-y-1/2 transform cursor-pointer"
														onClick={() => setShowPassword(false)}
													/>
												) : (
													<Eye
														className="absolute top-1/2 right-3 z-10 h-5 w-5 -translate-y-1/2 transform cursor-pointer"
														onClick={() => setShowPassword(true)}
													/>
												)}
											</div>
										</FormControl>
										<FormMessage className="text-destructive text-xs" />
									</FormItem>
								)}
							/>

							<Button
								type="submit"
								className="bg-primary w-full rounded-sm py-6 text-xl"
								disabled={form.formState.isSubmitting || isPending}
							>
								{isPending ? (
									<Loader2 className="animate-spin" />
								) : (
									<span>Login</span>
								)}
							</Button>

							<p className="text-left text-sm">
								<Link className="hover:underline" to="/forgot-password">
									Forgot Password
								</Link>
							</p>
						</form>
					</Form>
				</div>
			</article>
		</section>
	);
}
