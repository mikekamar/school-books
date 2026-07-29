<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SchoolBook extends Model
{
    protected $fillable = [
        'school_id',
        'book_id',
        'quantity',
    ];

    public function school()
    {
        return $this->belongsTo(School::class);
    }

    public function book()
    {
        return $this->belongsTo(Book::class);
    }
}