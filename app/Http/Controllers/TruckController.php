<?php

namespace App\Http\Controllers;

use App\Models\Truck;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TruckController extends Controller
{
    /**
     * Display a listing of trucks.
     */
    public function index()
    {
        $trucks = Truck::withCount('dispatches')
            ->latest()
            ->get();

        return Inertia::render('Trucks/Index', [
            'trucks' => $trucks,
        ]);
    }

    /**
     * Show the form for creating a new truck.
     */
    public function create()
    {
        return Inertia::render('Trucks/Create');
    }

    /**
     * Store a newly created truck.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'registration_number' => [
                'required',
                'string',
                'max:50',
                'unique:trucks,registration_number',
            ],

            'make' => [
                'nullable',
                'string',
                'max:100',
            ],

            'model' => [
                'nullable',
                'string',
                'max:100',
            ],

            'capacity' => [
                'nullable',
                'integer',
                'min:1',
            ],

            'status' => [
                'required',
                'in:available,assigned,maintenance,inactive',
            ],

            'remarks' => [
                'nullable',
                'string',
            ],
        ]);

        Truck::create($validated);

        return redirect()
            ->route('trucks.index')
            ->with('success', 'Truck registered successfully.');
    }

    /**
     * Display the specified truck.
     */
    public function show(Truck $truck)
    {
        $truck->load([
            'dispatches' => function ($query) {
                $query->with([
                    'county',
                    'fieldAgent',
                ])->latest();
            },
        ]);

        return Inertia::render('Trucks/Show', [
            'truck' => $truck,
        ]);
    }

    /**
     * Show the form for editing the truck.
     */
    public function edit(Truck $truck)
    {
        return Inertia::render('Trucks/Edit', [
            'truck' => $truck,
        ]);
    }

    /**
     * Update the truck.
     */
    public function update(Request $request, Truck $truck)
    {
        $validated = $request->validate([
            'registration_number' => [
                'required',
                'string',
                'max:50',
                'unique:trucks,registration_number,' . $truck->id,
            ],

            'make' => [
                'nullable',
                'string',
                'max:100',
            ],

            'model' => [
                'nullable',
                'string',
                'max:100',
            ],

            'capacity' => [
                'nullable',
                'integer',
                'min:1',
            ],

            'status' => [
                'required',
                'in:available,assigned,maintenance,inactive',
            ],

            'remarks' => [
                'nullable',
                'string',
            ],
        ]);

        $truck->update($validated);

        return redirect()
            ->route('trucks.index')
            ->with('success', 'Truck updated successfully.');
    }

    /**
     * Remove the specified truck.
     */
    public function destroy(Truck $truck)
    {
        if ($truck->hasActiveDispatch()) {
            return back()->with(
                'error',
                'This truck cannot be deleted because it has an active dispatch.'
            );
        }

        $truck->delete();

        return redirect()
            ->route('trucks.index')
            ->with('success', 'Truck deleted successfully.');
    }

    /**
     * Change truck status.
     */
    public function updateStatus(Request $request, Truck $truck)
    {
        $validated = $request->validate([
            'status' => [
                'required',
                'in:available,assigned,maintenance,inactive',
            ],
        ]);

        if (
            $validated['status'] === 'maintenance' &&
            $truck->hasActiveDispatch()
        ) {
            return back()->with(
                'error',
                'This truck has an active dispatch and cannot be placed under maintenance.'
            );
        }

        $truck->update([
            'status' => $validated['status'],
        ]);

        return back()->with(
            'success',
            'Truck status updated successfully.'
        );
    }
}