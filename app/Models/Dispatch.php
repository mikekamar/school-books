<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\User;
use App\Models\DispatchItem;
use App\Models\County;
use App\Models\subCounty;
use App\Models\Dispatch;
use App\models\DispatchItemBook;

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

    public function fieldAgent()
    {
        return $this->belongsTo(User::class, 'field_agent_id');
    }

    public function subCounty()
    {
        return $this->belongsTo(SubCounty::class);
    }

    public function dispatch()
    {
        return $this->belongsTo(Dispatch::class);
    }

    public function books()
    {
        return $this->hasMany(DispatchItemBook::class);
    }
}
