import { Link } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Package, Mail, Home, Download } from 'lucide-react';
import productWatch from '@/assets/product-watch.jpg';
import productBag from '@/assets/product-bag.jpg';
import productHeadphones from '@/assets/product-headphones.jpg';

const OrderConfirmation = () => {
	// Mock order data - in production, this would come from route params or state
	const orderDetails = {
		orderNumber: 'ORD-2024-001234',
		orderDate: new Date().toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'long',
			day: 'numeric',
		}),
		items: [
			{
				id: 1,
				name: 'Signature Timepiece',
				category: 'Watches',
				price: 2499,
				quantity: 1,
				image: productWatch,
			},
			{
				id: 2,
				name: 'Executive Tote',
				category: 'Bags',
				price: 899,
				quantity: 2,
				image: productBag,
			},
			{
				id: 3,
				name: 'Studio Pro Max',
				category: 'Audio',
				price: 549,
				quantity: 1,
				image: productHeadphones,
			},
		],
		shipping: {
			name: 'John Doe',
			address: '123 Main Street',
			city: 'New York',
			state: 'NY',
			zipCode: '10001',
			country: 'United States',
		},
		subtotal: 4247,
		shipping: 0,
		tax: 339.76,
		total: 4586.76,
	};

	const formatPrice = (price: number) => {
		return new Intl.NumberFormat('en-US', {
			style: 'currency',
			currency: 'USD',
			minimumFractionDigits: 2,
		}).format(price);
	};

	return (
		<div className="min-h-screen bg-background">
			<Navbar />
			<main className="pt-20">
				{/* Success Message */}
				<section className="py-16 md:py-24 border-b border-border">
					<div className="container mx-auto px-6">
						<div className="max-w-2xl mx-auto text-center space-y-4">
							<div className="flex justify-center mb-4">
								<div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center">
									<CheckCircle className="h-12 w-12 text-green-500" />
								</div>
							</div>
							<h1 className="text-4xl md:text-5xl font-bold tracking-tight">
								Order Confirmed!
							</h1>
							<p className="text-muted-foreground text-lg">
								Thank you for your purchase. We've received your order and will
								begin processing it right away.
							</p>
							<div className="pt-4">
								<p className="text-sm text-muted-foreground">
									Order Number:{' '}
									<span className="font-semibold text-foreground">
										{orderDetails.orderNumber}
									</span>
								</p>
								<p className="text-sm text-muted-foreground mt-1">
									Order Date:{' '}
									<span className="font-semibold text-foreground">
										{orderDetails.orderDate}
									</span>
								</p>
							</div>
						</div>
					</div>
				</section>

				{/* Order Details */}
				<section className="py-16 md:py-24">
					<div className="container mx-auto px-6">
						<div className="max-w-4xl mx-auto space-y-8">
							{/* What's Next */}
							<Card className="border-border bg-card">
								<CardHeader>
									<CardTitle>What's Next?</CardTitle>
								</CardHeader>
								<CardContent>
									<div className="grid md:grid-cols-3 gap-6">
										<div className="flex flex-col items-center text-center space-y-2">
											<div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mb-2">
												<Mail className="h-6 w-6 text-primary" />
											</div>
											<h3 className="font-semibold">Order Confirmation</h3>
											<p className="text-sm text-muted-foreground">
												You'll receive an email confirmation with your order
												details shortly.
											</p>
										</div>
										<div className="flex flex-col items-center text-center space-y-2">
											<div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mb-2">
												<Package className="h-6 w-6 text-primary" />
											</div>
											<h3 className="font-semibold">Processing</h3>
											<p className="text-sm text-muted-foreground">
												We'll prepare your order for shipment within 1-2
												business days.
											</p>
										</div>
										<div className="flex flex-col items-center text-center space-y-2">
											<div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mb-2">
												<Home className="h-6 w-6 text-primary" />
											</div>
											<h3 className="font-semibold">Delivery</h3>
											<p className="text-sm text-muted-foreground">
												Your order will arrive in 3-5 business days. You'll
												receive tracking info via email.
											</p>
										</div>
									</div>
								</CardContent>
							</Card>

							<div className="grid lg:grid-cols-3 gap-8">
								{/* Order Items */}
								<div className="lg:col-span-2 space-y-6">
									<Card className="border-border">
										<CardHeader>
											<CardTitle>Order Items</CardTitle>
										</CardHeader>
										<CardContent className="space-y-4">
											{orderDetails.items.map((item) => (
												<div
													key={item.id}
													className="flex gap-4 pb-4 border-b border-border last:border-0 last:pb-0"
												>
													<img
														src={item.image}
														alt={item.name}
														className="w-20 h-20 object-cover rounded-sm"
													/>
													<div className="flex-1">
														<h3 className="font-semibold mb-1">{item.name}</h3>
														<p className="text-sm text-muted-foreground mb-2">
															{item.category}
														</p>
														<div className="flex items-center justify-between">
															<p className="text-sm text-muted-foreground">
																Quantity: {item.quantity}
															</p>
															<p className="font-semibold text-gradient-gold">
																{formatPrice(item.price * item.quantity)}
															</p>
														</div>
													</div>
												</div>
											))}
										</CardContent>
									</Card>

									{/* Shipping Address */}
									<Card className="border-border">
										<CardHeader>
											<CardTitle>Shipping Address</CardTitle>
										</CardHeader>
										<CardContent>
											<div className="space-y-1 text-muted-foreground">
												<p className="font-medium text-foreground">
													{orderDetails.shipping.name}
												</p>
												<p>{orderDetails.shipping.address}</p>
												<p>
													{orderDetails.shipping.city},{' '}
													{orderDetails.shipping.state}{' '}
													{orderDetails.shipping.zipCode}
												</p>
												<p>{orderDetails.shipping.country}</p>
											</div>
										</CardContent>
									</Card>
								</div>

								{/* Order Summary */}
								<div className="lg:col-span-1">
									<Card className="border-border sticky top-24">
										<CardHeader>
											<CardTitle>Order Summary</CardTitle>
										</CardHeader>
										<CardContent className="space-y-4">
											<div className="space-y-2">
												<div className="flex justify-between text-sm">
													<span className="text-muted-foreground">
														Subtotal
													</span>
													<span>{formatPrice(orderDetails.subtotal)}</span>
												</div>
												<div className="flex justify-between text-sm">
													<span className="text-muted-foreground">
														Shipping
													</span>
													<span className="text-gold">Free</span>
												</div>
												<div className="flex justify-between text-sm">
													<span className="text-muted-foreground">Tax</span>
													<span>{formatPrice(orderDetails.tax)}</span>
												</div>
											</div>

											<div className="border-t border-border pt-4">
												<div className="flex justify-between text-lg font-bold mb-4">
													<span>Total</span>
													<span className="text-gradient-gold">
														{formatPrice(orderDetails.total)}
													</span>
												</div>
											</div>

											<div className="space-y-2 pt-4 border-t border-border">
												<Button variant="outline" className="w-full" asChild>
													<Link to="/orders">View Order History</Link>
												</Button>
												<Button variant="outline" className="w-full" asChild>
													<Link to="/products">
														<Home className="mr-2 h-4 w-4" />
														Continue Shopping
													</Link>
												</Button>
											</div>
										</CardContent>
									</Card>
								</div>
							</div>
						</div>
					</div>
				</section>
			</main>
			<Footer />
		</div>
	);
};

export default OrderConfirmation;
