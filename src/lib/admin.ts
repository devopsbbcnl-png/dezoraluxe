import { supabase } from './supabase';

/**
 * Check if the current user is an admin
 */
export const checkAdminStatus = async (): Promise<boolean> => {
	try {
		const {
			data: { user },
		} = await supabase.auth.getUser();

		if (!user) return false;

		const { data, error } = await supabase.rpc('is_admin', {
			user_uuid: user.id,
		});

		if (error) {
			console.error('Error checking admin status:', error);
			return false;
		}

		return data === true;
	} catch (error) {
		console.error('Error checking admin status:', error);
		return false;
	}
};

/**
 * Get the admin role of the current user
 */
export const getAdminRole = async (): Promise<string | null> => {
	try {
		const {
			data: { user },
		} = await supabase.auth.getUser();

		if (!user) return null;

		const { data, error } = await supabase.rpc('get_admin_role', {
			user_uuid: user.id,
		});

		if (error) {
			console.error('Error getting admin role:', error);
			return null;
		}

		return data;
	} catch (error) {
		console.error('Error getting admin role:', error);
		return null;
	}
};

/**
 * Make a user an admin (requires super_admin role)
 */
export const makeUserAdmin = async (
	userId: string,
	role: 'admin' | 'super_admin' = 'admin'
): Promise<{ success: boolean; error: string | null }> => {
	try {
		const {
			data: { user },
		} = await supabase.auth.getUser();

		if (!user) {
			return { success: false, error: 'Not authenticated' };
		}

		// Check if current user is super_admin
		const currentUserRole = await getAdminRole();
		if (currentUserRole !== 'super_admin') {
			return { success: false, error: 'Only super admins can create admins' };
		}

		const { error } = await supabase.from('admin_roles').upsert({
			user_id: userId,
			role: role,
			created_by: user.id,
			updated_at: new Date().toISOString(),
		});

		if (error) {
			return { success: false, error: error.message };
		}

		return { success: true, error: null };
	} catch (error) {
		return {
			success: false,
			error: error instanceof Error ? error.message : 'Unknown error',
		};
	}
};

/**
 * Remove admin role from a user
 */
export const removeAdminRole = async (
	userId: string
): Promise<{ success: boolean; error: string | null }> => {
	try {
		const {
			data: { user },
		} = await supabase.auth.getUser();

		if (!user) {
			return { success: false, error: 'Not authenticated' };
		}

		// Check if current user is super_admin
		const currentUserRole = await getAdminRole();
		if (currentUserRole !== 'super_admin') {
			return { success: false, error: 'Only super admins can remove admin roles' };
		}

		// Prevent removing your own admin role
		if (userId === user.id) {
			return { success: false, error: 'Cannot remove your own admin role' };
		}

		const { error } = await supabase.from('admin_roles').delete().eq('user_id', userId);

		if (error) {
			return { success: false, error: error.message };
		}

		return { success: true, error: null };
	} catch (error) {
		return {
			success: false,
			error: error instanceof Error ? error.message : 'Unknown error',
		};
	}
};

