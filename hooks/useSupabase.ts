import type { Session, SupabaseClient } from "@supabase/supabase-js";
import { useContext, useEffect, useState } from "react";

import { SupabaseContext } from "@/context/supabase-context";
import type { Database } from "@/types/database";

interface UseSupabaseProps {
	isLoaded: boolean;
	session: Session | null | undefined;
	supabase: SupabaseClient<Database>;
	signOut: () => Promise<void>;
}

export const useSupabase = (): UseSupabaseProps => {
	const supabase = useContext(SupabaseContext);
	const [isLoaded, setIsLoaded] = useState(false);
	const [session, setSession] = useState<Session | null>(null);

	useEffect(() => {
		if (!supabase) return;
		supabase.auth.getSession().then(({ data }) => {
			setSession(data.session);
			setIsLoaded(true);
		});
		const { data: listener } = supabase.auth.onAuthStateChange(
			(_event, newSession) => {
				setSession(newSession);
			},
		);
		return () => {
			listener.subscription.unsubscribe();
		};
	}, [supabase]);

	const signOut = async () => {
		if (!supabase) return;
		await supabase.auth.signOut();
		setSession(null);
	};

	if (!supabase) {
		throw new Error("useSupabase must be used within a SupabaseProvider");
	}

	return { isLoaded, session, supabase, signOut };
};
