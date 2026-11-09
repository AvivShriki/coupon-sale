const priceFormatter = new Intl.NumberFormat("he-IL", {
  style: "currency",
  currency: "ILS",
  maximumFractionDigits: 0,
});

const numberFormatter = new Intl.NumberFormat("he-IL");

const dateFormatter = new Intl.DateTimeFormat("he-IL", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

const shortDateFormatter = new Intl.DateTimeFormat("he-IL", {
  day: "numeric",
  month: "short",
});

export function formatPrice(value: number): string {
  return priceFormatter.format(value);
}

export function formatNumber(value: number): string {
  return numberFormatter.format(value);
}

export function formatDate(iso: string | null): string | null {
  if (!iso) return null;
  return dateFormatter.format(new Date(iso));
}

export function formatShortDate(iso: string | null): string | null {
  if (!iso) return null;
  return shortDateFormatter.format(new Date(iso));
}

/** "לפני 3 ימים" — בלי תלות בספריית תאריכים */
export function formatRelative(iso: string, now: number = Date.now()): string {
  const diffMs = now - new Date(iso).getTime();
  const minutes = Math.round(diffMs / 60000);
  if (minutes < 1) return "כרגע";
  if (minutes < 60) return `לפני ${minutes} דק׳`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `לפני ${hours} שעות`;
  const days = Math.round(hours / 24);
  if (days === 1) return "אתמול";
  if (days < 30) return `לפני ${days} ימים`;
  const months = Math.round(days / 30);
  if (months < 12) return `לפני ${months} חודשים`;
  return `לפני ${Math.round(months / 12)} שנים`;
}

export function discountPercent(price: number, originalPrice: number | null): number | null {
  if (!originalPrice || originalPrice <= price) return null;
  return Math.round(((originalPrice - price) / originalPrice) * 100);
}

/** ימים עד התפוגה. שלילי = פג */
export function daysUntil(iso: string | null, now: number = Date.now()): number | null {
  if (!iso) return null;
  const diff = new Date(iso).getTime() - now;
  return Math.ceil(diff / 86400000);
}

export function whatsappLink(phone: string, message: string): string {
  const digits = phone.replace(/\D/g, "").replace(/^0/, "972");
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}
