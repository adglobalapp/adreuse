<?php

namespace App\Models;

use Database\Factories\ListingFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable(['category_id', 'title', 'description', 'price', 'currency', 'condition', 'location', 'status'])]
class Listing extends Model
{
    /** @use HasFactory<ListingFactory> */
    use HasFactory;

    public const CONDITIONS = ['new', 'like_new', 'good', 'fair'];

    public const STATUSES = ['active', 'sold'];

    protected $attributes = [
        'currency' => 'HUF',
        'status' => 'active',
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
     * @param  Builder<Listing>  $query
     */
    public function scopeActive(Builder $query): void
    {
        $query->where('status', 'active');
    }
}
