const USD_TO_KHR = 4000;
const KHMER_DIGITS = '០១២៣៤៥៦៧៨៩';

export function toKhmerDigits(value: string) {
  return value.replace(/\d/g, (digit) => KHMER_DIGITS[Number(digit)]);
}

export function formatPrice(price: string, isKhmer: boolean) {
  if (!isKhmer || !price) {
    return price;
  }

  const isAlreadyRiel = /រៀល|KHR/i.test(price);
  const numericValue = Number(price.replace(/[^\d.]/g, ''));

  if (!Number.isFinite(numericValue)) {
    return toKhmerDigits(price);
  }

  const rielValue = isAlreadyRiel
    ? Math.round(numericValue)
    : Math.round(numericValue * USD_TO_KHR);

  return `${toKhmerDigits(rielValue.toLocaleString('en-US'))} រៀល`;
}
