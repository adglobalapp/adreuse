import { Link } from 'react-router';
import { api } from '../api';
import { Icon } from '../components/Icon';
import { ListingGrid } from '../components/ListingCard';
import { PageHead } from '../components/PageHead';
import { useI18n } from '../i18n';
import { useAsync } from '../useAsync';

export function MyListings() {
  const { t } = useI18n();
  const { data, error, loading } = useAsync(() => api.myListings(), []);

  return (
    <div className="container page">
      <PageHead label={t.my.label} title={t.my.title}>
        <Link to="/sell" className="btn btn--primary">
          {t.my.newListing} <Icon name="arrow" size={16} />
        </Link>
      </PageHead>

      {loading && <p className="notice">{t.common.loading}</p>}
      {error != null && <p className="notice notice--error">{t.common.error}</p>}
      {data && (data.data.length === 0 ? <p className="notice">{t.my.empty}</p> : <ListingGrid listings={data.data} />)}
    </div>
  );
}
