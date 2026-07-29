<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\School;
use App\Models\SchoolBook;

class Book extends Model
{
    protected $fillable = [
        'name'
    ];


    public function schools()
    {
        return $this->belongsToMany(School::class, 'school_books')
            ->withPivot('quantity')
            ->withTimestamps();
    }

    public function schoolBooks()
{
    return $this->hasMany(SchoolBook::class);
}

public function dispatchItems()
{
    return $this->hasMany(DispatchItemBook::class);
}

}
