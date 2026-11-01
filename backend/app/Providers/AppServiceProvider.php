<?php

namespace App\Providers;

use App\Services\Payments\PaymentGateway;
use App\Services\Payments\StripeGateway;
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
        $this->app->singleton(PaymentGateway::class, fn () => new StripeGateway(
            config('services.stripe.secret'),
            config('services.stripe.webhook_secret'),
        ));
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // Kapcsolati űrlap: 5 üzenet / 10 perc / IP.
        RateLimiter::for('contact', fn (Request $request) => Limit::perMinutes(10, 5)->by(ClientIp::of($request)));

        // Belépés / regisztráció: 10 próbálkozás / perc / IP, és 5 / perc ugyanarra az e-mail címre (jelszópróbálgatás ellen).
        RateLimiter::for('auth', fn (Request $request) => [
            Limit::perMinute(10)->by(ClientIp::of($request)),
            Limit::perMinute(5)->by('email|'.strtolower((string) $request->input('email'))),
        ]);

        // Fizetés indítása: 5 / perc és 15 / óra / IP – így senki nem tudja tömeges „foglalással” elérhetetlenné tenni a termékeket.
        RateLimiter::for('checkout', fn (Request $request) => [
            Limit::perMinute(5)->by(ClientIp::of($request)),
            Limit::perHour(15)->by('hour|'.ClientIp::of($request)),
        ]);
    }
}
