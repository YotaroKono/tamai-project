import type { SupabaseClient } from "@supabase/supabase-js";
import { createContext } from "react";

export const SupabaseContext = createContext<SupabaseClient | null>(null);
