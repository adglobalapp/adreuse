# adreuse

Használt tárgyak piactere: bárki regisztrálhat, hirdetést adhat fel fotóval, a többiek böngészhetnek, kereshetnek és szűrhetnek. Az [adlanding](https://github.com/adglobalapp/adlanding) letisztult fekete–piros arculatára épül.

| Mappa | Stack |
|---|---|
| `backend/` | Laravel 13 · PHP 8.3 · Sanctum (token auth) · SQLite (fejlesztéshez; MySQL/PostgreSQL-re átállítható) |
| `frontend/` | React 19 · TypeScript · React Router · CSS tokenek · Vite |

## Futtatás fejlesztéskor

Két terminálban:

```bash
# 1) backend – http://localhost:8000
cd backend
composer install
cp .env.example .env && php artisan key:generate
touch database/database.sqlite
php artisan migrate --seed     # kategóriák + demó hirdetések
php artisan storage:link       # feltöltött képek kiszolgálása
php artisan serve
```

```bash
# 2) frontend – http://localhost:5173
cd frontend
npm install
npm run dev
```

A Vite dev szerver az `/api` és `/storage` kéréseket továbbítja a backendnek, így nincs szükség CORS-beállításra.

Demó fiók: `demo@adreuse.test` / `password`

## Funkciók

- Regisztráció, belépés, kilépés (Sanctum bearer token)
- Hirdetés feladása, szerkesztése, törlése, „elkelt” jelölés – fotóval (JPG/PNG/WEBP, max. 5 MB)
- Böngészés: keresés, kategória, állapot, ársáv, rendezés, lapozás
- „Hirdetéseim” oldal
- Az eladó e-mail címét csak bejelentkezett felhasználók látják
- Három nyelvű felület (EN · ES · HU)

## API

| Metódus | Útvonal | Auth |
|---|---|---|
| POST | `/api/register`, `/api/login` | – |
| POST | `/api/logout` · GET `/api/me` | ✓ |
| GET | `/api/categories` | – |
| GET | `/api/listings?q=&category=&condition=&min_price=&max_price=&sort=&page=` | – |
| GET | `/api/listings/{id}` | – |
| POST | `/api/listings` (multipart) | ✓ |
| PATCH | `/api/listings/{id}` (multipart esetén POST + `_method=PATCH`) | ✓ tulajdonos |
| DELETE | `/api/listings/{id}` | ✓ tulajdonos |
| GET | `/api/my/listings` | ✓ |

## Tesztek

```bash
cd backend && php artisan test        # API feature tesztek
cd frontend && npm run build          # típusellenőrzés + build
```

## Arculat cseréje

- **Színek, betűk, méretek:** `frontend/src/styles/tokens.css`; betűtípusok: `frontend/index.html`
- **Logó:** a hivatalos AdApp logójel a `frontend/public/logo-mark.png`, a felirat színe és betűtípusa a `--logo-*` / `--font-logo` tokenekből jön; favicon: `frontend/public/favicon.png`
- **Név, közösségi linkek:** `frontend/src/brand.ts`
- **Szövegek, kategórianevek:** `frontend/src/content.ts`

## Élesítés

- Frontend: `npm run build`, a `dist/` statikusan kiszolgálható (SPA: minden útvonal az `index.html`-re essen). Ha az API másik domainen fut, buildelés előtt állítsd be: `VITE_API_URL=https://api.example.com`.
- Backend: szokásos Laravel deploy (`APP_ENV=production`, `APP_DEBUG=false`, éles adatbázis, `php artisan migrate --force`, `php artisan storage:link`). Külön domain esetén a CORS engedélyezett originjeit érdemes a frontend címére szűkíteni (`php artisan config:publish cors`).
