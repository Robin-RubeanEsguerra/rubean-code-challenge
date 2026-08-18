<?php

namespace App\Models;

use Database\Factories\CustomersFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Customers extends Model
{
    /** @use HasFactory<CustomersFactory> */
    use HasFactory;

    protected $table = 'customers';

    protected $fillable = ['first_name', 'last_name', 'email', 'contact'];
}
