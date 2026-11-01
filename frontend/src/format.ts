import { locales, type Lang } from './content';

/** Ár formázása; az összeg pennyben (minor unit) érkezik. Egész fontnál tizedesek nélkül. */
export function formatPrice(minor: number, currency: string, lang: Lang) {
  const whole = minor % 100 === 0;
  return new Intl.NumberFormat(locales[lang], {
    style: 'currency',
    currency,
    minimumFractionDigits: whole ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(minor / 100);
}

/** Fontban beírt összeg (pl. "12.5" vagy "12,50") átváltása pennyre; érvénytelen bemenetnél null. */
export function toMinor(value: string): number | null {
  const n = Number(value.replace(',', '.').trim());
  return value.trim() !== '' && Number.isFinite(n) && n >= 0 ? Math.round(n * 100) : null;
}

export function formatDate(iso: string, lang: Lang) {
  return new Intl.DateTimeFormat(locales[lang], { dateStyle: 'medium' }).format(new Date(iso));
}

/** Ország neve a felület nyelvén (pl. ES → España / Spain / Spanyolország). */
export function countryName(code: string, lang: Lang) {
  try {
    return new Intl.DisplayNames([locales[lang]], { type: 'region' }).of(code) ?? code;
  } catch {
    return code;
  }
}
