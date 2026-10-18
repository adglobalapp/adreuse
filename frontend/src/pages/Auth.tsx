import { useState, type FormEvent } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router';
import { ApiError } from '../api';
import { useAuth } from '../auth';
import { Icon } from '../components/Icon';
import { registrationEnabled } from '../features';
import { useI18n } from '../i18n';
import './Auth.css';

export function AuthPage({ mode }: { mode: 'login' | 'register' }) {
  const { t } = useI18n();
  const { user, login, register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string } | null)?.from ?? '/my';
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [failed, setFailed] = useState(false);
  const [busy, setBusy] = useState(false);

  if (user) return <Navigate to={from} replace />;

  const isLogin = mode === 'login';

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>;
    setBusy(true);
    setErrors({});
    setFailed(false);
    try {
      if (isLogin) await login(data.email, data.password);
      else await register({ name: data.name, email: data.email, password: data.password, password_confirmation: data.password_confirmation });
      navigate(from, { replace: true });
    } catch (err) {
      if (err instanceof ApiError && err.status === 422) setErrors(err.errors);
      else setFailed(true);
    } finally {
      setBusy(false);
    }
  };

  const error = (field: string) =>
    errors[field] && <small className="field__error">{errors[field][0]}</small>;

  return (
    <div className="container page auth">
      <div>
        <span className="label label--brand">{isLogin ? t.auth.loginLabel : t.auth.registerLabel}</span>
        <h1 className="contact__title">{isLogin ? t.auth.loginTitle : t.auth.registerTitle}</h1>
        <p className="section__lead">{isLogin ? t.auth.loginLead : t.auth.registerLead}</p>
      </div>

      <form className="form" onSubmit={onSubmit}>
        {!isLogin && (
          <label className="field">
            <span>{t.auth.name}</span>
            <input name="name" required autoComplete="name" />
            {error('name')}
          </label>
        )}
        <label className="field">
          <span>{t.auth.email}</span>
          <input name="email" type="email" required autoComplete="email" />
          {error('email')}
        </label>
        <label className="field">
          <span>{t.auth.password}</span>
          <input
            name="password"
            type="password"
            required
            minLength={isLogin ? undefined : 8}
            autoComplete={isLogin ? 'current-password' : 'new-password'}
          />
          {error('password')}
        </label>
        {!isLogin && (
          <label className="field">
            <span>{t.auth.passwordConfirm}</span>
            <input name="password_confirmation" type="password" required autoComplete="new-password" />
          </label>
        )}

        {failed && <p className="notice notice--error">{t.common.error}</p>}

        <button type="submit" className="btn btn--primary" disabled={busy}>
          {isLogin ? t.auth.login : t.auth.register} <Icon name="arrow" size={16} />
        </button>
        {registrationEnabled && (
          <Link to={isLogin ? '/register' : '/login'} state={location.state} className="auth__switch">
            {isLogin ? t.auth.noAccount : t.auth.hasAccount}
          </Link>
        )}
      </form>
    </div>
  );
}
