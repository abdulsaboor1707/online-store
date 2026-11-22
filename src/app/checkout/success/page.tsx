
"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

type PaymentStatus = "loading" | "success" | "pending" | "error";

function PaymentResult() {
  const searchParams = useSearchParams();
  const tracker = searchParams.get("tracker");

  const [status, setStatus] = useState<PaymentStatus>("loading");

  useEffect(() => {
    if (!tracker) {
      setStatus("error");
      return;
    }

    async function verifyPayment() {
      try {
        const response = await fetch(
          `/api/payment-status?tracker=${encodeURIComponent(tracker!)}`,
          { cache: "no-store" },
        );

        if (!response.ok) {
          throw new Error("Payment verification failed.");
        }

        const data = await response.json();

        setStatus(
          data.paymentStatus === "success" ? "success" : "pending",
        );
      } catch {
        setStatus("error");
      }
    }

    verifyPayment();
  }, [tracker]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md rounded-xl bg-white p-8 text-center shadow-md">
        {status === "loading" && (
          <>
            <h1 className="mb-3 text-2xl font-bold text-gray-800">
              Verifying Payment...
            </h1>
            <p className="text-gray-600">
              Please wait while we confirm your payment.
            </p>
          </>
        )}

        {status === "success" && (
          <>
            <div className="mb-4 text-5xl text-green-600">✓</div>
            <h1 className="mb-3 text-2xl font-bold text-green-700">
              Payment Successful!
            </h1>
            <p className="mb-6 text-gray-600">
              Thank you for your purchase. Your payment has been confirmed.
            </p>
          </>
        )}

        {status === "pending" && (
          <>
            <h1 className="mb-3 text-2xl font-bold text-yellow-600">
              Payment Pending
            </h1>
            <p className="mb-6 text-gray-600">
              We have not received confirmation yet. Please check again later.
            </p>
          </>
        )}

        {status === "error" && (
          <>
            <h1 className="mb-3 text-2xl font-bold text-red-600">
              Unable to Verify Payment
            </h1>
            <p className="mb-6 text-gray-600">
              We could not confirm your payment. Please contact support if
              money was deducted.
            </p>
          </>
        )}

        <Link
          href="/"
          className="inline-block rounded-lg bg-blue-600 px-6 py-3 font-medium text-white hover:bg-blue-700"
        >
          Return to Store
        </Link>
      </div>
    </main>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center">
          <p>Loading payment information...</p>
        </main>
      }
    >
      <PaymentResult />
    </Suspense>
  );
}
