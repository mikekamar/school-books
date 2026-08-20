<?php

namespace App\Http\Controllers;

use App\Models\Driver;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DriverController extends Controller
{
    /**
     * Display all drivers.
     */
    public function index()
    {
        $drivers = Driver::withCount('dispatches')
            ->latest()
            ->get();

        return Inertia::render('Drivers/Index', [
            'drivers' => $drivers,
        ]);
    }

    /**
     * Show create driver form.
     */
    public function create()
    {
        return Inertia::render('Drivers/Create');
    }

    /**
     * Store driver.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => [
                'required',
                'string',
                'max:255',
            ],

            'phone' => [
                'nullable',
                'string',
                'max:30',
            ],

            'license_number' => [
                'required',
                'string',
                'max:100',
                'unique:drivers,license_number',
            ],

            'license_expiry' => [
                'nullable',
                'date',
            ],

            'status' => [
                'required',
                'in:available,assigned,inactive',
            ],

            'remarks' => [
                'nullable',
                'string',
            ],
        ]);

        Driver::create($validated);

        return redirect()
            ->route('drivers.index')
            ->with('success', 'Driver registered successfully.');
    }

    /**
     * Display driver details.
     */
    public function show(Driver $driver)
    {
        $driver->load([
            'dispatches' => function ($query) {
                $query->with([
                    'county',
                    'truck',
                    'fieldAgent',
                ])->latest();
            },
        ]);

        return Inertia::render('Drivers/Show', [
            'driver' => $driver,
        ]);
    }

    /**
     * Show edit form.
     */
    public function edit(Driver $driver)
    {
        return Inertia::render('Drivers/Edit', [
            'driver' => $driver,
        ]);
    }

    /**
     * Update driver.
     */
    public function update(Request $request, Driver $driver)
    {
        $validated = $request->validate([
            'name' => [
                'required',
                'string',
                'max:255',
            ],

            'phone' => [
                'nullable',
                'string',
                'max:30',
            ],

            'license_number' => [
                'required',
                'string',
                'max:100',
                'unique:drivers,license_number,' . $driver->id,
            ],

            'license_expiry' => [
                'nullable',
                'date',
            ],

            'status' => [
                'required',
                'in:available,assigned,inactive',
            ],

            'remarks' => [
                'nullable',
                'string',
            ],
        ]);

        $driver->update($validated);

        return redirect()
            ->route('drivers.index')
            ->with('success', 'Driver updated successfully.');
    }

    /**
     * Delete driver.
     */
    public function destroy(Driver $driver)
    {
        if ($driver->hasActiveDispatch()) {
            return back()->with(
                'error',
                'This driver cannot be deleted because they have an active dispatch.'
            );
        }

        $driver->delete();

        return redirect()
            ->route('drivers.index')
            ->with('success', 'Driver deleted successfully.');
    }

    /**
     * Update driver status.
     */
    public function updateStatus(Request $request, Driver $driver)
    {
        $validated = $request->validate([
            'status' => [
                'required',
                'in:available,assigned,inactive',
            ],
        ]);

        if (
            $validated['status'] === 'inactive' &&
            $driver->hasActiveDispatch()
        ) {
            return back()->with(
                'error',
                'This driver has an active dispatch and cannot be deactivated.'
            );
        }

        $driver->update([
            'status' => $validated['status'],
        ]);

        return back()->with(
            'success',
            'Driver status updated successfully.'
        );
    }
}