
"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";

import ProductCard from "@/components/ProductCard";
import type { Product } from "@/data/products";
import { getProducts } from "@/lib/products";
import { useCart } from "@/context/CartContext";

export default function Home() {
  const { cart, cartTotal } = useCart();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cartOpen, setCartOpen] = useState(false);
  const [cartFeedback, setCartFeedback] = useState(false);

  const cartCount = cart.reduce(
    (total, item) => total + item.quantity,
    0,
  );

  const previousCartCount = useRef(cartCount);

  // Detect when a product is added to the cart.
  useEffect(() => {
    if (cartCount > previousCartCount.current) {
      setCartFeedback(true);

      const timer = setTimeout(() => {
        setCartFeedback(false);
      }, 900);

      previousCartCount.current = cartCount;

      return () => clearTimeout(timer);
    }

    previousCartCount.current = cartCount;
  }, [cartCount]);

  // Fetch products.
  useEffect(() => {
    async function fetchProducts() {
      try {
        const data = await getProducts();
        setProducts(data);
      } catch {
        setError("Unable to load products. Please try again.");
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-12 sm:px-8">
      <div className="mx-auto max-w-6xl">

        {/* Header */}
        <header className="mb-10 flex flex-col items-center justify-between gap-5 sm:flex-row">
          <div className="text-center sm:text-left">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              My Online Store
            </h1>

            <p className="mt-3 text-gray-600">
              Discover our latest products.
            </p>
          </div>

          {/* Cart Dropdown */}
          <div
            className="relative z-50"
            onMouseEnter={() => setCartOpen(true)}
            onMouseLeave={() => setCartOpen(false)}
          >
            <button
              type="button"
              onClick={() => setCartOpen((open) => !open)}
              aria-expanded={cartOpen}
              aria-label={`Shopping cart with ${cartCount} items`}
              className={`flex items-center gap-3 rounded-xl px-5 py-3 font-semibold text-white shadow-sm transition-all duration-300 ${
                cartFeedback
                  ? "scale-110 bg-green-600 ring-4 ring-green-100"
                  : "scale-100 bg-blue-600 hover:bg-blue-700"
              }`}
            >
              <span className="text-xl">🛒</span>

              <span>My Cart</span>

              <span className="flex h-7 min-w-7 items-center justify-center rounded-full bg-white px-2 text-sm font-bold text-blue-600">
                {cartCount}
              </span>

              <span className="text-xs">▼</span>
            </button>

            {/* Mini Cart Panel */}
            {cartOpen && (
              <div className="absolute right-0 top-full mt-2 w-[min(360px,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl">

                {/* Dropdown Header */}
                <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
                  <h2 className="font-bold text-gray-900">
                    Shopping Cart
                  </h2>

                  <span className="text-sm text-gray-500">
                    {cartCount} items
                  </span>
                </div>

                {/* Cart Products */}
                {cart.length === 0 ? (
                  <div className="px-5 py-10 text-center">
                    <p className="text-3xl">🛒</p>

                    <p className="mt-3 font-semibold text-gray-800">
                      Your cart is empty
                    </p>

                    <p className="mt-1 text-sm text-gray-500">
                      Add some products to get started.
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="max-h-80 divide-y divide-gray-100 overflow-y-auto">
                      {cart.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center gap-3 px-5 py-4"
                        >
                          <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-gray-100">
                            <Image
                              src={item.image}
                              alt={item.name}
                              fill
                              sizes="56px"
                              className="object-contain p-1"
                            />
                          </div>

                          <div className="min-w-0 flex-1">
                            <h3 className="line-clamp-2 text-sm font-semibold text-gray-900">
                              {item.name}
                            </h3>

                            <p className="mt-1 text-xs text-gray-500">
                              ${item.price.toFixed(2)} × {item.quantity}
                            </p>
                          </div>

                          <p className="shrink-0 text-sm font-bold text-gray-900">
                            ${(item.price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      ))}
                    </div>

                    {/* Subtotal */}
                    <div className="border-t border-gray-100 bg-gray-50 px-5 py-4">
                      <div className="mb-4 flex justify-between">
                        <span className="font-semibold text-gray-700">
                          Subtotal
                        </span>

                        <span className="text-lg font-bold text-gray-900">
                          ${cartTotal.toFixed(2)}
                        </span>
                      </div>

                      <Link
                        href="/cart"
                        onClick={() => setCartOpen(false)}
                        className="block rounded-xl bg-blue-600 px-4 py-3 text-center text-sm font-semibold text-white transition hover:bg-blue-700"
                      >
                        View Cart & Checkout →
                      </Link>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </header>

        {/* Product Loading */}
        {loading && (
          <p className="py-12 text-center text-gray-600">
            Loading products...
          </p>
        )}

        {/* Error */}
        {error && (
          <p className="py-12 text-center text-red-600">
            {error}
          </p>
        )}

        {/* Product Grid */}
        {!loading && !error && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
