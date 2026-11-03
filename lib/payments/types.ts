import type { CartItem } from "@/lib/store/cart-types";

export type CheckoutCustomer = {
  email: string;
  name: string;
  phone?: string;
  address: {
    line1: string;
    line2?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
};

export type CreateCheckoutResult = {
  redirectUrl?: string;
  clientSecret?: string;
  orderId: string;
};

export interface PaymentProvider {
  createCheckout(
    cart: CartItem[],
    customer: CheckoutCustomer,
  ): Promise<CreateCheckoutResult>;
  confirmOrder(orderId: string): Promise<{ ok: boolean; orderId: string }>;
}
