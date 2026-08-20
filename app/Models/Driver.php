<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Driver extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'phone',
        'license_number',
        'license_expiry',
        'status',
        'remarks',
    ];

    protected $casts = [
        'license_expiry' => 'date',
    ];

    /**
     * Dispatches assigned to this driver.
     */
    public function dispatches(): HasMany
    {
        return $this->hasMany(Dispatch::class);
    }

    /**
     * Determine whether the driver currently has an active dispatch.
     */
    public function hasActiveDispatch(): bool
    {
        return $this->dispatches()
            ->whereIn('status', [
                'assigned',
                'dispatched',
                'in_transit',
            ])
            ->exists();
    }

    /**
     * Determine whether the driver's licence has expired.
     */
    public function licenseExpired(): bool
    {
        return $this->license_expiry
            ? $this->license_expiry->isPast()
            : false;
    }
}