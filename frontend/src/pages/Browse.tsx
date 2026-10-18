import type { FormEvent } from 'react';
import { useSearchParams } from 'react-router';
import { api, type ListingFilters } from '../api';
import { ListingGrid } from '../components/ListingCard';
import { PageHead } from '../components/PageHead';
import type { Condition } from '../content';
import { useI18n } from '../i18n';
import { useAsync } from '../useAsync';
import './Browse.css';

const FILTER_KEYS = ['q', 'category', 'condition', 'min_price', 'max_price', 'sort', 'page'] as const;
const CONDITIONS: Condition[] = ['new', 'like_new', 'good', 'fair'];

export function Browse() {
  const { t } = useI18n();
  const [params, setParams] = useSearchParams();
  const filters: ListingFilters = Object.fromEntries(
    FILTER_KEYS.map((k) => [k, params.get(k) ?? undefined]),
  );

  const categories = useAsync(() => api.categories(), []);
  const listings = useAsync(() => api.listings(filters), [params.toString()]);

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const next = new URLSearchParams();
    new FormData(e.currentTarget).forEach((value, key) => {
      if (typeof value === 'string' && value.trim()) next.set(key, value.trim());
    });
    setParams(next);
  };

  const goToPage = (page: number) => {
    const next = new URLSearchParams(params);
    next.set('page', String(page));
    setParams(next);
    window.scrollTo({ top: 0 });
  };

  const meta = listings.data?.meta;

  return (
    <div className="container page">
      <PageHead label={t.browse.label} title={t.browse.title} />

      {/* key: URL-változáskor (pl. kategórialink) a mezők az új értékekkel töltődjenek újra */}
      <form key={params.toString()} className="filters" onSubmit={onSubmit}>
        <label className="field filters__search">
          <span>{t.browse.search}</span>
          <input name="q" type="search" defaultValue={filters.q} placeholder={t.browse.searchPlaceholder} />
        </label>
        <label className="field">
          <span>{t.browse.category}</span>
          <select name="category" defaultValue={filters.category ?? ''}>
            <option value="">{t.browse.allCategories}</option>
            {categories.data?.map((c) => (
              <option key={c.slug} value={c.slug}>
                {t.categories[c.slug] ?? c.name}
              </option>
            ))}
          </select>
        </label>
        <label className="field">
          <span>{t.browse.condition}</span>
          <select name="condition" defaultValue={filters.condition ?? ''}>
            <option value="">{t.browse.anyCondition}</option>
            {CONDITIONS.map((c) => (
              <option key={c} value={c}>
                {t.conditions[c]}
              </option>
            ))}
          </select>
        </label>
        <label className="field">
          <span>{t.browse.minPrice}</span>
          <input name="min_price" type="number" min={0} defaultValue={filters.min_price} />
        </label>
        <label className="field">
          <span>{t.browse.maxPrice}</span>
          <input name="max_price" type="number" min={0} defaultValue={filters.max_price} />
        </label>
        <label className="field">
          <span>{t.browse.sort}</span>
          <select name="sort" defaultValue={filters.sort ?? 'newest'}>
            <option value="newest">{t.browse.sortNewest}</option>
            <option value="price_asc">{t.browse.sortPriceAsc}</option>
            <option value="price_desc">{t.browse.sortPriceDesc}</option>
          </select>
        </label>
        <div className="btn-row filters__actions">
          <button type="submit" className="btn btn--primary">
            {t.browse.apply}
          </button>
          <button type="button" className="btn btn--outline" onClick={() => setParams(new URLSearchParams())}>
            {t.browse.reset}
          </button>
        </div>
      </form>

      {listings.loading && <p className="notice">{t.common.loading}</p>}
      {listings.error != null && <p className="notice notice--error">{t.common.error}</p>}

      {listings.data && meta && (
        <>
          <p className="results">{t.browse.results(meta.total)}</p>
          {listings.data.data.length === 0 ? (
            <p className="notice">{t.browse.empty}</p>
          ) : (
            <ListingGrid listings={listings.data.data} />
          )}

          {meta.last_page > 1 && (
            <nav className="pager" aria-label="Pagination">
              <button
                type="button"
                className="btn btn--outline"
                disabled={meta.current_page <= 1}
                onClick={() => goToPage(meta.current_page - 1)}
              >
                {t.browse.prev}
              </button>
              <span>{t.browse.page(meta.current_page, meta.last_page)}</span>
              <button
                type="button"
                className="btn btn--outline"
                disabled={meta.current_page >= meta.last_page}
                onClick={() => goToPage(meta.current_page + 1)}
              >
                {t.browse.next}
              </button>
            </nav>
          )}
        </>
      )}
    </div>
  );
}
