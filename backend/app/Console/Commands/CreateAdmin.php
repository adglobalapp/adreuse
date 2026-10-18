<?php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Command;
use Illuminate\Support\Str;

class CreateAdmin extends Command
{
    protected $signature = 'app:create-admin {email : Az admin e-mail címe} {--name=Admin : Megjelenített név}';

    protected $description = 'Admin fiók létrehozása (zárt regisztráció mellett ezzel jön létre az első admin)';

    public function handle(): int
    {
        $email = (string) $this->argument('email');

        if (! filter_var($email, FILTER_VALIDATE_EMAIL)) {
            $this->error('Érvénytelen e-mail cím.');

            return self::FAILURE;
        }

        if (User::where('email', $email)->exists()) {
            $this->error('Ezzel a címmel már van fiók. Admin joghoz: php artisan app:make-admin '.$email);

            return self::FAILURE;
        }

        // Véletlen jelszó, csak egyszer jelenik meg: belépés után érdemes megváltoztatni.
        $password = Str::password(20, symbols: false);

        $user = User::create(['name' => $this->option('name'), 'email' => $email, 'password' => $password]);
        $user->forceFill(['is_admin' => true])->save();

        $this->info("Admin létrehozva: {$email}");
        $this->line("Ideiglenes jelszó (csak most látszik, mentsd el biztonságos helyre): {$password}");

        return self::SUCCESS;
    }
}
