<?php

use App\Http\Controllers\Api\Admin;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\CheckoutController;
use App\Http\Controllers\Api\ContactController;
use App\Http\Controllers\Api\ListingController;
use App\Http\Controllers\Api\StripeWebhookController;
use Illuminate\Support\Facades\Route;

Route::middleware('throttle:auth')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);
});

Route::post('/contact', [ContactController::class, 'store'])->middleware('throttle:contact');

Route::get('/categories', [CategoryController::class, 'index']);

// Webshop: szállítási díjak, fizetés indítása, köszönőoldal, Stripe webhook
Route::get('/shipping', [CheckoutController::class, 'shipping']);
Route::post('/checkout', [CheckoutController::class, 'store'])->middleware('throttle:checkout');
Route::get('/checkout/{sessionId}', [CheckoutController::class, 'status']);
Route::post('/stripe/webhook', StripeWebhookController::class);
Route::get('/listings', [ListingController::class, 'index']);
Route::get('/listings/{listing}', [ListingController::class, 'show']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);

    Route::get('/my/listings', [ListingController::class, 'mine']);
    Route::post('/listings', [ListingController::class, 'store']);
    // A PATCH multipart (képfeltöltés) miatt POST + _method=PATCH formában is érkezhet.
    Route::patch('/listings/{listing}', [ListingController::class, 'update']);
    Route::delete('/listings/{listing}', [ListingController::class, 'destroy']);

    Route::prefix('admin')->middleware('admin')->group(function () {
        Route::get('/stats', Admin\StatsController::class);
        Route::get('/listings', [Admin\ListingController::class, 'index']);
        Route::get('/categories', [Admin\CategoryController::class, 'index']);
        Route::post('/categories', [Admin\CategoryController::class, 'store']);
        Route::patch('/categories/{category:id}', [Admin\CategoryController::class, 'update']);
        Route::delete('/categories/{category:id}', [Admin\CategoryController::class, 'destroy']);
        Route::get('/users', [Admin\UserController::class, 'index']);
        Route::patch('/users/{user}', [Admin\UserController::class, 'update']);
        Route::get('/messages', [Admin\MessageController::class, 'index']);
        Route::patch('/messages/{message}', [Admin\MessageController::class, 'update']);
        Route::delete('/messages/{message}', [Admin\MessageController::class, 'destroy']);
        Route::get('/orders', [Admin\OrderController::class, 'index']);
        Route::patch('/orders/{order}', [Admin\OrderController::class, 'update']);
        Route::post('/orders/{order}/refund', [Admin\OrderController::class, 'refund']);
        Route::get('/shipping-rates', [Admin\ShippingRateController::class, 'index']);
        Route::put('/shipping-rates', [Admin\ShippingRateController::class, 'update']);
    });
});
