<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Listing;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class ListingTest extends TestCase
{
    use RefreshDatabase;

    public function test_public_index_lists_only_active_listings(): void
    {
        Listing::factory()->count(2)->create();
        Listing::factory()->sold()->create();

        $this->getJson('/api/listings')
            ->assertOk()
            ->assertJsonCount(2, 'data')
            ->assertJsonStructure(['data', 'links', 'meta']);
    }

    public function test_index_filters_by_search_category_and_price(): void
    {
        $books = Category::factory()->create(['slug' => 'books']);
        Listing::factory()->create(['title' => 'Régi regény', 'category_id' => $books->id, 'price' => 2000]);
        Listing::factory()->create(['title' => 'Drága regény', 'category_id' => $books->id, 'price' => 90000]);
        Listing::factory()->create(['title' => 'Kerékpár', 'price' => 2000]);

        $this->getJson('/api/listings?q=regény&category=books&max_price=5000')
            ->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.title', 'Régi regény');
    }

    public function test_seller_email_is_hidden_from_guests(): void
    {
        $listing = Listing::factory()->create();

        $this->getJson("/api/listings/{$listing->id}")
            ->assertOk()
            ->assertJsonPath('data.seller.email', null);

        $this->actingAs(User::factory()->create(), 'sanctum')
            ->getJson("/api/listings/{$listing->id}")
            ->assertJsonPath('data.seller.email', $listing->user->email);
    }

    public function test_guest_cannot_create_listing(): void
    {
        $this->postJson('/api/listings', [])->assertUnauthorized();
    }

    public function test_user_can_create_listing_with_image(): void
    {
        Storage::fake('public');
        $user = User::factory()->create();
        $category = Category::factory()->create();

        $response = $this->actingAs($user, 'sanctum')->post('/api/listings', [
            'category_id' => $category->id,
            'title' => 'Használt kanapé',
            'description' => 'Jó állapotú, elvihető.',
            'price' => 30000,
            'condition' => 'good',
            'location' => 'Budapest',
            'image' => UploadedFile::fake()->image('kanape.jpg'),
        ], ['Accept' => 'application/json']);

        $response->assertCreated()
            ->assertJsonPath('data.title', 'Használt kanapé')
            ->assertJsonPath('data.is_owner', true);

        $listing = Listing::firstOrFail();
        $this->assertSame($user->id, $listing->user_id);
        Storage::disk('public')->assertExists($listing->image_path);
    }

    public function test_create_validates_input(): void
    {
        $this->actingAs(User::factory()->create(), 'sanctum')
            ->postJson('/api/listings', ['title' => 'x', 'condition' => 'broken'])
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['category_id', 'title', 'description', 'price', 'condition']);
    }

    public function test_owner_can_update_and_mark_as_sold(): void
    {
        $listing = Listing::factory()->create();

        $this->actingAs($listing->user, 'sanctum')
            ->patchJson("/api/listings/{$listing->id}", ['price' => 1234, 'status' => 'sold'])
            ->assertOk()
            ->assertJsonPath('data.price', 1234)
            ->assertJsonPath('data.status', 'sold');
    }

    public function test_other_users_cannot_update_or_delete(): void
    {
        $listing = Listing::factory()->create();
        $intruder = User::factory()->create();

        $this->actingAs($intruder, 'sanctum')
            ->patchJson("/api/listings/{$listing->id}", ['price' => 1])
            ->assertForbidden();

        $this->actingAs($intruder, 'sanctum')
            ->deleteJson("/api/listings/{$listing->id}")
            ->assertForbidden();

        $this->assertDatabaseHas('listings', ['id' => $listing->id]);
    }

    public function test_owner_can_delete_listing_and_its_image(): void
    {
        Storage::fake('public');
        $path = UploadedFile::fake()->image('a.jpg')->store('listings', 'public');
        $listing = Listing::factory()->create();
        $listing->forceFill(['image_path' => $path])->save();

        $this->actingAs($listing->user, 'sanctum')
            ->deleteJson("/api/listings/{$listing->id}")
            ->assertNoContent();

        $this->assertDatabaseMissing('listings', ['id' => $listing->id]);
        Storage::disk('public')->assertMissing($path);
    }

    public function test_my_listings_returns_own_listings_including_sold(): void
    {
        $user = User::factory()->create();
        Listing::factory()->for($user)->create();
        Listing::factory()->for($user)->sold()->create();
        Listing::factory()->create();

        $this->actingAs($user, 'sanctum')
            ->getJson('/api/my/listings')
            ->assertOk()
            ->assertJsonCount(2, 'data');
    }

    public function test_categories_include_active_listing_counts(): void
    {
        $category = Category::factory()->create();
        Listing::factory()->count(2)->create(['category_id' => $category->id]);
        Listing::factory()->sold()->create(['category_id' => $category->id]);

        $this->getJson('/api/categories')
            ->assertOk()
            ->assertJsonPath('data.0.listings_count', 2);
    }
}
