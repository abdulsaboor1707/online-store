
export type Product = {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  category?: string;
  rating?: number;
  discountPercentage?: number;
};

export const products: Product[] = [
  {
    id: 1,
    name: "Wireless Mouse",
    description: "A comfortable wireless mouse for everyday use.",
    price: 19.99,
    image: "🖱️",
  },
  {
    id: 2,
    name: "Mechanical Keyboard",
    description: "A premium mechanical keyboard for productivity.",
    price: 49.99,
    image: "⌨️",
  },
];
