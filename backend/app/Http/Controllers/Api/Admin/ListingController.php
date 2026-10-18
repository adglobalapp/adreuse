<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\ListingResource;
use App\Models\Listing;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Validation\Rule;

class ListingController extends Controller
{
    /**
     * Every listing, sold ones included. Editing and deleting go through the
     * regular listing endpoints, where the policy lets admins through.
     */
    public function index(Request $request): AnonymousResourceCollection
    {
        $filters = $request->validate([
            'q' => ['nullable', 'string', 'max:100'],
            'status' => ['nullable', Rule::in(Listing::STATUSES)],
            'category' => ['nullable', 'string', 'exists:categories,slug'],
        ]);

        $query = Listing::query()->with(['category', 'user'])->latest()->orderByDesc('id');

        if ($term = $filters['q'] ?? null) {
            $query->where(fn ($q) => $q
                ->where('title', 'like', "%{$term}%")
                ->orWhereRelation('user', 'email', 'like', "%{$term}%"));
        }

        if ($status = $filters['status'] ?? null) {
            $query->where('status', $status);
        }

        if ($slug = $filters['category'] ?? null) {
            $query->whereRelation('category', 'slug', $slug);
        }

        return ListingResource::collection($query->paginate(25)->withQueryString());
    }
}
