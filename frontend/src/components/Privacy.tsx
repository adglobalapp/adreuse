import { useEffect } from 'react';
import { useI18n } from '../i18n';
import { privacy } from '../privacy';
import './Privacy.css';

export function Privacy() {
  const { lang } = useI18n();
  const p = privacy[lang];

  useEffect(() => {
    document.title = p.title;
    window.scrollTo({ top: 0 });
  }, [p.title]);

  return (
    <section className="section privacy">
      <div className="container privacy__inner">
        <span className="label label--brand">{p.linkLabel}</span>
        <h1 className="section__title">{p.title}</h1>
        <p className="privacy__updated">{p.updated}</p>
        <p className="privacy__intro">{p.intro}</p>
        {p.sections.map((s) => (
          <div key={s.title} className="privacy__section">
            <h2>{s.title}</h2>
            {s.paragraphs?.map((t) => <p key={t}>{t}</p>)}
            {s.items && (
              <ul>
                {s.items.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
            )}
          </div>
        ))}
        <a className="btn btn--outline privacy__back" href="/">
          {p.back}
        </a>
      </div>
    </section>
  );
}
