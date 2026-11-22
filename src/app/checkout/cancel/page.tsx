
import Link from "next/link";

export default function CheckoutCancelPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md rounded-xl bg-white p-8 text-center shadow-md">
        <div className="mb-4 text-5xl text-red-500">✕</div>

        <h1 className="mb-3 text-2xl font-bold text-gray-800">
          Payment Cancelled
        </h1>

        <p className="mb-6 text-gray-600">
          Your checkout was cancelled. No order confirmation has been
          issued. You can return to your cart and try again.
        </p>

        <div className="flex flex-col gap-3">
          <Link
            href="/cart"
            className="rounded-lg bg-blue-600 px-6 py-3 font-medium text-white hover:bg-blue-700"
          >
            Return to Cart
          </Link>

          <Link
            href="/"
            className="text-sm font-medium text-gray-600 hover:text-gray-900"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </main>
  );
}
