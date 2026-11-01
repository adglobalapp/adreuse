<?php

namespace Tests\Feature;

use App\Models\Listing;
use App\Models\Order;
use App\Models\ShippingRate;
use App\Models\User;
use App\Services\Payments\InvalidWebhook;
use App\Services\Payments\PaymentGateway;
use App\Services\Payments\StripeGateway;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\Fakes\FakePaymentGateway;
use Tests\TestCase;

class ShopTest extends TestCase
{
    use RefreshDatabase;

    private FakePaymentGateway $payments;

    protected function setUp(): void
    {
        parent::setUp();
        $this->payments = new FakePaymentGateway;
        $this->app->instance(PaymentGateway::class, $this->payments);
        config(['shop.frontend_url' => 'https://adreuse.test', 'shop.orders_mail_to' => 'info@adglobalapp.com']);
    }

    private function listing(array $attrs = []): Listing
    {
        return Listing::factory()->create(array_merge(['price' => 2500, 'shipping_size' => 'medium', 'title' => 'Vintage lamp'], $attrs));
    }

    private function checkout(Listing $listing, array $extra = [])
    {
        return $this->postJson('/api/checkout', array_merge([
            'listing_id' => $listing->id, 'country' => 'ES', 'locale' => 'es', 'accept_terms' => true,
        ], $extra));
    }

    private function webhook(string $type, Order $order, array $session = [])
    {
        $payload = json_encode(['type' => $type, 'data' => ['object' => array_merge(['id' => $order->stripe_session_id], $session)]]);

        return $this->call('POST', '/api/stripe/webhook', [], [], [], ['HTTP_STRIPE_SIGNATURE' => 'valid', 'CONTENT_TYPE' => 'application/json'], $payload);
    }

    private function paidSession(): array
    {
        return [
            'payment_status' => 'paid',
            'payment_intent' => 'pi_123',
            'customer_details' => ['name' => 'Ana García', 'email' => 'ana@example.com', 'phone' => '+34600000000'],
            'collected_information' => ['shipping_details' => ['name' => 'Ana García', 'address' => [
                'line1' => 'Calle Mayor 1', 'city' => 'Madrid', 'postal_code' => '28013', 'country' => 'ES',
            ]]],
        ];
    }

    public function test_shipping_endpoint_lists_zones_and_default_rates(): void
    {
        $this->getJson('/api/shipping')
            ->assertOk()
            ->assertJsonPath('data.currency', 'GBP')
            ->assertJsonPath('data.zones.uk', ['GB'])
            ->assertJsonCount(6, 'data.rates');
    }

    public function test_checkout_creates_a_pending_order_with_item_and_shipping_price(): void
    {
        $listing = $this->listing();

        $this->checkout($listing)
            ->assertCreated()
            ->assertJsonPath('data.url', fn ($url) => str_starts_with($url, 'https://checkout.stripe.test/'));

        $order = Order::firstOrFail();
        $this->assertSame('pending', $order->status);
        $this->assertSame('eu', $order->shipping_zone);
        $this->assertSame(2500, $order->item_amount);
        $this->assertSame(ShippingRate::quote('medium', 'eu'), $order->shipping_amount);
        $this->assertSame(2500 + $order->shipping_amount, $order->total_amount);
        $this->assertSame('es', $order->locale);
        $this->assertNotNull($order->terms_accepted_at);
        $this->assertStringStartsWith('https://adreuse.test/order/success?session_id=', $this->payments->checkouts[0]['success']);
        $this->assertSame('cs_test_'.$order->reference, $order->stripe_session_id);
    }

    public function test_item_is_reserved_while_someone_is_paying(): void
    {
        $listing = $this->listing();
        $this->checkout($listing)->assertCreated();

        $this->checkout($listing)->assertUnprocessable();
        $this->getJson("/api/listings/{$listing->id}")->assertJsonPath('data.purchasable', false);
    }

    public function test_checkout_requires_terms_and_a_supported_country(): void
    {
        $listing = $this->listing();

        $this->checkout($listing, ['accept_terms' => false])->assertUnprocessable()->assertJsonValidationErrors('accept_terms');
        $this->checkout($listing, ['country' => 'US'])->assertUnprocessable()->assertJsonValidationErrors('country');
        $this->assertDatabaseCount('orders', 0);
    }

    public function test_custom_size_and_sold_items_cannot_be_bought_online(): void
    {
        $this->checkout($this->listing(['shipping_size' => 'custom']))->assertUnprocessable();
        $this->checkout($this->listing(['status' => 'sold']))->assertUnprocessable();
    }

    public function test_paid_webhook_marks_order_paid_item_sold_and_sends_emails(): void
    {
        $listing = $this->listing();
        $this->checkout($listing);
        $order = Order::firstOrFail();

        $this->webhook('checkout.session.completed', $order, $this->paidSession())->assertOk();

        $order->refresh();
        $this->assertSame('paid', $order->status);
        $this->assertSame('ana@example.com', $order->customer_email);
        $this->assertSame('Madrid', $order->shipping_address['city']);
        $this->assertSame('pi_123', $order->stripe_payment_intent);
        $this->assertSame('sold', $listing->fresh()->status);

        $sent = app('mailer')->getSymfonyTransport()->messages();
        $this->assertCount(2, $sent);
        $customer = $sent->first()->getOriginalMessage();
        $this->assertSame('ana@example.com', $customer->getTo()[0]->getAddress());
        $this->assertStringContainsString('Confirmación del pedido', $customer->getSubject());
        $this->assertStringContainsString('Calle Mayor 1', $customer->getTextBody());
        $this->assertSame('info@adglobalapp.com', $sent->last()->getOriginalMessage()->getTo()[0]->getAddress());

        // A Stripe ismételt küldése nem duplikál
        $this->webhook('checkout.session.completed', $order, $this->paidSession())->assertOk();
        $this->assertCount(2, app('mailer')->getSymfonyTransport()->messages());
    }

