import { useState, type FormEvent } from 'react';
import { Link, useSearchParams } from 'react-router';
import { api, type AdminOrder } from '../../api';
import { ConfirmButton } from '../../components/ConfirmButton';
import { Pager } from '../../components/Pager';
import { countryName, formatDate, formatPrice } from '../../format';
import { useI18n } from '../../i18n';
import { useAsync } from '../../useAsync';

const FILTERS = ['paid', 'shipped', 'delivered', 'cancelled', 'refunded', 'pending', 'expired'];

export function AdminOrders() {
  const { t } = useI18n();
  const o = t.admin.orders;
  const [params, setParams] = useSearchParams();
  const filters = { status: params.get('status') ?? undefined, q: params.get('q') ?? undefined, page: params.get('page') ?? undefined };
  const { data, error, loading, setData } = useAsync(() => api.admin.orders(filters), [params.toString()]);
  const [open, setOpen] = useState<number | null>(null);

  const replace = (updated: AdminOrder) =>
    data && setData({ ...data, data: data.data.map((x) => (x.id === updated.id ? updated : x)) });

  const onSearch = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const next = new URLSearchParams();
    new FormData(e.currentTarget).forEach((v, k) => typeof v === 'string' && v && next.set(k, v));
    setParams(next);
  };

  return (
    <>
      <form key={params.toString()} className="atoolbar" onSubmit={onSearch}>
        <input name="q" type="search" placeholder={t.admin.search} defaultValue={filters.q} aria-label={t.admin.search} />
        <select name="status" defaultValue={filters.status ?? ''} aria-label={t.admin.columns.status}>
          <option value="">{o.allStatuses}</option>
          {FILTERS.map((s) => (
            <option key={s} value={s}>
              {o.statuses[s]}
            </option>
          ))}
        </select>
        <button type="submit" className="btn btn--outline">
          {t.browse.apply}
        </button>
      </form>

      {loading && <p className="notice">{t.common.loading}</p>}
      {error != null && <p className="notice notice--error">{t.common.error}</p>}
      {data && data.data.length === 0 && <p className="notice">{t.admin.empty}</p>}

      <div className="aorders">
        {data?.data.map((order) => (
          <OrderCard key={order.id} order={order} open={open === order.id} onToggle={() => setOpen(open === order.id ? null : order.id)} onChange={replace} />
        ))}
      </div>

      {data && (
        <Pager
          page={data.meta.current_page}
          last={data.meta.last_page}
          onPage={(p) => {
            const next = new URLSearchParams(params);
            next.set('page', String(p));
            setParams(next);
          }}
        />
      )}
    </>
  );
}

