import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export interface SystemInfo {
	databaseStatus: 'connected' | 'disconnected' | 'error';
	lastBackup: string | null;
	storageUsed: string;
	apiStatus: 'operational' | 'degraded' | 'down';
}

export const useSystemInfo = () => {
	const [systemInfo, setSystemInfo] = useState<SystemInfo>({
		databaseStatus: 'connected',
		lastBackup: null,
		storageUsed: 'Calculating...',
		apiStatus: 'operational',
	});

	useEffect(() => {
		const fetchSystemInfo = async () => {
			try {
				// Check database connection
				const { error: dbError } = await supabase.from('products').select('id').limit(1);
				const databaseStatus = dbError ? 'error' : 'connected';

				// Get storage info (this would come from Supabase API or your backend)
				// For now, we'll estimate based on data
				const { count: productCount } = await supabase
					.from('products')
					.select('*', { count: 'exact', head: true });
				
				const { count: orderCount } = await supabase
					.from('orders')
					.select('*', { count: 'exact', head: true });

				// Rough estimate (this is just a placeholder)
				const estimatedSize = ((productCount || 0) * 0.1 + (orderCount || 0) * 0.05).toFixed(2);
				const storageUsed = `${estimatedSize} GB / 10 GB`;

				// Check API status
				const apiStatus = 'operational'; // This would check your API health

				setSystemInfo({
					databaseStatus,
					lastBackup: new Date().toISOString(),
					storageUsed,
					apiStatus,
				});
			} catch (error) {
				console.error('Error fetching system info:', error);
				setSystemInfo({
					databaseStatus: 'error',
					lastBackup: null,
					storageUsed: 'Error',
					apiStatus: 'down',
				});
			}
		};

		fetchSystemInfo();
		const interval = setInterval(fetchSystemInfo, 60000); // Update every minute

		return () => clearInterval(interval);
	}, []);

	return systemInfo;
};

