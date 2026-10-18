import { Link } from 'react-router';
import type { Listing } from '../api';
import { formatPrice } from '../format';
import { useI18n } from '../i18n';
import { Media } from './Media';
import './ListingCard.css';

export function ListingCard({ listing }: { listing: Listing }) {
  const { lang, t } = useI18n();

  return (
    <article className="lcard">
      <Link to={`/listings/${listing.id}`} className="lcard__link">
        <Media src={listing.image_url ?? undefined} alt={t.listing.imageAlt} ratio="4 / 3" />
        {listing.status === 'sold' && <span className="badge badge--sold lcard__badge">{t.listing.sold}</span>}
        <div className="lcard__body">
          <span className="lcard__meta">
            {t.categories[listing.category.slug] ?? listing.category.name} · {t.conditions[listing.condition]}
          </span>
          <h3 className="lcard__title">{listing.title}</h3>
          <div className="lcard__foot">
            <span className="lcard__price">{formatPrice(listing.price, listing.currency, lang)}</span>
            {listing.location && <span className="lcard__location">{listing.location}</span>}
          </div>
        </div>
      </Link>
    </article>
  );
}

export function ListingGrid({ listings }: { listings: Listing[] }) {
  return (
    <div className="lgrid">
      {listings.map((l) => (
        <ListingCard key={l.id} listing={l} />
      ))}
    </div>
  );
}
