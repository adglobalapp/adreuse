<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Services\OrderMailer;
use App\Services\Payments\InvalidWebhook;
use App\Services\Payments\PaymentGateway;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class StripeWebhookController extends Controller
{
    public function __invoke(Request $request, PaymentGateway $payments, OrderMailer $mailer): JsonResponse
    {
        try {
            $event = $payments->parseWebhook($request->getContent(), (string) $request->header('Stripe-Signature'));
        } catch (InvalidWebhook) {
            return response()->json(['message' => 'Invalid signature.'], 400);
        }

        $session = $event['data']['object'] ?? [];
        $order = isset($session['id']) ? Order::where('stripe_session_id', $session['id'])->first() : null;

        if (! $order) {
            // Nem hozzánk tartozó vagy ismeretlen esemény: nyugtázzuk, hogy a Stripe ne küldje újra.
            return response()->json(['received' => true]);
        }

        match ($event['type'] ?? null) {
            'checkout.session.completed', 'checkout.session.async_payment_succeeded' => ($session['payment_status'] ?? null) === 'paid'
                ? $this->markPaid($order, $session, $mailer)
                : null,
            'checkout.session.expired', 'checkout.session.async_payment_failed' => $this->expire($order),
            default => null,
        };

        return response()->json(['received' => true]);
    }

    /**
     * @param  array<string, mixed>  $session
     */
    private function markPaid(Order $order, array $session, OrderMailer $mailer): void
    {
        $paidNow = DB::transaction(function () use ($order, $session) {
            $order->refresh();
            if (! in_array($order->status, ['pending', 'expired'], true)) {
                return false; // már feldolgoztuk (a Stripe többször is küldheti)
            }

            $customer = $session['customer_details'] ?? [];
            $shipping = $session['collected_information']['shipping_details'] ?? $session['shipping_details'] ?? [];
            $address = $shipping['address'] ?? $customer['address'] ?? [];

            $order->update([
                'status' => 'paid',
                'paid_at' => now(),
                'stripe_payment_intent' => is_string($session['payment_intent'] ?? null) ? $session['payment_intent'] : null,
                'customer_name' => $customer['name'] ?? ($shipping['name'] ?? null),
                'customer_email' => $customer['email'] ?? null,
                'customer_phone' => $customer['phone'] ?? null,
                'shipping_address' => array_filter([
                    'name' => $shipping['name'] ?? ($customer['name'] ?? null),
                    'line1' => $address['line1'] ?? null,
                    'line2' => $address['line2'] ?? null,
                    'city' => $address['city'] ?? null,
                    'postal_code' => $address['postal_code'] ?? null,
                    'state' => $address['state'] ?? null,
                    'country' => $address['country'] ?? $order->country,
                ]),
            ]);

            $order->listing?->update(['status' => 'sold']);

            return true;
        });

        if ($paidNow) {
            $mailer->confirmation($order);
            $mailer->notifyAdmin($order);
        }
    }

    private function expire(Order $order): void
    {
        if ($order->status === 'pending') {
            $order->update(['status' => 'expired']);
        }
    }
}
