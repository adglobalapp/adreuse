<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Rendelések: egy rendelés = egy termék (használt cikkek, mindegyikből egy darab van).
     */
    public function up(): void
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->string('reference', 20)->unique();
            $table->foreignId('listing_id')->nullable()->constrained()->nullOnDelete();
            $table->string('item_title');
            $table->string('status', 20)->default('pending');
            $table->char('currency', 3);
            $table->unsignedInteger('item_amount');
            $table->unsignedInteger('shipping_amount');
            $table->unsignedInteger('total_amount');
            $table->string('shipping_size', 20);
            $table->string('shipping_zone', 10);
            $table->char('country', 2);
            $table->string('locale', 5)->default('en');
            $table->string('customer_name')->nullable();
            $table->string('customer_email')->nullable();
            $table->string('customer_phone')->nullable();
            $table->json('shipping_address')->nullable();
            $table->string('carrier')->nullable();
            $table->string('tracking_number')->nullable();
            $table->text('admin_note')->nullable();
            $table->string('stripe_session_id')->nullable()->unique();
            $table->string('stripe_payment_intent')->nullable();
            $table->timestamp('terms_accepted_at')->nullable();
            $table->timestamp('expires_at')->nullable();
            $table->timestamp('paid_at')->nullable();
            $table->timestamp('shipped_at')->nullable();
            $table->timestamps();

            $table->index(['status', 'created_at']);
            $table->index(['listing_id', 'status']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
