<?php

namespace App\Http\Controllers;

use App\Models\DispatchItem;
use App\Models\School;
use App\Models\County;
use App\Models\SubCounty;
use Inertia\Inertia;

class ReportController extends Controller
{
    public function deliverySummary()
{
    $totalSchools = School::count();

    $delivered = DispatchItem::where('status', 'Delivered')
        ->distinct('school_id')
        ->count('school_id');

    $pending = $totalSchools - $delivered;

    $progress = $totalSchools > 0
        ? round(($delivered / $totalSchools) * 100, 1)
        : 0;

    return Inertia::render('Reports/DeliverySummary', [
        'stats' => [
            'total' => $totalSchools,
            'delivered' => $delivered,
            'pending' => $pending,
            'progress' => $progress,
        ],
    ]);
}



public function countyProgress()
{
    $counties = County::with(['schools.dispatchItems'])
        ->get()
        ->map(function ($county) {

            $total = $county->schools->count();

            $delivered = $county->schools
                ->filter(function ($school) {
                    return $school->dispatchItems
                        ->contains('status', 'Delivered');
                })
                ->count();

            $pending = $total - $delivered;

            return [
                'id' => $county->id,
                'name' => $county->name,
                'total' => $total,
                'delivered' => $delivered,
                'pending' => $pending,
                'progress' => $total
                    ? round(($delivered / $total) * 100)
                    : 0,
            ];
        })
        ->sortByDesc('progress')
        ->values();

    return Inertia::render('Reports/CountyProgress', [
        'counties' => $counties,
    ]);
}

public function subCountyProgress(County $county)
{
    $county->load([
        'subCounties.schools.dispatchItems'
    ]);

    $countyTotal = 0;
    $countyDelivered = 0;

    $subCounties = $county->subCounties
    ->map(function ($subCounty) use (&$countyTotal, &$countyDelivered) {

        $total = $subCounty->schools->count();

        $delivered = $subCounty->schools
            ->filter(function ($school) {
                return $school->dispatchItems
                    ->contains('status', 'Delivered');
            })
            ->count();

        $pending = $total - $delivered;

        $countyTotal += $total;
        $countyDelivered += $delivered;

        return [
            'id' => $subCounty->id,
            'name' => $subCounty->name,
            'total' => $total,
            'delivered' => $delivered,
            'pending' => $pending,
            'progress' => $total > 0
                ? round(($delivered / $total) * 100)
                : 0,
        ];
    })
    ->sortBy('progress')
    ->values();

    return Inertia::render('Reports/SubCountyProgress', [
        'county' => [
            'id' => $county->id,
            'name' => $county->name,
            'total' => $countyTotal,
            'delivered' => $countyDelivered,
            'pending' => $countyTotal - $countyDelivered,
            'progress' => $countyTotal
                ? round(($countyDelivered / $countyTotal) * 100)
                : 0,
        ],
        'subCounties' => $subCounties,
    ]);
}

public function schools(SubCounty $subCounty)
{
    $subCounty->load([
        'county',
        'schools.dispatchItems.dispatch.fieldAgent'
    ]);

    $schools = $subCounty->schools->map(function ($school) {

        $dispatchItem = $school->dispatchItems->sortByDesc('id')->first();

        return [
            'id' => $school->id,
            'uic' => $school->uic,
            'school_name' => $school->school_name,
            'status' => $dispatchItem?->status ?? 'Not Dispatched',
            'dispatch_number' => $dispatchItem?->dispatch?->dispatch_number,
            'field_agent' => $dispatchItem?->dispatch?->fieldAgent?->name,
            'delivered_at' => $dispatchItem?->delivered_at,
        ];
    });

    return Inertia::render('Reports/Schools', [
        'county' => $subCounty->county,
        'subCounty' => $subCounty,
        'schools' => $schools,
    ]);
}

public function school(School $school)
{
    $school->load([
        'county',
        'subCounty',
        'dispatchItems.dispatch.fieldAgent',
        'schoolBooks.book',
    ]);

    $dispatchItem = $school->dispatchItems
        ->sortByDesc('id')
        ->first();

    return Inertia::render('Reports/SchoolDetails', [

        'school' => [

            /*
            |--------------------------------------------------------------------------
            | School Profile
            |--------------------------------------------------------------------------
            */

            'profile' => [

                'id' => $school->id,

                'uic' => $school->uic,

                'name' => $school->school_name,

                'emis' => $school->emis ?? null,

                'level' => $school->level ?? null,

                'category' => $school->category ?? null,

            ],

            /*
            |--------------------------------------------------------------------------
            | Location
            |--------------------------------------------------------------------------
            */

            'location' => [

                'county' => [

                    'id' => $school->county?->id,

                    'name' => $school->county?->name,

                ],

                'sub_county' => [

                    'id' => $school->subCounty?->id,

                    'name' => $school->subCounty?->name,

                ],

            ],

            /*
            |--------------------------------------------------------------------------
            | Latest Dispatch
            |--------------------------------------------------------------------------
            */

            'dispatch' => [

                'id' => $dispatchItem?->dispatch?->id,

                'number' => $dispatchItem?->dispatch?->dispatch_number,

                'status' => $dispatchItem?->status ?? 'Not Dispatched',

                'dispatch_date' => $dispatchItem?->dispatch?->dispatch_date,

                'delivered_at' => $dispatchItem?->delivered_at,

                'remarks' => $dispatchItem?->remarks,

                'field_agent' => [

                    'id' => $dispatchItem?->dispatch?->fieldAgent?->id,

                    'name' => $dispatchItem?->dispatch?->fieldAgent?->name,

                ],

            ],

            /*
            |--------------------------------------------------------------------------
            | Receiver
            |--------------------------------------------------------------------------
            */

            'receiver' => [

                'name' => $dispatchItem?->receiver_name,

                'phone' => $dispatchItem?->receiver_phone,

                'id_number' => $dispatchItem?->receiver_id,

                'designation' => $dispatchItem?->receiver_designation,

            ],

            /*
            |--------------------------------------------------------------------------
            | Statistics
            |--------------------------------------------------------------------------
            */

            'statistics' => [

                'allocated_books' => $school->schoolBooks
                    ->sum('quantity'),

                'titles_allocated' => $school->schoolBooks
                    ->count(),

                'titles_received' => null,

                'variance' => null,

            ],

            /*
            |--------------------------------------------------------------------------
            | Books
            |--------------------------------------------------------------------------
            */

            'books' => $school->schoolBooks->map(function ($book) use ($dispatchItem) {

                $allocated = $book->quantity;

                $received = $dispatchItem?->status === 'Delivered'
                    ? $allocated
                    : 0;

                return [

                    'id' => $book->book->id,

                    'title' => $book->book->name,

                    'publisher' => $book->book->publisher?->name,

                    'allocated' => $allocated,

                    'received' => $received,

                    'variance' => $allocated - $received,

                ];

        }),

            /*
            |--------------------------------------------------------------------------
            | Timeline
            |--------------------------------------------------------------------------
            */

            'timeline' => [

                [
                    'title' => 'Dispatch Created',

                    'date' => $dispatchItem?->dispatch?->created_at,

                    'completed' => true,
                ],

                [
                    'title' => 'Assigned to Field Agent',

                    'date' => $dispatchItem?->dispatch?->dispatch_date,

                    'completed' => $dispatchItem != null,
                ],

                [
                    'title' => 'Delivered',

                    'date' => $dispatchItem?->delivered_at,

                    'completed' => $dispatchItem?->status === 'Delivered',
                ],

            ],

            /*
            |--------------------------------------------------------------------------
            | History
            |--------------------------------------------------------------------------
            */

            'history' => $school->dispatchItems

                ->sortByDesc('created_at')

                ->map(function ($item) {

                    return [

                        'dispatch_number' => $item->dispatch?->dispatch_number,

                        'status' => $item->status,

                        'field_agent' => $item->dispatch?->fieldAgent?->name,

                        'dispatch_date' => $item->dispatch?->dispatch_date,

                        'delivered_at' => $item->delivered_at,

                    ];

                })->values(),

        ],

    ]);
}

    public function outstandingSchools()
    {
        //
    }
}