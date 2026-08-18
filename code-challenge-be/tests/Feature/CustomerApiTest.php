<?php

namespace Tests\Feature;

use App\Models\Customers;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

class CustomerApiTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        Http::fake([
            'searcher:9200/customers/_doc/*' => Http::response([], 200),
            'searcher:9200/customers/_search' => Http::response([
                'hits' => [
                    'hits' => [
                        [
                            '_source' => [
                                'id' => 1,
                                'first_name' => 'Ash',
                                'last_name' => 'Ketchum',
                                'email' => 'ash@example.com',
                                'contact' => '09123456789',
                            ],
                        ],
                    ],
                ],
            ], 200),
        ]);
    }

    public function test_it_lists_customers(): void
    {
        Customers::factory()->create([
            'first_name' => 'Misty',
            'email' => 'misty@example.com',
        ]);

        $this->getJson('/api/customers')
            ->assertOk()
            ->assertJsonFragment(['first_name' => 'Misty']);
    }

    public function test_it_searches_customers_by_name_and_email(): void
    {
        $this->getJson('/api/customers?search=Ash')
            ->assertOk()
            ->assertJsonFragment([
                'first_name' => 'Ash',
                'email' => 'ash@example.com',
            ]);
    }

    public function test_it_creates_a_customer_and_syncs_to_searcher(): void
    {
        $payload = [
            'first_name' => 'Brock',
            'last_name' => 'Harrison',
            'email' => 'brock@example.com',
            'contact' => '09998887777',
        ];

        $this->postJson('/api/customers', $payload)
            ->assertCreated()
            ->assertJsonFragment(['email' => 'brock@example.com']);

        $this->assertDatabaseHas('customers', ['email' => 'brock@example.com']);

        Http::assertSent(function ($request) use ($payload) {
            return $request->method() === 'PUT'
                && str_contains($request->url(), '/customers/_doc/')
                && $request['email'] === $payload['email'];
        });
    }

    public function test_it_updates_a_customer_and_syncs_to_searcher(): void
    {
        $customer = Customers::factory()->create([
            'first_name' => 'Gary',
            'email' => 'gary@example.com',
        ]);

        $this->putJson('/api/customers/'.$customer->id, [
            'first_name' => 'Ash',
            'last_name' => $customer->last_name,
            'email' => $customer->email,
            'contact' => $customer->contact,
        ])->assertOk();

        Http::assertSent(function ($request) use ($customer) {
            return $request->method() === 'PUT'
                && str_contains($request->url(), '/customers/_doc/'.$customer->id)
                && $request['first_name'] === 'Ash';
        });
    }
}
