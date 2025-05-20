"use client";

import { useEffect, useState } from "react";
import { DataTable } from "@/components/ui/data-table";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import type { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";

// Blog type
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

// Modal for create/edit
function BlogModal({
	open,
	onClose,
	onSave,
	initial,
}: {
	open: boolean;
	onClose: () => void;
	onSave: (data: Partial<BlogPost>) => void;
	initial?: Partial<BlogPost>;
}) {
	const [title, setTitle] = useState(initial?.title || "");
	const [slug, setSlug] = useState(initial?.slug || "");
	const [excerpt, setExcerpt] = useState(initial?.excerpt || "");
	const [published, setPublished] = useState(initial?.published || false);
	const [content, setContent] = useState(initial?.content || "");

	useEffect(() => {
		setTitle(initial?.title || "");
		setSlug(initial?.slug || "");
		setExcerpt(initial?.excerpt || "");
		setPublished(initial?.published || false);
		setContent(initial?.content || "");
	}, [initial, open]);

	if (!open) return null;
	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
			<div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
				<h2 className="text-xl font-bold mb-4">
					{initial?.id ? "Edit Blog" : "Create Blog"}
				</h2>
				<form
					onSubmit={(e) => {
						e.preventDefault();
						onSave({ title, slug, excerpt, published, content });
					}}
					className="space-y-4"
				>
					<div>
						<label className="block text-sm font-medium">Title</label>
						<input
							className="w-full border rounded p-2"
							value={title}
							onChange={(e) => setTitle(e.target.value)}
							required
						/>
					</div>
					<div>
						<label className="block text-sm font-medium">Slug</label>
						<input
							className="w-full border rounded p-2"
							value={slug}
							onChange={(e) => setSlug(e.target.value)}
							required
						/>
					</div>
					<div>
						<label className="block text-sm font-medium">Excerpt</label>
						<textarea
							className="w-full border rounded p-2"
							value={excerpt || ""}
							onChange={(e) => setExcerpt(e.target.value)}
						/>
					</div>
					<div>
						<label className="block text-sm font-medium">Content</label>
						<textarea
							className="w-full border rounded p-2"
							value={content}
							onChange={(e) => setContent(e.target.value)}
							required
						/>
					</div>
					<div className="flex items-center gap-2">
						<input
							type="checkbox"
							id="published"
							checked={published}
							onChange={(e) => setPublished(e.target.checked)}
						/>
						<label htmlFor="published" className="text-sm">
							Published
						</label>
					</div>
					<div className="flex gap-2 justify-end">
						<Button type="button" variant="outline" onClick={onClose}>
							Cancel
						</Button>
						<Button type="submit">{initial?.id ? "Update" : "Create"}</Button>
					</div>
				</form>
			</div>
		</div>
	);
}

export default function DashboardBlogsPage() {
	const [data, setData] = useState<BlogPost[]>([]);
	const [modalOpen, setModalOpen] = useState(false);
	const [editBlog, setEditBlog] = useState<BlogPost | null>(null);
	const [role, setRole] = useState<string | null>(null);
	const [roleLoading, setRoleLoading] = useState(true);
	const router = useRouter();

	// Fetch user role
	useEffect(() => {
		async function fetchRole() {
			const {
				data: { user },
			} = await supabase.auth.getUser();
			if (user) {
				const { data, error } = await supabase
					.from("profiles")
					.select("role")
					.eq("id", user.id)
					.single();
				if (!error && data) setRole(data.role);
			}
			setRoleLoading(false);
		}
		fetchRole();
	}, []);

	// Fetch blogs
	async function fetchBlogs() {
		const { data, error } = await supabase
			.from("blog_posts")
			.select(
				"id, title, slug, excerpt, content, published, published_at, created_at, updated_at"
			)
			.order("created_at", { ascending: false });
		if (!error) setData(data || []);
	}

	useEffect(() => {
		fetchBlogs();
	}, []);

	// Create or update blog
	async function handleSave(blog: Partial<BlogPost>) {
		if (editBlog) {
			// Update
			const { error } = await supabase
				.from("blog_posts")
				.update({
					title: blog.title,
					slug: blog.slug,
					excerpt: blog.excerpt,
					content: blog.content,
					published: blog.published,
					updated_at: new Date().toISOString(),
				})
				.eq("id", editBlog.id);
			if (!error) fetchBlogs();
		} else {
			// Create
			const { error } = await supabase.from("blog_posts").insert({
				title: blog.title,
				slug: blog.slug,
				excerpt: blog.excerpt,
				content: blog.content,
				published: blog.published,
			});
			if (!error) fetchBlogs();
		}
		setModalOpen(false);
		setEditBlog(null);
	}

	// Delete blog
	async function handleDelete(id: string) {
		const { error } = await supabase.from("blog_posts").delete().eq("id", id);
		if (!error) fetchBlogs();
	}

	// Table columns
	const columns: ColumnDef<BlogPost>[] = [
		{ accessorKey: "title", header: "Title" },
		{ accessorKey: "slug", header: "Slug" },
		{ accessorKey: "excerpt", header: "Excerpt" },
		{
			accessorKey: "published",
			header: "Status",
			cell: ({ row }) =>
				row.getValue("published") ? (
					<span className="px-2 py-1 rounded bg-green-100 text-green-700 text-xs">
						Published
					</span>
				) : (
					<span className="px-2 py-1 rounded bg-gray-100 text-gray-500 text-xs">
						Draft
					</span>
				),
		},
		{
			accessorKey: "created_at",
			header: "Created",
			cell: ({ row }) =>
				new Date(row.getValue("created_at")).toLocaleDateString(),
		},
		{
			id: "actions",
			header: "Actions",
			cell: ({ row }) => (
				<div className="flex gap-2">
					<Button
						size="sm"
						variant="outline"
						onClick={() => {
							setEditBlog(row.original);
							setModalOpen(true);
						}}
					>
						Edit
					</Button>
					<Button
						size="sm"
						variant="destructive"
						onClick={() => handleDelete(row.original.id)}
					>
						Delete
					</Button>
				</div>
			),
		},
	];

	if (roleLoading)
		return (
			<div className="flex items-center justify-center h-screen">
				Checking permissions...
			</div>
		);
	if (role !== "admin")
		return (
			<div className="flex items-center justify-center h-screen text-red-500 font-bold text-xl">
				Access denied. Admins only.
			</div>
		);

	return (
		<div className="min-h-screen bg-gray-50/50">
			<div className="container mx-auto p-8">
				<div className="mb-8 flex items-center justify-between">
					<div>
						<h1 className="text-3xl font-bold text-gray-900">Blog Dashboard</h1>
						<p className="mt-2 text-gray-600">Manage your blog posts</p>
					</div>
					<Button
						onClick={() => {
							setEditBlog(null);
							setModalOpen(true);
						}}
					>
						+ Create Blog
					</Button>
					<Button
						variant="outline"
						className="ml-4"
						onClick={async () => {
							await supabase.auth.signOut();
							router.replace("/");
						}}
					>
						Logout
					</Button>
				</div>
				<div className="rounded-lg bg-white">
					<DataTable columns={columns} data={data} />
				</div>
				<BlogModal
					open={modalOpen}
					onClose={() => {
						setModalOpen(false);
						setEditBlog(null);
					}}
					onSave={handleSave}
					initial={editBlog || undefined}
				/>
			</div>
		</div>
	);
}
