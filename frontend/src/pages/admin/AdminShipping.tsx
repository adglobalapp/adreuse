import { useState, type FormEvent } from 'react';
import { api, type ShippingRate } from '../../api';
import { toMinor } from '../../format';
import { useI18n } from '../../i18n';
import { useAsync } from '../../useAsync';

const SIZES: ShippingRate['size'][] = ['small', 'medium', 'large'];
const ZONES = ['uk', 'eu'];

export function AdminShipping() {
  const { t } = useI18n();
  const s = t.admin.shippingRates;
  const { data, error, loading, setData } = useAsync(() => api.admin.shippingRates(), []);
  const [status, setStatus] = useState<'idle' | 'saved' | 'error'>('idle');

  const amount = (size: string, zone: string) => data?.rates.find((r) => r.size === size && r.zone === zone)?.amount;

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const rates: ShippingRate[] = [];
    for (const size of SIZES) {
      for (const zone of ZONES) {
        const minor = toMinor(String(fd.get(`${size}-${zone}`) ?? ''));
        if (minor === null) return setStatus('error');
        rates.push({ size, zone, amount: minor });
      }
    }
    try {
      setData(await api.admin.saveShippingRates(rates));
      setStatus('saved');
    } catch {
      setStatus('error');
    }
  };

  if (loading) return <p className="notice">{t.common.loading}</p>;
  if (error || !data) return <p className="notice notice--error">{t.common.error}</p>;

  return (
    <form onSubmit={onSubmit} className="ashipping">
      <h2 className="ashipping__title">{s.title}</h2>
      <p className="ashipping__lead">{s.lead}</p>
      <div className="atable-wrap">
        <table className="atable">
          <thead>
            <tr>
              <th>{s.size}</th>
              {ZONES.map((z) => (
                <th key={z} className="num">
                  {t.zones[z]} (£)
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {SIZES.map((size) => (
              <tr key={size}>
                <td>{t.sizes[size]}</td>
                {ZONES.map((zone) => (
                  <td key={zone} className="num">
                    <input
                      className="ashipping__input"
                      name={`${size}-${zone}`}
                      type="number"
                      min={0}
                      step={0.01}
                      inputMode="decimal"
                      required
                      defaultValue={((amount(size, zone) ?? 0) / 100).toFixed(2)}
                      aria-label={`${t.sizes[size]} – ${t.zones[zone]}`}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="btn-row ashipping__actions">
        <button type="submit" className="btn btn--primary">
          {s.save}
        </button>
      </div>
      {status === 'saved' && <p className="form__status">{s.saved}</p>}
      {status === 'error' && <p className="form__status is-error">{t.common.error}</p>}
    </form>
  );
}
