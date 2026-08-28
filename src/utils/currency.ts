const formatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

export function formatCurrency(amount: number): string {
  return formatter.format(amount);
}

export function formatSignedCurrency(amount: number): string {
  const sign = amount < 0 ? "−" : "+";
  return `${sign}${formatter.format(Math.abs(amount))}`;
}
