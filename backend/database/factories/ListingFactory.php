<?php

namespace Database\Factories;

use App\Models\Category;
use App\Models\Listing;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Listing>
 */
class ListingFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'category_id' => Category::factory(),
            'title' => ucfirst(fake()->words(3, true)),
            'description' => fake()->paragraph(),
            'price' => fake()->numberBetween(5, 500) * 100,
            'condition' => fake()->randomElement(Listing::CONDITIONS),
            'location' => fake()->city(),
            'status' => 'active',
        ];
    }

    public function sold(): static
    {
        return $this->state(fn () => ['status' => 'sold']);
    }
}
