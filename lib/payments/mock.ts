import "server-only";

import type { PaymentProvider } from "@/lib/payments/types";

function orderId() {
  return `mock_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

export const mockPaymentProvider: PaymentProvider = {
  async createCheckout(cart, customer) {
    const id = orderId();
    console.info("[payments:mock] createCheckout", {
      orderId: id,
      itemCount: cart.length,
      hasCustomer: Boolean(customer.email),
    });
    return {
      orderId: id,
      redirectUrl: `/order/confirmation?orderId=${encodeURIComponent(id)}`,
    };
  },
  async confirmOrder(orderId) {
    console.info("[payments:mock] confirmOrder", orderId);
    return { ok: true, orderId };
  },
};
