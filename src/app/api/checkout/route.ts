
import { NextResponse } from "next/server";

import safepay from "@/lib/safepay";
import { convertUsdToPaisa } from "@/lib/currency";

type DummyProduct = {
  id: number;
  price: number;
};

export async function POST(request: Request) {
  try {
    const publicKey = process.env.SAFEPAY_PUBLIC_KEY;

    if (!publicKey) {
      throw new Error("Safepay public key is missing.");
    }

    const body: unknown = await request.json();

    if (
      !body ||
      typeof body !== "object" ||
      !("items" in body) ||
      !Array.isArray(body.items) ||
      body.items.length === 0
    ) {
      return NextResponse.json(
        { error: "Your cart is empty or invalid." },
        { status: 400 },
      );
    }

    let totalUsdCents = 0;

    for (const item of body.items) {
      if (
        !item ||
        typeof item !== "object" ||
        !("id" in item) ||
        !("quantity" in item) ||
        typeof item.id !== "number" ||
        typeof item.quantity !== "number" ||
        !Number.isSafeInteger(item.id) ||
        !Number.isSafeInteger(item.quantity) ||
        item.id < 1 ||
        item.quantity < 1 ||
        item.quantity > 20
      ) {
        return NextResponse.json(
          { error: "Invalid cart item." },
          { status: 400 },
        );
      }

      // Fetch the product from DummyJSON.
      const productResponse = await fetch(
        `https://dummyjson.com/products/${item.id}`,
        { cache: "no-store" },
      );

      if (!productResponse.ok) {
        return NextResponse.json(
          { error: `Product ${item.id} not found.` },
          { status: 400 },
        );
      }

      const product: DummyProduct = await productResponse.json();

      if (
        product.id !== item.id ||
        !Number.isFinite(product.price) ||
        product.price < 0
      ) {
        return NextResponse.json(
          { error: "Invalid product information." },
          { status: 400 },
        );
      }

      totalUsdCents +=
        Math.round(product.price * 100) * item.quantity;
    }

    const totalUsd = totalUsdCents / 100;
    const amountInPaisa = convertUsdToPaisa(totalUsd);

    // Create Safepay payment session.
    const session = await safepay.payments.session.setup({
      merchant_api_key: publicKey,
      intent: "CYBERSOURCE",
      mode: "payment",
      entry_mode: "raw",
      currency: "PKR",
      amount: amountInPaisa,
      metadata: {
        source: "my-online-store",
      },
      include_fees: false,
    });

    const trackerToken = session.data.tracker.token;

    // Generate Safepay passport.
    const passportResponse = await safepay.client.passport.create();

    const passportToken = passportResponse?.data;

    if (!passportToken) {
      throw new Error("Safepay passport token is missing.");
    }

    const appUrl = process.env.APP_URL ?? "http://localhost:3000";

    const checkoutUrl = safepay.checkout.createCheckoutUrl({
      env: "sandbox",
      tracker: trackerToken,
      tbt: passportToken,
      source: "hosted",
      redirect_url: new URL("/checkout/success", appUrl).toString(),
      cancel_url: new URL("/checkout/cancel", appUrl).toString(),
    });

    return NextResponse.json({ checkoutUrl });
  } catch (error) {
    console.error("Safepay checkout error:", error);

    return NextResponse.json(
      { error: "Unable to create checkout session." },
      { status: 500 },
    );
  }
}
