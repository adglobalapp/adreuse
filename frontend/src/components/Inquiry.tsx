import { useState, type FormEvent } from 'react';
import { api, type Listing } from '../api';
import { useI18n } from '../i18n';
import { Icon } from './Icon';

type Status = 'idle' | 'sending' | 'sent' | 'error';

/** Érdeklődő űrlap vendégeknek, amíg nincs regisztráció: a kapcsolati API-n át az admin felületre érkezik. */
export function Inquiry({ listing }: { listing: Listing }) {
  const { t } = useI18n();
  const [status, setStatus] = useState<Status>('idle');

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form)) as Record<string, string>;
    setStatus('sending');
    try {
      await api.contact({ name: data.name, email: data.email, message: data.message, website: data.website });
      form.reset();
      setStatus('sent');
    } catch {
      setStatus('error');
    }
  };

  if (status === 'sent') {
    return (
      <p className="form__status" role="status">
        {t.listing.inquirySent}
      </p>
    );
  }

  return (
    <form className="form inquiry" onSubmit={onSubmit}>
      <h2 className="inquiry__title">{t.listing.inquire}</h2>
      <label className="field">
        <span>{t.listing.inquiryName}</span>
        <input name="name" required maxLength={120} autoComplete="name" />
      </label>
      <label className="field">
        <span>{t.listing.inquiryEmail}</span>
        <input name="email" type="email" required autoComplete="email" />
      </label>
      <label className="field">
        <span>{t.listing.inquiryMessage}</span>
        <textarea name="message" rows={4} required maxLength={5000} defaultValue={t.listing.inquiryPrefill(listing.title, listing.id)} />
      </label>
      {/* Csapda mező a spam botoknak: ember nem látja, nem tölti ki. */}
      <input className="form__trap" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" />
      <button type="submit" className="btn btn--primary" disabled={status === 'sending'}>
        {status === 'sending' ? t.listing.inquirySending : t.listing.inquirySend} <Icon name="arrow" size={16} />
      </button>
      {status === 'error' && (
        <p className="form__status is-error" role="status">
          {t.listing.inquiryError}
        </p>
      )}
    </form>
  );
}
