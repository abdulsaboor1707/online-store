import "server-only";
import Safepay from "@sfpy/node-core";

const secretKey = process.env.SAFEPAY_SECRET_KEY;
const host = process.env.SAFEPAY_HOST;

if (!secretKey || !host) {
  throw new Error("Safepay environment variables are missing.");
}

const safepay = new Safepay(secretKey, {
  authType: "secret",
  host,
});

export default safepay;