# adreuse – backend

Laravel 13 API az AdReuse piactérhez. Telepítés, futtatás és az API leírása: [../README.md](../README.md).

Fontosabb fájlok:

```
routes/api.php                         # az összes API útvonal
app/Http/Controllers/Api/              # Auth, Category, Listing, Contact kontrollerek
app/Http/Controllers/Api/Admin/        # admin API: Stats, Listing, Category, User, Message
app/Http/Middleware/EnsureUserIsAdmin.php
app/Console/Commands/MakeAdmin.php     # php artisan app:make-admin {email}
app/Http/Requests/                     # hirdetés validáció
app/Http/Resources/                    # JSON válaszok formája
app/Policies/ListingPolicy.php         # a tulajdonos vagy admin szerkeszthet/törölhet
database/migrations/, database/seeders/
tests/Feature/                         # API tesztek
```
