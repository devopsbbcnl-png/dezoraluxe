import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { ArrowLeft, CreditCard, Lock } from 'lucide-react';
import productWatch from '@/assets/product-watch.jpg';
import productBag from '@/assets/product-bag.jpg';
import productHeadphones from '@/assets/product-headphones.jpg';

interface CartItem {
	id: number;
	name: string;
	category: string;
	price: number;
	image: string;
	quantity: number;
}

const Checkout = () => {
	const navigate = useNavigate();
	const [shippingInfo, setShippingInfo] = useState({
		firstName: '',
		lastName: '',
		email: '',
		phone: '',
		address: '',
		city: '',
		state: '',
		zipCode: '',
		country: 'United States',
	});

	const [paymentInfo, setPaymentInfo] = useState({
		cardNumber: '',
		cardName: '',
		expiryDate: '',
		cvv: '',
	});

	const [sameAsShipping, setSameAsShipping] = useState(true);

	// Mock cart items - in production, this would come from cart state/context
	const cartItems: CartItem[] = [
		{
			id: 1,
			name: 'Signature Timepiece',
			category: 'Watches',
			price: 2499,
			image: productWatch,
			quantity: 1,
		},
		{
			id: 2,
			name: 'Executive Tote',
			category: 'Bags',
			price: 899,
			image: productBag,
			quantity: 2,
		},
		{
			id: 3,
			name: 'Studio Pro Max',
			category: 'Audio',
			price: 549,
			image: productHeadphones,
			quantity: 1,
		},
	];

	const formatPrice = (price: number) => {
		return new Intl.NumberFormat('en-US', {
			style: 'currency',
			currency: 'USD',
			minimumFractionDigits: 0,
		}).format(price);
	};

	const subtotal = cartItems.reduce(
		(sum, item) => sum + item.price * item.quantity,
		0
	);
	const shipping = subtotal > 200 ? 0 : 15;
	const tax = subtotal * 0.08;
	const total = subtotal + shipping + tax;

	const handleShippingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setShippingInfo({
			...shippingInfo,
			[e.target.id]: e.target.value,
		});
	};

	const handlePaymentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setPaymentInfo({
			...paymentInfo,
			[e.target.id]: e.target.value,
		});
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		// Handle checkout logic here
		console.log('Checkout:', { shippingInfo, paymentInfo });
		// Navigate to order confirmation page
		navigate('/order-confirmation');
	};

	return (
		<div className="min-h-screen bg-background">
			<Navbar />
			<main className="pt-20">
				{/* Hero Section */}
				<section className="py-16 md:py-24 border-b border-border">
					<div className="container mx-auto px-6">
						<div className="text-center space-y-4">
							<h1 className="text-4xl md:text-6xl font-bold tracking-tight">
								Checkout
							</h1>
							<p className="text-muted-foreground">
								Complete your order securely
							</p>
						</div>
					</div>
				</section>

				{/* Checkout Content */}
				<section className="py-16 md:py-24">
					<div className="container mx-auto px-6">
						<Link
							to="/cart"
							className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
						>
							<ArrowLeft className="h-4 w-4" />
							Back to Cart
						</Link>

						<form onSubmit={handleSubmit}>
							<div className="grid lg:grid-cols-3 gap-8">
								{/* Left Column - Forms */}
								<div className="lg:col-span-2 space-y-8">
									{/* Shipping Information */}
									<Card className="border-border">
										<CardHeader>
											<CardTitle>Shipping Information</CardTitle>
										</CardHeader>
										<CardContent className="space-y-4">
											<div className="grid md:grid-cols-2 gap-4">
												<div className="space-y-2">
													<Label htmlFor="firstName">First Name</Label>
													<Input
														id="firstName"
														value={shippingInfo.firstName}
														onChange={handleShippingChange}
														required
													/>
												</div>
												<div className="space-y-2">
													<Label htmlFor="lastName">Last Name</Label>
													<Input
														id="lastName"
														value={shippingInfo.lastName}
														onChange={handleShippingChange}
														required
													/>
												</div>
											</div>

											<div className="space-y-2">
												<Label htmlFor="email">Email</Label>
												<Input
													id="email"
													type="email"
													value={shippingInfo.email}
													onChange={handleShippingChange}
													required
												/>
											</div>

											<div className="space-y-2">
												<Label htmlFor="phone">Phone</Label>
												<Input
													id="phone"
													type="tel"
													value={shippingInfo.phone}
													onChange={handleShippingChange}
													required
												/>
											</div>

											<div className="space-y-2">
												<Label htmlFor="address">Address</Label>
												<Input
													id="address"
													value={shippingInfo.address}
													onChange={handleShippingChange}
													required
												/>
											</div>

											<div className="grid md:grid-cols-3 gap-4">
												<div className="space-y-2">
													<Label htmlFor="city">City</Label>
													<Input
														id="city"
														value={shippingInfo.city}
														onChange={handleShippingChange}
														required
													/>
												</div>
												<div className="space-y-2">
													<Label htmlFor="state">State</Label>
													<Input
														id="state"
														value={shippingInfo.state}
														onChange={handleShippingChange}
														required
													/>
												</div>
												<div className="space-y-2">
													<Label htmlFor="zipCode">Zip Code</Label>
													<Input
														id="zipCode"
														value={shippingInfo.zipCode}
														onChange={handleShippingChange}
														required
													/>
												</div>
											</div>

											<div className="space-y-2">
												<Label htmlFor="country">Country</Label>
												<Select
													value={shippingInfo.country}
													onValueChange={(value) =>
														setShippingInfo({ ...shippingInfo, country: value })
													}
												>
													<SelectTrigger id="country">
														<SelectValue />
													</SelectTrigger>
													<SelectContent>
														<SelectItem value="United States">United States</SelectItem>
														<SelectItem value="Canada">Canada</SelectItem>
														<SelectItem value="United Kingdom">United Kingdom</SelectItem>
														<SelectItem value="Australia">Australia</SelectItem>
													</SelectContent>
												</Select>
											</div>
										</CardContent>
									</Card>

									{/* Payment Information */}
									<Card className="border-border">
										<CardHeader>
											<CardTitle className="flex items-center gap-2">
												<CreditCard className="h-5 w-5" />
												Payment Information
											</CardTitle>
										</CardHeader>
										<CardContent className="space-y-4">
											<div className="space-y-2">
												<Label htmlFor="cardNumber">Card Number</Label>
												<Input
													id="cardNumber"
													placeholder="1234 5678 9012 3456"
													value={paymentInfo.cardNumber}
													onChange={handlePaymentChange}
													maxLength={19}
													required
												/>
											</div>

											<div className="space-y-2">
												<Label htmlFor="cardName">Cardholder Name</Label>
												<Input
													id="cardName"
													placeholder="John Doe"
													value={paymentInfo.cardName}
													onChange={handlePaymentChange}
													required
												/>
											</div>

											<div className="grid md:grid-cols-2 gap-4">
												<div className="space-y-2">
													<Label htmlFor="expiryDate">Expiry Date</Label>
													<Input
														id="expiryDate"
														placeholder="MM/YY"
														value={paymentInfo.expiryDate}
														onChange={handlePaymentChange}
														maxLength={5}
														required
													/>
												</div>
												<div className="space-y-2">
													<Label htmlFor="cvv">CVV</Label>
													<Input
														id="cvv"
														placeholder="123"
														value={paymentInfo.cvv}
														onChange={handlePaymentChange}
														maxLength={4}
														required
													/>
												</div>
											</div>

											<div className="flex items-center gap-2 pt-2">
												<Lock className="h-4 w-4 text-muted-foreground" />
												<p className="text-xs text-muted-foreground">
													Your payment information is secure and encrypted
												</p>
											</div>
										</CardContent>
									</Card>
								</div>

								{/* Right Column - Order Summary */}
								<div className="lg:col-span-1">
									<Card className="border-border sticky top-24">
										<CardHeader>
											<CardTitle>Order Summary</CardTitle>
										</CardHeader>
										<CardContent className="space-y-4">
											{/* Order Items */}
											<div className="space-y-4 max-h-64 overflow-y-auto">
												{cartItems.map((item) => (
													<div key={item.id} className="flex gap-4">
														<img
															src={item.image}
															alt={item.name}
															className="w-16 h-16 object-cover rounded-sm"
														/>
														<div className="flex-1">
															<p className="font-medium text-sm">{item.name}</p>
															<p className="text-xs text-muted-foreground">
																Qty: {item.quantity}
															</p>
															<p className="text-sm font-semibold text-gradient-gold mt-1">
																{formatPrice(item.price * item.quantity)}
															</p>
														</div>
													</div>
												))}
											</div>

											<div className="border-t border-border pt-4 space-y-2">
												<div className="flex justify-between text-sm">
													<span className="text-muted-foreground">Subtotal</span>
													<span>{formatPrice(subtotal)}</span>
												</div>
												<div className="flex justify-between text-sm">
													<span className="text-muted-foreground">Shipping</span>
													<span>
														{shipping === 0 ? (
															<span className="text-gold">Free</span>
														) : (
															formatPrice(shipping)
														)}
													</span>
												</div>
												<div className="flex justify-between text-sm">
													<span className="text-muted-foreground">Tax</span>
													<span>{formatPrice(tax)}</span>
												</div>
												<div className="border-t border-border pt-4">
													<div className="flex justify-between text-lg font-bold mb-4">
														<span>Total</span>
														<span className="text-gradient-gold">
															{formatPrice(total)}
														</span>
													</div>
													<Button type="submit" variant="hero" className="w-full" size="lg">
														Place Order
													</Button>
												</div>
											</div>
										</CardContent>
									</Card>
								</div>
							</div>
						</form>
					</div>
				</section>
			</main>
			<Footer />
		</div>
	);
};

export default Checkout;

