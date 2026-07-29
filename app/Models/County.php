<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\SubCounty;
use App\Models\Dispatch;
use App\Models\School;

class County extends Model
{
   protected $fillable=[
        'name'
    ];

    public function schools()
    {
        return $this->hasMany(School::class);
    }

    public function subCounties()
    {
        return $this->hasMany(SubCounty::class);
    }

    public function dispatches()
{
    return $this->hasMany(Dispatch::class);
}
}
