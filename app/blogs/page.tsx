"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

interface BlogPost {
	id: string;
	title: string;
	slug: string;
	excerpt: string | null;
	published: boolean;
	published_at: string | null;
	created_at: string;
	updated_at: string;
}

export default function BlogsListPage() {
	const [blogs, setBlogs] = useState<BlogPost[]>([]);
	const [loading, setLoading] = useState(true);
	const router = useRouter();

	useEffect(() => {
		async function fetchBlogs() {
			setLoading(true);
			const { data, error } = await supabase
				.from("blog_posts")
				.select(
					"id, title, slug, excerpt, published, published_at, created_at, updated_at"
				)
				.eq("published", true)
				.order("created_at", { ascending: false });
			if (!error) setBlogs(data || []);
			setLoading(false);
		}
		fetchBlogs();
	}, []);

	if (loading) {
		return (
			<div className="flex items-center justify-center h-screen">
				Loading...
			</div>
		);
	}

	return (
		<main className="min-h-screen bg-white">
			<div className="container mx-auto py-10">
				<div className="flex items-center justify-between mb-8">
					<h1 className="text-3xl font-bold">Blogs</h1>
					<button
						className="px-4 py-2 text-white bg-red-600 rounded hover:bg-red-700 transition"
						onClick={async () => {
							await supabase.auth.signOut();
							router.replace("/");
						}}
					>
						Logout
					</button>
				</div>
				<div className="max-w-2xl mx-auto">
					<h1 className="text-3xl font-bold mb-8 text-gray-900">All Blogs</h1>
					{blogs.length === 0 && (
						<div className="text-gray-500">No published blogs yet.</div>
					)}
					<ul className="space-y-6">
						{blogs.map((blog) => (
							<li
								key={blog.id}
								className="p-6 bg-white rounded-lg shadow hover:shadow-md transition"
							>
								<Link href={`/blogs/${blog.id}`} className="block">
									<h2 className="text-2xl font-semibold text-blue-700 hover:underline mb-1">
										{blog.title}
									</h2>
									<div className="text-gray-500 text-xs mb-2">
										{new Date(blog.created_at).toLocaleDateString()}
									</div>
									{blog.excerpt && (
										<div className="text-gray-700 mb-2">{blog.excerpt}</div>
									)}
									<span className="text-blue-500 text-sm hover:underline">
										Read more →
									</span>
								</Link>
							</li>
						))}
					</ul>
				</div>
			</div>
		</main>
	);
}
