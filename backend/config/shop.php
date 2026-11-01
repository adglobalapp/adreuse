<?php

return [

    // Az AdReuse webshop beállításai. Az árak mindenhol pennyben (minor unit) vannak.

    'currency' => env('SHOP_CURRENCY', 'GBP'),

    // A frontend címe: ide tér vissza a vevő a Stripe fizetőoldaláról.
    'frontend_url' => rtrim(env('SHOP_FRONTEND_URL', 'https://adreuse.uk'), '/'),

    // Ide megy értesítés minden új rendelésről (alapból ugyanoda, mint a kapcsolati üzenetek).
    'orders_mail_to' => env('SHOP_ORDERS_MAIL_TO', env('CONTACT_MAIL_TO')),

    // Ennyi percig foglalt a termék, amíg a vevő a Stripe fizetőoldalán van (a Stripe minimuma 30 perc).
    'reservation_minutes' => (int) env('SHOP_RESERVATION_MINUTES', 30),

    // Csomagméretek. A "custom" (egyedi) méretű termék nem rendelhető online: árajánlatot kell kérni.
    'sizes' => ['small', 'medium', 'large', 'custom'],

    // Szállítási zónák és országaik (ISO 3166-1 alpha-2).
    'zones' => [
        'uk' => ['GB'],
        'eu' => [
            'AT', 'BE', 'BG', 'HR', 'CY', 'CZ', 'DK', 'EE', 'FI', 'FR', 'DE', 'GR', 'HU', 'IE',
            'IT', 'LV', 'LT', 'LU', 'MT', 'NL', 'PL', 'PT', 'RO', 'SK', 'SI', 'ES', 'SE',
        ],
    ],

    // Eladó adatai a vevőknek küldött levelekben (kötelező tájékoztatás).
    'seller' => [
        'name' => env('SHOP_SELLER_NAME', 'ADGLOBALAPP LTD'),
        'company_number' => env('SHOP_SELLER_COMPANY_NUMBER', '15251437'),
        'address' => env('SHOP_SELLER_ADDRESS', '38 Abbott Court, Buckshaw Village, Chorley, England, PR7 7ET'),
        'email' => env('SHOP_SELLER_EMAIL', 'info@adglobalapp.com'),
    ],

];
