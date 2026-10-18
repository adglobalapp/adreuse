<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

// Régi kapcsolati üzenetek törlése (megőrzési idő: CONTACT_RETENTION_MONTHS).
Schedule::command('model:prune')->daily();
