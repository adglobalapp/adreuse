<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Szállítási díjak méretkategória × zóna szerint, pennyben. Az admin felületen szerkeszthető.
     */
    public function up(): void
    {
        Schema::create('shipping_rates', function (Blueprint $table) {
            $table->id();
            $table->string('size', 20);
            $table->string('zone', 10);
            $table->unsignedInteger('amount');
            $table->timestamps();

            $table->unique(['size', 'zone']);
        });

        // Mintadíjak (penny) – a futár kiválasztása után az admin felületen kell a valósra állítani.
        $defaults = [
            'small' => ['uk' => 495, 'eu' => 1495],
            'medium' => ['uk' => 895, 'eu' => 2495],
            'large' => ['uk' => 1995, 'eu' => 4995],
        ];
        $now = now();
        foreach ($defaults as $size => $zones) {
            foreach ($zones as $zone => $amount) {
                DB::table('shipping_rates')->insert(compact('size', 'zone', 'amount') + ['created_at' => $now, 'updated_at' => $now]);
            }
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('shipping_rates');
    }
};
