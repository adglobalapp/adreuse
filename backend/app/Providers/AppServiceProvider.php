<?php

namespace App\Providers;

use App\Support\ClientIp;
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // Kapcsolati űrlap: 5 üzenet / 10 perc / IP.
        RateLimiter::for('contact', fn (Request $request) => Limit::perMinutes(10, 5)->by(ClientIp::of($request)));

        // Belépés / regisztráció: 10 próbálkozás / perc / IP.
        RateLimiter::for('auth', fn (Request $request) => Limit::perMinute(10)->by(ClientIp::of($request)));
    }
}
