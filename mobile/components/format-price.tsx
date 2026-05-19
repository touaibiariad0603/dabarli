export function formatPrice(amount: number) {
  const suffix = "Dz";
  return (
    amount.toLocaleString("en-DZ", { minimumFractionDigits: 0 }) + " " + suffix
  );
}
