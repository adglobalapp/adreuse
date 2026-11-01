<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\ShippingRate;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class ShippingRateController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json(['data' => [
            'currency' => config('shop.currency'),
            'rates' => ShippingRate::orderBy('zone')->get(['size', 'zone', 'amount']),
        ]]);
    }

    /**
     * Az összes díj mentése egyszerre: [{size, zone, amount (penny)}].
     */
    public function update(Request $request): JsonResponse
    {
        $sizes = array_values(array_diff(config('shop.sizes'), ['custom']));

        $data = $request->validate([
            'rates' => ['required', 'array', 'min:1'],
            'rates.*.size' => ['required', Rule::in($sizes)],
            'rates.*.zone' => ['required', Rule::in(array_keys(config('shop.zones')))],
            'rates.*.amount' => ['required', 'integer', 'min:0', 'max:1000000'],
        ]);

        foreach ($data['rates'] as $rate) {
            ShippingRate::updateOrCreate(['size' => $rate['size'], 'zone' => $rate['zone']], ['amount' => $rate['amount']]);
        }

        return $this->index();
    }
}
