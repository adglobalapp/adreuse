<?php

namespace App\Models;

use Database\Factories\ListingFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable(['category_id', 'title', 'description', 'price', 'currency', 'condition', 'shipping_size', 'location', 'status'])]
class Listing extends Model
{
    /** @use HasFactory<ListingFactory> */
    use HasFactory;

    public const CONDITIONS = ['new', 'like_new', 'good', 'fair'];

    public const STATUSES = ['active', 'sold'];

    /** Csomagméret a szállítási díjhoz; a "custom" nem rendelhető online. */
    public const SHIPPING_SIZES = ['small', 'medium', 'large', 'custom'];

    protected $attributes = [
        'currency' => 'GBP',
        'status' => 'active',
        'shipping_size' => 'small',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'price' => 'integer',
        ];
    }

    /**
     * @return BelongsTo<User, $this>
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * @return BelongsTo<Category, $this>
     */
    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    /**
     * @return HasMany<Order, $this>
     */
    public function orders(): HasMany
    {
        return $this->hasMany(Order::class);
    }

    /**
     * Online megvásárolható-e most: aktív, nem egyedi méretű, és épp nem fizet érte más.
     */
    public function isPurchasable(): bool
    {
        return $this->status === 'active'
            && $this->shipping_size !== 'custom'
            && ! $this->orders()->holding()->exists();
    }

    /**
     * @param  Builder<Listing>  $query
     */
    public function scopeActive(Builder $query): void
    {
        $query->where('status', 'active');
    }
}
