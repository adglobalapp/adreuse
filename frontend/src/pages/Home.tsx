import { Link } from 'react-router';
import { api } from '../api';
import { Icon } from '../components/Icon';
import { ListingGrid } from '../components/ListingCard';
import { useI18n } from '../i18n';
import { useAsync } from '../useAsync';
import '../components/Hero.css';
import './Home.css';

export function Home() {
  const { t } = useI18n();
  const [first, middle, last] = t.home.lines;
  const categories = useAsync(() => api.categories(), []);
  const latest = useAsync(() => api.listings({ per_page: '8' }), []);

  return (
    <>
      <section className="hero">
        <div className="container">
          <span className="label label--brand">{t.home.eyebrow}</span>
          <h1 className="hero__title">
            <span>{first}</span>
            <span className="accent">{middle}</span>
            <span>{last}</span>
          </h1>
          <blockquote className="hero__quote">{t.home.quote}</blockquote>
          <div className="hero__ctas">
            <Link to="/sell" className="btn btn--primary">
              {t.home.primaryCta} <Icon name="arrow" size={16} />
            </Link>
            <Link to="/listings" className="btn btn--outline">
              {t.home.secondaryCta}
            </Link>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section__head">
            <span className="label label--brand">{t.home.categoriesLabel}</span>
            <h2 className="section__title">{t.home.categoriesTitle}</h2>
          </div>
          {categories.error ? (
            <p className="notice notice--error">{t.common.error}</p>
          ) : (
            <div className="cats">
              {categories.data?.map((c, i) => (
                <Link key={c.slug} to={`/listings?category=${c.slug}`} className="cat">
                  <span className="cat__index">{String(i + 1).padStart(2, '0')}</span>
                  <span className="cat__name">{t.categories[c.slug] ?? c.name}</span>
                  <span className="cat__count">{c.listings_count ?? 0}</span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="page-head">
            <div>
              <span className="label label--brand">{t.home.latestLabel}</span>
              <h2 className="section__title">{t.home.latestTitle}</h2>
            </div>
            <Link to="/listings" className="btn btn--outline">
              {t.home.viewAll} <Icon name="arrow" size={16} />
            </Link>
          </div>
          {latest.loading && <p className="notice">{t.common.loading}</p>}
          {latest.error != null && <p className="notice notice--error">{t.common.error}</p>}
          {latest.data && <ListingGrid listings={latest.data.data} />}
        </div>
      </section>

      <section className="section">
        <div className="container sell-cta">
          <div>
            <h2 className="section__title">{t.home.sellTitle}</h2>
            <p className="section__lead">{t.home.sellText}</p>
          </div>
          <Link to="/sell" className="btn btn--primary">
            {t.home.sellCta} <Icon name="arrow" size={16} />
          </Link>
        </div>
      </section>
    </>
  );
}
