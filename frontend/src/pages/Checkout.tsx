import { useState, type FormEvent } from 'react';
import { Link, useParams } from 'react-router';
import { api, ApiError } from '../api';
import { brand } from '../brand';
import { Icon } from '../components/Icon';
import { Media } from '../components/Media';
import { PageHead } from '../components/PageHead';
import { countryName, formatPrice } from '../format';
import { useI18n } from '../i18n';
import { useAsync } from '../useAsync';
import { NotFound } from './NotFound';
import './Checkout.css';

/**
 * Fizetés előtti összesítő: a fogyasztóvédelmi szabályok szerinti kötelező tájékoztatással
 * (eladó, teljes ár, szállítás, vám, elállási jog, feltételek elfogadása), majd átirányítás a Stripe-ra.
 */
export function Checkout() {
  const { id = '' } = useParams();
  const { lang, t } = useI18n();
  const c = t.checkout;
  const data = useAsync(() => Promise.all([api.listing(id), api.shipping()]), [id]);
  const [country, setCountry] = useState('');
  const [accepted, setAccepted] = useState(false);
  const [state, setState] = useState<'idle' | 'paying' | 'unavailable' | 'error'>('idle');

  if (data.loading) return <p className="container page notice">{t.common.loading}</p>;
  if (data.error instanceof ApiError && data.error.status === 404) return <NotFound />;
  if (data.error || !data.data) return <p className="container page notice notice--error">{t.common.error}</p>;

  const [listing, shipping] = data.data;
  const zone = Object.entries(shipping.zones).find(([, codes]) => codes.includes(country))?.[0];
  const rate = zone ? shipping.rates.find((r) => r.size === listing.shipping_size && r.zone === zone) : undefined;
  const money = (minor: number) => formatPrice(minor, listing.currency, lang);

  if (!listing.purchasable || state === 'unavailable') {
    return (
      <div className="container page">
        <PageHead label={c.label} title={c.title} />
        <p className="notice">{c.notAvailable}</p>
        <Link to={`/listings/${listing.id}`} className="btn btn--outline">
          ← {t.listing.back}
        </Link>
      </div>
    );
  }

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!rate || !accepted) return;
    setState('paying');
    try {
      const { url } = await api.checkout({ listing_id: listing.id, country, locale: lang, accept_terms: true });
      window.location.assign(url);
    } catch (err) {
      setState(err instanceof ApiError && err.status === 422 ? 'unavailable' : 'error');
    }
  };

  return (
    <div className="container page">
      <PageHead label={c.label} title={c.title} />

      <form className="checkout" onSubmit={onSubmit}>
        <div className="checkout__main">
          <div className="checkout__item">
            <Media src={listing.image_url ?? undefined} alt={t.listing.imageAlt} ratio="1 / 1" />
            <div>
              <span className="label">{c.item}</span>
              <h2 className="checkout__title">{listing.title}</h2>
              <p className="checkout__meta">
                {t.conditions[listing.condition]} · {t.sizes[listing.shipping_size]}
              </p>
            </div>
          </div>

          <label className="field">
            <span>{c.country}</span>
            <select value={country} onChange={(e) => setCountry(e.target.value)} required>
              <option value="" disabled>
                {c.chooseCountry}
              </option>
              {Object.entries(shipping.zones).map(([z, codes]) => (
                <optgroup key={z} label={t.zones[z] ?? z}>
                  {[...codes]
                    .sort((a, b) => countryName(a, lang).localeCompare(countryName(b, lang), lang))
                    .map((code) => (
                      <option key={code} value={code}>
                        {countryName(code, lang)}
                      </option>
                    ))}
                </optgroup>
              ))}
            </select>
          </label>

          <section className="checkout__info">
            <h3>{c.delivery}</h3>
            <p>{c.deliveryText}</p>
            <h3>{c.customsTitle}</h3>
            {(zone === 'uk' || !zone) && <p>{c.customsUk}</p>}
            {(zone === 'eu' || !zone) && (
              <p>
                {c.customsEu}{' '}
                <a href="/delivery" target="_blank" rel="noreferrer">
                  {t.legal.shipping}
                </a>
              </p>
            )}
            <h3>{c.cancelTitle}</h3>
            <p>
              {c.cancelText}{' '}
              <a href="/returns" target="_blank" rel="noreferrer">
                {t.legal.returns}
              </a>
            </p>
            <h3>{c.seller}</h3>
            <p>
              {brand.parent.company} · {brand.parent.registeredOffice} · Company no. {brand.parent.companyNumber} ·{' '}
              {brand.email}
            </p>
          </section>
        </div>

        <aside className="checkout__summary">
          <dl>
            <div>
              <dt>{c.item}</dt>
              <dd>{money(listing.price)}</dd>
            </div>
            <div>
              <dt>{c.shipping}</dt>
              <dd>{rate ? money(rate.amount) : '—'}</dd>
            </div>
            <div className="checkout__total">
              <dt>{c.total}</dt>
              <dd>{rate ? money(listing.price + rate.amount) : '—'}</dd>
            </div>
          </dl>

          <label className="check checkout__accept">
            <input type="checkbox" checked={accepted} onChange={(e) => setAccepted(e.target.checked)} required />
            <span>
              {c.acceptBefore}
              <a href="/terms" target="_blank" rel="noreferrer">
                {c.acceptTerms}
              </a>
              {c.acceptAnd}
              <a href="/returns" target="_blank" rel="noreferrer">
                {c.acceptReturns}
              </a>
              {c.acceptAfter}
            </span>
          </label>

          <button type="submit" className="btn btn--primary checkout__pay" disabled={!rate || !accepted || state === 'paying'}>
            {state === 'paying' ? c.paying : c.pay} <Icon name="arrow" size={16} />
          </button>
          {state === 'error' && <p className="notice notice--error">{c.error}</p>}
          <p className="checkout__secure">{c.secure}</p>
        </aside>
      </form>
    </div>
  );
}
