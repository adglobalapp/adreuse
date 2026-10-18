import { locales, type Lang } from './content';

export function formatPrice(amount: number, currency: string, lang: Lang) {
  return new Intl.NumberFormat(locales[lang], { style: 'currency', currency, maximumFractionDigits: 0 }).format(amount);
}

export function formatDate(iso: string, lang: Lang) {
  return new Intl.DateTimeFormat(locales[lang], { dateStyle: 'medium' }).format(new Date(iso));
}
