<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Services\OrderMailer;
use App\Services\Payments\PaymentGateway;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\Rule;
use Throwable;

class OrderController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $filters = $request->validate([
            'status' => ['nullable', Rule::in(Order::STATUSES)],
            'q' => ['nullable', 'string', 'max:100'],
        ]);

        $orders = Order::query()
            // A még fizetésre váró és lejárt próbálkozások alapból nem zavarnak be
            ->when($filters['status'] ?? null, fn ($q, $s) => $q->where('status', $s), fn ($q) => $q->whereNotIn('status', ['pending', 'expired']))
            ->when($filters['q'] ?? null, fn ($q, $term) => $q->where(fn ($q) => $q
                ->where('reference', 'like', "%{$term}%")
                ->orWhere('customer_email', 'like', "%{$term}%")
                ->orWhere('customer_name', 'like', "%{$term}%")
                ->orWhere('item_title', 'like', "%{$term}%")))
            ->latest()
            ->orderByDesc('id')
            ->paginate(25)
            ->withQueryString();

        return response()->json([
            'data' => $orders->getCollection()->map(fn (Order $o) => $this->present($o)),
            'meta' => [
                'current_page' => $orders->currentPage(),
                'last_page' => $orders->lastPage(),
                'total' => $orders->total(),
                'per_page' => $orders->perPage(),
                'to_ship' => Order::where('status', 'paid')->count(),
            ],
        ]);
    }

    public function update(Request $request, Order $order, OrderMailer $mailer): JsonResponse
    {
        $data = $request->validate([
            'status' => ['sometimes', Rule::in(Order::ADMIN_STATUSES)],
            'carrier' => ['sometimes', 'nullable', 'string', 'max:80'],
            'tracking_number' => ['sometimes', 'nullable', 'string', 'max:120'],
            'admin_note' => ['sometimes', 'nullable', 'string', 'max:2000'],
            'restock' => ['sometimes', 'boolean'],
        ]);

        if (in_array($order->status, ['pending', 'expired', 'refunded'], true) && isset($data['status'])) {
            return response()->json([
                'message' => 'Ennek a rendelésnek az állapota nem módosítható.',
                'errors' => ['status' => ['Ennek a rendelésnek az állapota nem módosítható.']],
            ], 422);
        }

        $becameShipped = ($data['status'] ?? null) === 'shipped' && $order->status !== 'shipped';

        $order->fill(collect($data)->except('restock')->all());
        if ($becameShipped) {
            $order->shipped_at = now();
        }
        $order->save();

        // Lemondáskor a termék opcionálisan újra eladható lesz
        if (($data['status'] ?? null) === 'cancelled' && $request->boolean('restock')) {
            $order->listing?->update(['status' => 'active']);
        }

        if ($becameShipped) {
            $mailer->shipped($order);
        }

        return response()->json(['data' => $this->present($order)]);
    }

    /**
     * Teljes visszatérítés a Stripe-on keresztül.
     */
    public function refund(Request $request, Order $order, PaymentGateway $payments): JsonResponse
    {
        $restock = $request->validate(['restock' => ['sometimes', 'boolean']])['restock'] ?? false;

        if (! in_array($order->status, ['paid', 'shipped', 'delivered', 'cancelled'], true)) {
            return response()->json(['message' => 'Ez a rendelés nem téríthető vissza.'], 422);
        }

        try {
            $payments->refund($order);
        } catch (Throwable $e) {
            Log::error('Refund failed', ['order' => $order->reference, 'error' => $e->getMessage()]);

            return response()->json(['message' => 'A visszatérítés nem sikerült: '.$e->getMessage()], 502);
        }

        $order->update(['status' => 'refunded']);
        if ($restock) {
            $order->listing?->update(['status' => 'active']);
        }

        return response()->json(['data' => $this->present($order)]);
    }

    /**
     * @return array<string, mixed>
     */
    private function present(Order $o): array
    {
        return [
            'id' => $o->id,
            'reference' => $o->reference,
            'status' => $o->status,
            'listing_id' => $o->listing_id,
            'item_title' => $o->item_title,
            'currency' => $o->currency,
            'item_amount' => $o->item_amount,
            'shipping_amount' => $o->shipping_amount,
            'total_amount' => $o->total_amount,
            'shipping_size' => $o->shipping_size,
            'shipping_zone' => $o->shipping_zone,
            'country' => $o->country,
            'locale' => $o->locale,
            'customer_name' => $o->customer_name,
            'customer_email' => $o->customer_email,
            'customer_phone' => $o->customer_phone,
            'shipping_address' => $o->shipping_address,
            'carrier' => $o->carrier,
            'tracking_number' => $o->tracking_number,
            'admin_note' => $o->admin_note,
            'created_at' => $o->created_at?->toIso8601String(),
            'paid_at' => $o->paid_at?->toIso8601String(),
            'shipped_at' => $o->shipped_at?->toIso8601String(),
        ];
    }
}
