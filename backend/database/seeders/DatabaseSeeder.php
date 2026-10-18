<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Kategóriák mindig; demó fiókok és hirdetések csak helyi fejlesztésnél és teszteknél,
     * így egy véletlen éles `db:seed` sem hoz létre ismert jelszavú admint.
     */
    public function run(): void
    {
        $this->call(CategorySeeder::class);

        if (app()->environment('local', 'testing')) {
            $this->call(DemoSeeder::class);
        }
    }
}
