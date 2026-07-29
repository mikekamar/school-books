<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\County;
use App\Models\School;

class SubCounty extends Model
{
    protected $fillable=[
        'county_id',
        'name'
    ];


    public function county()
    {
        return $this->belongsTo(County::class);
    }



    public function schools()
    {
        return $this->hasMany(School::class);
    }
}
