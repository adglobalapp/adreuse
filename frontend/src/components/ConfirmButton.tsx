import { useEffect, useState, type ReactNode } from 'react';
import { useI18n } from '../i18n';

/** Kétlépéses törlés: első kattintásra „Biztos?”, másodikra végrehajt. 3 mp után visszaáll. */
export function ConfirmButton({
  onConfirm,
  disabled,
  title,
  children,
}: {
  onConfirm: () => void;
  disabled?: boolean;
  title?: string;
  children: ReactNode;
}) {
  const { t } = useI18n();
  const [armed, setArmed] = useState(false);

  useEffect(() => {
    if (!armed) return;
    const timer = setTimeout(() => setArmed(false), 3000);
    return () => clearTimeout(timer);
  }, [armed]);

  return (
    <button
      type="button"
      className={`abtn abtn--danger ${armed ? 'is-armed' : ''}`}
      disabled={disabled}
      title={title}
      onClick={() => (armed ? (setArmed(false), onConfirm()) : setArmed(true))}
    >
      {armed ? t.admin.confirm : children}
    </button>
  );
}
