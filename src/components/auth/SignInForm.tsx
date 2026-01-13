import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { User, Package, Truck, Heart, MapPin, LogOut } from 'lucide-react';

const SignInForm = () => {
	const navigate = useNavigate();
	const { user, signIn, signInWithGoogle, signInWithFacebook, signOut } =
		useAuth();
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [loading, setLoading] = useState(false);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);

		const { error } = await signIn(email, password);

		if (error) {
			toast.error(error.message || 'Failed to sign in');
		} else {
			toast.success('Signed in successfully');
			navigate('/');
		}

		setLoading(false);
	};

	const handleGoogleSignIn = async () => {
		setLoading(true);
		const { error } = await signInWithGoogle();
		if (error) {
			toast.error(error.message || 'Failed to sign in with Google');
			setLoading(false);
		}
	};

	const handleFacebookSignIn = async () => {
		setLoading(true);
		const { error } = await signInWithFacebook();
		if (error) {
			toast.error(error.message || 'Failed to sign in with Facebook');
			setLoading(false);
		}
	};

	// If user is logged in, show account navigation links
	if (user) {
		return (
			<div className="w-full space-y-2">
				<div className="space-y-1 pb-3 border-b border-border">
					<p className="text-sm font-semibold text-foreground">{user.email}</p>
					<p className="text-xs text-muted-foreground">My Account</p>
				</div>

				<nav className="space-y-1">
					<Link
						to="/profile"
						className="flex items-center gap-3 px-3 py-2 rounded-md text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
					>
						<User className="h-4 w-4" />
						My Account
					</Link>
					<Link
						to="/orders"
						className="flex items-center gap-3 px-3 py-2 rounded-md text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
					>
						<Package className="h-4 w-4" />
						Order History
					</Link>
					<Link
						to="/orders"
						className="flex items-center gap-3 px-3 py-2 rounded-md text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
					>
						<Truck className="h-4 w-4" />
						Track Orders
					</Link>
					<Link
						to="/favorites"
						className="flex items-center gap-3 px-3 py-2 rounded-md text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
					>
						<Heart className="h-4 w-4" />
						My Saved Items
					</Link>
					<Link
						to="/profile"
						className="flex items-center gap-3 px-3 py-2 rounded-md text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
					>
						<MapPin className="h-4 w-4" />
						My Addresses
					</Link>
				</nav>

				<div className="pt-3 border-t border-border">
					<Button
						variant="outline"
						className="w-full justify-start"
						onClick={signOut}
					>
						<LogOut className="mr-2 h-4 w-4" />
						Sign Out
					</Button>
				</div>
			</div>
		);
	}

	// If user is not logged in, show sign-in form
	return (
		<div className="w-full space-y-6">
			<div className="relative space-y-2 text-center">
				<h2 className="text-2xl font-bold">Sign In</h2>
				<p className="text-sm text-muted-foreground">
					Enter your credentials to access your account
				</p>
			</div>

			<form onSubmit={handleSubmit} className="space-y-4">
				<div className="space-y-2">
					<Label htmlFor="email">Email</Label>
					<Input
						id="email"
						type="email"
						placeholder="name@example.com"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						required
					/>
				</div>

				<div className="space-y-2">
					<Label htmlFor="password">Password</Label>
					<Input
						id="password"
						type="password"
						placeholder="Enter your password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						required
					/>
				</div>

				<Button
					type="submit"
					className="w-full"
					variant="default"
					disabled={loading}
				>
					{loading ? 'Signing in...' : 'Sign In'}
				</Button>
			</form>

			<div className="relative">
				<div className="absolute inset-0 flex items-center">
					<span className="w-full border-t border-border" />
				</div>
				<div className="relative flex justify-center text-xs uppercase">
					<span className="bg-popover px-2 text-muted-foreground">
						Or continue with
					</span>
				</div>
			</div>

			<div className="grid grid-cols-2 gap-4">
				<Button
					type="button"
					variant="outline"
					className="w-full"
					onClick={handleGoogleSignIn}
					disabled={loading}
				>
					<svg
						className="mr-2 h-4 w-4"
						aria-hidden="true"
						focusable="false"
						data-prefix="fab"
						data-icon="google"
						role="img"
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 488 512"
					>
						<path
							fill="currentColor"
							d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 52.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"
						></path>
					</svg>
					Google
				</Button>
				<Button
					type="button"
					variant="outline"
					className="w-full"
					onClick={handleFacebookSignIn}
					disabled={loading}
				>
					<svg
						className="mr-2 h-4 w-4"
						aria-hidden="true"
						focusable="false"
						data-prefix="fab"
						data-icon="facebook"
						role="img"
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 512 512"
					>
						<path
							fill="currentColor"
							d="M504 256C504 119 393 8 256 8S8 119 8 256c0 123.78 90.69 226.38 209.25 245V327.69h-63V256h63v-54.64c0-62.15 37-96.48 93.67-96.48 27.14 0 55.52 4.84 55.52 4.84v61h-31.28c-30.8 0-40.41 19.12-40.41 38.73V256h68.78l-11 71.69h-57.78V501C413.31 482.38 504 379.78 504 256z"
						></path>
					</svg>
					Facebook
				</Button>
			</div>

			<div className="text-center text-sm">
				<span className="text-muted-foreground">Don't have an account? </span>
				<Link
					to="/signup"
					className="text-gold hover:text-gold-muted font-medium transition-colors"
				>
					Sign Up
				</Link>
			</div>
		</div>
	);
};

export default SignInForm;
