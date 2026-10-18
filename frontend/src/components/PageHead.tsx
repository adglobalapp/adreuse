import type { ReactNode } from 'react';

export function PageHead({ label, title, children }: { label: string; title: string; children?: ReactNode }) {
  return (
    <div className="page-head">
      <div>
        <span className="label label--brand">{label}</span>
        <h1 className="page-head__title">{title}</h1>
      </div>
      {children}
    </div>
  );
}
