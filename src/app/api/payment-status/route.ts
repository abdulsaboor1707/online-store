
import { NextResponse } from "next/server";
import safepay from "@/lib/safepay";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const tracker = searchParams.get("tracker");

    if (!tracker || !/^track_[a-zA-Z0-9-]+$/.test(tracker)) {
      return NextResponse.json(
        { error: "Invalid payment reference." },
        { status: 400 },
      );
    }

    const response = await safepay.reporter.payments.fetch(tracker);

    const state = response?.data?.state;
    

    return NextResponse.json({
      paymentStatus:
        state === "TRACKER_ENDED" ? "success" : "pending",
    });
  } catch (error) {
    console.error("Payment verification error:", error);

    return NextResponse.json(
      { error: "Unable to verify payment." },
      { status: 500 },
    );
  }
}
