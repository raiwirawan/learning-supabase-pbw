"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function Login() {
	const router = useRouter();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		setError(null);

		try {
			const { data, error } = await supabase.auth.signInWithPassword({
				email,
				password,
			});

			if (error) {
				throw error;
			}

			if (data.user) {
				router.push("/");
			}
		} catch (error: unknown) {
			setError(
				error instanceof Error
					? error.message
					: "An error occurred during login."
			);
		} finally {
			setLoading(false);
		}
	};

	return (
		<main id="auth-login" className="bg-white">
			<div className="container mx-auto py-5 h-screen">
				<div className="flex items-center justify-center w-full h-full">
					<div className="w-75 lg:w-150 bg-white rounded-3xl p-5 lg:p-10 border shadow-2xl">
						<div className="text-black">
							<div className="font-semibold text-4xl mb-2">Log in</div>
							<div>To start viewing dashboard</div>
						</div>
						<form
							className="flex items-start justify-start flex-col my-6"
							onSubmit={handleSubmit}
						>
							{error && (
								<div className="py-2 px-5 bg-amber-300 text-white w-full flex items-center justify-start rounded-lg">
									{error}
								</div>
							)}

							<div className="flex items-start justify-start flex-col w-full my-1">
								<label
									htmlFor="email"
									className="text-gray-700 font-light mb-1"
								>
									Email
								</label>
								<input
									type="email"
									name="email"
									id="email"
									required
									className="w-full p-2 border border-gray-400 text-gray-800 rounded-lg placeholder:text-gray-400 placeholder:font-extralight"
									placeholder="mail@example.com"
									value={email}
									onChange={(e) => setEmail(e.target.value)}
								/>
							</div>
							<div className="flex items-start justify-start flex-col w-full my-1">
								<label
									htmlFor="password"
									className="text-gray-700 font-light mb-1"
								>
									Password
								</label>
								<input
									type="password"
									name="password"
									id="password"
									required
									className="w-full p-2 border border-gray-400 text-gray-800 rounded-lg placeholder:text-gray-400 placeholder:font-extralight"
									placeholder="password"
									value={password}
									onChange={(e) => setPassword(e.target.value)}
								/>
							</div>
							<div className="my-5 w-full">
								<button
									type="submit"
									disabled={loading}
									className="w-full bg-blue-700 py-3 text-white rounded-lg"
								>
									{loading ? "Loggin in...." : "Log in"}
								</button>
							</div>
						</form>
						<div className="text-center text-sm text-gray-700">
							{"Don't have an account yet? "}
							<Link
								href="/register"
								className="font-medium text-blue-600 hover:text-blue-500"
							>
								Register
							</Link>
						</div>
					</div>
				</div>
			</div>
		</main>
	);
}
