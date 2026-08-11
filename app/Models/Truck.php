<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Truck extends Model
{
    //
}
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Truck extends Model
{
    protected $fillable = [
        'registration_number',
        'make',
        'model',
        'capacity',
        'status',
        'remarks',
    ];

    public function dispatches()
    {
        return $this->hasMany(Dispatch::class);
    }

    public function activeDispatch()
    {
        return $this->hasOne(Dispatch::class)
            ->whereIn('status', ['Pending', 'In Transit']);
    }
}