"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { PaymentSlot } from "@/components/commerce/PaymentSlot";
import { useCart } from "@/lib/store/cart";
import { orderTotal } from "@/lib/commerce";
import { BRAND, SALES_MODE, SHIP_ESTIMATE_TEXT } from "@/lib/config";
import { checkoutCustomerSchema } from "@/lib/schemas";
import { cn, formatUsd } from "@/lib/utils";

type FormValues = z.infer<typeof checkoutCustomerSchema>;

const fieldClass =
  "mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-cyan/60";

export function CheckoutForm() {
  const router = useRouter();
  const items = useCart((s) => s.items);
  const clear = useCart((s) => s.clear);
  const subtotal = useCart((s) => s.subtotal());
  const { shipping, total } = orderTotal(subtotal);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm<FormValues>({
    resolver: zodResolver(checkoutCustomerSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      address: {
        line1: "",
        line2: "",
        city: "",
        state: "",
        postalCode: "",
        country: "US",
      },
    },
  });

  async function placeOrder() {
    setError(null);
    if (items.length === 0) {
      setError("Your cart is empty.");
      return;
    }

    const valid = await new Promise<boolean>((resolve) => {
      void handleSubmit(
        () => resolve(true),
        () => resolve(false),
      )();
    });
    if (!valid) {
      setError("Fix the highlighted fields, then try again.");
      return;
    }

    const customer = getValues();
    setBusy(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer,
          cart: items,
          waitlistEmail: SALES_MODE === "preorder" ? customer.email : undefined,
        }),
      });
      const data = (await res.json()) as {
        orderId?: string;
        redirectUrl?: string;
        error?: string;
      };
      if (!res.ok) {
        throw new Error(data.error || "Checkout failed");
      }
      clear();
      router.push(
        data.redirectUrl ||
          `/order/confirmation?orderId=${encodeURIComponent(data.orderId || "unknown")}`,
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Checkout failed");
    } finally {
      setBusy(false);
    }
  }

  if (items.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border p-10 text-center">
        <p className="text-muted">Nothing to check out yet.</p>
        <a href="/glove" className="mt-4 inline-block text-sm text-cyan">
          Shop the glove
        </a>
      </div>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
      <form
        className="space-y-6 rounded-2xl border border-border bg-glass p-6"
        onSubmit={(e) => {
          e.preventDefault();
          void placeOrder();
        }}
      >
        <div>
          <h2 className="font-display text-xl uppercase tracking-tight">
            Contact
          </h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <Field label="Full name" error={errors.name?.message}>
              <input {...register("name")} className={fieldClass} autoComplete="name" />
            </Field>
            <Field label="Email" error={errors.email?.message}>
              <input
                {...register("email")}
                type="email"
                className={fieldClass}
                autoComplete="email"
              />
            </Field>
            <Field label="Phone (optional)" error={errors.phone?.message}>
              <input {...register("phone")} className={fieldClass} autoComplete="tel" />
            </Field>
          </div>
        </div>

        <div>
          <h2 className="font-display text-xl uppercase tracking-tight">
            Shipping address
          </h2>
          <div className="mt-4 grid gap-4">
            <Field label="Address" error={errors.address?.line1?.message}>
              <input
                {...register("address.line1")}
                className={fieldClass}
                autoComplete="address-line1"
              />
            </Field>
            <Field label="Apt / suite" error={errors.address?.line2?.message}>
              <input
                {...register("address.line2")}
                className={fieldClass}
                autoComplete="address-line2"
              />
            </Field>
            <div className="grid gap-4 sm:grid-cols-3">
              <Field label="City" error={errors.address?.city?.message}>
                <input
                  {...register("address.city")}
                  className={fieldClass}
                  autoComplete="address-level2"
                />
              </Field>
              <Field label="State" error={errors.address?.state?.message}>
                <input
                  {...register("address.state")}
                  className={fieldClass}
                  autoComplete="address-level1"
                />
              </Field>
              <Field label="ZIP" error={errors.address?.postalCode?.message}>
                <input
                  {...register("address.postalCode")}
                  className={fieldClass}
                  autoComplete="postal-code"
                />
              </Field>
            </div>
            <input type="hidden" {...register("address.country")} />
          </div>
        </div>

        <PaymentSlot
          onMockPlaceOrder={() => void placeOrder()}
          busy={busy}
          disabled={items.length === 0}
        />

        {error ? <p className="text-sm text-red-300">{error}</p> : null}
        {SALES_MODE === "preorder" ? (
          <p className="text-xs text-muted">
            Pre-order mode captures your email on the waitlist when you place a
            mock order. {SHIP_ESTIMATE_TEXT}
          </p>
        ) : null}
      </form>

      <aside className="h-fit rounded-2xl border border-border p-6 lg:sticky lg:top-24">
        <h2 className="font-display text-xl uppercase tracking-tight">
          Order summary
        </h2>
        <ul className="mt-4 space-y-3 text-sm">
          {items.map((item) => (
            <li
              key={`${item.sku}-${item.size}`}
              className="flex justify-between gap-3"
            >
              <span>
                {BRAND.productName} · {item.size} × {item.qty}
              </span>
              <span>{formatUsd(item.price * item.qty)}</span>
            </li>
          ))}
        </ul>
        <dl className="mt-6 space-y-2 border-t border-border pt-4 text-sm">
          <div className="flex justify-between">
            <dt className="text-muted">Subtotal</dt>
            <dd>{formatUsd(subtotal)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted">Shipping</dt>
            <dd>{shipping === 0 ? "Free" : formatUsd(shipping)}</dd>
          </div>
          <div className="flex justify-between font-medium">
            <dt>Total</dt>
            <dd>{formatUsd(total)}</dd>
          </div>
        </dl>
      </aside>
    </div>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className={cn("block text-xs uppercase tracking-[0.14em] text-muted")}>
      {label}
      {children}
      {error ? (
        <span className="mt-1 block normal-case tracking-normal text-red-300">
          {error}
        </span>
      ) : null}
    </label>
  );
}
