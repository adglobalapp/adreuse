import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router';
import { api, ApiError } from '../api';
import { useAuth } from '../auth';
import { Icon } from '../components/Icon';
import { Media } from '../components/Media';
import { formatDate, formatPrice } from '../format';
import { useI18n } from '../i18n';
import { useAsync } from '../useAsync';
import { NotFound } from './NotFound';
import './ListingDetail.css';

export function ListingDetail() {
  const { id = '' } = useParams();
  const { lang, t } = useI18n();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);
  // user.id a függőségben: belépés után újratöltünk, hogy látszódjon az eladó e-mail címe
  const { data: listing, error, loading, setData } = useAsync(() => api.listing(id), [id, user?.id]);

  if (loading) return <p className="container page notice">{t.common.loading}</p>;
  if (error instanceof ApiError && error.status === 404) return <NotFound />;
  if (error || !listing) return <p className="container page notice notice--error">{t.common.error}</p>;

  const toggleSold = async () => {
    setBusy(true);
    try {
      setData(await api.setStatus(listing.id, listing.status === 'sold' ? 'active' : 'sold'));
    } finally {
      setBusy(false);
    }
  };

  const remove = async () => {
    if (!window.confirm(t.listing.confirmDelete)) return;
    setBusy(true);
    try {
      await api.deleteListing(listing.id);
      navigate('/my');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="container page">
      <Link to="/listings" className="back">
        ← {t.listing.back}
      </Link>

      <div className="detail">
        <Media src={listing.image_url ?? undefined} alt={t.listing.imageAlt} ratio="4 / 3" />

        <div className="detail__info">
          <span className="label label--brand">{t.categories[listing.category.slug] ?? listing.category.name}</span>
          <h1 className="detail__title">{listing.title}</h1>
          <p className="detail__price">
            {formatPrice(listing.price, listing.currency, lang)}
            {listing.status === 'sold' && <span className="badge badge--sold">{t.listing.sold}</span>}
          </p>

          <dl className="detail__facts">
            <div>
              <dt>{t.listing.condition}</dt>
              <dd>{t.conditions[listing.condition]}</dd>
            </div>
            {listing.location && (
              <div>
                <dt>{t.listing.location}</dt>
                <dd>{listing.location}</dd>
              </div>
            )}
            <div>
              <dt>{t.listing.posted}</dt>
              <dd>{formatDate(listing.created_at, lang)}</dd>
            </div>
            <div>
              <dt>{t.listing.seller}</dt>
              <dd>{listing.seller.name}</dd>
            </div>
          </dl>

          <p className="detail__desc">{listing.description}</p>

          {listing.is_owner ? (
            <div className="btn-row">
              <Link to={`/listings/${listing.id}/edit`} className="btn btn--primary">
                {t.listing.edit}
              </Link>
              <button type="button" className="btn btn--outline" disabled={busy} onClick={toggleSold}>
                {listing.status === 'sold' ? t.listing.markActive : t.listing.markSold}
              </button>
              <button type="button" className="btn btn--danger" disabled={busy} onClick={remove}>
                {t.listing.delete}
              </button>
            </div>
          ) : listing.seller.email ? (
            <a
              className="btn btn--primary"
              href={`mailto:${listing.seller.email}?subject=${encodeURIComponent(listing.title)}`}
            >
              <Icon name="mail" size={16} /> {t.listing.contactSeller}
            </a>
          ) : (
            <Link to="/login" state={{ from: `/listings/${listing.id}` }} className="btn btn--outline">
              {t.listing.loginToContact}
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
