<?php

namespace App\Services;

use App\Models\Order;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Throwable;

/**
 * A rendelésekhez tartozó levelek. A rendelés akkor is érvényes, ha a levélküldés hibázik (csak naplózzuk).
 */
class OrderMailer
{
    public function confirmation(Order $order): void
    {
        if (blank($order->customer_email)) {
            return;
        }

        $this->send($order->customer_email, __('shop.confirmation_subject', ['reference' => $order->reference], $order->locale),
            __('shop.confirmation_body', $this->vars($order), $order->locale), $order);
    }

    public function shipped(Order $order): void
    {
        if (blank($order->customer_email)) {
            return;
        }

        $this->send($order->customer_email, __('shop.shipped_subject', ['reference' => $order->reference], $order->locale),
            __('shop.shipped_body', $this->vars($order), $order->locale), $order);
    }

    public function notifyAdmin(Order $order): void
    {
        $to = config('shop.orders_mail_to');
        if (blank($to)) {
            return;
        }

        $v = $this->vars($order, 'en');
        $body = "New paid order {$order->reference}\n\n"
            ."Item: {$order->item_title}\nTotal: {$v['total']} (item {$v['item_amount']} + shipping {$v['shipping_amount']}, size {$order->shipping_size}, zone {$order->shipping_zone})\n\n"
            ."Customer: {$v['name']} <{$order->customer_email}>".($order->customer_phone ? ", {$order->customer_phone}" : '')."\n\n"
            ."Ship to:\n{$v['address']}\n\nManage it in the AdReuse admin: Orders.";

        $this->send($to, "New order {$order->reference} – {$order->item_title}", $body, $order, replyTo: $order->customer_email);
    }

    private function send(string $to, string $subject, string $body, Order $order, ?string $replyTo = null): void
    {
        try {
            Mail::raw($body, function ($mail) use ($to, $subject, $replyTo) {
                $mail->to($to)->subject($subject);
                if ($replyTo) {
                    $mail->replyTo($replyTo);
                }
            });
        } catch (Throwable $e) {
            Log::warning('Order email failed', ['order' => $order->reference, 'error' => $e->getMessage()]);
        }
    }

    /**
     * @return array<string, string>
     */
    private function vars(Order $order, ?string $locale = null): array
    {
        $locale ??= $order->locale;
        $seller = config('shop.seller');

        return [
            'name' => $order->customer_name ?: __('shop.not_provided', [], $locale),
            'reference' => $order->reference,
            'item' => $order->item_title,
            'item_amount' => self::money($order->item_amount, $order->currency),
            'shipping_amount' => self::money($order->shipping_amount, $order->currency),
            'total' => self::money($order->total_amount, $order->currency),
            'address' => $this->address($order) ?: __('shop.not_provided', [], $locale),
            'carrier' => $order->carrier ?: __('shop.not_provided', [], $locale),
            'tracking' => $order->tracking_number ?: __('shop.not_provided', [], $locale),
            'returns_url' => config('shop.frontend_url').'/returns',
            'seller' => "AdReuse – {$seller['name']}\nCompany no. {$seller['company_number']}, {$seller['address']}",
        ];
    }

    private function address(Order $order): string
    {
        $a = $order->shipping_address ?? [];

        return collect([
            $a['name'] ?? null,
            $a['line1'] ?? null,
            $a['line2'] ?? null,
            trim(($a['postal_code'] ?? '').' '.($a['city'] ?? '')),
            $a['state'] ?? null,
            $a['country'] ?? null,
        ])->filter()->implode("\n");
    }

    public static function money(int $minor, string $currency): string
    {
        $symbol = ['GBP' => '£', 'EUR' => '€', 'USD' => '$'][strtoupper($currency)] ?? strtoupper($currency).' ';

        return $symbol.number_format($minor / 100, 2);
    }
}
