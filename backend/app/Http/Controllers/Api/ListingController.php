<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreListingRequest;
use App\Http\Requests\UpdateListingRequest;
use App\Http\Resources\ListingResource;
use App\Models\Listing;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;

class ListingController extends Controller
{
    public function index(Request $request): AnonymousResourceCollection
    {
        $filters = $request->validate([
            'q' => ['nullable', 'string', 'max:100'],
            'category' => ['nullable', 'string', 'exists:categories,slug'],
            'condition' => ['nullable', Rule::in(Listing::CONDITIONS)],
            'min_price' => ['nullable', 'integer', 'min:0'],
            'max_price' => ['nullable', 'integer', 'min:0'],
            'sort' => ['nullable', Rule::in(['newest', 'price_asc', 'price_desc'])],
            'per_page' => ['nullable', 'integer', 'min:1', 'max:48'],
        ]);

        $query = Listing::query()->active()->with(['category', 'user']);

        if ($term = $filters['q'] ?? null) {
            $query->where(fn ($q) => $q
                ->where('title', 'like', "%{$term}%")
                ->orWhere('description', 'like', "%{$term}%"));
        }

        if ($slug = $filters['category'] ?? null) {
            $query->whereRelation('category', 'slug', $slug);
        }

        if ($condition = $filters['condition'] ?? null) {
            $query->where('condition', $condition);
        }

        if (isset($filters['min_price'])) {
            $query->where('price', '>=', $filters['min_price']);
        }

        if (isset($filters['max_price'])) {
            $query->where('price', '<=', $filters['max_price']);
        }

        match ($filters['sort'] ?? 'newest') {
            'price_asc' => $query->orderBy('price'),
            'price_desc' => $query->orderByDesc('price'),
            default => $query->latest()->orderByDesc('id'),
        };

        return ListingResource::collection(
            $query->paginate($filters['per_page'] ?? 12)->withQueryString()
        );
    }

    public function mine(Request $request): AnonymousResourceCollection
    {
        $listings = $request->user()->listings()
            ->with(['category', 'user'])
            ->latest()
            ->orderByDesc('id')
            ->paginate(24);

        return ListingResource::collection($listings);
    }

    public function show(Listing $listing): ListingResource
    {
        return new ListingResource($listing->load(['category', 'user']));
    }

    public function store(StoreListingRequest $request): JsonResponse
    {
        $listing = new Listing($request->safe()->except('image'));
        $listing->user()->associate($request->user());
        $listing->image_path = $this->storeImage($request->file('image'));
        $listing->save();

        return (new ListingResource($listing->load(['category', 'user'])))
            ->response()
            ->setStatusCode(201);
    }

    public function update(UpdateListingRequest $request, Listing $listing): ListingResource
    {
        Gate::authorize('update', $listing);

        $listing->fill($request->safe()->except(['image', 'remove_image']));

        if ($request->hasFile('image') || $request->boolean('remove_image')) {
            $this->deleteImage($listing->image_path);
            $listing->image_path = $this->storeImage($request->file('image'));
        }

        $listing->save();

        return new ListingResource($listing->load(['category', 'user']));
    }

    public function destroy(Listing $listing): JsonResponse
    {
        Gate::authorize('delete', $listing);

        $this->deleteImage($listing->image_path);
        $listing->delete();

        return response()->json(null, 204);
    }

    private function storeImage(?UploadedFile $file): ?string
    {
        return $file?->store('listings', 'public') ?: null;
    }

    private function deleteImage(?string $path): void
    {
        if ($path) {
            Storage::disk('public')->delete($path);
        }
    }
}
