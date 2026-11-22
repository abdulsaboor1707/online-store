export const USD_TO_PKR_RATE = 280;

export function convertUsdToPaisa(usdAmount: number): number {
  const pkrAmount = usdAmount * USD_TO_PKR_RATE;

  const roundedRupees = Math.round(pkrAmount);

  return roundedRupees * 100;
}