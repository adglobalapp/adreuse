<?php

namespace Tests\Feature;

use App\Models\ContactMessage;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\Client\Request as HttpRequest;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

class ContactProtectionTest extends TestCase
{
    use RefreshDatabase;

    private array $payload = [
        'site' => 'adlingua',
        'name' => 'Teszt Elek',
        'email' => 'elek@example.com',
        'message' => 'Ajánlatot kérnék.',
    ];

    public function test_turnstile_token_is_required_when_secret_is_set(): void
    {
        config(['services.turnstile.secret_key' => 'secret']);
        Http::fake();

        $this->postJson('/api/contact', $this->payload)
            ->assertUnprocessable()
            ->assertJsonValidationErrors('turnstile');

        $this->assertDatabaseCount('contact_messages', 0);
        Http::assertNothingSent();
    }

    public function test_valid_turnstile_token_is_verified_with_client_ip(): void
    {
        config(['services.turnstile.secret_key' => 'secret']);
        Http::fake(['challenges.cloudflare.com/*' => Http::response(['success' => true])]);

        $this->postJson('/api/contact', $this->payload + ['cf-turnstile-response' => 'tok'], ['CF-Connecting-IP' => '203.0.113.7'])
            ->assertAccepted();

        Http::assertSent(fn (HttpRequest $r) => $r['secret'] === 'secret'
            && $r['response'] === 'tok'
            && $r['remoteip'] === '203.0.113.7');
        $this->assertDatabaseCount('contact_messages', 1);
    }

    public function test_rejected_turnstile_token_blocks_the_message(): void
    {
        config(['services.turnstile.secret_key' => 'secret']);
        Http::fake(['challenges.cloudflare.com/*' => Http::response(['success' => false])]);

        $this->postJson('/api/contact', $this->payload + ['cf-turnstile-response' => 'bad'])
            ->assertUnprocessable();

        $this->assertDatabaseCount('contact_messages', 0);
    }

    public function test_rate_limit_is_five_per_ten_minutes_per_cloudflare_ip(): void
    {
        foreach (range(1, 5) as $i) {
            $this->postJson('/api/contact', $this->payload, ['CF-Connecting-IP' => '198.51.100.1'])->assertAccepted();
        }

        $this->postJson('/api/contact', $this->payload, ['CF-Connecting-IP' => '198.51.100.1'])->assertTooManyRequests();

        // Másik látogató (más CF IP) ettől még küldhet.
        $this->postJson('/api/contact', $this->payload, ['CF-Connecting-IP' => '198.51.100.2'])->assertAccepted();
    }

    public function test_notification_goes_to_contact_address_with_visitor_as_reply_to(): void
    {
        config(['services.contact.to' => 'info@adglobalapp.com', 'mail.from.address' => 'noreply@adglobalapp.com']);

        $this->postJson('/api/contact', $this->payload)->assertAccepted();

        $sent = app('mailer')->getSymfonyTransport()->messages();
        $this->assertCount(1, $sent);
        $email = $sent->first()->getOriginalMessage();
        $this->assertSame('info@adglobalapp.com', $email->getTo()[0]->getAddress());
        $this->assertSame('noreply@adglobalapp.com', $email->getFrom()[0]->getAddress());
        $this->assertSame('elek@example.com', $email->getReplyTo()[0]->getAddress());
    }

    public function test_old_messages_are_pruned_after_the_retention_period(): void
    {
        $old = ContactMessage::create($this->payload);
        $old->forceFill(['created_at' => now()->subMonths(25)])->save();
        $recent = ContactMessage::create($this->payload);

        $this->artisan('model:prune', ['--model' => [ContactMessage::class]])->assertSuccessful();

        $this->assertModelMissing($old);
        $this->assertModelExists($recent);
    }
}
