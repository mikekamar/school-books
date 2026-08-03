<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\User;
use App\Models\DispatchItem;
use App\Models\County;

class Dispatch extends Model
{
protected $fillable = [
    'dispatch_number',
    'county_id',
    'driver_id',
    'created_by',
    'dispatch_date',
    'remarks',
    'status',
];

     public function county()
    {
        return $this->belongsTo(County::class);
    }

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function items()
    {
        return $this->hasMany(DispatchItem::class);
    }

   public function driver()
    {
        return $this->belongsTo(User::class, 'driver_id');
    }

    public function assignments()
{
    return $this->hasMany(DispatchAssignment::class);
}
}
