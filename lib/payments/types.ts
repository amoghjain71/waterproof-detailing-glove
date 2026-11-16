import type { CheckoutCartItem } from "@/lib/schemas";

export type CheckoutCustomer = {
  email: string;
  name: string;
  phone?: string;
};

export type CreateCheckoutResult = {
  redirectUrl?: string;
  clientSecret?: string;
  orderId: string;
};

export interface PaymentProvider {
  createCheckout(
    cart: CheckoutCartItem[],
    customer: CheckoutCustomer,
  ): Promise<CreateCheckoutResult>;
  confirmOrder(orderId: string): Promise<{ ok: boolean; orderId: string }>;
}
