# syntax=docker/dockerfile:1
# AdReuse backend (Laravel) – php-fpm + nginx egy image-ben, a 80-as porton.
# Titkot (APP_KEY, DB jelszó, SMTP token, Turnstile secret) az image nem tartalmaz: futáskor env-ből jön.

# 1) PHP függőségek (dev csomagok nélkül)
FROM composer:2 AS vendor
WORKDIR /app
COPY composer.json composer.lock ./
RUN composer install --no-dev --no-interaction --no-scripts --no-autoloader --prefer-dist --ignore-platform-reqs
COPY . .
RUN composer dump-autoload --no-dev --optimize --no-scripts

# 2) Futtatókörnyezet
FROM php:8.3-fpm-alpine

# PHP-kiterjesztések a hivatalos image saját eszközével (mbstring alapból benne van)
RUN apk add --no-cache nginx su-exec icu-libs libzip libpng libjpeg-turbo libwebp freetype \
    && apk add --no-cache --virtual .build-deps $PHPIZE_DEPS icu-dev libzip-dev libpng-dev \
        libjpeg-turbo-dev libwebp-dev freetype-dev \
    && docker-php-ext-configure gd --with-jpeg --with-webp --with-freetype \
    && docker-php-ext-install -j"$(nproc)" pdo_mysql intl zip bcmath opcache gd \
    && apk del .build-deps \
    && ln -sf /dev/stdout /var/log/nginx/access.log \
    && ln -sf /dev/stderr /var/log/nginx/error.log

COPY docker/php.ini "$PHP_INI_DIR/conf.d/zz-app.ini"
COPY docker/nginx.conf /etc/nginx/http.d/default.conf
COPY --chmod=0755 docker/entrypoint.sh /usr/local/bin/entrypoint

WORKDIR /var/www/html
COPY --from=vendor /app /var/www/html
RUN rm -f .env \
    && php artisan package:discover --ansi \
    && chown -R www-data:www-data storage bootstrap/cache

EXPOSE 80
HEALTHCHECK --interval=30s --timeout=5s --start-period=60s CMD wget -qO- http://127.0.0.1/up >/dev/null || exit 1
ENTRYPOINT ["entrypoint"]
