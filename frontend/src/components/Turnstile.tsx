import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import { useI18n } from '../i18n';

/*
 * Cloudflare Turnstile widget. A nyilvános kulcs buildkor jön: VITE_TURNSTILE_SITE_KEY.
 * Ha nincs megadva, nem jelenik meg semmi (a backend ilyenkor TURNSTILE_SECRET_KEY nélkül fut).
 * A widget egy rejtett "cf-turnstile-response" mezőt tesz az űrlapba, így a FormData-val elküldődik.
 */

const SITE_KEY = import.meta.env.VITE_TURNSTILE_SITE_KEY ?? '';
const SCRIPT_URL = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';

type TurnstileApi = {
  render: (el: HTMLElement, options: Record<string, unknown>) => string;
  reset: (id?: string) => void;
  remove: (id: string) => void;
};

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

let loader: Promise<TurnstileApi> | null = null;

function loadTurnstile(): Promise<TurnstileApi> {
  loader ??= new Promise((resolve, reject) => {
    if (window.turnstile) return resolve(window.turnstile);
    const script = document.createElement('script');
    script.src = SCRIPT_URL;
    script.async = true;
    script.onload = () => (window.turnstile ? resolve(window.turnstile) : reject(new Error('turnstile')));
    script.onerror = () => reject(new Error('turnstile'));
    document.head.appendChild(script);
  });
  return loader;
}

export const turnstileEnabled = SITE_KEY !== '';

export type TurnstileHandle = { reset: () => void };

export const Turnstile = forwardRef<TurnstileHandle>(function Turnstile(_, ref) {
  const { lang } = useI18n();
  const container = useRef<HTMLDivElement>(null);
  const widget = useRef<string | null>(null);

  useImperativeHandle(ref, () => ({
    reset: () => widget.current && window.turnstile?.reset(widget.current),
  }));

  useEffect(() => {
    if (!turnstileEnabled || !container.current) return;
    let cancelled = false;
    loadTurnstile()
      .then((api) => {
        if (cancelled || !container.current) return;
        widget.current = api.render(container.current, { sitekey: SITE_KEY, theme: 'dark', language: lang });
      })
      .catch(() => {
        // A szkript nem töltődött be: a backend elutasítja a küldést, az űrlap hibaüzenetet mutat.
      });
    return () => {
      cancelled = true;
      if (widget.current) window.turnstile?.remove(widget.current);
      widget.current = null;
    };
  }, [lang]);

  if (!turnstileEnabled) return null;
  return <div className="turnstile" ref={container} />;
});
