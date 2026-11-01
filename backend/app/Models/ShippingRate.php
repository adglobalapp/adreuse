<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;

#[Fillable(['size', 'zone', 'amount'])]
class ShippingRate extends Model
{
    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'amount' => 'integer',
        ];
    }

    /**
     * Melyik zónába tartozik az ország (null, ha oda nem szállítunk).
     */
    public static function zoneFor(string $country): ?string
    {
        foreach (config('shop.zones') as $zone => $countries) {
            if (in_array(strtoupper($country), $countries, true)) {
                return $zone;
            }
        }

        return null;
    }

    /**
     * Szállítási díj pennyben (null, ha nincs díj megadva, vagy egyedi méretű a termék).
     */
    public static function quote(string $size, string $zone): ?int
    {
        if ($size === 'custom') {
            return null;
        }

        return static::where('size', $size)->where('zone', $zone)->value('amount');
    }
}