function OrderCard({ order, open, onToggle, onChange }: { order: AdminOrder; open: boolean; onToggle: () => void; onChange: (o: AdminOrder) => void }) {
  const { lang, t } = useI18n();
  const o = t.admin.orders;
  const [restock, setRestock] = useState(true);
  const [saved, setSaved] = useState(false);
  const [failure, setFailure] = useState<string | null>(null);
  const money = (minor: number) => formatPrice(minor, order.currency, lang);
  const a = order.shipping_address ?? {};

  const run = async (action: () => Promise<AdminOrder>) => {
    setFailure(null);
    setSaved(false);
    try {
      onChange(await action());
      setSaved(true);
    } catch (err) {
      setFailure(err instanceof Error ? err.message : t.common.error);
    }
  };

  const onSave = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    run(() =>
      api.admin.updateOrder(order.id, {
        carrier: String(fd.get('carrier') ?? ''),
        tracking_number: String(fd.get('tracking_number') ?? ''),
        admin_note: String(fd.get('admin_note') ?? ''),
      }),
    );
  };

  const fields = () => {
    const form = document.getElementById(`order-form-${order.id}`) as HTMLFormElement | null;
    const fd = form ? new FormData(form) : null;
    return { carrier: String(fd?.get('carrier') ?? order.carrier ?? ''), tracking_number: String(fd?.get('tracking_number') ?? order.tracking_number ?? '') };
  };

  return (
    <article className={`aorder aorder--${order.status}`}>
      <button type="button" className="aorder__head" onClick={onToggle} aria-expanded={open}>
        <strong>{order.reference}</strong>
        <span className={`badge ${order.status === 'paid' ? 'badge--sold' : ''}`}>{o.statuses[order.status] ?? order.status}</span>
        <span className="aorder__title">{order.item_title}</span>
        <span className="aorder__total">{money(order.total_amount)}</span>
        <span className="aorder__date">{formatDate(order.paid_at ?? order.created_at, lang)}</span>
      </button>

      {open && (
        <div className="aorder__body">
          <div className="aorder__cols">
            <div>
              <h4>{o.customer}</h4>
              <p>
                {order.customer_name}
                <br />
                {order.customer_email && <a href={`mailto:${order.customer_email}`}>{order.customer_email}</a>}
                {order.customer_phone && (
                  <>
                    <br />
                    {order.customer_phone}
                  </>
                )}
              </p>
            </div>
            <div>
              <h4>{o.address}</h4>
              <p className="aorder__address">
                {[a.name, a.line1, a.line2, `${a.postal_code ?? ''} ${a.city ?? ''}`.trim(), a.state, countryName(order.country, lang)].filter(Boolean).join('\n')}
              </p>
            </div>
            <div>
              <h4>{o.items}</h4>
              <p>
                {order.listing_id ? <Link to={`/listings/${order.listing_id}`}>{order.item_title}</Link> : order.item_title}
                <br />
                {money(order.item_amount)} + {t.checkout.shipping.toLowerCase()} {money(order.shipping_amount)} ({t.sizes[order.shipping_size]}, {t.zones[order.shipping_zone] ?? order.shipping_zone})
              </p>
            </div>
          </div>

          <form id={`order-form-${order.id}`} className="aorder__form" onSubmit={onSave}>
            <label className="field">
              <span>{o.carrier}</span>
              <input name="carrier" defaultValue={order.carrier ?? ''} maxLength={80} />
            </label>
            <label className="field">
              <span>{o.tracking}</span>
              <input name="tracking_number" defaultValue={order.tracking_number ?? ''} maxLength={120} />
            </label>
            <label className="field aorder__note">
              <span>{o.note}</span>
              <textarea name="admin_note" rows={2} defaultValue={order.admin_note ?? ''} maxLength={2000} />
            </label>
            <div className="aactions">
              <button type="submit" className="abtn">
                {o.save}
              </button>
              {order.status === 'paid' && (
                <button type="button" className="abtn" onClick={() => run(() => api.admin.updateOrder(order.id, { status: 'shipped', ...fields() }))}>
                  {o.markShipped}
                </button>
              )}
              {order.status === 'shipped' && (
                <button type="button" className="abtn" onClick={() => run(() => api.admin.updateOrder(order.id, { status: 'delivered' }))}>
                  {o.markDelivered}
                </button>
              )}
            </div>
          </form>

          {['paid', 'shipped', 'delivered', 'cancelled'].includes(order.status) && (
            <div className="aactions aorder__danger">
              <label className="check">
                <input type="checkbox" checked={restock} onChange={(e) => setRestock(e.target.checked)} />
                {o.restock}
              </label>
              {order.status === 'paid' && (
                <ConfirmButton onConfirm={() => run(() => api.admin.updateOrder(order.id, { status: 'cancelled', restock }))}>{o.cancel}</ConfirmButton>
              )}
              <ConfirmButton title={o.refundConfirm} onConfirm={() => run(() => api.admin.refundOrder(order.id, restock))}>
                {o.refund}
              </ConfirmButton>
            </div>
          )}

          {saved && <p className="form__status">{o.saved}</p>}
          {failure && <p className="form__status is-error">{failure}</p>}
        </div>
      )}
    </article>
  );
}
