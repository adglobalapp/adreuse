# adreuse – backend

Laravel 13 API az AdReuse piactérhez. Telepítés, futtatás és az API leírása: [../README.md](../README.md).

Fontosabb fájlok:

```
routes/api.php                         # az összes API útvonal
app/Http/Controllers/Api/              # Auth, Category, Listing kontrollerek
app/Http/Requests/                     # hirdetés validáció
app/Http/Resources/                    # JSON válaszok formája
app/Policies/ListingPolicy.php         # csak a tulajdonos szerkeszthet/törölhet
database/migrations/, database/seeders/
tests/Feature/                         # API tesztek
```
