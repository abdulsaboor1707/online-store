
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

import type { Product } from "@/data/products";
import { useCart } from "@/context/CartContext";

type ProductCardProps = {
  product: Product;
};

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const [isAdded, setIsAdded] = useState(false);

  function handleAddToCart() {
    addToCart(product);
    setIsAdded(true);
  }

  useEffect(() => {
    if (!isAdded) return;

    const timer = setTimeout(() => {
      setIsAdded(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, [isAdded]);

  return (
    <div className="group overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
      <div className="relative h-56 overflow-hidden bg-gray-100">
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-contain p-4 transition duration-300 group-hover:scale-105"
        />

        {product.discountPercentage && (
          <span className="absolute left-3 top-3 rounded-md bg-red-500 px-2 py-1 text-xs font-semibold text-white">
            {Math.round(product.discountPercentage)}% OFF
          </span>
        )}
      </div>

      <div className="space-y-3 p-5">
        <p className="text-xs font-medium capitalize text-blue-600">
          {product.category}
        </p>

        <h2 className="line-clamp-2 min-h-12 text-lg font-semibold text-gray-900">
          {product.name}
        </h2>

        <p className="line-clamp-2 text-sm text-gray-600">
          {product.description}
        </p>

        <div className="flex items-center justify-between">
          <span className="text-xl font-bold text-gray-900">
            ${product.price.toFixed(2)}
          </span>

          {product.rating !== undefined && (
            <span className="text-sm font-medium text-amber-600">
              ★ {product.rating.toFixed(1)}
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={handleAddToCart}
          className={`w-full rounded-lg px-4 py-2.5 text-sm font-semibold text-white transition ${
            isAdded
              ? "bg-green-600 hover:bg-green-700"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {isAdded ? "Added ✓" : "Add to Cart"}
        </button>
      </div>
    </div>
  );
}
