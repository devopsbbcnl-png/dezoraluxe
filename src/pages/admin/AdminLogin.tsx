import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Shield, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { checkAdminStatus } from '@/lib/admin';
import { toast } from 'sonner';

const AdminLogin = () => {
	const navigate = useNavigate();
	const [formData, setFormData] = useState({
		email: '',
		password: '',
	});
	const [error, setError] = useState('');
	const [loading, setLoading] = useState(false);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setFormData({
			...formData,
			[e.target.id]: e.target.value,
		});
		setError('');
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		setError('');

		try {
			// Sign in with Supabase
			const { data, error: signInError } = await supabase.auth.signInWithPassword({
				email: formData.email,
				password: formData.password,
			});

			if (signInError) {
				setError(signInError.message || 'Invalid email or password');
				setLoading(false);
				return;
			}

			if (!data.user) {
				setError('Authentication failed');
				setLoading(false);
				return;
			}

			// Check if user is an admin
			const isAdmin = await checkAdminStatus();

			if (!isAdmin) {
				// Sign out if not admin
				await supabase.auth.signOut();
				setError('Access denied. You do not have admin privileges.');
				setLoading(false);
				return;
			}

			// Store admin session
			localStorage.setItem('adminAuthenticated', 'true');
			toast.success('Admin access granted');
			navigate('/admin/dashboard');
		} catch (err) {
			console.error('Admin login error:', err);
			setError('An error occurred. Please try again.');
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="min-h-screen bg-background flex items-center justify-center p-6">
			<div className="w-full max-w-md">
				<Card className="border-border shadow-card">
					<CardHeader className="text-center space-y-4">
						<div className="mx-auto w-16 h-16 rounded-full bg-card border-2 border-gold flex items-center justify-center">
							<Shield className="h-8 w-8 text-gold" />
						</div>
						<div>
							<CardTitle className="text-2xl">Admin Login</CardTitle>
							<CardDescription>
								Access the admin dashboard to manage your store
							</CardDescription>
						</div>
					</CardHeader>
					<CardContent>
						<form onSubmit={handleSubmit} className="space-y-4">
							{error && (
								<div className="p-3 rounded-md bg-destructive/10 border border-destructive/20 text-destructive text-sm">
									{error}
								</div>
							)}
							<div className="space-y-2">
								<Label htmlFor="email">Email</Label>
								<Input
									id="email"
									type="email"
									placeholder="admin@dezoraluxe.com"
									value={formData.email}
									onChange={handleChange}
									required
								/>
							</div>
							<div className="space-y-2">
								<Label htmlFor="password">Password</Label>
								<Input
									id="password"
									type="password"
									placeholder="Enter your password"
									value={formData.password}
									onChange={handleChange}
									required
								/>
							</div>
							<Button
								type="submit"
								variant="hero"
								className="w-full"
								size="lg"
								disabled={loading}
							>
								{loading ? (
									<>
										<Loader2 className="mr-2 h-4 w-4 animate-spin" />
										Signing in...
									</>
								) : (
									'Sign In'
								)}
							</Button>
						</form>
						<div className="mt-4 text-center text-xs text-muted-foreground">
							<p>Only users with admin privileges can access this page</p>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
};

export default AdminLogin;

