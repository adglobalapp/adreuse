<?php

use App\Models\Order;
use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

// Régi kapcsolati üzenetek törlése (megőrzési idő: CONTACT_RETENTION_MONTHS).
Schedule::command('model:prune')->daily();

// A lejárt, ki nem fizetett rendelések felszabadítják a terméket (ha a Stripe expired webhookja nem érkezne meg).
Artisan::command('app:expire-orders', function () {
    $count = Order::where('status', 'pending')->where('expires_at', '<', now())->update(['status' => 'expired']);
    $this->info("Lejárt rendelések: {$count}");
})->purpose('Lejárt, ki nem fizetett rendelések lezárása');

Schedule::command('app:expire-orders')->everyFiveMinutes();
