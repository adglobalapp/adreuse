# adreuse – backend

Laravel 13 API az AdReuse piactérhez. Telepítés, futtatás és az API leírása: [../README.md](../README.md).

Fontosabb fájlok:

```
routes/api.php                         # az összes API útvonal
app/Http/Controllers/Api/              # Auth, Category, Listing, Contact kontrollerek
app/Http/Controllers/Api/Admin/        # admin API: Stats, Listing, Category, User, Message
app/Http/Middleware/EnsureUserIsAdmin.php
app/Console/Commands/MakeAdmin.php     # php artisan app:make-admin {email}
app/Console/Commands/TestMail.php      # php artisan app:test-mail {email} – levélküldés próbája
app/Console/Commands/CreateAdmin.php   # php artisan app:create-admin {email} – első admin zárt regisztrációnál
app/Services/Turnstile.php             # Cloudflare Turnstile ellenőrzés
app/Support/ClientIp.php               # valódi kliens IP (CF-Connecting-IP)
Dockerfile, docker/                    # éles image: php-fpm + nginx, entrypoint
database/seeders/CategorySeeder.php    # élesben is futtatható; DemoSeeder csak fejlesztéshez
.env.production.example                # éles beállítások mintája (Brevo SMTP, MariaDB, CORS)
app/Http/Requests/                     # hirdetés validáció
app/Http/Resources/                    # JSON válaszok formája
app/Policies/ListingPolicy.php         # a tulajdonos vagy admin szerkeszthet/törölhet
database/migrations/, database/seeders/
tests/Feature/                         # API tesztek
```
