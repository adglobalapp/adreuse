<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Listing;
use App\Models\User;
use Illuminate\Database\Seeder;

/**
 * Demó fiókok (jelszó: "password") és hirdetések – CSAK fejlesztéshez.
 */
class DemoSeeder extends Seeder
{
    public function run(): void
    {
        $demo = User::updateOrCreate(
            ['email' => 'demo@adreuse.test'],
            ['name' => 'Demó Eladó', 'password' => 'password'],
        );

        User::updateOrCreate(
            ['email' => 'admin@adreuse.test'],
            ['name' => 'Admin', 'password' => 'password'],
        )->forceFill(['is_admin' => true])->save();

        if (Listing::exists()) {
            return;
        }

        $samples = [
            ['electronics', 'Használt laptop, 14"', 8500, 'good', 'London'],
            ['electronics', 'Bluetooth fejhallgató', 1500, 'like_new', 'Manchester'],
            ['furniture', 'Tölgyfa étkezőasztal', 12000, 'good', 'Leeds'],
            ['furniture', 'Irodai szék', 2500, 'fair', 'London'],
            ['clothing', 'Téli kabát, M méret', 3000, 'like_new', 'Bristol'],
            ['books', 'Regénycsomag (10 db)', 1200, 'good', 'Liverpool'],
            ['sports', 'Országúti kerékpár', 25000, 'good', 'London'],
            ['sports', 'Jógaszőnyeg', 800, 'new', 'Preston'],
            ['home-garden', 'Fűnyíró', 6000, 'fair', 'Chorley'],
            ['kids', 'Babakocsi', 4500, 'good', 'Bolton'],
            ['kids', 'LEGO doboz', 2000, 'like_new', 'London'],
            ['other', 'Bakelit lemezek', 3500, 'good', 'York'],
        ];

        foreach ($samples as [$slug, $title, $price, $condition, $location]) {
            Listing::factory()->for($demo)->create([
                'shipping_size' => $price > 10000 ? 'large' : ($price > 3000 ? 'medium' : 'small'),
                'category_id' => Category::where('slug', $slug)->value('id'),
                'title' => $title,
                'description' => 'Demó hirdetés – a leírás helye. Állapot, méret, átvételi lehetőségek.',
                'price' => $price,
                'condition' => $condition,
                'location' => $location,
            ]);
        }
    }
}
