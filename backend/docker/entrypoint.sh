#!/bin/sh
# Az AdReuse backend indítása a konténerben.
# NEM fut: db:seed (demó fiókokat hozna létre) és key:generate (az APP_KEY-t env-ből kapjuk).
set -e
cd /var/www/html

if [ -z "$APP_KEY" ]; then
    echo "HIBA: az APP_KEY nincs beállítva. Egyszer generáld le (pl. php artisan key:generate --show)," >&2
    echo "és tedd a szerveren lévő .env-be. Később ne változtasd meg." >&2
    exit 1
fi

# A storage kötetként üresen is érkezhet: a szükséges könyvtárak létrehozása
mkdir -p storage/app/public storage/framework/cache/data storage/framework/sessions \
    storage/framework/views storage/logs bootstrap/cache

php artisan storage:link --force >/dev/null 2>&1 || true

# Az adatbázis indulása eltarthat egy ideig: legfeljebb ~60 mp-ig próbálkozunk
tries=0
until php artisan migrate --force --no-interaction; do
    tries=$((tries + 1))
    if [ "$tries" -ge 30 ]; then
        echo "HIBA: a migráció nem sikerült (elérhető az adatbázis? jók a DB_* beállítások?)" >&2
        exit 1
    fi
    echo "Várakozás az adatbázisra... ($tries)"
    sleep 2
done

php artisan config:cache
php artisan route:cache
php artisan view:cache
chown -R www-data:www-data storage bootstrap/cache

# Ütemezett feladatok (pl. régi kapcsolati üzenetek törlése) a háttérben
su-exec www-data php artisan schedule:work >/dev/null 2>&1 &

php-fpm -D
exec nginx -g 'daemon off;'
