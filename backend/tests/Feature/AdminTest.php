<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Listing;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdminTest extends TestCase
{
    use RefreshDatabase;

    private function admin(): User
    {
        return User::factory()->create()->forceFill(['is_admin' => true]);
    }

    public function test_non_admins_are_rejected(): void
    {
        $this->getJson('/api/admin/stats')->assertUnauthorized();

        $this->actingAs(User::factory()->create(), 'sanctum')
            ->getJson('/api/admin/stats')
            ->assertForbidden();
    }

    public function test_admin_sees_stats(): void
    {
        Listing::factory()->count(2)->create();
        Listing::factory()->sold()->create();

        $this->actingAs($this->admin(), 'sanctum')
            ->getJson('/api/admin/stats')
            ->assertOk()
            ->assertJsonPath('data.listings_active', 2)
            ->assertJsonPath('data.listings_sold', 1);
    }

    public function test_admin_lists_all_listings_including_sold(): void
    {
        Listing::factory()->create();
        Listing::factory()->sold()->create();

        $this->actingAs($this->admin(), 'sanctum')
            ->getJson('/api/admin/listings')
            ->assertOk()
            ->assertJsonCount(2, 'data');

        $this->actingAs($this->admin(), 'sanctum')
            ->getJson('/api/admin/listings?status=sold')
            ->assertJsonCount(1, 'data');
    }

    public function test_admin_can_edit_and_delete_any_listing(): void
    {
        $listing = Listing::factory()->create();
        $admin = $this->admin();

        $this->actingAs($admin, 'sanctum')
            ->patchJson("/api/listings/{$listing->id}", ['status' => 'sold'])
            ->assertOk()
            ->assertJsonPath('data.status', 'sold')
            ->assertJsonPath('data.is_owner', false)
            ->assertJsonPath('data.can_manage', true);

        $this->actingAs($admin, 'sanctum')
            ->deleteJson("/api/listings/{$listing->id}")
            ->assertNoContent();
    }

    public function test_admin_manages_categories(): void
    {
        $admin = $this->admin();

        $id = $this->actingAs($admin, 'sanctum')
            ->postJson('/api/admin/categories', ['name' => 'Hangszerek'])
            ->assertCreated()
            ->assertJsonPath('data.slug', 'hangszerek')
            ->json('data.id');

        $this->actingAs($admin, 'sanctum')
            ->patchJson("/api/admin/categories/{$id}", ['name' => 'Hangszer', 'position' => 3])
            ->assertOk()
            ->assertJsonPath('data.name', 'Hangszer');

        $this->actingAs($admin, 'sanctum')
            ->deleteJson("/api/admin/categories/{$id}")
            ->assertNoContent();
    }

    public function test_category_with_listings_cannot_be_deleted(): void
    {
        $category = Category::factory()->create();
        Listing::factory()->create(['category_id' => $category->id]);

        $this->actingAs($this->admin(), 'sanctum')
            ->deleteJson("/api/admin/categories/{$category->id}")
            ->assertUnprocessable();

        $this->assertDatabaseHas('categories', ['id' => $category->id]);
    }

    public function test_admin_can_promote_users_but_not_demote_self(): void
    {
        $admin = $this->admin();
        $user = User::factory()->create();

        $this->actingAs($admin, 'sanctum')
            ->patchJson("/api/admin/users/{$user->id}", ['is_admin' => true])
            ->assertOk()
            ->assertJsonPath('data.is_admin', true);

        $this->actingAs($admin, 'sanctum')
            ->patchJson("/api/admin/users/{$admin->id}", ['is_admin' => false])
            ->assertUnprocessable();
    }

    public function test_make_admin_command(): void
    {
        $user = User::factory()->create(['email' => 'boss@example.com']);

        $this->artisan('app:make-admin', ['email' => 'boss@example.com'])->assertSuccessful();
        $this->assertTrue($user->fresh()->is_admin);

        $this->artisan('app:make-admin', ['email' => 'nobody@example.com'])->assertFailed();
    }
}
