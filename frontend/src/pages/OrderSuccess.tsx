import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router';
import { api } from '../api';
import { PageHead } from '../components/PageHead';
import { formatPrice } from '../format';
import { useI18n } from '../i18n';

type Status = Awaited<ReturnType<typeof api.checkoutStatus>>;

/**
 * Visszatérés a Stripe-ról. A fizetés visszaigazolása webhookon jön, ami pár másodpercet késhet,
 * ezért rövid ideig újra lekérdezzük az állapotot.
 */
export function OrderSuccess() {
  const { lang, t } = useI18n();
  const [params] = useSearchParams();
  const sessionId = params.get('session_id') ?? '';
  const [order, setOrder] = useState<Status | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    let tries = 0;
    const load = async () => {
      try {
        const res = await api.checkoutStatus(sessionId);
        if (cancelled) return;
        setOrder(res);
        if (res.status === 'pending' && ++tries < 10) setTimeout(load, 2000);
      } catch {
        if (!cancelled) setFailed(true);
      }
    };
    if (sessionId) load();
    else setFailed(true);
    return () => {
      cancelled = true;
    };
  }, [sessionId]);

  const paid = order && ['paid', 'shipped', 'delivered'].includes(order.status);

  return (
    <div className="container page">
      <PageHead label={t.order.label} title={paid ? t.order.paidTitle : t.order.processing} />
      {failed && <p className="notice notice--error">{t.order.notFound}</p>}
      {order && (
        <div className="order-done">
          <p className="section__lead">{paid ? t.order.paidText(order.reference) : t.order.pendingText}</p>
          <p className="order-done__item">
            {order.item_title} · {t.order.total}: {formatPrice(order.total_amount, order.currency, lang)}
          </p>
        </div>
      )}
      <Link to="/listings" className="btn btn--outline order-done__back">
        {t.order.continue}
      </Link>
    </div>
  );
}
