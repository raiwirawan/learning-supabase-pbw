import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY as string;

if (!supabaseUrl || !supabaseServiceRoleKey) {
	console.error("[admin-create-user] Missing Supabase env vars", {
		supabaseUrl,
		supabaseServiceRoleKey,
	});
	throw new Error("Supabase environment variables are not set.");
}

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

export async function POST(req: NextRequest) {
	try {
		const { email, password, role } = await req.json();
		if (!email || !password || !role) {
			return NextResponse.json({ error: "Missing fields" }, { status: 400 });
		}
		// Create user in Supabase Auth
		const { data, error } = await supabase.auth.admin.createUser({
			email,
			password,
			email_confirm: true,
		});
		if (error) {
			return NextResponse.json({ error: error.message }, { status: 400 });
		}
		if (data.user) {
			// Insert profile with role
			const { error: profileError } = await supabase.from("profiles").upsert({
				id: data.user.id,
				email: data.user.email ?? email,
				role,
			});
			if (profileError) {
				return NextResponse.json(
					{ error: profileError.message },
					{ status: 400 }
				);
			}
			return NextResponse.json({ success: true });
		}
		return NextResponse.json(
			{ error: "User creation failed" },
			{ status: 400 }
		);
	} catch (err) {
		console.error("[admin-create-user] API error:", err);
		const error = err instanceof Error ? err : new Error(String(err));
		return NextResponse.json(
			{ error: error.message || "Unknown error" },
			{ status: 500 }
		);
	}
}
