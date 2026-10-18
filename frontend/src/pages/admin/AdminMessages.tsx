import { useSearchParams } from 'react-router';
import { api, type ContactMessage } from '../../api';
import { ConfirmButton } from '../../components/ConfirmButton';
import { Pager } from '../../components/Pager';
import { formatDate } from '../../format';
import { useI18n } from '../../i18n';
import { useAsync } from '../../useAsync';

const SITES = ['adlingua', 'adtransport', 'admaintenance', 'adreuse', 'adlanding'];

export function AdminMessages() {
  const { lang, t } = useI18n();
  const [params, setParams] = useSearchParams();
  const filters = {
    site: params.get('site') ?? undefined,
    unread: params.get('unread') ?? undefined,
    page: params.get('page') ?? undefined,
  };
  const { data, error, loading, setData } = useAsync(() => api.admin.messages(filters), [params.toString()]);

  const setFilter = (key: string, value: string) => {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value);
    else next.delete(key);
    next.delete('page');
    setParams(next);
  };

  const toggleRead = async (m: ContactMessage) => {
    const updated = await api.admin.setRead(m.id, !m.read);
    if (data) setData({ ...data, data: data.data.map((x) => (x.id === m.id ? updated : x)) });
  };
  const remove = async (m: ContactMessage) => {
    await api.admin.deleteMessage(m.id);
    if (data) setData({ ...data, data: data.data.filter((x) => x.id !== m.id) });
  };

  return (
    <>
      <div className="atoolbar">
        <select value={filters.site ?? ''} onChange={(e) => setFilter('site', e.target.value)} aria-label={t.admin.columns.site}>
          <option value="">{t.admin.allSites}</option>
          {SITES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <label className="check">
          <input type="checkbox" checked={filters.unread === '1'} onChange={(e) => setFilter('unread', e.target.checked ? '1' : '')} />
          {t.admin.onlyUnread}
        </label>
      </div>

      {loading && <p className="notice">{t.common.loading}</p>}
      {error != null && <p className="notice notice--error">{t.common.error}</p>}
      {data && data.data.length === 0 && <p className="notice">{t.admin.empty}</p>}
      <div className="amsgs">
        {data?.data.map((m) => (
          <article key={m.id} className={`amsg ${m.read ? '' : 'is-unread'}`}>
            <header className="amsg__head">
              <span className="badge">{m.site}</span>
              <strong>{m.name}</strong>
              <span className="amsg__email">{m.email}</span>
              <time dateTime={m.created_at}>{formatDate(m.created_at, lang)}</time>
            </header>
            <p className="amsg__body">{m.message}</p>
            <div className="aactions">
              <a className="abtn" href={`mailto:${m.email}`}>
                {t.admin.reply}
              </a>
              <button type="button" className="abtn" onClick={() => toggleRead(m)}>
                {m.read ? t.admin.markUnread : t.admin.markRead}
              </button>
              <ConfirmButton onConfirm={() => remove(m)}>{t.admin.delete}</ConfirmButton>
            </div>
          </article>
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
