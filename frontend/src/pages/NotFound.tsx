import { Link } from 'react-router';
import { useI18n } from '../i18n';

export function NotFound() {
  const { t } = useI18n();

  return (
    <div className="container page">
      <span className="label label--brand">404</span>
      <h1 className="page-head__title">{t.common.notFoundTitle}</h1>
      <p className="section__lead">{t.common.notFoundText}</p>
      <div className="btn-row" style={{ marginTop: 'var(--space-6)' }}>
        <Link to="/" className="btn btn--primary">
          {t.common.home}
        </Link>
      </div>
    </div>
  );
}
