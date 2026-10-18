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

## E-mail küldés (Brevo)

A backend a Brevo SMTP relayén küld (kapcsolati értesítések): feladó `noreply@adglobalapp.com`, címzett `CONTACT_MAIL_TO` (`info@adglobalapp.com`), válaszcím a látogató e-mail címe. A teljes éles minta: `backend/.env.production.example`.

```
MAIL_MAILER=smtp
MAIL_HOST=smtp-relay.brevo.com
MAIL_PORT=587
MAIL_USERNAME=<Brevo SMTP login>
MAIL_PASSWORD=<Brevo SMTP kulcs>
MAIL_FROM_ADDRESS=noreply@adglobalapp.com
```

A kulcsot csak a szerveren lévő `.env`-be írd. Kipróbálás: `php artisan app:test-mail sajat@cim.hu`. Másik szolgáltatóra váltáskor elég a `MAIL_*` sorokat átírni.

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

### Backend (Docker)

Minden `backend/` változás után a GitHub Actions (`.github/workflows/docker-backend.yml`) elkészíti a `ghcr.io/adglobalapp/adreuse-backend:latest` image-et (linux/arm64 + amd64). Az image php-fpm + nginx a 80-as porton, titkot nem tartalmaz.

Induláskor (`backend/docker/entrypoint.sh`): létrehozza a `storage/` könyvtárait (kötetként üresen is jöhet), `storage:link`, `migrate --force` (megvárja az adatbázist), `config/route/view:cache`, és háttérben futtatja az ütemezőt (régi kapcsolati üzenetek törlése). **Nem fut** `db:seed` és `key:generate`; `APP_KEY` nélkül a konténer hibaüzenettel leáll.

1. `.env` a szerveren a `backend/.env.production.example` alapján (titkok csak itt).
2. `APP_KEY` egyszeri generálása: `docker run --rm --entrypoint php ghcr.io/adglobalapp/adreuse-backend:latest artisan key:generate --show`
3. Konténer: `env_file: .env`, kötet a `/var/www/html/storage`-ra, a `web` hálózaton. Ellenőrzés: `GET /up` → 200.
4. Alap kategóriák (egyszer, biztonságosan ismételhető): `docker exec <konténer> php artisan db:seed --class=CategorySeeder --force`
5. Első admin (zárt regisztráció mellett): `docker exec -it <konténer> php artisan app:create-admin email@cim --name="Név"` – véletlen ideiglenes jelszót ír ki, csak egyszer.
6. Levélküldés próbája: `docker exec <konténer> php artisan app:test-mail sajat@cim.hu`

A feltöltött képek a `storage/app/public` alatt vannak: ezt a kötetet is menteni kell, nem csak az adatbázist.

**Proxy és IP:** a Laravel minden proxyban megbízik (`trustProxies(at: '*')`), így felismeri a HTTPS-t a Cloudflare → Tunnel → NPM lánc mögött. A korlátozások (kapcsolat: 5 üzenet / 10 perc, belépés: 10 / perc) a `CF-Connecting-IP` fejléc szerinti valódi kliens-IP-re vonatkoznak.

**Spamvédelem:** honeypot mező, korlátozás és Cloudflare Turnstile (`TURNSTILE_SECRET_KEY`; a frontendekben a nyilvános site key build-változó).

**DNS az adglobalapp.com-hoz** (Cloudflare → DNS; a tulajdonos állítja be):

| Rekord | Érték | Megjegyzés |
|---|---|---|
| SPF – `TXT @` | `v=spf1 include:_spf.mx.cloudflare.net include:spf.brevo.com ~all` | Egyetlen SPF rekord lehet: a Cloudflare Email Routing és a Brevo is legyen benne. |
| DKIM + domain-hitelesítés | a Brevo adja | Brevo → Senders, Domains → adglobalapp.com → Authenticate: a megadott DKIM és `brevo-code` rekordokat kell felvenni, amíg mind zöld nem lesz. |
| DMARC – `TXT _dmarc` | `v=DMARC1; p=none; rua=mailto:info@adglobalapp.com` | Először `p=none` (csak jelentés); ha pár hétig minden levél átmegy, szigorítható `p=quarantine`-ra. |


**Frontend (Docker):** minden `main`-re kerülő változás után a GitHub Actions (`.github/workflows/docker.yml`) elkészíti a `ghcr.io/adglobalapp/adreuse-frontend:latest` image-et ARM64-re és amd64-re (nginx, `frontend/nginx.conf`, az SPA-útvonalak az `index.html`-re esnek). Build-beállítások a repó Actions-változóiban (Settings → Secrets and variables → Actions → Variables): `API_URL` (alapból `https://api.adreuse.uk`), `REGISTRATION_ENABLED` (alapból `false`).


- Frontend: `npm run build`, a `dist/` statikusan kiszolgálható (SPA: minden útvonal az `index.html`-re essen). Ha az API másik domainen fut, buildelés előtt állítsd be: `VITE_API_URL=https://api.example.com`.
- Backend: szokásos Laravel deploy (`APP_ENV=production`, `APP_DEBUG=false`, éles adatbázis, `php artisan migrate --force`, `php artisan storage:link`). Külön domain esetén a `CORS_ALLOWED_ORIGINS`-t állítsd a frontendek címére.
