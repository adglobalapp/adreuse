import { NavLink, Outlet } from 'react-router';
import { PageHead } from '../../components/PageHead';
import { useI18n } from '../../i18n';
import './Admin.css';

export function Admin() {
  const { t } = useI18n();
  const tabs = [
    { to: '/admin', label: t.admin.tabs.overview, end: true },
    { to: '/admin/listings', label: t.admin.tabs.listings },
    { to: '/admin/categories', label: t.admin.tabs.categories },
    { to: '/admin/users', label: t.admin.tabs.users },
    { to: '/admin/messages', label: t.admin.tabs.messages },
  ];

  return (
    <div className="container page">
      <PageHead label={t.admin.label} title={t.admin.title} />
      <nav className="atabs" aria-label={t.admin.title}>
        {tabs.map((tab) => (
          <NavLink key={tab.to} to={tab.to} end={tab.end}>
            {tab.label}
          </NavLink>
        ))}
      </nav>
      <Outlet />
    </div>
  );
}
