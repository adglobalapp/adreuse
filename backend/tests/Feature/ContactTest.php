<?php

namespace Tests\Feature;

use App\Models\ContactMessage;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ContactTest extends TestCase
{
    use RefreshDatabase;

    private array $payload = [
        'site' => 'adlingua',
        'name' => 'Teszt Elek',
        'email' => 'elek@example.com',
        'message' => 'Ajánlatot kérnék.',
    ];

    public function test_message_is_stored(): void
    {
        $this->postJson('/api/contact', $this->payload)->assertAccepted();

        $this->assertDatabaseHas('contact_messages', ['site' => 'adlingua', 'email' => 'elek@example.com']);
    }

    public function test_unknown_site_and_missing_fields_are_rejected(): void
    {
        $this->postJson('/api/contact', ['site' => 'evil'])
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['site', 'name', 'email', 'message']);
    }

    public function test_honeypot_submissions_are_dropped(): void
    {
        $this->postJson('/api/contact', $this->payload + ['website' => 'http://spam'])->assertAccepted();

        $this->assertDatabaseCount('contact_messages', 0);
    }

    public function test_admin_reads_and_deletes_messages(): void
    {
        $message = ContactMessage::create($this->payload);
        $admin = User::factory()->create()->forceFill(['is_admin' => true]);

        $this->actingAs($admin, 'sanctum')
            ->getJson('/api/admin/messages')
            ->assertOk()
            ->assertJsonPath('meta.unread', 1)
            ->assertJsonPath('data.0.read', false);

        $this->actingAs($admin, 'sanctum')
            ->patchJson("/api/admin/messages/{$message->id}", ['read' => true])
            ->assertJsonPath('data.read', true);

        $this->actingAs($admin, 'sanctum')
            ->deleteJson("/api/admin/messages/{$message->id}")
            ->assertNoContent();
    }

    public function test_regular_users_cannot_read_messages(): void
    {
        $this->actingAs(User::factory()->create(), 'sanctum')
            ->getJson('/api/admin/messages')
            ->assertForbidden();
    }
}
