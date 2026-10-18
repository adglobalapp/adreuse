<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ContactMessage;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Validation\Rule;
use Throwable;

/**
 * Az összes AdGlobalApp oldal kapcsolati űrlapja ide küld (lásd config/services.php → contact).
 */
class ContactController extends Controller
{
    public function store(Request $request): JsonResponse
    {
        // Csapda mező: ember nem látja, bot kitölti. Ilyenkor úgy teszünk, mintha sikerült volna.
        if (filled($request->input('website'))) {
            return response()->json(null, 202);
        }

        $data = $request->validate([
            'site' => ['required', 'string', Rule::in(config('services.contact.sites'))],
            'name' => ['required', 'string', 'max:120'],
            'email' => ['required', 'string', 'email', 'max:255'],
            'message' => ['required', 'string', 'max:5000'],
        ]);

        $message = ContactMessage::create($data);

        if ($to = config('services.contact.to')) {
            try {
                Mail::raw(
                    "{$message->message}\n\n— {$message->name} <{$message->email}>",
                    fn ($mail) => $mail->to($to)
                        ->replyTo($message->email, $message->name)
                        ->subject("Új üzenet – {$message->site}"),
                );
            } catch (Throwable $e) {
                // Az üzenet el van mentve, az admin felületen akkor is látszik.
                Log::warning('Contact notification failed', ['id' => $message->id, 'error' => $e->getMessage()]);
            }
        }

        return response()->json(null, 202);
    }
}
