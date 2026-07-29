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
    'field_agent_id',
    'created_by',
    'dispatch_date',
    'remarks',
    'status',
];

     public function county()
    {
        return $this->belongsTo(County::class);
    }

    public function fieldAgent()
    {
        return $this->belongsTo(User::class, 'field_agent_id');
    }

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function items()
    {
        return $this->hasMany(DispatchItem::class);
    }
}
