/**
 * Paystack Payment Integration
 * 
 * This file handles Paystack payment initialization and callbacks.
 * Make sure to add your Paystack public key to .env file:
 * VITE_PAYSTACK_PUBLIC_KEY=pk_test_...
 */

declare global {
	interface Window {
		PaystackPop: {
			setup: (options: PaystackOptions) => {
				openIframe: () => void;
			};
		};
	}
}

export interface PaystackOptions {
	key: string;
	email: string;
	amount: number; // Amount in kobo (for NGN) or cents
	currency?: string;
	ref: string;
	metadata?: {
		custom_fields: Array<{
			display_name: string;
			variable_name: string;
			value: string;
		}>;
	};
	callback: (response: PaystackResponse) => void;
	onClose: () => void;
}

export interface PaystackResponse {
	reference: string;
	status: string;
	message: string;
	transaction: string;
	trxref: string;
}

/**
 * Initialize Paystack payment
 */
export const initializePaystack = (
	email: string,
	amount: number,
	reference: string,
	metadata?: PaystackOptions['metadata'],
	onSuccess?: (response: PaystackResponse) => void,
	onClose?: () => void
): void => {
	const publicKey = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY;

	if (!publicKey) {
		console.error('Paystack public key not found. Please add VITE_PAYSTACK_PUBLIC_KEY to your .env file');
		return;
	}

	if (!window.PaystackPop) {
		console.error('Paystack script not loaded. Please add the Paystack script to your index.html');
		return;
	}

	const handler = window.PaystackPop.setup({
		key: publicKey,
		email: email,
		amount: amount * 100, // Convert to kobo/cents
		currency: 'NGN', // Change to your preferred currency
		ref: reference,
		metadata: metadata,
		callback: (response: PaystackResponse) => {
			if (onSuccess) {
				onSuccess(response);
			}
		},
		onClose: () => {
			if (onClose) {
				onClose();
			}
		},
	});

	handler.openIframe();
};

/**
 * Generate a unique reference for Paystack
 */
export const generatePaystackReference = (): string => {
	return `DZL_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
};

