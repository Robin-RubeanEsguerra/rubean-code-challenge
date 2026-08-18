<?php

namespace Tests\Unit;

use App\Models\Customers;
use App\Services\SearcherService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

class SearcherServiceTest extends TestCase
{
    use RefreshDatabase;

    public function test_it_maps_elasticsearch_hits_to_customer_documents(): void
    {
        Http::fake([
            'searcher:9200/customers/_search' => Http::response([
                'hits' => [
                    'hits' => [
                        [
                            '_source' => [
                                'first_name' => 'Ash',
                                'email' => 'ash@example.com',
                            ],
                        ],
                    ],
                ],
            ], 200),
        ]);

        $results = app(SearcherService::class)->searchCustomers('Ash');

        $this->assertSame('Ash', $results[0]['first_name']);
        $this->assertSame('ash@example.com', $results[0]['email']);
    }

    public function test_it_indexes_a_customer_document_over_http(): void
    {
        Http::fake([
            'searcher:9200/customers/_doc/*' => Http::response([], 201),
        ]);

        $customer = Customers::factory()->create([
            'first_name' => 'Ash',
            'email' => 'ash@example.com',
        ]);

        app(SearcherService::class)->indexCustomer($customer);

        Http::assertSent(function ($request) use ($customer) {
            return $request->method() === 'PUT'
                && str_contains($request->url(), '/customers/_doc/'.$customer->id)
                && $request['first_name'] === 'Ash';
        });
    }
}
