<?php

namespace App\Support;

use Illuminate\Http\Request;

class ClientIp
{
    /**
     * A látogató valódi IP-címe. Élesben a forgalom Cloudflare → Tunnel → NPM → konténer
     * úton jön, ezért a Cloudflare által beállított CF-Connecting-IP a megbízható forrás
     * (a kliens által küldött X-Forwarded-For hamisítható). Ha nincs ilyen fejléc, a szokásos IP.
     */
    public static function of(Request $request): string
    {
        $cf = $request->header('CF-Connecting-IP');

        return $cf && filter_var($cf, FILTER_VALIDATE_IP) ? $cf : (string) $request->ip();
    }
}
