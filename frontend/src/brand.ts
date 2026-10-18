import type { IconName } from './components/Icon';

/*
 * Arculat és elérhetőségek egy helyen.
 * Színek, betűk, méretek: src/styles/tokens.css
 */
export const brand = {
  id: 'adreuse',
  name: 'AdReuse',
  /** Szöveges logó két fele a jel előtt és után. */
  logoText: ['Ad', 'Reuse'] as [string, string],
  /** Kép logó, pl. '/logo.svg'. Ha meg van adva, a szöveges logó helyett ez jelenik meg. */
  logoSrc: '' as string,

  email: 'hello@adreuse.example',
  currency: 'HUF',

  social: [
    { label: 'Facebook', href: 'https://www.facebook.com', icon: 'facebook' },
    { label: 'Instagram', href: 'https://www.instagram.com', icon: 'instagram' },
  ] satisfies { label: string; href: string; icon: IconName }[],
};
