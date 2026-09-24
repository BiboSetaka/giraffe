export const CURRENCY_SYMBOL = "M"

export function formatPrice(value) {
  return `${CURRENCY_SYMBOL}${Number(value).toFixed(2)}`
}
