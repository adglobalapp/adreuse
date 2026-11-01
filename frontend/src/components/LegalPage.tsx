import { useEffect } from 'react';
import { Link } from 'react-router';
import { api } from '../api';
import { formatPrice } from '../format';
import { useI18n } from '../i18n';
import { legal, type LegalKey } from '../legal';
import { useAsync } from '../useAsync';
import './Privacy.css';

const SIZES = ['small', 'medium', 'large'] as const;

/** ÁSZF, elállás, szállítás – a szállítási oldalon az aktuális díjtáblázattal. */
export function LegalPage({ doc }: { doc: LegalKey }) {
  const { lang, t } = useI18n();
  const d = legal[lang][doc];

  useEffect(() => {
    document.title = d.title;
    window.scrollTo({ top: 0 });
  }, [d.title]);

  return (
    <section className="section privacy">
      <div className="container privacy__inner">
        <span className="label label--brand">{d.label}</span>
        <h1 className="section__title">{d.title}</h1>
        <p className="privacy__updated">{d.updated}</p>
        <p className="privacy__intro">{d.intro}</p>
        {doc === 'delivery' && <RatesTable />}
        {d.sections.map((s) => (
          <div key={s.title} className="privacy__section">
            <h2>{s.title}</h2>
            {s.paragraphs?.map((p) => <p key={p}>{p}</p>)}
            {s.items && (
              <ul>
                {s.items.map((i) => (
                  <li key={i}>{i}</li>
                ))}
              </ul>
            )}
          </div>
        ))}
        <Link className="btn btn--outline privacy__back" to="/listings">
          {d.back}
        </Link>
      </div>
    </section>
  );

  function RatesTable() {
    const { data } = useAsync(() => api.shipping(), []);
    if (!data) return null;
    const zones = Object.keys(data.zones);
    return (
      <div className="privacy__section">
        <div className="atable-wrap">
          <table className="atable">
            <thead>
              <tr>
                <th>{t.form.shippingSize}</th>
                {zones.map((z) => (
                  <th key={z} className="num">
                    {t.zones[z] ?? z}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {SIZES.map((size) => (
                <tr key={size}>
                  <td>{t.sizes[size]}</td>
                  {zones.map((z) => {
                    const r = data.rates.find((x) => x.size === size && x.zone === z);
                    return (
                      <td key={z} className="num">
                        {r ? formatPrice(r.amount, data.currency, lang) : '—'}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}
