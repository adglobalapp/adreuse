<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;

/**
 * Alap kategóriák. Élesben is biztonságosan futtatható, többször is:
 * php artisan db:seed --class=CategorySeeder --force
 * A kategórianevek fordítását a frontend végzi a slug alapján.
 */
class CategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            'electronics' => 'Elektronika',
            'furniture' => 'Bútor',
            'clothing' => 'Ruházat',
            'books' => 'Könyv',
            'sports' => 'Sport',
            'home-garden' => 'Otthon és kert',
            'kids' => 'Gyerek',
            'other' => 'Egyéb',
        ];

        foreach (array_keys($categories) as $i => $slug) {
            Category::updateOrCreate(['slug' => $slug], ['name' => $categories[$slug], 'position' => $i]);
        }
    }
}
