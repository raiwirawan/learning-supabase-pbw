"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function DashboardRedirect() {
	const router = useRouter();
	useEffect(() => {
		async function checkRoleAndRedirect() {
			const {
				data: { user },
			} = await supabase.auth.getUser();
			if (!user) {
				router.replace("/login");
				return;
			}
			const { data, error } = await supabase
				.from("profiles")
				.select("role")
				.eq("id", user.id)
				.single();
			if (!error && data) {
				if (data.role === "admin") {
					router.replace("/dashboard/blogs");
				} else {
					router.replace("/blogs");
				}
			} else {
				router.replace("/blogs");
			}
		}
		checkRoleAndRedirect();
	}, [router]);
	return null;
}
