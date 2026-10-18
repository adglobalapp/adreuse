import { useI18n } from '../i18n';

export function Pager({ page, last, onPage }: { page: number; last: number; onPage: (page: number) => void }) {
  const { t } = useI18n();
  if (last <= 1) return null;

  return (
    <nav className="pager" aria-label="Pagination">
      <button type="button" className="btn btn--outline" disabled={page <= 1} onClick={() => onPage(page - 1)}>
        {t.browse.prev}
      </button>
      <span>{t.browse.page(page, last)}</span>
      <button type="button" className="btn btn--outline" disabled={page >= last} onClick={() => onPage(page + 1)}>
        {t.browse.next}
      </button>
    </nav>
  );
}
