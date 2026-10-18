import { Link } from 'react-router';
import { api } from '../../api';
import { useI18n } from '../../i18n';
import { useAsync } from '../../useAsync';

export function Overview() {
  const { t } = useI18n();
  const { data, error } = useAsync(() => api.admin.stats(), []);

  if (error) return <p className="notice notice--error">{t.common.error}</p>;
  if (!data) return <p className="notice">{t.common.loading}</p>;

  const tiles = [
    { value: data.listings_active, label: t.admin.stats.active, to: '/admin/listings?status=active' },
    { value: data.listings_sold, label: t.admin.stats.sold, to: '/admin/listings?status=sold' },
    { value: data.listings_last_7_days, label: t.admin.stats.week, to: '/admin/listings' },
    { value: data.users, label: t.admin.stats.users, to: '/admin/users' },
    { value: data.categories, label: t.admin.stats.categories, to: '/admin/categories' },
    { value: data.messages_unread, label: t.admin.stats.unread, to: '/admin/messages?unread=1' },
  ];

  return (
    <div className="astats">
      {tiles.map((tile) => (
        <Link key={tile.label} to={tile.to} className="astat">
          <span className="astat__value">{tile.value}</span>
          <span className="astat__label">{tile.label}</span>
        </Link>
      ))}
    </div>
  );
}
