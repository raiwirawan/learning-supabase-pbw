"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";

interface BlogPost {
	id: string;
	title: string;
	slug: string;
	excerpt: string | null;
	content: string | null;
	published: boolean;
	published_at: string | null;
	created_at: string;
	updated_at: string;
}

export default function BlogDetailPage() {
	const { id } = useParams();
	const [blog, setBlog] = useState<BlogPost | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		async function fetchBlog() {
			setLoading(true);
			const { data, error } = await supabase
				.from("blog_posts")
				.select(
					"id, title, slug, excerpt, content, published, published_at, created_at, updated_at"
				)
				.eq("id", id)
				.single();
			if (!error) setBlog(data);
			setLoading(false);
		}
		if (id) fetchBlog();
	}, [id]);

	if (loading) {
		return (
			<div className="flex items-center justify-center h-screen">
				Loading...
			</div>
		);
	}
	if (!blog) {
		return (
			<div className="flex items-center justify-center h-screen text-gray-500">
				Blog not found.
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gray-50/50">
			<div className="container mx-auto max-w-2xl p-8">
				<h1 className="text-4xl font-bold mb-4 text-gray-900">{blog.title}</h1>
				<div className="mb-2 text-gray-500 text-sm">
					{new Date(blog.created_at).toLocaleDateString()}
				</div>
				{blog.excerpt && (
					<div className="mb-4 text-lg text-gray-700 italic">
						{blog.excerpt}
					</div>
				)}
				<div
					className="prose prose-lg max-w-none text-gray-800"
					style={{ whiteSpace: "pre-line" }}
				>
					{blog.content}
				</div>
			</div>
		</div>
	);
}
