/**
 * Database types for Supabase
 * 
 * These types should match your Supabase database schema.
 * You can generate these automatically using Supabase CLI:
 * npx supabase gen types typescript --project-id YOUR_PROJECT_ID > src/types/database.ts
 */

export interface Product {
	id: string;
	name: string;
	description: string | null;
	color: string | null;
	size: string | null;
	category: string;
	collection: string | null;
	price: number;
	cost_price?: number | null;
	selling_price?: number | null;
	images: string[];
	stock: number;
	featured: boolean;
	new_arrival: boolean;
	best_seller: boolean;
	on_sale: boolean;
	features: string[];
	created_at: string;
	updated_at: string;
}

export interface User {
	id: string;
	email: string;
	full_name: string | null;
	phone: string | null;
	avatar_url: string | null;
	created_at: string;
	updated_at: string;
}

export interface Order {
	id: string;
	user_id: string | null;
	order_number: string;
	total_amount: number;
	status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
	shipping_address: {
		name: string;
		address: string;
		city: string;
		state: string;
		zip_code: string;
		country: string;
	};
	payment_reference?: string | null;
	delivery_method?: string | null;
	created_at: string;
	updated_at: string;
}

export interface OrderItem {
	id: string;
	order_id: string;
	product_id: string;
	quantity: number;
	price: number;
	created_at: string;
}

export interface CartItem {
	id: string;
	user_id: string;
	product_id: string;
	quantity: number;
	created_at: string;
}

export interface Favorite {
	id: string;
	user_id: string;
	product_id: string;
	created_at: string;
}

export interface Subscriber {
	id: string;
	email: string;
	status: 'active' | 'unsubscribed';
	subscribed_at: string;
	unsubscribed_at: string | null;
}

export interface Transaction {
	id: string;
	order_id: string;
	amount: number;
	status: 'pending' | 'completed' | 'failed' | 'refunded';
	payment_method: string;
	transaction_id: string | null;
	created_at: string;
}

export interface ShippingAddress {
	id: string;
	user_id: string;
	first_name: string;
	last_name: string;
	phone: string | null;
	address: string;
	city: string;
	state: string;
	zip_code: string;
	country: string;
	is_default: boolean;
	created_at: string;
	updated_at: string;
}

export interface Collection {
	id: string;
	name: string;
	description: string | null;
	image_url: string | null;
	created_at: string;
	updated_at: string;
}

export interface Category {
	id: string;
	name: string;
	description: string | null;
	image_url: string | null;
	created_at: string;
	updated_at: string;
}

export type AnalyticsEventName =
	| 'visit'
	| 'add_to_cart'
	| 'checkout_started'
	| 'paid_order';

export interface AnalyticsEvent {
	id: string;
	event_name: AnalyticsEventName;
	session_id: string;
	user_id: string | null;
	product_id: string | null;
	order_id: string | null;
	path: string | null;
	metadata: Record<string, unknown> | null;
	created_at: string;
}

