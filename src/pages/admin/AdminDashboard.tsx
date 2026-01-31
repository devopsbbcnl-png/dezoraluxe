import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
	CardDescription,
} from '@/components/ui/card';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
} from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/seperator';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import {
	LayoutDashboard,
	Package,
	ShoppingCart,
	Users,
	Settings,
	LogOut,
	TrendingUp,
	DollarSign,
	Package2,
	UserPlus,
	ArrowUpRight,
	ArrowDownRight,
	Edit,
	Trash2,
	Plus,
	Mail,
	Loader2,
	Bell,
	Save,
	Globe,
	Palette,
	Shield,
	Database,
	Eye,
	X,
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import {
	checkAdminStatus,
	getAdminRole,
	makeUserAdmin,
	removeAdminRole,
} from '@/lib/admin';
import AddProductModal from '@/components/admin/AddProductModal';
import {
	saveSettings,
	loadSettings,
	formatDate,
	formatCurrency,
	getItemsPerPage,
	showNotification,
	showBrowserNotificationIfEnabled,
	isNotificationEnabled,
} from '@/lib/settings';
import {
	requestNotificationPermission,
	canShowNotifications,
} from '@/lib/notifications';
import { useSessionTimeout } from '@/hooks/useSessionTimeout';
import { useSystemInfo } from '@/hooks/useSystemInfo';
import type { Product, Order, Subscriber, OrderItem } from '@/types/database';
import { getOptimizedCloudinaryUrl } from '@/lib/cloudinary';

