"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { PaymentSlot } from "@/components/commerce/PaymentSlot";
import { useCart } from "@/lib/store/cart";
import { orderTotal } from "@/lib/commerce";
import { PreorderTerms } from "@/components/commerce/OfferNotes";
import { readAttribution, track } from "@/lib/track";
import { displayUnitPriceUsd, labelForSku } from "@/lib/catalog";
import { useFormAbuseFields } from "@/lib/form-abuse";
import { checkoutCustomerSchema } from "@/lib/schemas";
import { cn, formatUsd } from "@/lib/utils";

type FormValues = z.infer<typeof checkoutCustomerSchema>;

const fieldClass =
  "mt-2 w-full rounded border border-rule bg-ground px-4 py-3 text-label outline-none focus:border-brand";

export function CheckoutForm() {
  const router = useRouter();
  const items = useCart((s) => s.items);
  const clear = useCart((s) => s.clear);
  const subtotal = useCart((s) => s.subtotal());
  const { shipping, total } = orderTotal(subtotal);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abuse = useFormAbuseFields();

  useEffect(() => {
    if (items.length > 0) track("begin_checkout", { items: items.length });
  }, [items.length]);

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
          cart: items.map(({ sku, size, qty }) => ({
            sku,
            size,
            qty,
          })),
          waitlistEmail: customer.email,
          attribution: readAttribution(),
          ...abuse,
        }),
      });
      const data = (await res.json()) as {
        orderId?: string;
        redirectUrl?: string;
        error?: string;
      };
      if (!res.ok || (!data.redirectUrl && !data.orderId)) {
        throw new Error("Checkout failed");
      }
      // Hosted Stripe Checkout is an absolute URL. full navigation required.
      if (data.redirectUrl?.startsWith("http")) {
        window.location.assign(data.redirectUrl);
        return;
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
      <div className="border border-rule p-10">
        <p className="text-ink-muted">Nothing to check out yet.</p>
        <a href="/glove" className="mt-4 inline-block text-label text-brand">
          Shop the glove
        </a>
      </div>
    );
  }

  return (
    <div className="grid gap-8 lg:split-7-5">
      <form
        className="space-y-6 rounded border border-rule bg-surface p-6"
        onSubmit={(e) => {
          e.preventDefault();
          void placeOrder();
        }}
      >
        <div>
          <h2 className="font-display text-h3">
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
          <h2 className="font-display text-h3">
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
          onPlaceOrder={() => void placeOrder()}
          busy={busy}
          disabled={items.length === 0}
          error={Boolean(error)}
        />

        {error ? <p className="text-label text-ink">{error}</p> : null}
        <PreorderTerms />
      </form>

      <aside className="h-fit border border-rule p-6 lg:sticky lg:top-chrome">
        <h2 className="font-display text-h3">
          Order summary
        </h2>
        <ul className="mt-4 space-y-3 text-label">
          {items.map((item) => (
            <li
              key={`${item.sku}-${item.size}`}
              className="flex justify-between gap-3"
            >
              <span>
                {labelForSku(item.sku)} · Size {item.size} × {item.qty}
              </span>
              <span>
                {formatUsd(displayUnitPriceUsd(item.sku) * item.qty)}
              </span>
            </li>
          ))}
        </ul>
        <dl className="mt-6 space-y-2 border-t border-rule pt-4 text-label">
          <div className="flex justify-between">
            <dt className="text-ink-muted">Subtotal</dt>
            <dd>{formatUsd(subtotal)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-ink-muted">Shipping</dt>
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
    <label className={cn("block text-label text-ink-muted")}>
      {label}
      {children}
      {error ? (
        <span className="mt-1 block normal-case tracking-normal text-ink">
          {error}
        </span>
      ) : null}
    </label>
  );
}
