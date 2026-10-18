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
  /** A logójel (céltábla) képe a public/ mappából. */
  logoMarkSrc: '/logo-mark.png',
  /** Teljes kép logó, pl. '/logo.svg'. Ha meg van adva, a szöveges logó helyett ez jelenik meg. */
  logoSrc: '' as string,

  email: 'hello@adreuse.example',
  currency: 'HUF',

  social: [
    { label: 'LinkedIn', href: 'https://uk.linkedin.com/company/adglobalapp', icon: 'linkedin' },
  ] satisfies { label: string; href: string; icon: IconName }[],

  /** Anyacég: a láblécben a logója és a cégadatok (Companies House szerint). */
  parent: {
    name: 'AdGlobalApp',
    company: 'ADGLOBALAPP LTD',
    companyNumber: '15251437',
    registeredOffice: '38 Abbott Court, Buckshaw Village, Chorley, England, PR7 7ET',
    url: 'https://www.adglobalapp.com',
    logoSrc: '/adapp-logo.png',
  },
};
