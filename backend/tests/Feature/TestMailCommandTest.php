<?php

namespace Tests\Feature;

use Illuminate\Support\Facades\Mail;
use Tests\TestCase;

class TestMailCommandTest extends TestCase
{
    public function test_it_sends_a_test_message(): void
    {
        $this->artisan('app:test-mail', ['to' => 'me@example.com'])->assertSuccessful();

        $sent = app('mailer')->getSymfonyTransport()->messages();
        $this->assertCount(1, $sent);
        $this->assertSame('me@example.com', $sent->first()->getEnvelope()->getRecipients()[0]->getAddress());
    }

    public function test_it_reports_failures(): void
    {
        Mail::shouldReceive('raw')->andThrow(new \RuntimeException('auth failed'));

        $this->artisan('app:test-mail', ['to' => 'me@example.com'])
            ->expectsOutputToContain('auth failed')
            ->assertFailed();
    }
}
