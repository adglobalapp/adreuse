import { brand } from '../brand';
import { useI18n } from '../i18n';
import { Icon } from './Icon';
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
          <a className="footer__signoff" href={brand.parent.url} target="_blank" rel="noreferrer" aria-label={brand.parent.name}>
            <img src={brand.parent.logoSrc} alt={brand.parent.name} />
          </a>
        </div>

        <p className="footer__copy">
          <span>{brand.parent.company}</span>
          <span>{t.footer.registered}</span>
          <span>
            {t.footer.companyNo} {brand.parent.companyNumber}
          </span>
          <span className="footer__office">
            {t.footer.office}: {brand.parent.registeredOffice}
          </span>
          <span className="footer__office">
            © {year} {t.footer.rights}
          </span>
        </p>
      </div>
    </footer>
  );
}
