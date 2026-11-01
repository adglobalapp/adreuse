<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Listing;
use App\Models\Order;
use App\Models\ShippingRate;
use App\Services\Payments\PaymentGateway;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\Rule;
use Throwable;

class CheckoutController extends Controller
{
    /**
     * Szállítási zónák, országok és díjak a fizetés előtti összesítőhöz.
     */
    public function shipping(): JsonResponse
    {
        return response()->json(['data' => [
            'currency' => config('shop.currency'),
            'zones' => config('shop.zones'),
            'rates' => ShippingRate::orderBy('zone')->get(['size', 'zone', 'amount']),
        ]]);
    }

    /**
     * Fizetés indítása: rendelés létrehozása és átirányítás a Stripe fizetőoldalára.
     */
    public function store(Request $request, PaymentGateway $payments): JsonResponse
    {
        $countries = array_merge(...array_values(config('shop.zones')));

        $data = $request->validate([
            'listing_id' => ['required', 'integer', 'exists:listings,id'],
            'country' => ['required', 'string', Rule::in($countries)],
            'locale' => ['nullable', Rule::in(['en', 'hu', 'es'])],
            'accept_terms' => ['accepted'],
        ]);

        $zone = ShippingRate::zoneFor($data['country']);

        $order = DB::transaction(function () use ($data, $zone) {
            $listing = Listing::whereKey($data['listing_id'])->lockForUpdate()->firstOrFail();

            if (! $listing->isPurchasable()) {
                return null;
            }

            $shipping = ShippingRate::quote($listing->shipping_size, $zone);
            if ($shipping === null) {
                return null;
            }

            return Order::create([
                'listing_id' => $listing->id,
                'item_title' => $listing->title,
                'status' => 'pending',
                'currency' => config('shop.currency'),
                'item_amount' => $listing->price,
                'shipping_amount' => $shipping,
                'total_amount' => $listing->price + $shipping,
                'shipping_size' => $listing->shipping_size,
                'shipping_zone' => $zone,
                'country' => strtoupper($data['country']),
                'locale' => $data['locale'] ?? 'en',
                'terms_accepted_at' => now(),
                'expires_at' => now()->addMinutes(max(30, config('shop.reservation_minutes'))),
            ]);
        });

        if (! $order) {
            return response()->json([
                'message' => 'Ez a termék most nem rendelhető online.',
                'errors' => ['listing_id' => ['Ez a termék most nem rendelhető online.']],
            ], 422);
        }

        $front = config('shop.frontend_url');

        try {
            $session = $payments->createCheckout(
                $order,
                "{$front}/order/success?session_id={CHECKOUT_SESSION_ID}",
                "{$front}/listings/{$order->listing_id}?checkout=cancelled",
            );
        } catch (Throwable $e) {
            Log::error('Checkout session failed', ['order' => $order->reference, 'error' => $e->getMessage()]);
            $order->update(['status' => 'expired']);

            return response()->json(['message' => 'A fizetés most nem indítható. Próbáld újra később.'], 503);
        }

        $order->update(['stripe_session_id' => $session->id]);

        return response()->json(['data' => ['url' => $session->url, 'reference' => $order->reference]], 201);
    }

    /**
     * A köszönőoldal ezzel kérdezi le a rendelés állapotát (személyes adat nélkül).
     */
    public function status(string $sessionId): JsonResponse
    {
        $order = Order::where('stripe_session_id', $sessionId)->firstOrFail();

        return response()->json(['data' => [
            'reference' => $order->reference,
            'status' => $order->status,
            'item_title' => $order->item_title,
            'currency' => $order->currency,
            'total_amount' => $order->total_amount,
        ]]);
    }
}