    public function test_unpaid_completion_does_not_mark_paid(): void
    {
        $this->checkout($this->listing());
        $order = Order::firstOrFail();

        $this->webhook('checkout.session.completed', $order, ['payment_status' => 'unpaid'])->assertOk();

        $this->assertSame('pending', $order->fresh()->status);
    }

    public function test_invalid_webhook_signature_is_rejected(): void
    {
        $this->call('POST', '/api/stripe/webhook', [], [], [], ['HTTP_STRIPE_SIGNATURE' => 'forged'], '{}')->assertStatus(400);
    }

    public function test_expired_session_releases_the_item(): void
    {
        $listing = $this->listing();
        $this->checkout($listing);
        $order = Order::firstOrFail();

        $this->webhook('checkout.session.expired', $order)->assertOk();

        $this->assertSame('expired', $order->fresh()->status);
        $this->assertTrue($listing->fresh()->isPurchasable());
    }

    public function test_expire_command_releases_stale_reservations(): void
    {
        $listing = $this->listing();
        $this->checkout($listing);
        Order::query()->update(['expires_at' => now()->subMinute()]);

        $this->artisan('app:expire-orders')->assertSuccessful();

        $this->assertSame('expired', Order::first()->status);
        $this->assertTrue($listing->fresh()->isPurchasable());
    }

    public function test_admin_ships_an_order_and_the_customer_gets_tracking(): void
    {
        $this->checkout($this->listing());
        $order = Order::firstOrFail();
        $this->webhook('checkout.session.completed', $order, $this->paidSession());
        $admin = User::factory()->create()->forceFill(['is_admin' => true]);

        $this->actingAs($admin, 'sanctum')
            ->patchJson("/api/admin/orders/{$order->id}", ['status' => 'shipped', 'carrier' => 'Royal Mail', 'tracking_number' => 'RM123GB'])
            ->assertOk()
            ->assertJsonPath('data.status', 'shipped');

        $last = app('mailer')->getSymfonyTransport()->messages()->last()->getOriginalMessage();
        $this->assertStringContainsString('RM123GB', $last->getTextBody());
        $this->assertNotNull($order->fresh()->shipped_at);

        $this->actingAs($admin, 'sanctum')->getJson('/api/admin/orders')->assertJsonPath('data.0.reference', $order->reference);
    }

    public function test_admin_refund_goes_through_the_gateway_and_can_restock(): void
    {
        $listing = $this->listing();
        $this->checkout($listing);
        $order = Order::firstOrFail();
        $this->webhook('checkout.session.completed', $order, $this->paidSession());
        $admin = User::factory()->create()->forceFill(['is_admin' => true]);

        $this->actingAs($admin, 'sanctum')
            ->postJson("/api/admin/orders/{$order->id}/refund", ['restock' => true])
            ->assertOk()
            ->assertJsonPath('data.status', 'refunded');

        $this->assertSame([$order->reference], $this->payments->refunds);
        $this->assertSame('active', $listing->fresh()->status);
    }

    public function test_admin_updates_shipping_rates_and_customers_cannot(): void
    {
        $admin = User::factory()->create()->forceFill(['is_admin' => true]);

        $this->actingAs($admin, 'sanctum')
            ->putJson('/api/admin/shipping-rates', ['rates' => [['size' => 'small', 'zone' => 'uk', 'amount' => 399]]])
            ->assertOk();
        $this->assertSame(399, ShippingRate::quote('small', 'uk'));

        $this->actingAs(User::factory()->create(), 'sanctum')
            ->putJson('/api/admin/shipping-rates', ['rates' => []])
            ->assertForbidden();
    }

    public function test_status_endpoint_shows_no_personal_data(): void
    {
        $this->checkout($this->listing());
        $order = Order::firstOrFail();
        $this->webhook('checkout.session.completed', $order, $this->paidSession());

        $this->getJson("/api/checkout/{$order->stripe_session_id}")
            ->assertOk()
            ->assertJsonPath('data.status', 'paid')
            ->assertJsonMissingPath('data.customer_email');
    }

    public function test_real_stripe_gateway_verifies_webhook_signatures(): void
    {
        $gateway = new StripeGateway('sk_test_x', 'whsec_test');
        $payload = json_encode(['id' => 'evt_1', 'object' => 'event', 'type' => 'checkout.session.expired', 'data' => ['object' => ['id' => 'cs_1']]]);
        $t = time();
        $signature = "t={$t},v1=".hash_hmac('sha256', "{$t}.{$payload}", 'whsec_test');

        $this->assertSame('checkout.session.expired', $gateway->parseWebhook($payload, $signature)['type']);

        $this->expectException(InvalidWebhook::class);
        $gateway->parseWebhook($payload, "t={$t},v1=deadbeef");
    }
}
