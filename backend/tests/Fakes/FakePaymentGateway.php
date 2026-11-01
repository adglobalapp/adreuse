<?php

namespace Tests\Fakes;

use App\Models\Order;
use App\Services\Payments\CheckoutSession;
use App\Services\Payments\InvalidWebhook;
use App\Services\Payments\PaymentGateway;

class FakePaymentGateway implements PaymentGateway
{
    /** @var list<array{order: Order, success: string, cancel: string}> */
    public array $checkouts = [];

    /** @var list<string> */
    public array $refunds = [];

    public function createCheckout(Order $order, string $successUrl, string $cancelUrl): CheckoutSession
    {
        $this->checkouts[] = ['order' => $order, 'success' => $successUrl, 'cancel' => $cancelUrl];

        return new CheckoutSession('cs_test_'.$order->reference, 'https://checkout.stripe.test/'.$order->reference);
    }

    public function parseWebhook(string $payload, string $signature): array
    {
        if ($signature !== 'valid') {
            throw new InvalidWebhook('bad signature');
        }

        return json_decode($payload, true);
    }

    public function refund(Order $order): void
    {
        $this->refunds[] = $order->reference;
    }
}
