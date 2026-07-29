<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\User;

class Import extends Model
{
   protected $fillable = [
        'file_name',
        'status',
        'total_rows',
        'processed_rows',
        'user_id',
        'error_message'
    ];


    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
