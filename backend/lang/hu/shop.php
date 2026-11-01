<?php

return [
    'confirmation_subject' => 'Rendelés visszaigazolása :reference – AdReuse',
    'confirmation_body' => "Kedves :name!\n\nKöszönjük a rendelésedet, a fizetés megérkezett.\n\nRendelésszám: :reference\nTermék: :item\nTermék ára: :item_amount\nSzállítás: :shipping_amount\nFizetett összeg: :total\n\nSzállítási cím:\n:address\n\nAmikor feladtuk a csomagot, újra írunk. Az Egyesült Királyságon kívüli szállításnál a címzett országában import-ÁFA, vám és kezelési díj merülhet fel, ezeket a címzett fizeti.\n\nA rendeléstől a termék átvételétől számított 14 napon belül elállhatsz, részletek: :returns_url\n\nKérdésed van? Válaszolj erre a levélre.\n\n:seller",
    'shipped_subject' => 'Úton van a rendelésed (:reference) – AdReuse',
    'shipped_body' => "Kedves :name!\n\nA(z) :reference számú rendelésedet (:item) feladtuk.\n\nFutárszolgálat: :carrier\nCsomagkövetési szám: :tracking\n\nKöszönjük, hogy nálunk vásároltál.\n\n:seller",
    'not_provided' => 'nincs megadva',
];
