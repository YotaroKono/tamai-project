import type { Session, SupabaseClient } from "@supabase/supabase-js";
import { createContext } from "react";
import type { Database } from "@/types/database";

export type SupabaseContextType = {
	supabase: SupabaseClient<Database>;
	session: Session | null;
	isLoaded: boolean;
	signOut: () => Promise<void>;
};

export const SupabaseContext = createContext<SupabaseContextType | null>(null);
