import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function LandingPage() {
	return (
		<main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-blue-200">
			<div className="max-w-xl w-full bg-white/90 rounded-2xl shadow-2xl p-10 flex flex-col items-center">
				<h1 className="text-4xl font-bold text-blue-900 mb-4 text-center">
					Welcome to My Blog Platform
				</h1>
				<p className="text-lg text-gray-700 mb-8 text-center">
					Share your thoughts, read inspiring stories, and manage your content
					with ease. Join our community to start blogging or explore the latest
					posts!
				</p>
				<div className="flex gap-4 w-full justify-center mb-6">
					<Link href="/login">
						<Button className="w-32" variant="default">
							Login
						</Button>
					</Link>
					<Link href="/register">
						<Button className="w-32" variant="outline">
							Register
						</Button>
					</Link>
				</div>
				<div className="mt-4 text-gray-500 text-sm text-center">
					Or browse public blogs without an account.
				</div>
				<Link href="/blogs">
					<Button className="mt-2 w-full" variant="ghost">
						Explore Blogs
					</Button>
				</Link>
			</div>
			<footer className="mt-10 text-gray-400 text-xs text-center">
				&copy; {new Date().getFullYear()} My Blog Platform. All rights reserved.
			</footer>
		</main>
	);
}
