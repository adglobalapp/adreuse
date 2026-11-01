<?php

namespace App\Services\Payments;

use App\Models\Order;
use RuntimeException;
use Stripe\Exception\SignatureVerificationException;
use Stripe\StripeClient;
use Stripe\Webhook;
use UnexpectedValueException;

class StripeGateway implements PaymentGateway
{
    public function __construct(private ?string $secret, private ?string $webhookSecret) {}

    private function client(): StripeClient
    {
        if (blank($this->secret)) {
            throw new RuntimeException('STRIPE_SECRET_KEY nincs beállítva.');
        }

        return new StripeClient($this->secret);
    }

    public function createCheckout(Order $order, string $successUrl, string $cancelUrl): CheckoutSession
    {
        $currency = strtolower($order->currency);

        $session = $this->client()->checkout->sessions->create([
            'mode' => 'payment',
            'locale' => $order->locale,
            'client_reference_id' => $order->reference,
            'metadata' => ['order_id' => (string) $order->id, 'reference' => $order->reference],
            'payment_intent_data' => ['metadata' => ['order_id' => (string) $order->id, 'reference' => $order->reference]],
            'line_items' => [[
                'quantity' => 1,
                'price_data' => [
                    'currency' => $currency,
                    'unit_amount' => $order->item_amount,
                    'product_data' => ['name' => $order->item_title],
                ],
            ]],
            // A vevő csak a választott országba kérhet szállítást; a díj a méret és a zóna szerint fix.
            'shipping_address_collection' => ['allowed_countries' => [$order->country]],
            'shipping_options' => [[
                'shipping_rate_data' => [
                    'type' => 'fixed_amount',
                    'display_name' => 'Shipping',
                    'fixed_amount' => ['amount' => $order->shipping_amount, 'currency' => $currency],
                ],
            ]],
            'phone_number_collection' => ['enabled' => true],
            'expires_at' => $order->expires_at->getTimestamp(),
            'success_url' => $successUrl,
            'cancel_url' => $cancelUrl,
        ]);

        return new CheckoutSession($session->id, $session->url);
    }

    public function parseWebhook(string $payload, string $signature): array
    {
        if (blank($this->webhookSecret)) {
            throw new InvalidWebhook('STRIPE_WEBHOOK_SECRET nincs beállítva.');
        }

        try {
            $event = Webhook::constructEvent($payload, $signature, $this->webhookSecret);
        } catch (SignatureVerificationException|UnexpectedValueException $e) {
            throw new InvalidWebhook($e->getMessage(), previous: $e);
        }

        return $event->toArray();
    }

    public function refund(Order $order): void
    {
        if (blank($order->stripe_payment_intent)) {
            throw new RuntimeException('A rendeléshez nem tartozik Stripe fizetés.');
        }

        $this->client()->refunds->create(['payment_intent' => $order->stripe_payment_intent]);
    }
}
