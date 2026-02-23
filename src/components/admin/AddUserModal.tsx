import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import { supabase } from '@/lib/supabase';
import { checkAdminStatus } from '@/lib/admin';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

interface AddUserModalProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onSuccess: () => void;
}

const AddUserModal = ({ open, onOpenChange, onSuccess }: AddUserModalProps) => {
	const navigate = useNavigate();
	const [formData, setFormData] = useState({
		email: '',
		password: '',
		full_name: '',
		phone: '',
	});
	const [loading, setLoading] = useState(false);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setFormData({ ...formData, [e.target.id]: e.target.value });
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);

		try {
			const isAdmin = await checkAdminStatus();
			if (!isAdmin) {
				toast.error('Admin privileges required to create users');
				setLoading(false);
				return;
			}

			const email = formData.email.trim();
			const password = formData.password;
			if (!email || !password) {
				toast.error('Email and password are required');
				setLoading(false);
				return;
			}

			if (password.length < 6) {
				toast.error('Password must be at least 6 characters');
				setLoading(false);
				return;
			}

			const { data, error } = await supabase.auth.signUp({
				email,
				password,
				options: {
					data: {
						full_name: formData.full_name.trim() || null,
						phone: formData.phone.trim() || null,
					},
				},
			});

			if (error) {
				toast.error(error.message || 'Failed to create user');
				setLoading(false);
				return;
			}

			if (data.user) {
				await supabase.from('user_profiles').upsert({
					id: data.user.id,
					full_name: formData.full_name.trim() || null,
					phone: formData.phone.trim() || null,
					updated_at: new Date().toISOString(),
				});
			}

			// If Supabase returned a session for the new user (e.g. when email confirmation is off),
			// sign out so the admin can log back in.
			if (data.session) {
				await supabase.auth.signOut();
				toast.success('User created. Please log in again.');
				onOpenChange(false);
				navigate('/admin/login');
				setLoading(false);
				return;
			}

			toast.success('User created successfully');
			setFormData({ email: '', password: '', full_name: '', phone: '' });
			onOpenChange(false);
			onSuccess();
		} catch (err) {
			console.error('Error creating user:', err);
			toast.error(err instanceof Error ? err.message : 'Failed to create user');
		} finally {
			setLoading(false);
		}
	};

	const handleOpenChange = (next: boolean) => {
		if (!next) setFormData({ email: '', password: '', full_name: '', phone: '' });
		onOpenChange(next);
	};

	return (
		<Dialog open={open} onOpenChange={handleOpenChange}>
			<DialogContent className="sm:max-w-md">
				<DialogHeader>
					<DialogTitle>Add New User</DialogTitle>
					<DialogDescription>
						Create a new user account. They can sign in with the email and password you set. Email confirmation may be required depending on your Supabase Auth settings.
					</DialogDescription>
				</DialogHeader>

				<form onSubmit={handleSubmit} className="space-y-4">
					<div className="space-y-2">
						<Label htmlFor="email">Email *</Label>
						<Input
							id="email"
							type="email"
							value={formData.email}
							onChange={handleChange}
							placeholder="user@example.com"
							required
							autoComplete="off"
						/>
					</div>

					<div className="space-y-2">
						<Label htmlFor="password">Password *</Label>
						<Input
							id="password"
							type="password"
							value={formData.password}
							onChange={handleChange}
							placeholder="Min. 6 characters"
							required
							minLength={6}
							autoComplete="new-password"
						/>
					</div>

					<div className="space-y-2">
						<Label htmlFor="full_name">Full name</Label>
						<Input
							id="full_name"
							value={formData.full_name}
							onChange={handleChange}
							placeholder="John Doe"
						/>
					</div>

					<div className="space-y-2">
						<Label htmlFor="phone">Phone</Label>
						<Input
							id="phone"
							type="tel"
							value={formData.phone}
							onChange={handleChange}
							placeholder="+234 800 000 0000"
						/>
					</div>

					<DialogFooter className="gap-2 sm:gap-0">
						<Button
							type="button"
							variant="outline"
							onClick={() => handleOpenChange(false)}
							disabled={loading}
						>
							Cancel
						</Button>
						<Button type="submit" variant="hero" disabled={loading}>
							{loading ? (
								<>
									<Loader2 className="mr-2 h-4 w-4 animate-spin" />
									Creating...
								</>
							) : (
								'Create User'
							)}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
};

export default AddUserModal;
