<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Prunable;

#[Fillable(['site', 'name', 'email', 'message'])]
class ContactMessage extends Model
{
    use Prunable;

    /**
     * A megőrzési idő után automatikusan töröljük (php artisan model:prune, naponta ütemezve).
     *
     * @return Builder<ContactMessage>
     */
    public function prunable(): Builder
    {
        return static::where('created_at', '<', now()->subMonths(config('services.contact.retention_months')));
    }

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'read_at' => 'datetime',
        ];
    }
}
