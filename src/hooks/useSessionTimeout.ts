import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { loadSettings } from '@/lib/settings';

/**
 * Hook to handle session timeout based on settings
 */
export const useSessionTimeout = () => {
	const navigate = useNavigate();
	const timeoutRef = useRef<NodeJS.Timeout | null>(null);
	const lastActivityRef = useRef<Date>(new Date());

	useEffect(() => {
		const settings = loadSettings();
		const timeoutMinutes = settings.security.sessionTimeout;

		if (timeoutMinutes <= 0) {
			return; // Disabled
		}

		const resetTimeout = () => {
			lastActivityRef.current = new Date();
			
			if (timeoutRef.current) {
				clearTimeout(timeoutRef.current);
			}

			timeoutRef.current = setTimeout(async () => {
				// Check if user is still active
				const timeSinceLastActivity =
					(new Date().getTime() - lastActivityRef.current.getTime()) / 1000 / 60;

				if (timeSinceLastActivity >= timeoutMinutes) {
					// Session expired
					await supabase.auth.signOut();
					localStorage.removeItem('adminAuthenticated');
					navigate('/admin/login');
				}
			}, timeoutMinutes * 60 * 1000);
		};

		// Track user activity
		const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
		const activityHandler = () => resetTimeout();

		events.forEach((event) => {
			window.addEventListener(event, activityHandler);
		});

		// Initial timeout
		resetTimeout();

		// Cleanup
		return () => {
			events.forEach((event) => {
				window.removeEventListener(event, activityHandler);
			});
			if (timeoutRef.current) {
				clearTimeout(timeoutRef.current);
			}
		};
	}, [navigate]);
};

