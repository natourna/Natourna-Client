const shortFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
});

const longFormatter = new Intl.DateTimeFormat("en-US", {
  month: "long",
  day: "numeric",
  year: "numeric",
});

const weekdayFormatter = new Intl.DateTimeFormat("en-US", {
  weekday: "long",
  month: "long",
  day: "numeric",
});

const monthYearFormatter = new Intl.DateTimeFormat("en-US", {
  month: "long",
  year: "numeric",
});

export function formatShortDate(isoDate: string): string {
  return shortFormatter.format(new Date(isoDate));
}

export function formatLongDate(isoDate: string): string {
  return longFormatter.format(new Date(isoDate));
}

export function formatWeekdayDate(date: Date): string {
  return weekdayFormatter.format(date);
}

export function formatMonthYear(isoDate: string): string {
  return monthYearFormatter.format(new Date(isoDate));
}

export function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

export function isPastDue(dueDate: string): boolean {
  return dueDate < todayIso();
}

export function isSameMonth(isoDate: string, reference: Date): boolean {
  const date = new Date(isoDate);
  return (
    date.getFullYear() === reference.getFullYear() &&
    date.getMonth() === reference.getMonth()
  );
}

export function currentMonthLabel(): string {
  return new Intl.DateTimeFormat("en-US", { month: "long" }).format(new Date());
}

export function greeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}
