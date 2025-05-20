"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import type { ColumnDef } from "@tanstack/react-table";

interface UserProfile {
	id: string;
	email: string;
	role: string;
}

function UserModal({
	open,
	onClose,
	onSave,
}: {
	open: boolean;
	onClose: () => void;
	onSave: (data: { email: string; password: string; role: string }) => void;
}) {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [role, setRole] = useState("viewer");

	useEffect(() => {
		if (open) {
			setEmail("");
			setPassword("");
			setRole("viewer");
		}
	}, [open]);

	if (!open) return null;
	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
			<div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
				<h2 className="text-xl font-bold mb-4">Create User</h2>
				<form
					onSubmit={(e) => {
						e.preventDefault();
						onSave({ email, password, role });
					}}
					className="space-y-4"
				>
					<div>
						<label className="block text-sm font-medium">Email</label>
						<input
							className="w-full border rounded p-2"
							type="email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							required
						/>
					</div>
					<div>
						<label className="block text-sm font-medium">Password</label>
						<input
							className="w-full border rounded p-2"
							type="password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							required
						/>
					</div>
					<div>
						<label className="block text-sm font-medium">Role</label>
						<select
							className="w-full border rounded p-2"
							value={role}
							onChange={(e) => setRole(e.target.value)}
						>
							<option value="viewer">Viewer</option>
							<option value="admin">Admin</option>
						</select>
					</div>
					<div className="flex gap-2 justify-end">
						<Button type="button" variant="outline" onClick={onClose}>
							Cancel
						</Button>
						<Button type="submit">Create</Button>
					</div>
				</form>
			</div>
		</div>
	);
}

export default function UsersDashboard() {
	const [users, setUsers] = useState<UserProfile[]>([]);
	const [loading, setLoading] = useState(true);
	const [role, setRole] = useState<string | null>(null);
	const [roleLoading, setRoleLoading] = useState(true);
	const [updating, setUpdating] = useState<string | null>(null);
	const [modalOpen, setModalOpen] = useState(false);
	const [createError, setCreateError] = useState<string | null>(null);

	// Fetch current user role
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

	// Fetch all users
	async function fetchUsers() {
		setLoading(true);
		const { data, error } = await supabase
			.from("profiles")
			.select("id, email, role")
			.order("email", { ascending: true });
		if (!error && data) setUsers(data);
		setLoading(false);
	}

	useEffect(() => {
		if (role === "admin") fetchUsers();
	}, [role]);

	// Change user role
	async function handleRoleChange(id: string, newRole: string) {
		setUpdating(id);
		const { error } = await supabase
			.from("profiles")
			.update({ role: newRole })
			.eq("id", id);
		if (!error) fetchUsers();
		setUpdating(null);
	}

	// Create user
	async function handleCreateUser({
		email,
		password,
		role,
	}: {
		email: string;
		password: string;
		role: string;
	}) {
		setCreateError(null);
		try {
			const res = await fetch("/api/admin-create-user", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ email, password, role }),
			});
			const result = await res.json();
			if (!res.ok) throw new Error(result.error || "Failed to create user");
			fetchUsers();
			setModalOpen(false);
		} catch (err) {
			setCreateError((err as Error).message || "Failed to create user");
		}
	}

	const columns: ColumnDef<UserProfile>[] = [
		{ accessorKey: "email", header: "Email" },
		{
			accessorKey: "role",
			header: "Role",
			cell: ({ row }) => (
				<span className="capitalize">{row.getValue("role")}</span>
			),
		},
		{
			id: "actions",
			header: "Actions",
			cell: ({ row }) => (
				<div className="flex gap-2">
					<Button
						size="sm"
						variant={row.original.role === "admin" ? "default" : "outline"}
						disabled={
							row.original.role === "admin" || updating === row.original.id
						}
						onClick={() => handleRoleChange(row.original.id, "admin")}
					>
						Promote to Admin
					</Button>
					<Button
						size="sm"
						variant={row.original.role === "viewer" ? "default" : "outline"}
						disabled={
							row.original.role === "viewer" || updating === row.original.id
						}
						onClick={() => handleRoleChange(row.original.id, "viewer")}
					>
						Demote to Viewer
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
					<h1 className="text-3xl font-bold">User Management</h1>
					<Button onClick={() => setModalOpen(true)}>+ Create User</Button>
				</div>
				<div className="rounded-lg bg-white p-6">
					{loading ? (
						<div>Loading users...</div>
					) : (
						<DataTable columns={columns} data={users} />
					)}
				</div>
				<UserModal
					open={modalOpen}
					onClose={() => setModalOpen(false)}
					onSave={handleCreateUser}
				/>
				{createError && <div className="mt-4 text-red-500">{createError}</div>}
			</div>
		</div>
	);
}
