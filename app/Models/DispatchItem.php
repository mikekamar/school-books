<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DispatchItem extends Model
{
    use HasFactory;

    protected $fillable = [
    'dispatch_id',
    'school_id',
    'assigned_to',
    'assigned_by',
    'assigned_at',
    'status',
    'delivered_at',
    'remarks',
    'receiver_name',
    'receiver_phone',
];

    protected $casts = [
        'delivered_at' => 'datetime',
    ];

    public function assignee()
    {
        return $this->belongsTo(User::class, 'assigned_to');
    }

    public function assigner()
    {
        return $this->belongsTo(User::class, 'assigned_by');
    }

    public function dispatch()
    {
        return $this->belongsTo(Dispatch::class);
    }

    public function school()
    {
        return $this->belongsTo(School::class);
    }

    public function books()
{
    return $this->hasMany(DispatchItemBook::class);
}
}