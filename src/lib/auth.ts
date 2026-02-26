import { supabase } from '@/lib/supabase';

/**
 * Signs out and clears client-side auth artifacts across the app.
 */
export const signOutAndClearSession = async () => {
	const clearLocalAuthData = () => {
		localStorage.removeItem('adminAuthenticated');
		sessionStorage.removeItem('adminAuthenticated');

		// Supabase stores auth in keys like "sb-<project-ref>-auth-token".
		for (const key of Object.keys(localStorage)) {
			if (key.startsWith('sb-') && key.endsWith('-auth-token')) {
				localStorage.removeItem(key);
			}
		}

		for (const key of Object.keys(sessionStorage)) {
			if (key.startsWith('sb-') && key.endsWith('-auth-token')) {
				sessionStorage.removeItem(key);
			}
		}
	};

	try {
		await supabase.auth.signOut();
	} finally {
		clearLocalAuthData();
	}
};
