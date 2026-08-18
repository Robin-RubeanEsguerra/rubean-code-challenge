<?php

namespace App\Http\Controllers;

use App\Models\Customers;
use App\Services\SearcherService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;

class CustomersController extends Controller
{
    protected SearcherService $searcher;

    public function __construct(SearcherService $searcher)
    {
        $this->searcher = $searcher;
    }

    /** get all customers */
    public function index(Request $request)
    {
        $search = $request->query('search');

        if ($search) {
            return response()->json($this->searcher->searchCustomers($search));
        }

        $customers = Customers::orderBy('id', 'desc')->get();

        return response()->json($customers);
    }

    // create customer
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'first_name' => 'required',
            'last_name' => 'required',
            'email' => 'required|email|unique:customers,email',
        ], [
            'email.required' => 'The :attribute field is required.',
            'email.email' => 'The :attribute must be a valid email address.',
            'email.unique' => 'This email is already registered.',
            'first_name.required' => 'The :attribute field is required.',
            'last_name.required' => 'The :attribute field is required.',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'errors' => $validator->errors(),
            ], 422);
        }

        $customer = Customers::create($request->all());
        $this->searcher->indexCustomer($customer);

        return response()->json($customer, 201);
    }

    // update customer
    public function update(Request $request, $id)
    {
        $customer = Customers::find($id);

        if (is_null($customer)) {
            return response()->json(['message' => 'Customer not found'], 404);
        }

        $validator = Validator::make($request->all(), [
            'first_name' => 'required',
            'last_name' => 'required',
            'email' => [
                'required',
                'email',
                Rule::unique('customers', 'email')->ignore($customer->id),
            ],

        ], [
            'email.required' => 'The :attribute field is required.',
            'email.email' => 'The :attribute must be a valid email address.',
            'email.unique' => 'This email is already registered.',
            'first_name.required' => 'The :attribute field is required.',
            'last_name.required' => 'The :attribute field is required.',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'errors' => $validator->errors(),
            ], 422);
        }

        $customer->update($request->all());
        $this->searcher->indexCustomer($customer);

        return response()->json($customer);
    }

    // delete customer
    public function destroy($id)
    {
        $customer = Customers::find($id);

        if (is_null($customer)) {
            return response()->json(['message' => 'Customer not found'], 404);
        }

        $customer->delete();
        $this->searcher->deleteCustomer((int) $id);

        return response()->json(['message' => 'Customer deleted successfully'], 200);
    }
    
    public function getOneCustomer($id)
    {   
        $customer = Customers::find($id);

        if (is_null($customer)) {
            return response()->json(['message' => 'Customer not found'], 404);
        }

        return response()->json($customer);
    }
}
