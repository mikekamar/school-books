<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DispatchAssignment extends Model
{
    protected $fillable = [
        'dispatch_id',
        'sub_county_id',
        'field_agent_id',
        'assigned_by',
    ];

    public function dispatch()
    {
        return $this->belongsTo(Dispatch::class);
    }

    public function subCounty()
    {
        return $this->belongsTo(SubCounty::class);
    }

    public function fieldAgent()
    {
        return $this->belongsTo(User::class, 'field_agent_id');
    }

    public function assignedBy()
    {
        return $this->belongsTo(User::class, 'assigned_by');
    }
}
