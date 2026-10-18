import { useState, type FormEvent } from 'react';
import { Link, useNavigate, useParams } from 'react-router';
import { api, ApiError, type Listing } from '../api';
import { Icon } from '../components/Icon';
import { PageHead } from '../components/PageHead';
import type { Condition } from '../content';
import { useI18n } from '../i18n';
import { useAsync } from '../useAsync';
import { NotFound } from './NotFound';

const CONDITIONS: Condition[] = ['new', 'like_new', 'good', 'fair'];

/** Új hirdetés (/sell) és szerkesztés (/listings/:id/edit) közös űrlapja. */
export function ListingForm() {
  const { id } = useParams();
  const { t } = useI18n();
  const existing = useAsync(() => (id ? api.listing(id) : Promise.resolve(null)), [id]);

  if (existing.loading) return <p className="container page notice">{t.common.loading}</p>;
  if (id && (!existing.data || !existing.data.is_owner)) return <NotFound />;

  return <ListingFormInner listing={existing.data} />;
}

function ListingFormInner({ listing }: { listing: Listing | null }) {
  const { t } = useI18n();
  const navigate = useNavigate();
  const categories = useAsync(() => api.categories(), []);
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [failed, setFailed] = useState(false);
  const [saving, setSaving] = useState(false);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const image = form.get('image');
    if (image instanceof File && image.size === 0) form.delete('image');

    setSaving(true);
    setErrors({});
    setFailed(false);
    try {
      const saved = listing ? await api.updateListing(listing.id, form) : await api.createListing(form);
      navigate(`/listings/${saved.id}`);
    } catch (err) {
      if (err instanceof ApiError && err.status === 422) setErrors(err.errors);
      else setFailed(true);
    } finally {
      setSaving(false);
    }
  };

  const error = (field: string) =>
    errors[field] && <small className="field__error">{errors[field][0]}</small>;

  return (
    <div className="container page">
      <PageHead label={t.form.newLabel} title={listing ? t.form.editTitle : t.form.newTitle} />

      <form className="form form--narrow" onSubmit={onSubmit}>
        <label className="field">
          <span>{t.form.title}</span>
          <input name="title" required minLength={3} maxLength={120} defaultValue={listing?.title} />
          {error('title')}
        </label>

        <div className="form__row">
          <label className="field">
            <span>{t.form.category}</span>
            <select name="category_id" required defaultValue={listing?.category.id ?? ''}>
              <option value="" disabled>
                {t.form.choose}
              </option>
              {categories.data?.map((c) => (
                <option key={c.id} value={c.id}>
                  {t.categories[c.slug] ?? c.name}
                </option>
              ))}
            </select>
            {error('category_id')}
          </label>
          <label className="field">
            <span>{t.form.condition}</span>
            <select name="condition" required defaultValue={listing?.condition ?? ''}>
              <option value="" disabled>
                {t.form.choose}
              </option>
              {CONDITIONS.map((c) => (
                <option key={c} value={c}>
                  {t.conditions[c]}
                </option>
              ))}
            </select>
            {error('condition')}
          </label>
        </div>

        <div className="form__row">
          <label className="field">
            <span>{t.form.price}</span>
            <input name="price" type="number" required min={0} step={1} defaultValue={listing?.price} />
            {error('price')}
          </label>
          <label className="field">
            <span>{t.form.location}</span>
            <input name="location" maxLength={120} defaultValue={listing?.location ?? ''} />
            {error('location')}
          </label>
        </div>

        <label className="field">
          <span>{t.form.description}</span>
          <textarea name="description" rows={6} required maxLength={5000} defaultValue={listing?.description} />
          {error('description')}
        </label>

        <label className="field">
          <span>{t.form.image}</span>
          <input name="image" type="file" accept="image/jpeg,image/png,image/webp" />
          <small className="field__hint">{t.form.imageHint}</small>
          {error('image')}
        </label>

        {listing?.image_url && (
          <label className="check">
            <input type="checkbox" name="remove_image" value="1" />
            {t.form.removeImage}
          </label>
        )}

        {failed && <p className="notice notice--error">{t.common.error}</p>}

        <div className="btn-row">
          <button type="submit" className="btn btn--primary" disabled={saving}>
            {saving ? t.form.saving : listing ? t.form.save : t.form.create} <Icon name="arrow" size={16} />
          </button>
          <Link to={listing ? `/listings/${listing.id}` : '/my'} className="btn btn--outline">
            {t.form.cancel}
          </Link>
        </div>
      </form>
    </div>
  );
}
