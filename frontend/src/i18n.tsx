import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { brand } from './brand';
import { content, defaultLang, languages, type Content, type Lang } from './content';

// v2: a korábbi verzió minden látogatónál automatikusan elmentette a magyart; azt figyelmen kívül hagyjuk.
const STORAGE_KEY = `${brand.id}-lang-v2`;

/** A böngésző nyelvei közül az első spanyol vagy angol; a magyar böngésző is angolt kap (a HU gombbal váltható). */
function browserLang(): Lang {
  const preferred = navigator.languages?.length ? navigator.languages : [navigator.language];
  for (const tag of preferred) {
    const code = tag?.toLowerCase().slice(0, 2);
    if (code === 'es' || code === 'en') return code;
  }
  return defaultLang;
}

function initialLang(): Lang {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && (languages as readonly string[]).includes(stored)) return stored as Lang;
  } catch {
    // storage nem elérhető – a böngésző nyelve dönt
  }
  return browserLang();
}

type I18nValue = { lang: Lang; setLang: (lang: Lang) => void; t: Content };

const I18nContext = createContext<I18nValue | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(initialLang);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  // Csak a látogató saját választását jegyezzük meg, az automatikusan felismert nyelvet nem.
  const setLang = (next: Lang) => {
    setLangState(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // ignore
    }
  };

  return <I18nContext.Provider value={{ lang, setLang, t: content[lang] }}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useI18n must be used inside <I18nProvider>');
  return ctx;
}
