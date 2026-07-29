<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\SubCounty;
use App\Models\County;
use App\Models\Book;
use App\Models\DispatchItem;
use App\Models\SchoolBook;

class School extends Model
{
    protected $fillable=[
        'sub_county_id',
        'county_id',
        'school_name',
        'uic'
    ];



    public function subCounty()
    {
        return $this->belongsTo(SubCounty::class);
    }

    public function county()
    {
        return $this->belongsTo(County::class);
    }

    public function books()
    {
        return $this->belongsToMany(Book::class, 'school_books')
            ->withPivot('quantity')
            ->withTimestamps();
    }

    public function schoolBooks()
    {
        return $this->hasMany(SchoolBook::class);
    }

    public function dispatchItems()
    {
        return $this->hasMany(DispatchItem::class);
    }
}
