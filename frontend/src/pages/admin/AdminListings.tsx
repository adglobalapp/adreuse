import type { FormEvent } from 'react';
import { Link, useSearchParams } from 'react-router';
import { api, type Listing } from '../../api';
import { ConfirmButton } from '../../components/ConfirmButton';
import { Pager } from '../../components/Pager';
import { formatPrice } from '../../format';
import { useI18n } from '../../i18n';
import { useAsync } from '../../useAsync';

export function AdminListings() {
  const { lang, t } = useI18n();
  const [params, setParams] = useSearchParams();
  const filters = { q: params.get('q') ?? undefined, status: params.get('status') ?? undefined, page: params.get('page') ?? undefined };
  const { data, error, loading, setData } = useAsync(() => api.admin.listings(filters), [params.toString()]);

  const onSearch = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const next = new URLSearchParams();
    new FormData(e.currentTarget).forEach((v, k) => typeof v === 'string' && v && next.set(k, v));
    setParams(next);
  };

  const replace = (updated: Listing) =>
    data && setData({ ...data, data: data.data.map((l) => (l.id === updated.id ? updated : l)) });

  const toggle = async (l: Listing) => replace(await api.setStatus(l.id, l.status === 'sold' ? 'active' : 'sold'));
  const remove = async (l: Listing) => {
    await api.deleteListing(l.id);
    if (data) setData({ ...data, data: data.data.filter((x) => x.id !== l.id) });
  };

  return (
    <>
      <form key={params.toString()} className="atoolbar" onSubmit={onSearch}>
        <input name="q" type="search" placeholder={t.admin.search} defaultValue={filters.q} aria-label={t.admin.search} />
        <select name="status" defaultValue={filters.status ?? ''} aria-label={t.admin.columns.status}>
          <option value="">{t.admin.allStatuses}</option>
          <option value="active">{t.my.active}</option>
          <option value="sold">{t.my.sold}</option>
        </select>
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
                <th>{t.admin.columns.title}</th>
                <th>{t.admin.columns.category}</th>
                <th className="num">{t.admin.columns.price}</th>
                <th>{t.admin.columns.seller}</th>
                <th>{t.admin.columns.status}</th>
                <th>{t.admin.columns.actions}</th>
              </tr>
            </thead>
            <tbody>
              {data.data.map((l) => (
                <tr key={l.id}>
                  <td>
                    <Link to={`/listings/${l.id}`}>{l.title}</Link>
                  </td>
                  <td>{t.categories[l.category.slug] ?? l.category.name}</td>
                  <td className="num">{formatPrice(l.price, l.currency, lang)}</td>
                  <td>
                    {l.seller.name}
                    <small>{l.seller.email}</small>
                  </td>
                  <td>
                    <span className={`badge ${l.status === 'sold' ? 'badge--sold' : 'badge--active'}`}>
                      {l.status === 'sold' ? t.my.sold : t.my.active}
                    </span>
                  </td>
                  <td>
                    <div className="aactions">
                      <Link to={`/listings/${l.id}/edit`} className="abtn">
                        {t.admin.edit}
                      </Link>
                      <button type="button" className="abtn" onClick={() => toggle(l)}>
                        {l.status === 'sold' ? t.listing.markActive : t.listing.markSold}
                      </button>
                      <ConfirmButton onConfirm={() => remove(l)}>{t.admin.delete}</ConfirmButton>
                    </div>
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
