import { useState, type FormEvent } from 'react';
import { api, ApiError, type Category } from '../../api';
import { ConfirmButton } from '../../components/ConfirmButton';
import { useI18n } from '../../i18n';
import { useAsync } from '../../useAsync';

export function AdminCategories() {
  const { t } = useI18n();
  const { data, error, loading, setData } = useAsync(() => api.admin.categories(), []);
  const [editing, setEditing] = useState<number | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  const fail = (err: unknown) =>
    setFormError(err instanceof ApiError ? Object.values(err.errors)[0]?.[0] ?? err.message : t.common.error);

  const onAdd = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const name = String(new FormData(form).get('name') ?? '').trim();
    if (!name || !data) return;
    setFormError(null);
    try {
      const created = await api.admin.createCategory({ name });
      setData([...data, created]);
      form.reset();
    } catch (err) {
      fail(err);
    }
  };

  const onSave = async (e: FormEvent<HTMLFormElement>, c: Category) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setFormError(null);
    try {
      const updated = await api.admin.updateCategory(c.id, {
        name: String(fd.get('name')).trim(),
        position: Number(fd.get('position')),
      });
      setData((data ?? []).map((x) => (x.id === c.id ? updated : x)).sort((a, b) => (a.position ?? 0) - (b.position ?? 0)));
      setEditing(null);
    } catch (err) {
      fail(err);
    }
  };

  const remove = async (c: Category) => {
    setFormError(null);
    try {
      await api.admin.deleteCategory(c.id);
      setData((data ?? []).filter((x) => x.id !== c.id));
    } catch (err) {
      fail(err);
    }
  };

  return (
    <>
      <form className="atoolbar" onSubmit={onAdd}>
        <input name="name" required maxLength={80} placeholder={t.admin.newCategory} aria-label={t.admin.newCategory} />
        <button type="submit" className="btn btn--primary">
          {t.admin.add}
        </button>
      </form>
      {formError && <p className="notice notice--error">{formError}</p>}

      {loading && <p className="notice">{t.common.loading}</p>}
      {error != null && <p className="notice notice--error">{t.common.error}</p>}
      {data && (
        <div className="atable-wrap">
          <table className="atable">
            <thead>
              <tr>
                <th>{t.admin.columns.name}</th>
                <th>{t.admin.columns.slug}</th>
                <th className="num">{t.admin.columns.position}</th>
                <th className="num">{t.admin.columns.listings}</th>
                <th>{t.admin.columns.actions}</th>
              </tr>
            </thead>
            <tbody>
              {data.map((c) =>
                editing === c.id ? (
                  <tr key={c.id}>
                    <td colSpan={5}>
                      <form className="arow-form" onSubmit={(e) => onSave(e, c)}>
                        <input name="name" required maxLength={80} defaultValue={c.name} aria-label={t.admin.columns.name} />
                        <input name="position" type="number" min={0} defaultValue={c.position ?? 0} aria-label={t.admin.columns.position} />
                        <button type="submit" className="abtn">
                          {t.admin.save}
                        </button>
                        <button type="button" className="abtn" onClick={() => setEditing(null)}>
                          {t.admin.cancel}
                        </button>
                      </form>
                    </td>
                  </tr>
                ) : (
                  <tr key={c.id}>
                    <td>
                      {c.name}
                      {t.categories[c.slug] && t.categories[c.slug] !== c.name && <small>{t.categories[c.slug]}</small>}
                    </td>
                    <td>
                      <code>{c.slug}</code>
                    </td>
                    <td className="num">{c.position ?? 0}</td>
                    <td className="num">{c.listings_count ?? 0}</td>
                    <td>
                      <div className="aactions">
                        <button type="button" className="abtn" onClick={() => setEditing(c.id)}>
                          {t.admin.edit}
                        </button>
                        <ConfirmButton
                          onConfirm={() => remove(c)}
                          disabled={(c.listings_count ?? 0) > 0}
                          title={(c.listings_count ?? 0) > 0 ? t.admin.categoryHasListings : undefined}
                        >
                          {t.admin.delete}
                        </ConfirmButton>
                      </div>
                    </td>
                  </tr>
                ),
              )}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
