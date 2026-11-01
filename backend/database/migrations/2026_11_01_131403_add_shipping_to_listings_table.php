<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Csomagméret a szállítási díjhoz, és átállás fontra: az ár ezentúl pennyben (minor unit) van.
     */
    public function up(): void
    {
        Schema::table('listings', function (Blueprint $table) {
            $table->string('shipping_size', 20)->default('small')->after('condition');
            $table->char('currency', 3)->default('GBP')->change();
        });

        // A korábbi (forintos) hirdetések számértéke fontként marad meg: 12000 → 12000.00 £
        DB::table('listings')->where('currency', '!=', 'GBP')->update([
            'currency' => 'GBP',
            'price' => DB::raw('price * 100'),
        ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('listings', function (Blueprint $table) {
            $table->dropColumn('shipping_size');
        });
    }
};
