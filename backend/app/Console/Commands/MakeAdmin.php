<?php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Command;

class MakeAdmin extends Command
{
    protected $signature = 'app:make-admin {email : A felhasználó e-mail címe} {--revoke : Admin jog elvétele}';

    protected $description = 'Admin jog adása (vagy elvétele) egy regisztrált felhasználónak';

    public function handle(): int
    {
        $user = User::where('email', $this->argument('email'))->first();

        if (! $user) {
            $this->error('Nincs ilyen e-mail címmel regisztrált felhasználó.');

            return self::FAILURE;
        }

        $user->forceFill(['is_admin' => ! $this->option('revoke')])->save();

        $this->info($user->is_admin ? "{$user->email} mostantól admin." : "{$user->email} már nem admin.");

        return self::SUCCESS;
    }
}
