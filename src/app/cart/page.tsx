
"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";

export default function CartPage() {
  const {
    cart,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
    cartTotal,
  } = useCart();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleCheckout() {
    try {
      setIsLoading(true);
      setError("");

      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items: cart.map((item) => ({
            id: item.id,
            quantity: item.quantity,
          })),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Checkout failed.");
      }

      if (!data.checkoutUrl) {
        throw new Error("Safepay checkout URL was not returned.");
      }

      window.location.assign(data.checkoutUrl);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong.",
      );

      setIsLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">

        {/* Header */}
        <div className="mb-10 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-blue-600">
              Your Shopping Bag
            </p>

            <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Shopping Cart
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Review your items before proceeding to checkout.
            </p>
          </div>

          <Link
            href="/"
            className="text-sm font-semibold text-blue-600 transition hover:text-blue-800"
          >
            ← Continue Shopping
          </Link>
        </div>

        {cart.length === 0 ? (
          /* Empty Cart */
          <div className="rounded-2xl border border-slate-200 bg-white px-6 py-16 text-center shadow-sm">
            <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-blue-50 text-4xl">
              🛒
            </div>

            <h2 className="text-2xl font-bold text-slate-900">
              Your cart is empty
            </h2>

            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-500">
              Looks like you haven't added anything to your cart yet.
              Explore our collection and find something you love.
            </p>

            <Link
              href="/"
              className="mt-7 inline-flex items-center justify-center rounded-xl bg-blue-600 px-7 py-3 font-semibold text-white shadow-sm transition hover:bg-blue-700"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-3">

            {/* Cart Items */}
            <section className="space-y-5 lg:col-span-2">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-slate-900">
                  Cart Items
                </h2>

                <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                  {cart.reduce((total, item) => total + item.quantity, 0)} items
                </span>
              </div>

              <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                {cart.map((item) => (
                  <div
                    key={item.id}
                    className="flex flex-col gap-5 border-b border-slate-100 p-5 last:border-b-0 sm:flex-row sm:items-center sm:justify-between sm:p-6"
                  >
                    {/* Product Details */}
                    <div className="flex min-w-0 items-center gap-4">
                      <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-slate-50">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          sizes="96px"
                          className="object-contain p-2"
                        />
                      </div>

                      <div className="min-w-0">
                        <p className="mb-1 text-xs font-medium capitalize text-blue-600">
                          {item.category || "Product"}
                        </p>

                        <h3 className="line-clamp-2 font-semibold text-slate-900">
                          {item.name}
                        </h3>

                        <p className="mt-2 text-sm text-slate-500">
                          ${item.price.toFixed(2)} each
                        </p>
                      </div>
                    </div>

                    {/* Quantity and Price */}
                    <div className="flex flex-wrap items-center justify-between gap-4 sm:justify-end">
                      <div className="flex items-center rounded-lg border border-slate-200">
                        <button
                          type="button"
                          onClick={() => decreaseQuantity(item.id)}
                          aria-label={`Decrease ${item.name} quantity`}
                          className="flex h-9 w-9 items-center justify-center text-lg text-slate-600 transition hover:bg-slate-100"
                        >
                          −
                        </button>

                        <span className="min-w-9 text-center text-sm font-semibold text-slate-900">
                          {item.quantity}
                        </span>

                        <button
                          type="button"
                          onClick={() => increaseQuantity(item.id)}
                          aria-label={`Increase ${item.name} quantity`}
                          className="flex h-9 w-9 items-center justify-center text-lg text-slate-600 transition hover:bg-slate-100"
                        >
                          +
                        </button>
                      </div>

                      <div className="min-w-20 text-right">
                        <p className="font-bold text-slate-900">
                          ${(item.price * item.quantity).toFixed(2)}
                        </p>

                        <button
                          type="button"
                          onClick={() => removeFromCart(item.id)}
                          className="mt-1 text-xs font-medium text-red-500 transition hover:text-red-700"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <Link
                href="/"
                className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-blue-600"
              >
                ← Add more products
              </Link>
            </section>

            {/* Order Summary */}
            <aside className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:sticky lg:top-6">
              <h2 className="text-lg font-bold text-slate-900">
                Order Summary
              </h2>

              <div className="mt-6 space-y-4">
                <div className="flex justify-between text-sm text-slate-600">
                  <span>Subtotal</span>
                  <span>${cartTotal.toFixed(2)}</span>
                </div>

                <div className="flex justify-between text-sm text-slate-600">
                  <span>Shipping</span>
                  <span className="font-semibold text-green-600">
                    Free
                  </span>
                </div>

                <div className="border-t border-slate-100 pt-4">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">
                      Total
                    </span>

                    <span className="text-2xl font-bold text-slate-900">
                      ${cartTotal.toFixed(2)}
                    </span>
                  </div>

                  <p className="mt-1 text-xs text-slate-400">
                    Final payment amount is converted to PKR at checkout.
                  </p>
                </div>
              </div>

              {error && (
                <p className="mt-5 rounded-lg border border-red-100 bg-red-50 p-3 text-sm text-red-700">
                  {error}
                </p>
              )}

              <button
                type="button"
                onClick={handleCheckout}
                disabled={isLoading}
                className="mt-7 w-full rounded-xl bg-blue-600 px-5 py-3.5 font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-400"
              >
                {isLoading
                  ? "Redirecting to Safepay..."
                  : "Proceed to Checkout →"}
              </button>

              <div className="mt-5 flex items-center justify-center gap-2 text-xs text-slate-500">
                <span>🔒</span>
                Secure checkout powered by Safepay
              </div>

              <div className="mt-6 rounded-xl bg-slate-50 p-4">
                <p className="text-center text-xs leading-5 text-slate-500">
                  Your payment will be processed securely through
                  Safepay's hosted checkout page.
                </p>
              </div>
            </aside>
          </div>
        )}
      </div>
    </main>
  );
}
