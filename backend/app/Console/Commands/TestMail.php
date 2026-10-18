<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Mail;
use Throwable;

class TestMail extends Command
{
    protected $signature = 'app:test-mail {to : Erre a címre megy a próbalevél}';

    protected $description = 'Próbalevél küldése a beállított levelezővel (pl. Brevo SMTP)';

    public function handle(): int
    {
        $to = $this->argument('to');

        try {
            Mail::raw(
                'Ez egy próbalevél az AdReuse backendből. Ha megérkezett, a levélküldés be van állítva.',
                fn ($mail) => $mail->to($to)->subject('AdReuse próbalevél'),
            );
        } catch (Throwable $e) {
            $this->error('Nem sikerült elküldeni: '.$e->getMessage());
            $this->line('Ellenőrizd a MAIL_* beállításokat a .env-ben.');

            return self::FAILURE;
        }

        $this->info("Elküldve ide: {$to} (küldő: ".config('mail.from.address').', levelező: '.config('mail.default').')');

        return self::SUCCESS;
    }
}