const AdminDashboard = () => {
	const navigate = useNavigate();
	const [activeTab, setActiveTab] = useState('overview');
	const [loading, setLoading] = useState(true);
	const [isAddProductOpen, setIsAddProductOpen] = useState(false);

	// Apply session timeout
	useSessionTimeout();

	// Load settings on mount
	const [settings, setSettings] = useState(() => loadSettings());

	// Get system information
	const systemInfo = useSystemInfo();
	const [settingsLoading, setSettingsLoading] = useState(false);
	const [currentPage, setCurrentPage] = useState(1);
	const [notificationPermission, setNotificationPermission] =
		useState<NotificationPermission>(
			typeof window !== 'undefined' && 'Notification' in window
				? Notification.permission
				: 'denied'
		);
	const [stats, setStats] = useState({
		totalRevenue: 0,
		totalOrders: 0,
		totalProducts: 0,
		totalUsers: 0,
		revenueChange: 0,
		ordersChange: 0,
		productsChange: 0,
		usersChange: 0,
	});
	const [products, setProducts] = useState<Product[]>([]);
	const [orders, setOrders] = useState<Order[]>([]);
	const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
	const [users, setUsers] = useState<
		Array<{
			id: string;
			email?: string;
			full_name: string | null;
			phone: string | null;
			avatar_url: string | null;
			created_at: string;
			updated_at: string | null;
			admin_role?: string | null;
		}>
	>([]);
	const [currentUserRole, setCurrentUserRole] = useState<string | null>(null);
	const [adminActionsLoading, setAdminActionsLoading] = useState<
		Record<string, boolean>
	>({});
	const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
	const [orderItems, setOrderItems] = useState<
		Array<OrderItem & { product?: Product }>
	>([]);
	const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
	const [loadingOrderItems, setLoadingOrderItems] = useState(false);

	useEffect(() => {
		const verifyAdminAccess = async () => {
			// Check if user is signed in
			const {
				data: { session },
			} = await supabase.auth.getSession();

			if (!session) {
				navigate('/admin/login');
				return;
			}

			// Check if user has admin privileges
			const isAdmin = await checkAdminStatus();

			if (!isAdmin) {
				toast.error('Access denied. Admin privileges required.');
				await supabase.auth.signOut();
				localStorage.removeItem('adminAuthenticated');
				navigate('/admin/login');
				return;
			}

			// Get current user's admin role
			const role = await getAdminRole();
			setCurrentUserRole(role);

			// Verify localStorage flag (for backward compatibility)
			const isAuthenticated = localStorage.getItem('adminAuthenticated');
			if (!isAuthenticated) {
				localStorage.setItem('adminAuthenticated', 'true');
			}

			// Load saved settings
			const savedSettings = loadSettings();
			setSettings(savedSettings);

			// Load data when component mounts
			loadDashboardData();
		};

		verifyAdminAccess();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [navigate]);

	useEffect(() => {
		// Reload data when tab changes
		if (activeTab === 'products') {
			loadProducts();
		} else if (activeTab === 'orders') {
			loadOrders();
		} else if (activeTab === 'users') {
			loadUsers();
		} else if (activeTab === 'subscribers') {
			loadSubscribers();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [activeTab]);

	const loadDashboardData = async () => {
		setLoading(true);
		try {
			await Promise.all([
				loadStats(),
				loadProducts(),
				loadOrders(),
				loadSubscribers(),
				loadUsers(),
			]);
		} catch (error) {
			console.error('Error loading dashboard data:', error);
			toast.error('Failed to load dashboard data');
		} finally {
			setLoading(false);
		}
	};

	const loadStats = async () => {
		try {
			// Get total revenue from orders
			const { data: ordersData, error: ordersError } = await supabase
				.from('orders')
				.select('total_amount, created_at');

			if (ordersError) throw ordersError;

			const totalRevenue =
				ordersData?.reduce(
					(sum, order) => sum + Number(order.total_amount),
					0
				) || 0;

			// Get total orders count
			const { count: ordersCount } = await supabase
				.from('orders')
				.select('*', { count: 'exact', head: true });

			// Get total products count
			const { count: productsCount } = await supabase
				.from('products')
				.select('*', { count: 'exact', head: true });

			// Get total users count
			const { count: usersCount } = await supabase
				.from('user_profiles')
				.select('*', { count: 'exact', head: true });

			// Calculate changes (simplified - you can enhance this with date comparisons)
			setStats({
				totalRevenue,
				totalOrders: ordersCount || 0,
				totalProducts: productsCount || 0,
				totalUsers: usersCount || 0,
				revenueChange: 12.5, // TODO: Calculate from previous period
				ordersChange: 8.3,
				productsChange: 5.2,
				usersChange: 15.7,
			});
		} catch (error) {
			console.error('Error loading stats:', error);
		}
	};

	const loadProducts = async () => {
		try {
			const itemsPerPage = getItemsPerPage();
			const { data, error } = await supabase
				.from('products')
				.select('*')
				.order('created_at', { ascending: false })
				.range(
					(currentPage - 1) * itemsPerPage,
					currentPage * itemsPerPage - 1
				);

			if (error) throw error;
			setProducts(data || []);

			// Check for low stock and notify if enabled
			if (data) {
				const lowStockProducts = data.filter((p: Product) => p.stock < 10);
				if (lowStockProducts.length > 0 && isNotificationEnabled('lowStock')) {
					const message = `${lowStockProducts.length} product(s) are running low on stock`;
					showNotification('lowStock', message, toast);
					await showBrowserNotificationIfEnabled(
						'lowStock',
						'Low Stock Alert',
						message,
						settings,
						toast
					);
				}
			}
		} catch (error) {
			console.error('Error loading products:', error);
			toast.error('Failed to load products');
		}
	};

	const loadOrders = async () => {
		try {
			const itemsPerPage = getItemsPerPage();
			const { data, error } = await supabase
				.from('orders')
				.select('*')
				.order('created_at', { ascending: false })
				.range(
					(currentPage - 1) * itemsPerPage,
					currentPage * itemsPerPage - 1
				);

			if (error) throw error;

			// Notify about new orders if enabled
			if (data && data.length > 0 && isNotificationEnabled('newOrders')) {
				const newOrders = data.filter((order: Order) => {
					const orderDate = new Date(order.created_at);
					const hoursSinceOrder =
						(new Date().getTime() - orderDate.getTime()) / (1000 * 60 * 60);
					return hoursSinceOrder < 24; // Orders from last 24 hours
				});
				if (newOrders.length > 0) {
					const message = `${newOrders.length} new order(s) in the last 24 hours`;
					showNotification('newOrders', message, toast);
					await showBrowserNotificationIfEnabled(
						'newOrders',
						'New Orders',
						message,
						settings,
						toast
					);
				}
			}

			setOrders(data || []);
		} catch (error) {
			console.error('Error loading orders:', error);
			toast.error('Failed to load orders');
		}
	};

	const loadSubscribers = async () => {
		try {
			const { data, error } = await supabase
				.from('subscribers')
				.select('*')
				.order('subscribed_at', { ascending: false });

			if (error) throw error;
			setSubscribers(data || []);
		} catch (error) {
			console.error('Error loading subscribers:', error);
			toast.error('Failed to load subscribers');
		}
	};

	const loadUsers = async () => {
		// Notify about new users if enabled
		if (isNotificationEnabled('newUsers')) {
			// This would check for new users in the last 24 hours
		}
		try {
			// Load admin roles for all users
			const { data: adminRolesData } = await supabase
				.from('admin_roles')
				.select('user_id, role');

			const adminRolesMap = new Map<string, string>();
			adminRolesData?.forEach((ar) => {
				adminRolesMap.set(ar.user_id, ar.role);
			});

			// Try to use the database function first (if created)
			try {
				const { data: authUsersData, error: authError } = await supabase.rpc(
					'get_all_users'
				);

				if (!authError && authUsersData && authUsersData.length > 0) {
					setUsers(
						authUsersData.map(
							(user: {
								id: string;
								email?: string;
								full_name: string | null;
								phone: string | null;
								avatar_url: string | null;
								created_at: string;
								updated_at: string | null;
							}) => ({
								id: user.id,
								email: user.email || 'N/A',
								full_name: user.full_name,
								phone: user.phone,
								avatar_url: user.avatar_url,
								created_at: user.created_at,
								updated_at: user.updated_at,
								admin_role: adminRolesMap.get(user.id) || null,
							})
						)
					);
					return;
				}
			} catch (rpcError) {
				console.log('RPC function not available, trying alternative method');
			}

			// Fallback: Try to use the view
			try {
				const { data: viewData, error: viewError } = await supabase
					.from('admin_users_view')
					.select('*')
					.order('created_at', { ascending: false });

				if (!viewError && viewData && viewData.length > 0) {
					setUsers(
						viewData.map(
							(user: {
								id: string;
								email?: string;
								full_name: string | null;
								phone: string | null;
								avatar_url: string | null;
								created_at: string;
								updated_at: string | null;
								role?: string;
							}) => ({
								id: user.id,
								email: user.email || 'N/A',
								full_name: user.full_name,
								phone: user.phone,
								avatar_url: user.avatar_url,
								created_at: user.created_at,
								updated_at: user.updated_at,
								admin_role: user.role || adminRolesMap.get(user.id) || null,
							})
						)
					);
					return;
				}
			} catch (viewError) {
				console.log('View not available, using user_profiles only');
			}

			// Final fallback: Use user_profiles table
			// Note: This will only show users who have profiles created
			// Make sure user_profiles are created for all users (see AuthContext.tsx)
			const { data: profilesData, error: profilesError } = await supabase
				.from('user_profiles')
				.select('*')
				.order('created_at', { ascending: false });

			if (profilesError) {
				throw profilesError;
			}

			// Get emails from auth.users by checking each profile
			// This is a workaround - ideally use the function or view above
			const usersWithEmail =
				profilesData?.map((profile) => ({
					...profile,
					email: 'Check auth.users', // Email not available without function/view
					admin_role: adminRolesMap.get(profile.id) || null,
				})) || [];

			setUsers(usersWithEmail);

			if (usersWithEmail.length === 0) {
				toast.info(
					'No users found. Run the SQL function in SUPABASE_USERS_FUNCTION.sql to see all auth users.'
				);
			}
		} catch (error) {
			console.error('Error loading users:', error);
			toast.error(
				'Failed to load users. Run SUPABASE_USERS_FUNCTION.sql in your Supabase SQL Editor to enable full user listing.'
			);
		}
	};

	const handleDeleteProduct = async (productId: string) => {
		if (!confirm('Are you sure you want to delete this product?')) return;

		try {
			const { error } = await supabase
				.from('products')
				.delete()
				.eq('id', productId);

			if (error) throw error;

			toast.success('Product deleted successfully');

			// Check for low stock after deletion
			if (isNotificationEnabled('lowStock')) {
				// This will be checked when products reload
			}

			loadProducts();
			loadStats();
		} catch (error) {
			console.error('Error deleting product:', error);
			toast.error('Failed to delete product');
		}
	};

	const handleDeleteSubscriber = async (subscriberId: string) => {
		if (!confirm('Are you sure you want to delete this subscriber?')) return;

		try {
			const { error } = await supabase
				.from('subscribers')
				.delete()
				.eq('id', subscriberId);

			if (error) throw error;

			toast.success('Subscriber deleted successfully');
			loadSubscribers();
		} catch (error) {
			console.error('Error deleting subscriber:', error);
			toast.error('Failed to delete subscriber');
		}
	};

	const handleMakeAdmin = async (
		userId: string,
		role: 'admin' | 'super_admin' = 'admin'
	) => {
		if (!confirm(`Are you sure you want to make this user a ${role}?`)) return;

		setAdminActionsLoading((prev) => ({ ...prev, [userId]: true }));
		try {
			const result = await makeUserAdmin(userId, role);
			if (result.success) {
				toast.success(`User has been made a ${role}`);
				loadUsers();
			} else {
				toast.error(result.error || 'Failed to make user admin');
			}
		} catch (error) {
			console.error('Error making user admin:', error);
			toast.error('Failed to make user admin');
		} finally {
			setAdminActionsLoading((prev) => ({ ...prev, [userId]: false }));
		}
	};

	const handleRemoveAdmin = async (userId: string) => {
		if (
			!confirm(
				'Are you sure you want to remove admin privileges from this user?'
			)
		)
			return;

		setAdminActionsLoading((prev) => ({ ...prev, [userId]: true }));
		try {
			const result = await removeAdminRole(userId);
			if (result.success) {
				toast.success('Admin privileges removed');
				loadUsers();
			} else {
				toast.error(result.error || 'Failed to remove admin role');
			}
		} catch (error) {
			console.error('Error removing admin role:', error);
			toast.error('Failed to remove admin role');
		} finally {
			setAdminActionsLoading((prev) => ({ ...prev, [userId]: false }));
		}
	};

	const handleUpdateOrderStatus = async (
		orderId: string,
		newStatus: Order['status']
	) => {
		try {
			const { error } = await supabase
				.from('orders')
				.update({ status: newStatus, updated_at: new Date().toISOString() })
				.eq('id', orderId);

			if (error) throw error;

			toast.success('Order status updated');
			loadOrders();
			loadStats();
		} catch (error) {
			console.error('Error updating order status:', error);
			toast.error('Failed to update order status');
		}
	};

	const loadOrderItems = async (orderId: string) => {
		setLoadingOrderItems(true);
		try {
			// Fetch order items with product details
			const { data: itemsData, error: itemsError } = await supabase
				.from('order_items')
				.select('*')
				.eq('order_id', orderId);

			if (itemsError) throw itemsError;

			// Fetch product details for each item
			const itemsWithProducts = await Promise.all(
				(itemsData || []).map(async (item) => {
					const { data: productData, error: productError } = await supabase
						.from('products')
						.select('*')
						.eq('id', item.product_id)
						.single();

					if (productError) {
						console.error('Error loading product:', productError);
					}

					return {
						...item,
						product: productData || undefined,
					};
				})
			);

			setOrderItems(itemsWithProducts);
		} catch (error) {
			console.error('Error loading order items:', error);
			toast.error('Failed to load order items');
			setOrderItems([]);
		} finally {
			setLoadingOrderItems(false);
		}
	};

	const handleViewOrder = async (order: Order) => {
		setSelectedOrder(order);
		setIsOrderModalOpen(true);
		await loadOrderItems(order.id);
	};

	const handleSaveSettings = async () => {
		setSettingsLoading(true);
		try {
			const success = await saveSettings(settings);
			if (success) {
				toast.success('Settings saved successfully');
				// Reload page to apply settings (or just reload data)
				window.location.reload();
			} else {
				toast.error('Failed to save settings');
			}
		} catch (error) {
			console.error('Error saving settings:', error);
			toast.error('Failed to save settings');
		} finally {
			setSettingsLoading(false);
		}
	};

	const handleLogout = async () => {
		localStorage.removeItem('adminAuthenticated');
		await supabase.auth.signOut();
		toast.success('Logged out successfully');
		navigate('/admin/login');
	};

	// Get customer name from order shipping address
	const getCustomerName = (order: Order) => {
		if (
			typeof order.shipping_address === 'object' &&
			order.shipping_address?.name
		) {
			return order.shipping_address.name;
		}
		return 'Unknown Customer';
	};

	const formatPrice = (price: number) => {
		return formatCurrency(price, settings.store.currency);
	};

	const sidebarItems = [
		{ id: 'overview', label: 'Overview', icon: LayoutDashboard },
		{ id: 'products', label: 'Products', icon: Package },
		{ id: 'orders', label: 'Orders', icon: ShoppingCart },
		{ id: 'users', label: 'Users', icon: Users },
		{ id: 'subscribers', label: 'Subscribers', icon: Mail },
		{ id: 'settings', label: 'Settings', icon: Settings },
	];

	return (
		<div className="min-h-screen bg-background">
			{/* Sidebar */}
			<div className="fixed left-0 top-0 h-full w-64 bg-card border-r border-border p-6">
				<div className="flex flex-col h-full">
					<div className="mb-8">
						<img
							src="/images/DLX.png"
							alt="Dezora Luxe"
							className="h-12 w-auto mb-2 object-contain"
						/>
						<p className="text-xs text-muted-foreground">Admin Dashboard</p>
					</div>

					<nav className="flex-1 space-y-2">
						{sidebarItems.map((item) => {
							const Icon = item.icon;
							return (
								<button
									key={item.id}
									onClick={() => setActiveTab(item.id)}
									className={`w-full flex items-center gap-3 px-4 py-3 rounded-md transition-colors ${
										activeTab === item.id
											? 'bg-primary text-primary-foreground'
											: 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
									}`}
								>
									<Icon className="h-5 w-5" />
									<span className="font-medium">{item.label}</span>
								</button>
							);
						})}
					</nav>

					<Button
						variant="outline"
						className="w-full justify-start"
						onClick={handleLogout}
					>
						<LogOut className="mr-2 h-4 w-4" />
						Logout
					</Button>
				</div>
			</div>

			{/* Main Content */}
			<div className="ml-64 p-8">
				{loading && activeTab === 'overview' && (
					<div className="flex items-center justify-center py-12">
						<Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
					</div>
				)}

				{activeTab === 'overview' && !loading && (
					<div className="space-y-8">
						<div>
							<h2 className="text-3xl font-bold mb-2">Dashboard Overview</h2>
							<p className="text-muted-foreground">
								Welcome back! Here's what's happening with your store today.
							</p>
						</div>

						{/* Stats Grid */}
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
							<Card className="border-border">
								<CardHeader className="flex flex-row items-center justify-between pb-2">
									<CardTitle className="text-sm font-medium text-muted-foreground">
										Total Revenue
									</CardTitle>
									<DollarSign className="h-4 w-4 text-muted-foreground" />
								</CardHeader>
								<CardContent>
									<div className="text-2xl font-bold">
										{formatPrice(stats.totalRevenue)}
									</div>
									<div className="flex items-center gap-1 text-xs text-green-500 mt-1">
										<ArrowUpRight className="h-3 w-3" />
										{stats.revenueChange}% from last month
									</div>
								</CardContent>
							</Card>

							<Card className="border-border">
								<CardHeader className="flex flex-row items-center justify-between pb-2">
									<CardTitle className="text-sm font-medium text-muted-foreground">
										Total Orders
									</CardTitle>
									<ShoppingCart className="h-4 w-4 text-muted-foreground" />
								</CardHeader>
								<CardContent>
									<div className="text-2xl font-bold">{stats.totalOrders}</div>
									<div className="flex items-center gap-1 text-xs text-green-500 mt-1">
										<ArrowUpRight className="h-3 w-3" />
										{stats.ordersChange}% from last month
									</div>
								</CardContent>
							</Card>

							<Card className="border-border">
								<CardHeader className="flex flex-row items-center justify-between pb-2">
									<CardTitle className="text-sm font-medium text-muted-foreground">
										Total Products
									</CardTitle>
									<Package2 className="h-4 w-4 text-muted-foreground" />
								</CardHeader>
								<CardContent>
									<div className="text-2xl font-bold">
										{stats.totalProducts}
									</div>
									<div className="flex items-center gap-1 text-xs text-green-500 mt-1">
										<ArrowUpRight className="h-3 w-3" />
										{stats.productsChange}% from last month
									</div>
								</CardContent>
							</Card>

							<Card className="border-border">
								<CardHeader className="flex flex-row items-center justify-between pb-2">
									<CardTitle className="text-sm font-medium text-muted-foreground">
										Total Users
									</CardTitle>
									<UserPlus className="h-4 w-4 text-muted-foreground" />
								</CardHeader>
								<CardContent>
									<div className="text-2xl font-bold">{stats.totalUsers}</div>
									<div className="flex items-center gap-1 text-xs text-green-500 mt-1">
										<ArrowUpRight className="h-3 w-3" />
										{stats.usersChange}% from last month
									</div>
								</CardContent>
							</Card>
						</div>

						{/* Recent Orders */}
						<Card className="border-border">
							<CardHeader>
								<CardTitle>Recent Orders</CardTitle>
							</CardHeader>
							<CardContent>
								<Table>
									<TableHeader>
										<TableRow>
											<TableHead>Order ID</TableHead>
											<TableHead>Customer</TableHead>
											<TableHead>Amount</TableHead>
											<TableHead>Status</TableHead>
											<TableHead>Date</TableHead>
										</TableRow>
									</TableHeader>
									<TableBody>
										{orders.slice(0, 10).map((order) => (
											<TableRow key={order.id}>
												<TableCell className="font-medium">
													{order.order_number}
												</TableCell>
												<TableCell>{getCustomerName(order)}</TableCell>
												<TableCell>
													{formatPrice(Number(order.total_amount))}
												</TableCell>
												<TableCell>
													<span
														className={`px-2 py-1 rounded-full text-xs ${
															order.status === 'delivered'
																? 'bg-green-500/20 text-green-500'
																: order.status === 'shipped'
																? 'bg-blue-500/20 text-blue-500'
																: order.status === 'processing'
																? 'bg-yellow-500/20 text-yellow-500'
																: 'bg-gray-500/20 text-gray-500'
														}`}
													>
														{order.status}
													</span>
												</TableCell>
												<TableCell>
													{formatDate(
														order.created_at,
														settings.display.dateFormat
													)}
												</TableCell>
											</TableRow>
										))}
										{orders.length === 0 && (
											<TableRow>
												<TableCell
													colSpan={5}
													className="text-center py-8 text-muted-foreground"
												>
													No orders found
												</TableCell>
											</TableRow>
										)}
									</TableBody>
								</Table>
							</CardContent>
						</Card>
					</div>
				)}

				{activeTab === 'products' && (
					<div className="space-y-8">
						<div className="flex items-center justify-between">
							<div>
								<h2 className="text-3xl font-bold mb-2">Products</h2>
								<p className="text-muted-foreground">
									Manage your product catalog
								</p>
							</div>
							<Button variant="hero" onClick={() => setIsAddProductOpen(true)}>
								<Plus className="mr-2 h-4 w-4" />
								Add Product
							</Button>
						</div>

						<Card className="border-border">
							<CardContent className="p-0">
								<Table>
									<TableHeader>
										<TableRow>
											<TableHead>ID</TableHead>
											<TableHead>Name</TableHead>
											<TableHead>Category</TableHead>
											<TableHead>Price</TableHead>
											<TableHead>Stock</TableHead>
											<TableHead className="text-right">Actions</TableHead>
										</TableRow>
									</TableHeader>
									<TableBody>
										{products.length === 0 ? (
											<TableRow>
												<TableCell
													colSpan={6}
													className="text-center py-8 text-muted-foreground"
												>
													No products found. Add your first product!
												</TableCell>
											</TableRow>
										) : (
											products.map((product) => (
												<TableRow key={product.id}>
													<TableCell className="font-medium">
														{product.id.slice(0, 8)}...
													</TableCell>
													<TableCell>{product.name}</TableCell>
													<TableCell>{product.category}</TableCell>
													<TableCell>
														{formatPrice(Number(product.price))}
													</TableCell>
													<TableCell>{product.stock}</TableCell>
													<TableCell className="text-right">
														<div className="flex justify-end gap-2">
															<Button variant="ghost" size="icon" title="Edit">
																<Edit className="h-4 w-4" />
															</Button>
															<Button
																variant="ghost"
																size="icon"
																className="text-destructive"
																onClick={() => handleDeleteProduct(product.id)}
																title="Delete"
															>
																<Trash2 className="h-4 w-4" />
															</Button>
														</div>
													</TableCell>
												</TableRow>
											))
										)}
									</TableBody>
								</Table>
							</CardContent>
						</Card>
					</div>
				)}

				{activeTab === 'orders' && (
					<div className="space-y-8">
						<div>
							<h2 className="text-3xl font-bold mb-2">Orders</h2>
							<p className="text-muted-foreground">
								View and manage customer orders
							</p>
						</div>

						<Card className="border-border">
							<CardContent className="p-0">
								<Table>
									<TableHeader>
										<TableRow>
											<TableHead>Order ID</TableHead>
											<TableHead>Customer</TableHead>
											<TableHead>Amount</TableHead>
											<TableHead>Status</TableHead>
											<TableHead>Date</TableHead>
											<TableHead className="text-right">Actions</TableHead>
										</TableRow>
									</TableHeader>
									<TableBody>
										{orders.length === 0 ? (
											<TableRow>
												<TableCell
													colSpan={6}
													className="text-center py-8 text-muted-foreground"
												>
													No orders found
												</TableCell>
											</TableRow>
										) : (
											orders.map((order) => (
												<TableRow key={order.id}>
													<TableCell className="font-medium">
														{order.order_number}
													</TableCell>
													<TableCell>{getCustomerName(order)}</TableCell>
													<TableCell>
														{formatPrice(Number(order.total_amount))}
													</TableCell>
													<TableCell>
														<span
															className={`px-2 py-1 rounded-full text-xs ${
																order.status === 'delivered'
																	? 'bg-green-500/20 text-green-500'
																	: order.status === 'shipped'
																	? 'bg-blue-500/20 text-blue-500'
																	: order.status === 'processing'
																	? 'bg-yellow-500/20 text-yellow-500'
																	: 'bg-gray-500/20 text-gray-500'
															}`}
														>
															{order.status}
														</span>
													</TableCell>
													<TableCell>
														{formatDate(
															order.created_at,
															settings.display.dateFormat
														)}
													</TableCell>
													<TableCell className="text-right">
														<Button
															variant="ghost"
															size="sm"
															onClick={() => handleViewOrder(order)}
														>
															<Eye className="mr-2 h-4 w-4" />
															View
														</Button>
													</TableCell>
												</TableRow>
											))
										)}
									</TableBody>
								</Table>
							</CardContent>
						</Card>
					</div>
				)}

				{activeTab === 'users' && (
					<div className="space-y-8">
						<div>
							<h2 className="text-3xl font-bold mb-2">Users</h2>
							<p className="text-muted-foreground">Manage user accounts</p>
						</div>

						<Card className="border-border">
							<CardContent className="p-0">
								<Table>
									<TableHeader>
										<TableRow>
											<TableHead>ID</TableHead>
											<TableHead>Name</TableHead>
											<TableHead>Email</TableHead>
											<TableHead>Phone</TableHead>
											<TableHead>Role</TableHead>
											<TableHead>Joined</TableHead>
											{currentUserRole === 'super_admin' && (
												<TableHead className="text-right">Actions</TableHead>
											)}
										</TableRow>
									</TableHeader>
									<TableBody>
										{users.length === 0 ? (
											<TableRow>
												<TableCell
													colSpan={currentUserRole === 'super_admin' ? 7 : 6}
													className="text-center py-8 text-muted-foreground"
												>
													No users found
												</TableCell>
											</TableRow>
										) : (
											users.map((user) => (
												<TableRow key={user.id}>
													<TableCell className="font-medium">
														{user.id.slice(0, 8)}...
													</TableCell>
													<TableCell>{user.full_name || 'N/A'}</TableCell>
													<TableCell>{user.email || 'N/A'}</TableCell>
													<TableCell>{user.phone || 'N/A'}</TableCell>
													<TableCell>
														{user.admin_role ? (
															<span
																className={`px-2 py-1 rounded-full text-xs font-medium ${
																	user.admin_role === 'super_admin'
																		? 'bg-gold/20 text-gold'
																		: 'bg-blue-500/20 text-blue-500'
																}`}
															>
																{user.admin_role === 'super_admin'
																	? 'Super Admin'
																	: 'Admin'}
															</span>
														) : (
															<span className="text-xs text-muted-foreground">
																User
															</span>
														)}
													</TableCell>
													<TableCell>
														{formatDate(
															user.created_at,
															settings.display.dateFormat
														)}
													</TableCell>
													{currentUserRole === 'super_admin' && (
														<TableCell className="text-right">
															<div className="flex justify-end gap-2">
																{user.admin_role ? (
																	<Button
																		variant="ghost"
																		size="sm"
																		onClick={() => handleRemoveAdmin(user.id)}
																		disabled={adminActionsLoading[user.id]}
																		title="Remove Admin"
																	>
																		{adminActionsLoading[user.id] ? (
																			<Loader2 className="h-4 w-4 animate-spin" />
																		) : (
																			<Shield className="h-4 w-4 text-destructive" />
																		)}
																	</Button>
																) : (
																	<>
																		<Button
																			variant="ghost"
																			size="sm"
																			onClick={() =>
																				handleMakeAdmin(user.id, 'admin')
																			}
																			disabled={adminActionsLoading[user.id]}
																			title="Make Admin"
																		>
																			{adminActionsLoading[user.id] ? (
																				<Loader2 className="h-4 w-4 animate-spin" />
																			) : (
																				<Users className="h-4 w-4" />
																			)}
																		</Button>
																		<Button
																			variant="ghost"
																			size="sm"
																			onClick={() =>
																				handleMakeAdmin(user.id, 'super_admin')
																			}
																			disabled={adminActionsLoading[user.id]}
																			title="Make Super Admin"
																		>
																			{adminActionsLoading[user.id] ? (
																				<Loader2 className="h-4 w-4 animate-spin" />
																			) : (
																				<Shield className="h-4 w-4 text-gold" />
																			)}
																		</Button>
																	</>
																)}
															</div>
														</TableCell>
													)}
												</TableRow>
											))
										)}
									</TableBody>
								</Table>
							</CardContent>
						</Card>
					</div>
				)}

				{activeTab === 'subscribers' && (
					<div className="space-y-8">
						<div className="flex items-center justify-between">
							<div>
								<h2 className="text-3xl font-bold mb-2">Subscribers</h2>
								<p className="text-muted-foreground">
									Manage newsletter and email subscribers
								</p>
							</div>
							<div className="flex items-center gap-2">
								<span className="text-sm text-muted-foreground">
									Total: {subscribers.length}
								</span>
							</div>
						</div>

						<Card className="border-border">
							<CardContent className="p-0">
								<Table>
									<TableHeader>
										<TableRow>
											<TableHead>ID</TableHead>
											<TableHead>Email</TableHead>
											<TableHead>Subscribed At</TableHead>
											<TableHead>Status</TableHead>
											<TableHead className="text-right">Actions</TableHead>
										</TableRow>
									</TableHeader>
									<TableBody>
										{subscribers.length === 0 ? (
											<TableRow>
												<TableCell
													colSpan={5}
													className="text-center py-8 text-muted-foreground"
												>
													No subscribers found
												</TableCell>
											</TableRow>
										) : (
											subscribers.map((subscriber) => (
												<TableRow key={subscriber.id}>
													<TableCell className="font-medium">
														{subscriber.id.slice(0, 8)}...
													</TableCell>
													<TableCell>{subscriber.email}</TableCell>
													<TableCell>
														{formatDate(
															subscriber.subscribed_at,
															settings.display.dateFormat
														)}
													</TableCell>
													<TableCell>
														<span
															className={`px-2 py-1 rounded-full text-xs ${
																subscriber.status === 'active'
																	? 'bg-green-500/20 text-green-500'
																	: 'bg-gray-500/20 text-gray-500'
															}`}
														>
															{subscriber.status}
														</span>
													</TableCell>
													<TableCell className="text-right">
														<div className="flex justify-end gap-2">
															<Button
																variant="ghost"
																size="icon"
																className="text-destructive"
																onClick={() =>
																	handleDeleteSubscriber(subscriber.id)
																}
																title="Delete"
															>
																<Trash2 className="h-4 w-4" />
															</Button>
														</div>
													</TableCell>
												</TableRow>
											))
										)}
									</TableBody>
								</Table>
							</CardContent>
						</Card>
					</div>
				)}

				{activeTab === 'settings' && (
					<div className="space-y-8">
						<div className="flex items-center justify-between">
							<div>
								<h2 className="text-3xl font-bold mb-2">Settings</h2>
								<p className="text-muted-foreground">
									Manage your store settings and preferences
								</p>
								<p className="text-xs text-muted-foreground mt-1">
									Store: {settings.store.storeName} | Currency:{' '}
									{settings.store.currency}
								</p>
							</div>
							<Button
								variant="hero"
								onClick={handleSaveSettings}
								disabled={settingsLoading}
							>
								{settingsLoading ? (
									<>
										<Loader2 className="mr-2 h-4 w-4 animate-spin" />
										Saving...
									</>
								) : (
									<>
										<Save className="mr-2 h-4 w-4" />
										Save Changes
									</>
								)}
							</Button>
						</div>

						{/* Notifications */}
						<Card className="border-border">
							<CardHeader>
								<div className="flex items-center justify-between">
									<div className="flex items-center gap-2">
										<Bell className="h-5 w-5 text-gold" />
										<CardTitle>Notifications</CardTitle>
									</div>
									{!canShowNotifications() && (
										<Button
											variant="outline"
											size="sm"
											onClick={async () => {
												const permission =
													await requestNotificationPermission();
												setNotificationPermission(permission);
												if (permission === 'granted') {
													toast.success('Browser notifications enabled!');
												} else if (permission === 'denied') {
													toast.error(
														'Browser notifications blocked. Please enable in browser settings.'
													);
												}
											}}
										>
											{notificationPermission === 'default'
												? 'Enable Browser Notifications'
												: notificationPermission === 'denied'
												? 'Permission Denied'
												: 'Notifications Enabled'}
										</Button>
									)}
								</div>
								<CardDescription>
									Configure which notifications you want to receive
									{canShowNotifications() && (
										<span className="block mt-1 text-xs text-green-500">
											✓ Browser notifications enabled
										</span>
									)}
								</CardDescription>
							</CardHeader>
							<CardContent className="space-y-6">
								<div className="flex items-center justify-between">
									<div className="space-y-0.5">
										<Label htmlFor="newOrders">New Orders</Label>
										<p className="text-sm text-muted-foreground">
											Get notified when new orders are placed
										</p>
									</div>
									<Switch
										id="newOrders"
										checked={settings.notifications.newOrders}
										onCheckedChange={(checked) =>
											setSettings({
												...settings,
												notifications: {
													...settings.notifications,
													newOrders: checked,
												},
											})
										}
									/>
								</div>

								<Separator />

								<div className="flex items-center justify-between">
									<div className="space-y-0.5">
										<Label htmlFor="lowStock">Low Stock Alerts</Label>
										<p className="text-sm text-muted-foreground">
											Receive alerts when products are running low
										</p>
									</div>
									<Switch
										id="lowStock"
										checked={settings.notifications.lowStock}
										onCheckedChange={(checked) =>
											setSettings({
												...settings,
												notifications: {
													...settings.notifications,
													lowStock: checked,
												},
											})
										}
									/>
								</div>

								<Separator />

								<div className="flex items-center justify-between">
									<div className="space-y-0.5">
										<Label htmlFor="newUsers">New User Registrations</Label>
										<p className="text-sm text-muted-foreground">
											Get notified when new users sign up
										</p>
									</div>
									<Switch
										id="newUsers"
										checked={settings.notifications.newUsers}
										onCheckedChange={(checked) =>
											setSettings({
												...settings,
												notifications: {
													...settings.notifications,
													newUsers: checked,
												},
											})
										}
									/>
								</div>

								<Separator />

								<div className="flex items-center justify-between">
									<div className="space-y-0.5">
										<Label htmlFor="orderUpdates">Order Status Updates</Label>
										<p className="text-sm text-muted-foreground">
											Notifications for order status changes
										</p>
									</div>
									<Switch
										id="orderUpdates"
										checked={settings.notifications.orderUpdates}
										onCheckedChange={(checked) =>
											setSettings({
												...settings,
												notifications: {
													...settings.notifications,
													orderUpdates: checked,
												},
											})
										}
									/>
								</div>

								<Separator />

								<div className="flex items-center justify-between">
									<div className="space-y-0.5">
										<Label htmlFor="weeklyReport">Weekly Reports</Label>
										<p className="text-sm text-muted-foreground">
											Receive weekly sales and performance reports
										</p>
									</div>
									<Switch
										id="weeklyReport"
										checked={settings.notifications.weeklyReport}
										onCheckedChange={(checked) =>
											setSettings({
												...settings,
												notifications: {
													...settings.notifications,
													weeklyReport: checked,
												},
											})
										}
									/>
								</div>
							</CardContent>
						</Card>

						{/* Store Information */}
						<Card className="border-border">
							<CardHeader>
								<div className="flex items-center gap-2">
									<Globe className="h-5 w-5 text-gold" />
									<CardTitle>Store Information</CardTitle>
								</div>
								<CardDescription>
									Manage your store's basic information
								</CardDescription>
							</CardHeader>
							<CardContent className="space-y-4">
								<div className="grid grid-cols-2 gap-4">
									<div className="space-y-2">
										<Label htmlFor="storeName">Store Name</Label>
										<Input
											id="storeName"
											value={settings.store.storeName}
											onChange={(e) =>
												setSettings({
													...settings,
													store: {
														...settings.store,
														storeName: e.target.value,
													},
												})
											}
										/>
									</div>
									<div className="space-y-2">
										<Label htmlFor="storeEmail">Store Email</Label>
										<Input
											id="storeEmail"
											type="email"
											value={settings.store.storeEmail}
											onChange={(e) =>
												setSettings({
													...settings,
													store: {
														...settings.store,
														storeEmail: e.target.value,
													},
												})
											}
										/>
									</div>
								</div>

								<div className="grid grid-cols-2 gap-4">
									<div className="space-y-2">
										<Label htmlFor="storePhone">Store Phone</Label>
										<Input
											id="storePhone"
											type="tel"
											value={settings.store.storePhone}
											onChange={(e) =>
												setSettings({
													...settings,
													store: {
														...settings.store,
														storePhone: e.target.value,
													},
												})
											}
											placeholder="+1 (555) 123-4567"
										/>
									</div>
									<div className="space-y-2">
										<Label htmlFor="currency">Currency</Label>
										<Select
											value={settings.store.currency}
											onValueChange={(value) =>
												setSettings({
													...settings,
													store: {
														...settings.store,
														currency: value,
													},
												})
											}
										>
											<SelectTrigger id="currency">
												<SelectValue />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value="NGN">
													NGN - Nigerian Naira
												</SelectItem>
												<SelectItem value="USD">USD - US Dollar</SelectItem>
												<SelectItem value="EUR">EUR - Euro</SelectItem>
												<SelectItem value="GBP">GBP - British Pound</SelectItem>
												<SelectItem value="CAD">
													CAD - Canadian Dollar
												</SelectItem>
											</SelectContent>
										</Select>
									</div>
								</div>

								<div className="space-y-2">
									<Label htmlFor="timezone">Timezone</Label>
									<Select
										value={settings.store.timezone}
										onValueChange={(value) =>
											setSettings({
												...settings,
												store: {
													...settings.store,
													timezone: value,
												},
											})
										}
									>
										<SelectTrigger id="timezone">
											<SelectValue />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="America/New_York">
												Eastern Time (ET)
											</SelectItem>
											<SelectItem value="America/Chicago">
												Central Time (CT)
											</SelectItem>
											<SelectItem value="America/Denver">
												Mountain Time (MT)
											</SelectItem>
											<SelectItem value="America/Los_Angeles">
												Pacific Time (PT)
											</SelectItem>
											<SelectItem value="Europe/London">
												London (GMT)
											</SelectItem>
											<SelectItem value="Europe/Paris">Paris (CET)</SelectItem>
										</SelectContent>
									</Select>
								</div>
							</CardContent>
						</Card>

						{/* Display Preferences */}
						<Card className="border-border">
							<CardHeader>
								<div className="flex items-center gap-2">
									<Palette className="h-5 w-5 text-gold" />
									<CardTitle>Display Preferences</CardTitle>
								</div>
								<CardDescription>
									Customize how data is displayed in the dashboard
								</CardDescription>
							</CardHeader>
							<CardContent className="space-y-4">
								<div className="grid grid-cols-2 gap-4">
									<div className="space-y-2">
										<Label htmlFor="itemsPerPage">Items Per Page</Label>
										<Select
											value={settings.display.itemsPerPage.toString()}
											onValueChange={(value) =>
												setSettings({
													...settings,
													display: {
														...settings.display,
														itemsPerPage: parseInt(value, 10),
													},
												})
											}
										>
											<SelectTrigger id="itemsPerPage">
												<SelectValue />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value="10">10 items</SelectItem>
												<SelectItem value="20">20 items</SelectItem>
												<SelectItem value="50">50 items</SelectItem>
												<SelectItem value="100">100 items</SelectItem>
											</SelectContent>
										</Select>
									</div>
									<div className="space-y-2">
										<Label htmlFor="dateFormat">Date Format</Label>
										<Select
											value={settings.display.dateFormat}
											onValueChange={(value) =>
												setSettings({
													...settings,
													display: {
														...settings.display,
														dateFormat: value,
													},
												})
											}
										>
											<SelectTrigger id="dateFormat">
												<SelectValue />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
												<SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
												<SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
											</SelectContent>
										</Select>
									</div>
								</div>
							</CardContent>
						</Card>

						{/* Security Settings */}
						<Card className="border-border">
							<CardHeader>
								<div className="flex items-center gap-2">
									<Shield className="h-5 w-5 text-gold" />
									<CardTitle>Security</CardTitle>
								</div>
								<CardDescription>
									Manage your account security settings
								</CardDescription>
							</CardHeader>
							<CardContent className="space-y-6">
								<div className="flex items-center justify-between">
									<div className="space-y-0.5">
										<Label htmlFor="twoFactorAuth">
											Two-Factor Authentication
										</Label>
										<p className="text-sm text-muted-foreground">
											Add an extra layer of security to your account
										</p>
									</div>
									<Switch
										id="twoFactorAuth"
										checked={settings.security.twoFactorAuth}
										onCheckedChange={(checked) =>
											setSettings({
												...settings,
												security: {
													...settings.security,
													twoFactorAuth: checked,
												},
											})
										}
									/>
								</div>

								<Separator />

								<div className="space-y-2">
									<Label htmlFor="sessionTimeout">
										Session Timeout (minutes)
									</Label>
									<Input
										id="sessionTimeout"
										type="number"
										min="5"
										max="480"
										value={settings.security.sessionTimeout}
										onChange={(e) =>
											setSettings({
												...settings,
												security: {
													...settings.security,
													sessionTimeout: parseInt(e.target.value, 10) || 30,
												},
											})
										}
									/>
									<p className="text-sm text-muted-foreground">
										Automatically log out after inactivity (5-480 minutes)
									</p>
								</div>
							</CardContent>
						</Card>

						{/* Database & System */}
						<Card className="border-border">
							<CardHeader>
								<div className="flex items-center gap-2">
									<Database className="h-5 w-5 text-gold" />
									<CardTitle>System Information</CardTitle>
								</div>
								<CardDescription>
									View system status and database information
								</CardDescription>
							</CardHeader>
							<CardContent className="space-y-4">
								<div className="grid grid-cols-2 gap-4">
									<div className="space-y-1">
										<p className="text-sm font-medium">Database Status</p>
										<p
											className={`text-sm ${
												systemInfo.databaseStatus === 'connected'
													? 'text-green-500'
													: systemInfo.databaseStatus === 'error'
													? 'text-red-500'
													: 'text-yellow-500'
											}`}
										>
											{systemInfo.databaseStatus === 'connected'
												? 'Connected'
												: systemInfo.databaseStatus === 'error'
												? 'Error'
												: 'Disconnected'}
										</p>
									</div>
									<div className="space-y-1">
										<p className="text-sm font-medium">Last Backup</p>
										<p className="text-sm text-muted-foreground">
											{systemInfo.lastBackup
												? formatDate(
														systemInfo.lastBackup,
														settings.display.dateFormat
												  )
												: 'Never'}
										</p>
									</div>
									<div className="space-y-1">
										<p className="text-sm font-medium">Storage Used</p>
										<p className="text-sm text-muted-foreground">
											{systemInfo.storageUsed}
										</p>
									</div>
									<div className="space-y-1">
										<p className="text-sm font-medium">API Status</p>
										<p
											className={`text-sm ${
												systemInfo.apiStatus === 'operational'
													? 'text-green-500'
													: systemInfo.apiStatus === 'degraded'
													? 'text-yellow-500'
													: 'text-red-500'
											}`}
										>
											{systemInfo.apiStatus === 'operational'
												? 'Operational'
												: systemInfo.apiStatus === 'degraded'
												? 'Degraded'
												: 'Down'}
										</p>
									</div>
								</div>
							</CardContent>
						</Card>
					</div>
				)}
			</div>

			{/* Add Product Modal */}
			<AddProductModal
				open={isAddProductOpen}
				onOpenChange={setIsAddProductOpen}
				onSuccess={() => {
					loadProducts();
					loadStats();
				}}
			/>

			{/* Order Details Modal */}
			<Dialog open={isOrderModalOpen} onOpenChange={setIsOrderModalOpen}>
				<DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
					<DialogHeader>
						<DialogTitle>Order Details</DialogTitle>
						<DialogDescription>
							Order #{selectedOrder?.order_number || 'N/A'}
						</DialogDescription>
					</DialogHeader>

					{selectedOrder && (
						<div className="space-y-6">
							{/* Order Information */}
							<div className="grid md:grid-cols-2 gap-4">
								<Card className="border-border">
									<CardHeader>
										<CardTitle className="text-lg">Order Information</CardTitle>
									</CardHeader>
									<CardContent className="space-y-2">
										<div className="flex justify-between">
											<span className="text-muted-foreground">Order Number:</span>
											<span className="font-medium">{selectedOrder.order_number}</span>
										</div>
										<div className="flex justify-between">
											<span className="text-muted-foreground">Status:</span>
											<span
												className={`px-2 py-1 rounded-full text-xs ${
													selectedOrder.status === 'delivered'
														? 'bg-green-500/20 text-green-500'
														: selectedOrder.status === 'shipped'
														? 'bg-blue-500/20 text-blue-500'
														: selectedOrder.status === 'processing'
														? 'bg-yellow-500/20 text-yellow-500'
														: 'bg-gray-500/20 text-gray-500'
												}`}
											>
												{selectedOrder.status}
											</span>
										</div>
										<div className="flex justify-between">
											<span className="text-muted-foreground">Date:</span>
											<span className="font-medium">
												{formatDate(
													selectedOrder.created_at,
													settings.display.dateFormat
												)}
											</span>
										</div>
										{selectedOrder.payment_reference && (
											<div className="flex justify-between">
												<span className="text-muted-foreground">Payment Ref:</span>
												<span className="font-medium text-sm">
													{selectedOrder.payment_reference}
												</span>
											</div>
										)}
										{selectedOrder.delivery_method && (
											<div className="flex justify-between">
												<span className="text-muted-foreground">Delivery:</span>
												<span className="font-medium">
													{selectedOrder.delivery_method}
												</span>
											</div>
										)}
									</CardContent>
								</Card>

								<Card className="border-border">
									<CardHeader>
										<CardTitle className="text-lg">Shipping Address</CardTitle>
									</CardHeader>
									<CardContent className="space-y-1">
										{typeof selectedOrder.shipping_address === 'object' &&
										selectedOrder.shipping_address ? (
											<>
												<p className="font-medium">
													{selectedOrder.shipping_address.name}
												</p>
												<p className="text-sm text-muted-foreground">
													{selectedOrder.shipping_address.address}
												</p>
												<p className="text-sm text-muted-foreground">
													{selectedOrder.shipping_address.city},{' '}
													{selectedOrder.shipping_address.state}
												</p>
												<p className="text-sm text-muted-foreground">
													{selectedOrder.shipping_address.zip_code}
												</p>
												<p className="text-sm text-muted-foreground">
													{selectedOrder.shipping_address.country}
												</p>
											</>
										) : (
											<p className="text-sm text-muted-foreground">
												No shipping address available
											</p>
										)}
									</CardContent>
								</Card>
							</div>

							{/* Order Items */}
							<Card className="border-border">
								<CardHeader>
									<CardTitle className="text-lg">Order Items</CardTitle>
								</CardHeader>
								<CardContent>
									{loadingOrderItems ? (
										<div className="flex items-center justify-center py-8">
											<Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
										</div>
									) : orderItems.length === 0 ? (
										<p className="text-center py-8 text-muted-foreground">
											No items found for this order
										</p>
									) : (
										<div className="space-y-4">
											{orderItems.map((item) => (
												<div
													key={item.id}
													className="flex gap-4 p-4 border border-border rounded-lg"
												>
													{item.product?.images &&
													item.product.images.length > 0 ? (
														<img
															src={getOptimizedCloudinaryUrl(
																item.product.images[0],
																{
																	width: 100,
																	height: 100,
																	crop: 'fill',
																	quality: 'auto',
																}
															)}
															alt={item.product.name}
															className="w-20 h-20 object-cover rounded-sm"
														/>
													) : (
														<div className="w-20 h-20 bg-card rounded-sm flex items-center justify-center">
															<Package className="h-8 w-8 text-muted-foreground" />
														</div>
													)}
													<div className="flex-1">
														<p className="font-medium">
															{item.product?.name || 'Product not found'}
														</p>
														<p className="text-sm text-muted-foreground">
															Quantity: {item.quantity}
														</p>
														<p className="text-sm text-muted-foreground">
															Price: {formatPrice(item.price)} each
														</p>
													</div>
													<div className="text-right">
														<p className="font-semibold text-lg">
															{formatPrice(item.price * item.quantity)}
														</p>
													</div>
												</div>
											))}
										</div>
									)}
								</CardContent>
							</Card>

							{/* Order Summary */}
							<Card className="border-border">
								<CardHeader>
									<CardTitle className="text-lg">Order Summary</CardTitle>
								</CardHeader>
								<CardContent>
									<div className="space-y-2">
										<div className="flex justify-between">
											<span className="text-muted-foreground">Subtotal:</span>
											<span>
												{formatPrice(
													orderItems.reduce(
														(sum, item) => sum + item.price * item.quantity,
														0
													)
												)}
											</span>
										</div>
										<div className="flex justify-between">
											<span className="text-muted-foreground">Total:</span>
											<span className="text-lg font-bold text-gradient-gold">
												{formatPrice(Number(selectedOrder.total_amount))}
											</span>
										</div>
									</div>
								</CardContent>
							</Card>
						</div>
					)}
				</DialogContent>
			</Dialog>
		</div>
	);
};

export default AdminDashboard;
