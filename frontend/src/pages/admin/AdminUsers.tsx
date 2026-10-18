import type { FormEvent } from 'react';
import { useSearchParams } from 'react-router';
import { api, type AdminUser } from '../../api';
import { useAuth } from '../../auth';
import { Pager } from '../../components/Pager';
import { formatDate } from '../../format';
import { useI18n } from '../../i18n';
import { useAsync } from '../../useAsync';

export function AdminUsers() {
  const { lang, t } = useI18n();
  const { user: me } = useAuth();
  const [params, setParams] = useSearchParams();
  const filters = { q: params.get('q') ?? undefined, page: params.get('page') ?? undefined };
  const { data, error, loading, setData } = useAsync(() => api.admin.users(filters), [params.toString()]);

  const onSearch = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const q = String(new FormData(e.currentTarget).get('q') ?? '').trim();
    setParams(q ? { q } : {});
  };

  const toggle = async (u: AdminUser) => {
    const updated = await api.admin.setAdmin(u.id, !u.is_admin);
    if (data) setData({ ...data, data: data.data.map((x) => (x.id === u.id ? updated : x)) });
  };

  return (
    <>
      <form key={params.toString()} className="atoolbar" onSubmit={onSearch}>
        <input name="q" type="search" placeholder={t.admin.search} defaultValue={filters.q} aria-label={t.admin.search} />
        <button type="submit" className="btn btn--outline">
          {t.browse.apply}
        </button>
      </form>

      {loading && <p className="notice">{t.common.loading}</p>}
      {error != null && <p className="notice notice--error">{t.common.error}</p>}
      {data && data.data.length === 0 && <p className="notice">{t.admin.empty}</p>}
      {data && data.data.length > 0 && (
        <div className="atable-wrap">
          <table className="atable">
            <thead>
              <tr>
                <th>{t.admin.columns.name}</th>
                <th>{t.admin.columns.email}</th>
                <th className="num">{t.admin.columns.listings}</th>
                <th>{t.admin.columns.date}</th>
                <th>{t.admin.columns.role}</th>
                <th>{t.admin.columns.actions}</th>
              </tr>
            </thead>
            <tbody>
              {data.data.map((u) => (
                <tr key={u.id}>
                  <td>
                    {u.name}
                    {u.id === me?.id && <small>({t.admin.you})</small>}
                  </td>
                  <td>{u.email}</td>
                  <td className="num">{u.listings_count}</td>
                  <td>{formatDate(u.created_at, lang)}</td>
                  <td>
                    <span className={`badge ${u.is_admin ? 'badge--sold' : ''}`}>
                      {u.is_admin ? t.admin.adminRole : t.admin.userRole}
                    </span>
                  </td>
                  <td>
                    <button
                      type="button"
                      className="abtn"
                      disabled={u.id === me?.id}
                      onClick={() => toggle(u)}
                    >
                      {u.is_admin ? t.admin.removeAdmin : t.admin.makeAdmin}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {data && (
        <Pager
          page={data.meta.current_page}
          last={data.meta.last_page}
          onPage={(p) => setParams({ ...(filters.q ? { q: filters.q } : {}), page: String(p) })}
        />
      )}
    </>
  );
}
