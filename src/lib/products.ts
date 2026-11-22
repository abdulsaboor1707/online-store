
import type { Product } from "@/data/products";

type DummyProduct = {
  id: number;
  title: string;
  description: string;
  price: number;
  thumbnail: string;
  category: string;
  rating: number;
  discountPercentage: number;
};

type DummyProductsResponse = {
  products: DummyProduct[];
  total: number;
  skip: number;
  limit: number;
};

export async function getProducts(): Promise<Product[]> {
  const response = await fetch("https://dummyjson.com/products", {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch products.");
  }

  const data: DummyProductsResponse = await response.json();

  return data.products.map((product) => ({
    id: product.id,
    name: product.title,
    description: product.description,
    price: product.price,
    image: product.thumbnail,
    category: product.category,
    rating: product.rating,
    discountPercentage: product.discountPercentage,
  }));
}
