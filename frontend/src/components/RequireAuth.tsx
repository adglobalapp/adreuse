import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router';
import { useAuth } from '../auth';
import { useI18n } from '../i18n';

/** Bejelentkezéshez kötött oldalak: vendéget a belépésre küld, majd vissza. `admin` esetén csak adminnak. */
export function RequireAuth({ children, admin = false }: { children: ReactNode; admin?: boolean }) {
  const { user, loading } = useAuth();
  const { t } = useI18n();
  const location = useLocation();

  if (loading) return <p className="notice">{t.common.loading}</p>;
  if (!user) return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  if (admin && !user.is_admin) return <Navigate to="/" replace />;
  return children;
}
