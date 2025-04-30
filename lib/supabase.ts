import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
	(process.env.NEXT_PUBLIC_SUPABASE_URL as string) ||
	"https://ybwlwkzhoimjldloexqj.supabase.co";
const supabaseAnonKey =
	(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string) ||
	"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlid2x3a3pob2ltamxkbG9leHFqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU5MjE1NjksImV4cCI6MjA2MTQ5NzU2OX0.CdB-wWeFagWaM2tvn5RVUM_x065Xg8Yt76ybfvSm6m4";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
