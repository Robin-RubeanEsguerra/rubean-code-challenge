<?php

namespace App\Services;

use App\Models\Customers;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Http;

class SearcherService
{
    public function searchCustomers(string $search): array
    {
        $response = Http::post(
            config('services.searcher.url').'/customers/_search',
            [
                'query' => [
                    'multi_match' => [
                        'query' => $search,
                        'fields' => [
                            'first_name',
                            'last_name',
                            'email',
                        ],
                    ],
                ],
            ]
        );

        $response->throw();

        return collect($response->json('hits.hits', []))
            ->map(fn (array $hit) => $hit['_source'] ?? [])
            ->values()
            ->all();
    }

    public function indexCustomer(Customers $customer): void
    {
        Http::put(
            config('services.searcher.url').'/customers/_doc/'.$customer->id,
            [
                'id' => $customer->id,
                'first_name' => $customer->first_name,
                'last_name' => $customer->last_name,
                'email' => $customer->email,
                'contact' => $customer->contact,
                'created_at' => $customer->created_at,
                'updated_at' => $customer->updated_at,
            ]
        )->throw();
    }

    public function deleteCustomer(int $id): void
    {
        Http::delete(config('services.searcher.url').'/customers/_doc/'.$id);
    }

    public function reindexCustomers(Collection $customers): void
    {
        foreach ($customers as $customer) {
            $this->indexCustomer($customer);
        }
    }
}
