import { brand } from '../brand';
import { useI18n } from '../i18n';
import { Icon } from './Icon';
import { LogoMark } from './Logo';
import './Footer.css';

export function Footer() {
  const { t } = useI18n();
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container footer__inner">
        <ul className="footer__tags">
          {t.footer.tags.map((tag) => (
            <li key={tag}>{tag}</li>
          ))}
        </ul>

        <div className="footer__right">
          <div className="footer__social">
            {brand.social.map((s) => (
              <a key={s.href} href={s.href} target="_blank" rel="noreferrer" aria-label={s.label}>
                <Icon name={s.icon} size={22} />
              </a>
            ))}
          </div>
          <span className="footer__mark">
            <LogoMark size={44} />
          </span>
        </div>

        <p className="footer__copy">
          © {year} {brand.name}. {t.footer.rights}
        </p>
      </div>
    </footer>
  );
}
