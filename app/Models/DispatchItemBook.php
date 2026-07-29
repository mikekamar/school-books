<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class DispatchItemBook extends Model
{
    use HasFactory;

    protected $fillable = [

        'dispatch_item_id',

        'book_id',

        'allocated_quantity',

        'received_quantity',

        'damaged_quantity',

        'remarks',

    ];

    public function dispatchItem()
    {
        return $this->belongsTo(DispatchItem::class);
    }

    public function book()
    {
        return $this->belongsTo(Book::class);
    }
}