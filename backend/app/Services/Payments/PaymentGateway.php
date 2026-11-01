<?php

namespace App\Services\Payments;

use App\Models\Order;

/**
 * A fizetési szolgáltató (Stripe) és az alkalmazás közötti réteg; a tesztekben cserélhető.
 */
interface PaymentGateway
{
    public function createCheckout(Order $order, string $successUrl, string $cancelUrl): CheckoutSession;

    /**
     * Ellenőrzi a webhook aláírását, és visszaadja az eseményt (type + data.object) tömbként.
     *
     * @return array<string, mixed>
     *
     * @throws InvalidWebhook
     */
    public function parseWebhook(string $payload, string $signature): array;

    /**
     * Teljes visszatérítés a fizetésre.
     */
    public function refund(Order $order): void;
}
