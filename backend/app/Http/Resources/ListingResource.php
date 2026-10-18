<?php

namespace App\Http\Resources;

use App\Models\Listing;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

/** @mixin Listing */
class ListingResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $viewer = $request->user('sanctum');

        return [
            'id' => $this->id,
            'title' => $this->title,
            'description' => $this->description,
            'price' => $this->price,
            'currency' => $this->currency,
            'condition' => $this->condition,
            'location' => $this->location,
            'status' => $this->status,
            'image_url' => $this->image_path ? Storage::disk('public')->url($this->image_path) : null,
            'category' => new CategoryResource($this->whenLoaded('category')),
            'seller' => $this->whenLoaded('user', fn () => [
                'id' => $this->user->id,
                'name' => $this->user->name,
                // Az eladó e-mail címét csak bejelentkezett felhasználók látják.
                'email' => $viewer ? $this->user->email : null,
            ]),
            'is_owner' => $viewer?->id === $this->user_id,
            'created_at' => $this->created_at?->toIso8601String(),
            'updated_at' => $this->updated_at?->toIso8601String(),
        ];
    }
}
