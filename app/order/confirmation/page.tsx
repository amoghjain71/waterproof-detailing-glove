import type { Metadata } from "next";
import { Suspense } from "react";
import { ConfirmationClient } from "@/components/commerce/ConfirmationClient";

export const metadata: Metadata = {
  title: "Order confirmation",
};

async function ConfirmationFromParams({
  searchParams,
}: {
  searchParams: Promise<{ orderId?: string }>;
}) {
  const params = await searchParams;
  return <ConfirmationClient orderId={params.orderId ?? "mock_order"} />;
}

export default function OrderConfirmationPage({
  searchParams,
}: {
  searchParams: Promise<{ orderId?: string }>;
}) {
  return (
    <Suspense
      fallback={
        <div className="px-4 py-20 text-label text-ink-muted">
          Confirming the order.
        </div>
      }
    >
      <ConfirmationFromParams searchParams={searchParams} />
    </Suspense>
  );
}
