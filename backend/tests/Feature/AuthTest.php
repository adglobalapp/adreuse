<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AuthTest extends TestCase
{
    use RefreshDatabase;

    public function test_registration_is_closed_by_default(): void
    {
        $this->postJson('/api/register', [
            'name' => 'Teszt Elek',
            'email' => 'elek@example.com',
            'password' => 'secret-password',
            'password_confirmation' => 'secret-password',
        ])->assertForbidden();

        $this->assertDatabaseCount('users', 0);
    }

    public function test_user_can_register_and_receives_token(): void
    {
        config(['adreuse.registration_enabled' => true]);

        $response = $this->postJson('/api/register', [
            'name' => 'Teszt Elek',
            'email' => 'elek@example.com',
            'password' => 'secret-password',
            'password_confirmation' => 'secret-password',
        ]);

        $response->assertCreated()
            ->assertJsonStructure(['token', 'user' => ['id', 'name', 'email']]);

        $this->assertDatabaseHas('users', ['email' => 'elek@example.com']);
    }

    public function test_user_can_log_in_and_fetch_profile(): void
    {
        User::factory()->create(['email' => 'elek@example.com']);

        $token = $this->postJson('/api/login', [
            'email' => 'elek@example.com',
            'password' => 'password',
        ])->assertOk()->json('token');

        $this->withToken($token)->getJson('/api/me')
            ->assertOk()
            ->assertJsonPath('data.email', 'elek@example.com');
    }

    public function test_login_fails_with_wrong_password(): void
    {
        User::factory()->create(['email' => 'elek@example.com']);

        $this->postJson('/api/login', [
            'email' => 'elek@example.com',
            'password' => 'wrong',
        ])->assertUnprocessable()->assertJsonValidationErrors('email');
    }

    public function test_logout_revokes_the_token(): void
    {
        $user = User::factory()->create();
        $token = $user->createToken('spa')->plainTextToken;

        $this->withToken($token)->postJson('/api/logout')->assertNoContent();

        $this->assertDatabaseCount('personal_access_tokens', 0);
    }
}
