<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Str;

class Order extends Model
{
    /** pending: a vevő a fizetőoldalon van; expired: nem fizetett időben. */
    public const STATUSES = ['pending', 'paid', 'shipped', 'delivered', 'cancelled', 'refunded', 'expired'];

    /** Az admin által kézzel beállítható állapotok. */
    public const ADMIN_STATUSES = ['paid', 'shipped', 'delivered', 'cancelled'];

    protected $guarded = ['id'];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'item_amount' => 'integer',
            'shipping_amount' => 'integer',
            'total_amount' => 'integer',
            'shipping_address' => 'array',
            'terms_accepted_at' => 'datetime',
            'expires_at' => 'datetime',
            'paid_at' => 'datetime',
            'shipped_at' => 'datetime',
        ];
    }

    protected static function booted(): void
    {
        static::creating(function (Order $order) {
            $order->reference ??= static::newReference();
        });
    }

    /**
     * Rövid, emberi szemmel olvasható rendelésszám, pl. AR-7K3QF9.
     */
    public static function newReference(): string
    {
        do {
            $ref = 'AR-'.strtoupper(Str::random(6));
        } while (static::where('reference', $ref)->exists());

        return $ref;
    }

    /**
     * @return BelongsTo<Listing, $this>
     */
    public function listing(): BelongsTo
    {
        return $this->belongsTo(Listing::class);
    }

    /**
     * Folyamatban lévő (még nem lejárt) fizetés: ilyenkor a termék foglalt.
     *
     * @param  Builder<Order>  $query
     */
    public function scopeHolding(Builder $query): void
    {
        $query->where('status', 'pending')->where('expires_at', '>', now());
    }
}
