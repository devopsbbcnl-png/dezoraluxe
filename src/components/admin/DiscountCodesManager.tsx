import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import { Loader2, RefreshCw, Trash2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import type { DiscountCode } from '@/types/database';
import { toast } from 'sonner';

type DiscountType = 'percentage' | 'fixed';

const CODE_LENGTH = 6;
const CODE_CHARSET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

const generateDiscountCode = () => {
	let code = '';
	for (let i = 0; i < CODE_LENGTH; i += 1) {
		const randomIndex = Math.floor(Math.random() * CODE_CHARSET.length);
		code += CODE_CHARSET[randomIndex];
	}
	return code;
};

const formatPrice = (price: number) =>
	new Intl.NumberFormat('en-NG', {
		style: 'currency',
		currency: 'NGN',
		minimumFractionDigits: 0,
	}).format(price);

const DiscountCodesManager = () => {
	const [codes, setCodes] = useState<DiscountCode[]>([]);
	const [loading, setLoading] = useState(false);
	const [submitting, setSubmitting] = useState(false);
	const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

	const [newCode, setNewCode] = useState(generateDiscountCode);
	const [discountType, setDiscountType] = useState<DiscountType>('percentage');
	const [discountValue, setDiscountValue] = useState('');
	const [usageLimit, setUsageLimit] = useState('');
	const [expiresAt, setExpiresAt] = useState('');
	const [isActive, setIsActive] = useState(true);
	const [oneTimePerUser, setOneTimePerUser] = useState(false);
	const [customerEmail, setCustomerEmail] = useState('');
	const [customerPhone, setCustomerPhone] = useState('');

	const loadCodes = async () => {
		setLoading(true);
		try {
			const { data, error } = await supabase
				.from('discount_codes')
				.select('*')
				.order('created_at', { ascending: false });

			if (error) throw error;
			setCodes((data as DiscountCode[]) || []);
		} catch (error) {
			console.error('Error loading discount codes:', error);
			toast.error('Failed to load discount codes');
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		void loadCodes();
	}, []);

	const resetForm = () => {
		setNewCode(generateDiscountCode());
		setDiscountType('percentage');
		setDiscountValue('');
		setUsageLimit('');
		setExpiresAt('');
		setIsActive(true);
		setOneTimePerUser(false);
		setCustomerEmail('');
		setCustomerPhone('');
	};

	const handleCreateCode = async (e: React.FormEvent) => {
		e.preventDefault();
		const value = Number(discountValue);

		if (!newCode || newCode.length !== CODE_LENGTH) {
			toast.error('Discount code must be 6 characters');
			return;
		}

		if (!/^[A-Z0-9]{6}$/.test(newCode)) {
			toast.error('Discount code must be uppercase letters and numbers only');
			return;
		}

		if (!Number.isFinite(value) || value <= 0) {
			toast.error('Discount value must be greater than 0');
			return;
		}

		if (discountType === 'percentage' && value > 100) {
			toast.error('Percentage discount cannot exceed 100%');
			return;
		}

		const usageLimitValue = usageLimit.trim() === '' ? null : Number(usageLimit);
		if (usageLimitValue !== null && (!Number.isInteger(usageLimitValue) || usageLimitValue <= 0)) {
			toast.error('Usage limit must be a whole number greater than 0');
			return;
		}

		const trimmedCustomerEmail = customerEmail.trim();
		const trimmedCustomerPhone = customerPhone.trim();

		if (trimmedCustomerEmail && !trimmedCustomerEmail.includes('@')) {
			toast.error('Enter a valid customer email');
			return;
		}

		if (trimmedCustomerPhone && trimmedCustomerPhone.length < 7) {
			toast.error('Enter a valid customer phone');
			return;
		}

		setSubmitting(true);
		try {
			const {
				data: { user },
			} = await supabase.auth.getUser();

			const payload = {
				code: newCode,
				discount_type: discountType,
				discount_value: value,
				is_active: isActive,
				usage_limit: usageLimitValue,
				one_time_per_user: oneTimePerUser,
				customer_email: trimmedCustomerEmail || null,
				customer_phone: trimmedCustomerPhone || null,
				expires_at: expiresAt ? new Date(expiresAt).toISOString() : null,
				created_by: user?.id ?? null,
			};

			const { error } = await supabase.from('discount_codes').insert(payload);
			if (error) throw error;

			toast.success(`Discount code ${newCode} created`);
			resetForm();
			await loadCodes();
		} catch (error) {
			console.error('Error creating discount code:', error);
			const message =
				error instanceof Error && error.message.includes('duplicate key')
					? 'Generated code already exists. Regenerate and try again.'
					: 'Failed to create discount code';
			toast.error(message);
		} finally {
			setSubmitting(false);
		}
	};

	const toggleCodeStatus = async (codeId: string, nextStatus: boolean) => {
		setActionLoadingId(codeId);
		try {
			const { error } = await supabase
				.from('discount_codes')
				.update({ is_active: nextStatus, updated_at: new Date().toISOString() })
				.eq('id', codeId);
			if (error) throw error;
			setCodes((prev) =>
				prev.map((item) => (item.id === codeId ? { ...item, is_active: nextStatus } : item))
			);
			toast.success(nextStatus ? 'Code activated' : 'Code deactivated');
		} catch (error) {
			console.error('Error toggling discount code:', error);
			toast.error('Failed to update code status');
		} finally {
			setActionLoadingId(null);
		}
	};

	const handleDeleteCode = async (codeId: string) => {
		if (!confirm('Delete this discount code? This cannot be undone.')) return;

		setActionLoadingId(codeId);
		try {
			const { error } = await supabase.from('discount_codes').delete().eq('id', codeId);
			if (error) throw error;
			setCodes((prev) => prev.filter((item) => item.id !== codeId));
			toast.success('Discount code deleted');
		} catch (error) {
			console.error('Error deleting discount code:', error);
			toast.error('Failed to delete discount code');
		} finally {
			setActionLoadingId(null);
		}
	};

	return (
		<div className="space-y-8">
			<div>
				<h2 className="text-2xl font-bold mb-2 sm:text-3xl">Discount Codes</h2>
				<p className="text-muted-foreground text-sm sm:text-base">
					Create and manage 6-character discount codes for checkout.
				</p>
			</div>

			<Card className="border-border">
				<CardHeader>
					<CardTitle>Create New Code</CardTitle>
				</CardHeader>
				<CardContent>
					<form onSubmit={handleCreateCode} className="space-y-4">
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div className="space-y-2">
								<Label htmlFor="discountCode">Code</Label>
								<div className="flex gap-2">
									<Input
										id="discountCode"
										maxLength={6}
										value={newCode}
										onChange={(e) =>
											setNewCode(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ''))
										}
										placeholder="ABC123"
										required
									/>
									<Button
										type="button"
										variant="outline"
										onClick={() => setNewCode(generateDiscountCode())}
									>
										<RefreshCw className="h-4 w-4 mr-2" />
										Generate
									</Button>
								</div>
							</div>

							<div className="space-y-2">
								<Label htmlFor="discountType">Discount Type</Label>
								<Select
									value={discountType}
									onValueChange={(value: DiscountType) => setDiscountType(value)}
								>
									<SelectTrigger id="discountType">
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="percentage">Percentage (%)</SelectItem>
										<SelectItem value="fixed">Fixed Amount (NGN)</SelectItem>
									</SelectContent>
								</Select>
							</div>
						</div>

						<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
							<div className="space-y-2">
								<Label htmlFor="discountValue">
									Value {discountType === 'percentage' ? '(%)' : '(NGN)'}
								</Label>
								<Input
									id="discountValue"
									type="number"
									min="0"
									step={discountType === 'percentage' ? '0.1' : '1'}
									value={discountValue}
									onChange={(e) => setDiscountValue(e.target.value)}
									required
								/>
							</div>

							<div className="space-y-2">
								<Label htmlFor="usageLimit">Usage Limit (optional)</Label>
								<Input
									id="usageLimit"
									type="number"
									min="1"
									step="1"
									value={usageLimit}
									onChange={(e) => setUsageLimit(e.target.value)}
									placeholder="Unlimited if empty"
								/>
							</div>

							<div className="space-y-2">
								<Label htmlFor="expiresAt">Expiry Date (optional)</Label>
								<Input
									id="expiresAt"
									type="datetime-local"
									value={expiresAt}
									onChange={(e) => setExpiresAt(e.target.value)}
								/>
							</div>
						</div>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div className="space-y-2">
								<Label htmlFor="customerEmail">Customer Email (optional)</Label>
								<Input
									id="customerEmail"
									type="email"
									value={customerEmail}
									onChange={(e) => setCustomerEmail(e.target.value)}
									placeholder="Limit code to this email"
								/>
							</div>
							<div className="space-y-2">
								<Label htmlFor="customerPhone">Customer Phone (optional)</Label>
								<Input
									id="customerPhone"
									type="tel"
									value={customerPhone}
									onChange={(e) => setCustomerPhone(e.target.value)}
									placeholder="Limit code to this phone"
								/>
							</div>
						</div>

						<div className="flex items-center justify-between pt-2">
							<div className="space-y-2">
								<div className="flex items-center gap-2">
									<Switch checked={isActive} onCheckedChange={setIsActive} id="isActive" />
									<Label htmlFor="isActive">Active immediately</Label>
								</div>
								<div className="flex items-center gap-2">
									<Switch
										checked={oneTimePerUser}
										onCheckedChange={setOneTimePerUser}
										id="oneTimePerUser"
									/>
									<Label htmlFor="oneTimePerUser">One-time per user</Label>
								</div>
							</div>
							<Button type="submit" variant="hero" disabled={submitting}>
								{submitting ? (
									<>
										<Loader2 className="mr-2 h-4 w-4 animate-spin" />
										Creating...
									</>
								) : (
									'Create Discount Code'
								)}
							</Button>
						</div>
					</form>
				</CardContent>
			</Card>

			<Card className="border-border">
				<CardHeader>
					<CardTitle>Existing Codes</CardTitle>
				</CardHeader>
				<CardContent className="p-0 overflow-x-auto">
					{loading ? (
						<div className="p-6 flex items-center gap-2 text-muted-foreground text-sm">
							<Loader2 className="h-4 w-4 animate-spin" />
							Loading codes...
						</div>
					) : (
						<Table className="min-w-[760px]">
							<TableHeader>
								<TableRow>
									<TableHead>Code</TableHead>
									<TableHead>Type</TableHead>
									<TableHead>Value</TableHead>
									<TableHead>Usage</TableHead>
									<TableHead>Rules</TableHead>
									<TableHead>Customer Scope</TableHead>
									<TableHead>Expires</TableHead>
									<TableHead>Status</TableHead>
									<TableHead className="text-right">Actions</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{codes.length === 0 ? (
									<TableRow>
										<TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
											No discount codes created yet
										</TableCell>
									</TableRow>
								) : (
									codes.map((item) => (
										<TableRow key={item.id}>
											<TableCell className="font-medium tracking-wider">{item.code}</TableCell>
											<TableCell>
												{item.discount_type === 'percentage' ? 'Percentage' : 'Fixed'}
											</TableCell>
											<TableCell>
												{item.discount_type === 'percentage'
													? `${item.discount_value}%`
													: formatPrice(Number(item.discount_value))}
											</TableCell>
											<TableCell>
												{item.times_used}
												{item.usage_limit ? ` / ${item.usage_limit}` : ' / Unlimited'}
											</TableCell>
											<TableCell>
												{item.one_time_per_user ? 'One-time/user' : 'Reusable'}
											</TableCell>
											<TableCell>
												{item.customer_email || item.customer_phone
													? [item.customer_email, item.customer_phone]
															.filter(Boolean)
															.join(' / ')
													: 'All customers'}
											</TableCell>
											<TableCell>
												{item.expires_at
													? new Date(item.expires_at).toLocaleString()
													: 'No expiry'}
											</TableCell>
											<TableCell>
												<div className="flex items-center gap-2">
													<Switch
														checked={item.is_active}
														onCheckedChange={(checked) =>
															void toggleCodeStatus(item.id, checked)
														}
														disabled={actionLoadingId === item.id}
													/>
													<span className="text-sm">
														{item.is_active ? 'Active' : 'Inactive'}
													</span>
												</div>
											</TableCell>
											<TableCell className="text-right">
												<Button
													variant="ghost"
													size="icon"
													className="text-destructive"
													onClick={() => void handleDeleteCode(item.id)}
													disabled={actionLoadingId === item.id}
													title="Delete code"
												>
													<Trash2 className="h-4 w-4" />
												</Button>
											</TableCell>
										</TableRow>
									))
								)}
							</TableBody>
						</Table>
					)}
				</CardContent>
			</Card>
		</div>
	);
};

export default DiscountCodesManager;
