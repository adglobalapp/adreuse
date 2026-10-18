<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class UserController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $term = $request->validate(['q' => ['nullable', 'string', 'max:100']])['q'] ?? null;

        $users = User::query()
            ->withCount('listings')
            ->when($term, fn ($q) => $q->where(fn ($q) => $q
                ->where('name', 'like', "%{$term}%")
                ->orWhere('email', 'like', "%{$term}%")))
            ->orderBy('name')
            ->paginate(25)
            ->withQueryString();

        return response()->json([
            'data' => $users->getCollection()->map(fn (User $u) => $this->present($u)),
            'meta' => [
                'current_page' => $users->currentPage(),
                'last_page' => $users->lastPage(),
                'total' => $users->total(),
                'per_page' => $users->perPage(),
            ],
        ]);
    }

    public function update(Request $request, User $user): JsonResponse
    {
        $data = $request->validate(['is_admin' => ['required', 'boolean']]);

        // Saját magát senki ne fokozza le, különben admin nélkül maradhat az oldal.
        if ($user->is($request->user()) && ! $data['is_admin']) {
            return response()->json([
                'message' => 'A saját admin jogodat nem veheted el.',
                'errors' => ['is_admin' => ['A saját admin jogodat nem veheted el.']],
            ], 422);
        }

        $user->forceFill(['is_admin' => $data['is_admin']])->save();

        return response()->json(['data' => $this->present($user->loadCount('listings'))]);
    }

    /**
     * @return array<string, mixed>
     */
    private function present(User $user): array
    {
        return [
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'is_admin' => $user->is_admin,
            'listings_count' => $user->listings_count,
            'created_at' => $user->created_at?->toIso8601String(),
        ];
    }
}
