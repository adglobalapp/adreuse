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
            ['electronics', 'Használt laptop, 14"', 85000, 'good', 'Budapest'],
            ['electronics', 'Bluetooth fejhallgató', 12000, 'like_new', 'Debrecen'],
            ['furniture', 'Tölgyfa étkezőasztal', 45000, 'good', 'Szeged'],
            ['furniture', 'Irodai szék', 9000, 'fair', 'Budapest'],
            ['clothing', 'Téli kabát, M méret', 15000, 'like_new', 'Győr'],
            ['books', 'Regénycsomag (10 db)', 5000, 'good', 'Pécs'],
            ['sports', 'Országúti kerékpár', 120000, 'good', 'Budapest'],
            ['sports', 'Jógaszőnyeg', 3000, 'new', 'Miskolc'],
            ['home-garden', 'Fűnyíró', 30000, 'fair', 'Kecskemét'],
            ['kids', 'Babakocsi', 25000, 'good', 'Székesfehérvár'],
            ['kids', 'LEGO doboz', 8000, 'like_new', 'Budapest'],
            ['other', 'Bakelit lemezek', 18000, 'good', 'Eger'],
        ];

        foreach ($samples as [$slug, $title, $price, $condition, $location]) {
            Listing::factory()->for($demo)->create([
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
