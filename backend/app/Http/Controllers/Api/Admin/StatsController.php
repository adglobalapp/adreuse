<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\ContactMessage;
use App\Models\Listing;
use App\Models\User;
use Illuminate\Http\JsonResponse;

class StatsController extends Controller
{
    public function __invoke(): JsonResponse
    {
        return response()->json(['data' => [
            'users' => User::count(),
            'listings_active' => Listing::where('status', 'active')->count(),
            'listings_sold' => Listing::where('status', 'sold')->count(),
            'listings_last_7_days' => Listing::where('created_at', '>=', now()->subDays(7))->count(),
            'categories' => Category::count(),
            'messages_unread' => ContactMessage::whereNull('read_at')->count(),
        ]]);
    }
}
