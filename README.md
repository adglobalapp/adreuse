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

Demó fiókok (a seeder hozza létre):

| Szerep | E-mail | Jelszó |
|---|---|---|
| Admin | `admin@adreuse.test` | `password` |
| Eladó | `demo@adreuse.test` | `password` |

Élesben valódi admint így lehet kinevezni (a felhasználónak előbb regisztrálnia kell):

```bash
php artisan app:make-admin valaki@example.com            # admin jog
php artisan app:make-admin valaki@example.com --revoke   # jog elvétele
```

## Funkciók

- Regisztráció, belépés, kilépés (Sanctum bearer token)
- Hirdetés feladása, szerkesztése, törlése, „elkelt” jelölés – fotóval (JPG/PNG/WEBP, max. 5 MB)
- Böngészés: keresés, kategória, állapot, ársáv, rendezés, lapozás
- „Hirdetéseim” oldal
- Az eladó e-mail címét csak bejelentkezett felhasználók látják
- Három nyelvű felület (EN · ES · HU)
- **Admin felület** (`/admin`, csak adminoknak):
  - Áttekintés: aktív és eladott hirdetések, új hirdetések az elmúlt 7 napban, felhasználók, kategóriák, olvasatlan üzenetek
  - Hirdetések: az összes hirdetés keresése és szűrése; bármelyik szerkesztése, „elkelt” jelölése, törlése
  - Kategóriák: hozzáadás, átnevezés, sorrend; csak üres kategória törölhető
  - Felhasználók: keresés, admin jog adása és elvétele (a sajátját senki nem veheti el)
  - Üzenetek: az összes AdGlobalApp oldal kapcsolati űrlapjáról érkező üzenetek, olvasott/olvasatlan, válasz e-mailben, törlés
- **Kapcsolati API** az összes oldalnak: `POST /api/contact` (mentés, e-mail értesítés, spamcsapda, percenként 5 kérés)

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
| POST | `/api/contact` (`site`, `name`, `email`, `message`) | – |
| GET | `/api/admin/stats` | admin |
| GET | `/api/admin/listings?q=&status=&category=` | admin |
| GET · POST · PATCH · DELETE | `/api/admin/categories[/{id}]` | admin |
| GET · PATCH | `/api/admin/users[/{id}]` (`is_admin`) | admin |
| GET · PATCH · DELETE | `/api/admin/messages[/{id}]` (`read`) | admin |

Hirdetést az admin a fenti `PATCH` / `DELETE /api/listings/{id}` végpontokon szerkeszt és töröl; a jogosultságot a `ListingPolicy` adja.

## E-mail küldés (Cloudflare Email Service)

A backend a Cloudflare Email Service SMTP-jén küld (kapcsolati értesítések, később jelszó-visszaállítás). A teljes éles minta: `backend/.env.production.example`.

1. **Küldés bekapcsolása a domainre:** Cloudflare dashboard → Email Service / Email Sending → az `adglobalapp.com` domain hozzáadása („onboarding”). Mivel a domain a Cloudflare-en van, a szükséges DNS-bejegyzéseket (DKIM, SPF) a Cloudflare maga veszi fel; a meglévő Email Routing (továbbítás) mellette tovább működik. A szolgáltatás bétában van, a menü neve változhat.
2. **API token:** My Profile → API Tokens → Create Token → egyéni token, jogosultság: *Account → Email Sending → Edit*, csak a saját fiókra.
3. **`backend/.env` a szerveren:**
   ```
   MAIL_MAILER=smtp
   MAIL_SCHEME=smtps
   MAIL_HOST=smtp.mx.cloudflare.net
   MAIL_PORT=465
   MAIL_USERNAME=api_token
   MAIL_PASSWORD=<a 2. lépés tokenje>
   MAIL_FROM_ADDRESS=noreply@adglobalapp.com
   MAIL_FROM_NAME="AdGlobalApp"
   CONTACT_MAIL_TO=info@adglobalapp.com
   ```
   A tokent csak a szerveren lévő `.env`-be írd, gitbe és chatbe ne.
4. **Kipróbálás:** `php artisan config:clear && php artisan app:test-mail sajat@cim.hu` – ha a levél megérkezik, kész. Hiba esetén a parancs kiírja az okát.

Ha később másik szolgáltatóra (pl. Brevo) kell váltani, elég a `MAIL_*` sorokat átírni, a kódhoz nem kell nyúlni.

## Beállítások (`backend/.env`)

| Változó | Mire való |
|---|---|
| `CONTACT_MAIL_TO` | Erre a címre megy értesítés minden új kapcsolati üzenetről (üresen hagyva csak mentjük). Javasolt: `info@adglobalapp.com`. A levélküldést lásd fent. |
| `REGISTRATION_ENABLED` | Új fiókok regisztrációja (alapból `false`). A frontendben ugyanígy kell állítani: `VITE_REGISTRATION_ENABLED`. Kikapcsolva csak a meglévő fiókok (adminok) lépnek be, a látogatók a hirdetésnél „Érdeklődöm” űrlapon írhatnak (Admin → Üzenetek). |
| `CONTACT_SITES` | Azok az oldalazonosítók, amelyek üzenetet küldhetnek. |
| `CORS_ALLOWED_ORIGINS` | A többi oldal domainje vesszővel elválasztva (pl. `https://adlingua.org,https://adglobaltransport.com`), ahonnan a böngésző hívhatja az API-t. |

## Tesztek

```bash
cd backend && php artisan test        # API feature tesztek
cd frontend && npm run build          # típusellenőrzés + build
```

## Arculat cseréje

- **Színek, betűk, méretek:** `frontend/src/styles/tokens.css`; betűtípusok: `frontend/index.html`
- **Logó:** a hivatalos AdApp logójel a `frontend/public/logo-mark.png`, a felirat színe és betűtípusa a `--logo-*` / `--font-logo` tokenekből jön; böngészőfül- és telefonikonok: `frontend/public/favicon.ico`, `favicon*.png`, `apple-touch-icon.png`, `icon-*.png`, `site.webmanifest`
- **Név, közösségi linkek:** `frontend/src/brand.ts`
- **Szövegek, kategórianevek:** `frontend/src/content.ts`

## Élesítés

**Frontend (Docker):** minden `main`-re kerülő változás után a GitHub Actions (`.github/workflows/docker.yml`) elkészíti a `ghcr.io/adglobalapp/adreuse-frontend:latest` image-et ARM64-re és amd64-re (nginx, `frontend/nginx.conf`, az SPA-útvonalak az `index.html`-re esnek). Build-beállítások a repó Actions-változóiban (Settings → Secrets and variables → Actions → Variables): `API_URL` (alapból `https://api.adreuse.uk`), `REGISTRATION_ENABLED` (alapból `false`).


- Frontend: `npm run build`, a `dist/` statikusan kiszolgálható (SPA: minden útvonal az `index.html`-re essen). Ha az API másik domainen fut, buildelés előtt állítsd be: `VITE_API_URL=https://api.example.com`.
- Backend: szokásos Laravel deploy (`APP_ENV=production`, `APP_DEBUG=false`, éles adatbázis, `php artisan migrate --force`, `php artisan storage:link`). Külön domain esetén a `CORS_ALLOWED_ORIGINS`-t állítsd a frontendek címére.
