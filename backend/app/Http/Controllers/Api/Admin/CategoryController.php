<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\CategoryResource;
use App\Models\Category;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class CategoryController extends Controller
{
    public function index(): AnonymousResourceCollection
    {
        return CategoryResource::collection(
            Category::withCount('listings')->orderBy('position')->orderBy('id')->get()
        );
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:80'],
            'slug' => ['nullable', 'string', 'max:80', 'alpha_dash', 'unique:categories,slug'],
            'position' => ['nullable', 'integer', 'min:0', 'max:65535'],
        ]);

        $category = Category::create([
            'name' => $data['name'],
            'slug' => $data['slug'] ?? $this->uniqueSlug($data['name']),
            'position' => $data['position'] ?? (Category::max('position') + 1),
        ]);

        return (new CategoryResource($category->loadCount('listings')))->response()->setStatusCode(201);
    }

    public function update(Request $request, Category $category): CategoryResource
    {
        $data = $request->validate([
            'name' => ['sometimes', 'string', 'max:80'],
            'slug' => ['sometimes', 'string', 'max:80', 'alpha_dash', Rule::unique('categories', 'slug')->ignore($category)],
            'position' => ['sometimes', 'integer', 'min:0', 'max:65535'],
        ]);

        $category->update($data);

        return new CategoryResource($category->loadCount('listings'));
    }

    public function destroy(Category $category): JsonResponse
    {
        if ($category->listings()->exists()) {
            return response()->json([
                'message' => 'A kategóriában még vannak hirdetések.',
                'errors' => ['category' => ['A kategóriában még vannak hirdetések.']],
            ], 422);
        }

        $category->delete();

        return response()->json(null, 204);
    }

    private function uniqueSlug(string $name): string
    {
        $base = Str::slug($name) ?: 'category';
        $slug = $base;

        for ($i = 2; Category::where('slug', $slug)->exists(); $i++) {
            $slug = "{$base}-{$i}";
        }

        return $slug;
    }
}
