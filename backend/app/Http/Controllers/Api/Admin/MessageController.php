<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\ContactMessage;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class MessageController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $filters = $request->validate([
            'site' => ['nullable', Rule::in(config('services.contact.sites'))],
            'unread' => ['nullable', 'boolean'],
        ]);

        $messages = ContactMessage::query()
            ->when($filters['site'] ?? null, fn ($q, $site) => $q->where('site', $site))
            ->when($request->boolean('unread'), fn ($q) => $q->whereNull('read_at'))
            ->latest()
            ->orderByDesc('id')
            ->paginate(25)
            ->withQueryString();

        return response()->json([
            'data' => $messages->getCollection()->map(fn (ContactMessage $m) => $this->present($m)),
            'meta' => [
                'current_page' => $messages->currentPage(),
                'last_page' => $messages->lastPage(),
                'total' => $messages->total(),
                'per_page' => $messages->perPage(),
                'unread' => ContactMessage::whereNull('read_at')->count(),
            ],
        ]);
    }

    public function update(Request $request, ContactMessage $message): JsonResponse
    {
        $read = $request->validate(['read' => ['required', 'boolean']])['read'];
        $message->forceFill(['read_at' => $read ? ($message->read_at ?? now()) : null])->save();

        return response()->json(['data' => $this->present($message)]);
    }

    public function destroy(ContactMessage $message): JsonResponse
    {
        $message->delete();

        return response()->json(null, 204);
    }

    /**
     * @return array<string, mixed>
     */
    private function present(ContactMessage $m): array
    {
        return [
            'id' => $m->id,
            'site' => $m->site,
            'name' => $m->name,
            'email' => $m->email,
            'message' => $m->message,
            'read' => $m->read_at !== null,
            'created_at' => $m->created_at?->toIso8601String(),
        ];
    }
}
