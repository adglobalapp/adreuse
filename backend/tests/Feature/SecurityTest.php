<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Listing;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class SecurityTest extends TestCase
{
    use RefreshDatabase;

    public function test_uploaded_images_are_re_encoded_as_jpeg(): void
    {
        Storage::fake('public');
        $user = User::factory()->create();

        $this->actingAs($user, 'sanctum')->post('/api/listings', [
            'category_id' => Category::factory()->create()->id,
            'title' => 'Lámpa',
            'description' => 'Leírás',
            'price' => 1000,
            'condition' => 'good',
            'image' => UploadedFile::fake()->image('photo.png', 3000, 1500),
        ], ['Accept' => 'application/json'])->assertCreated();

        $path = Listing::firstOrFail()->image_path;
        $this->assertStringEndsWith('.jpg', $path);
        $bytes = Storage::disk('public')->get($path);
        $this->assertSame("\xFF\xD8", substr($bytes, 0, 2)); // JPEG
        [$w, $h] = getimagesizefromstring($bytes);
        $this->assertSame([2000, 1000], [$w, $h]); // lekicsinyítve
    }

    public function test_login_is_limited_per_email_even_from_different_ips(): void
    {
        User::factory()->create(['email' => 'target@example.com']);

        foreach (range(1, 5) as $i) {
            $this->postJson('/api/login', ['email' => 'target@example.com', 'password' => 'wrong'], ['CF-Connecting-IP' => "203.0.113.{$i}"])
                ->assertUnprocessable();
        }

        $this->postJson('/api/login', ['email' => 'target@example.com', 'password' => 'wrong'], ['CF-Connecting-IP' => '203.0.113.99'])
            ->assertTooManyRequests();
    }

    public function test_tokens_expire(): void
    {
        $this->assertSame(10080, config('sanctum.expiration'));
    }
}
