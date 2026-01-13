import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';

const AuthCallback = () => {
	const navigate = useNavigate();

	useEffect(() => {
		const handleAuthCallback = async () => {
			try {
				// Handle the OAuth callback
				const { data, error } = await supabase.auth.getSession();
				
				if (error) {
					console.error('Auth callback error:', error);
					navigate('/signin?error=auth_failed');
					return;
				}

				if (data.session?.user) {
					// Create or update user profile for social logins
					const user = data.session.user;
					const userMetadata = user.user_metadata;

					// Check if profile exists, if not create it
					const { data: profile } = await supabase
						.from('user_profiles')
						.select('id')
						.eq('id', user.id)
						.single();

					if (!profile) {
						// Create profile for new social login user
						await supabase.from('user_profiles').upsert({
							id: user.id,
							full_name: userMetadata?.full_name || userMetadata?.name || null,
							avatar_url: userMetadata?.avatar_url || null,
							updated_at: new Date().toISOString(),
						});
					}

					// Successful authentication
					navigate('/');
				} else {
					// No session found
					navigate('/signin');
				}
			} catch (error) {
				console.error('Auth callback error:', error);
				navigate('/signin?error=auth_failed');
			}
		};

		handleAuthCallback();
	}, [navigate]);

	return (
		<div className="min-h-screen bg-background flex items-center justify-center">
			<div className="text-center space-y-4">
				<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold mx-auto"></div>
				<p className="text-muted-foreground">Completing authentication...</p>
			</div>
		</div>
	);
};

export default AuthCallback;

