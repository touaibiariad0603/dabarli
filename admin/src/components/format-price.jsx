export function formatPrice(amount) {
  const suffix = "Dz";
  return (
    amount.toLocaleString("en-DZ", { minimumFractionDigits: 0 }) + " " + suffix
  );
}
