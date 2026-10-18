<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\User;
use Database\Seeders\DatabaseSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class ProductionSetupTest extends TestCase
{
    use RefreshDatabase;

    public function test_seeding_in_production_creates_categories_but_no_accounts(): void
    {
        $this->app['env'] = 'production';

        $this->artisan('db:seed', ['--class' => DatabaseSeeder::class, '--force' => true])->assertSuccessful();

        $this->assertSame(8, Category::count());
        $this->assertSame(0, User::count());
    }

    public function test_create_admin_command_makes_an_admin_with_a_random_password(): void
    {
        $this->artisan('app:create-admin', ['email' => 'zoltan@example.com', '--name' => 'Zoltan'])
            ->expectsOutputToContain('Admin létrehozva')
            ->assertSuccessful();

        $user = User::where('email', 'zoltan@example.com')->firstOrFail();
        $this->assertTrue($user->is_admin);
        $this->assertFalse(Hash::check('password', $user->password));

        $this->artisan('app:create-admin', ['email' => 'zoltan@example.com'])->assertFailed();
        $this->artisan('app:create-admin', ['email' => 'not-an-email'])->assertFailed();
    }

    public function test_https_is_detected_behind_the_proxy(): void
    {
        $this->get('/up', ['X-Forwarded-Proto' => 'https', 'X-Forwarded-For' => '10.0.0.1'])->assertOk();

        $this->assertTrue(request()->isSecure());
    }
}
