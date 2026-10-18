import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router';
import { useAuth } from '../auth';
import { languages } from '../content';
import { registrationEnabled } from '../features';
import { useI18n } from '../i18n';
import { Icon } from './Icon';
import { Logo } from './Logo';
import './Header.css';

export function Header() {
  const { lang, setLang, t } = useI18n();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  const onLogout = async () => {
    close();
    await logout();
    navigate('/');
  };

  return (
    <header className="header">
      <div className="container header__inner">
        <Logo />

        <div className="header__right">
          <div className="lang" role="group" aria-label="Language">
            {languages.map((l) => (
              <button
                key={l}
                type="button"
                className={l === lang ? 'is-active' : ''}
                aria-pressed={l === lang}
                onClick={() => setLang(l)}
              >
                {l.toUpperCase()}
              </button>
            ))}
          </div>

          <nav className={`header__nav ${open ? 'is-open' : ''}`} aria-label="Main">
            <NavLink to="/listings" onClick={close}>
              {t.nav.browse}
            </NavLink>
            {(user || registrationEnabled) && (
              <NavLink to="/sell" onClick={close}>
                {t.nav.sell}
              </NavLink>
            )}
            {user ? (
              <>
                <NavLink to="/my" onClick={close}>
                  {t.nav.my}
                </NavLink>
                {user.is_admin && (
                  <NavLink to="/admin" onClick={close}>
                    {t.nav.admin}
                  </NavLink>
                )}
                <button type="button" className="header__link" onClick={onLogout}>
                  {t.nav.logout}
                </button>
              </>
            ) : (
              <NavLink to="/login" onClick={close}>
                {t.nav.login}
              </NavLink>
            )}
          </nav>

          <button
            type="button"
            className="header__toggle"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-label="Menu"
          >
            <Icon name={open ? 'close' : 'menu'} size={24} />
          </button>
        </div>
      </div>
    </header>
  );
}
