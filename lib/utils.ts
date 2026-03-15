import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(Number(price) || 0);
}

export function calcDiscountedPrice(price: number | string, discount: number | string): number {
  const p = Number(price) || 0;
  const d = Number(discount) || 0;
  if (!d || d <= 0) return p;
  return p - (p * d) / 100;
}

export function formatDate(dateString: string): string {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(dateString));
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trimEnd() + "...";
}

export function generateStarArray(rating: number | string): boolean[] {
  return Array.from({ length: 5 }, (_, i) => i < Math.round(Number(rating) || 0));
}