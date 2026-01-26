import type { SupabaseClient } from "@supabase/supabase-js";
import { createContext } from "react";
import type { Database } from "@/types/database";

export const SupabaseContext = createContext<SupabaseClient<Database> | null>(
	null,
);
