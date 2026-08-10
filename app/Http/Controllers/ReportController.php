<?php

namespace App\Http\Controllers;

use App\Models\DispatchItem;
use App\Models\DispatchItemBook;
use App\Models\School;
use App\Models\County;
use App\Models\SubCounty;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Barryvdh\DomPDF\Facade\Pdf;

class ReportController extends Controller
{
    public function deliverySummary()
{
    /*
    |--------------------------------------------------------------------------
    | School Statistics
    |--------------------------------------------------------------------------
    */

    $totalSchools = School::count();

    $deliveredSchools = DispatchItem::where('status', 'Delivered')
        ->distinct('school_id')
        ->count('school_id');

    $partialSchools = DispatchItem::where('status', 'Partial')
        ->distinct('school_id')
        ->count('school_id');

    $pendingSchools = $totalSchools - $deliveredSchools - $partialSchools;

    $schoolProgress = $totalSchools > 0
        ? round(($deliveredSchools / $totalSchools) * 100, 1)
        : 0;

    /*
    |--------------------------------------------------------------------------
    | Book Statistics
    |--------------------------------------------------------------------------
    */

    $totalAllocatedBooks = DB::table('school_books')
    ->sum('quantity');

    $totalDeliveredBooks = DB::table('dispatch_item_books')
    ->sum('received_quantity');

    $totalMissingBooks = max(
    0,
    $totalAllocatedBooks - $totalDeliveredBooks
    );

    $totalDamagedBooks = DB::table('dispatch_item_books')
    ->sum('damaged_quantity');

    $bookProgress = $totalAllocatedBooks > 0
    ? round(($totalDeliveredBooks / $totalAllocatedBooks) * 100, 1)
    : 0;

    return Inertia::render('Reports/DeliverySummary', [

        'stats' => [

    // School statistics
    'total_schools' => $totalSchools,
    'delivered_schools' => $deliveredSchools,
    'partial_schools' => $partialSchools,
    'pending_schools' => $pendingSchools,
    'school_progress' => $schoolProgress,

    // Book statistics
    'allocated_books' => $totalAllocatedBooks,
    'received_books' => $totalDeliveredBooks,
    'missing_books' => $totalMissingBooks,
    'damaged_books' => $totalDamagedBooks,
    'book_progress' => $bookProgress,

    ],

    ]);
}

public function countyProgress()
{
    $counties = County::with([
        'schools.dispatchItems.books',
    ])
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

        /*
        |--------------------------------------------------------------------------
        | Book quantities
        |--------------------------------------------------------------------------
        */

        $booksAllocated = 0;
        $booksDelivered = 0;

        foreach ($county->schools as $school) {

            foreach ($school->dispatchItems as $dispatchItem) {

                foreach ($dispatchItem->books as $book) {

                    $booksAllocated += (int) $book->allocated_quantity;

                    $booksDelivered += (int) $book->received_quantity;
                }
            }
        }

        $booksPending = max(
            0,
            $booksAllocated - $booksDelivered
        );

        return [
            'id' => $county->id,
            'name' => $county->name,

            // School statistics
            'total' => $total,
            'delivered' => $delivered,
            'pending' => $pending,

            // Book statistics
            'books_allocated' => $booksAllocated,
            'books_delivered' => $booksDelivered,
            'books_pending' => $booksPending,

            // School delivery progress
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
        'subCounties.schools.dispatchItems.books',
    ]);

    $countyTotal = 0;
    $countyDelivered = 0;
    $countyBooksAllocated = 0;
    $countyBooksDelivered = 0;

    $subCounties = $county->subCounties
        ->map(function ($subCounty) use (
            &$countyTotal,
            &$countyDelivered,
            &$countyBooksAllocated,
            &$countyBooksDelivered
        ) {

            $total = $subCounty->schools->count();

            $delivered = $subCounty->schools
                ->filter(function ($school) {
                    return $school->dispatchItems
                        ->contains('status', 'Delivered');
                })
                ->count();

            $pending = $total - $delivered;

            /*
            |--------------------------------------------------------------------------
            | Book quantities
            |--------------------------------------------------------------------------
            */

            $dispatchItems = $subCounty->schools
                ->flatMap(function ($school) {
                    return $school->dispatchItems;
                });

            $books = $dispatchItems
                ->flatMap(function ($dispatchItem) {
                    return $dispatchItem->books;
                });

            $booksAllocated = $books->sum('allocated_quantity');

            $booksDelivered = $books->sum('received_quantity');

            $booksPending = max(
                0,
                $booksAllocated - $booksDelivered
            );

            /*
            |--------------------------------------------------------------------------
            | County totals
            |--------------------------------------------------------------------------
            */

            $countyTotal += $total;
            $countyDelivered += $delivered;

            $countyBooksAllocated += $booksAllocated;
            $countyBooksDelivered += $booksDelivered;

            return [
                'id' => $subCounty->id,
                'name' => $subCounty->name,

                // School statistics
                'total' => $total,
                'delivered' => $delivered,
                'pending' => $pending,

                // Book statistics
                'books_allocated' => $booksAllocated,
                'books_delivered' => $booksDelivered,
                'books_pending' => $booksPending,

                // Progress
                'progress' => $total > 0
                    ? round(($delivered / $total) * 100)
                    : 0,
            ];
        })
        ->sortBy('progress')
        ->values();

    $countyBooksPending = max(
        0,
        $countyBooksAllocated - $countyBooksDelivered
    );

    return Inertia::render('Reports/SubCountyProgress', [
        'county' => [
            'id' => $county->id,
            'name' => $county->name,

            // School statistics
            'total' => $countyTotal,
            'delivered' => $countyDelivered,
            'pending' => $countyTotal - $countyDelivered,

            // Book statistics
            'books_allocated' => $countyBooksAllocated,
            'books_delivered' => $countyBooksDelivered,
            'books_pending' => $countyBooksPending,

            // Progress
            'progress' => $countyTotal
                ? round(($countyDelivered / $countyTotal) * 100)
                : 0,
        ],

        'subCounties' => $subCounties,
    ]);
}

public function subCountyProgressPdf(County $county)
{
    $county->load([
        'subCounties.schools.dispatchItems.books',
    ]);

    $countyTotal = 0;
    $countyDelivered = 0;
    $countyBooksAllocated = 0;
    $countyBooksDelivered = 0;

    $subCounties = $county->subCounties
        ->map(function ($subCounty) use (
            &$countyTotal,
            &$countyDelivered,
            &$countyBooksAllocated,
            &$countyBooksDelivered
        ) {

            $total = $subCounty->schools->count();

            $delivered = $subCounty->schools
                ->filter(function ($school) {
                    return $school->dispatchItems
                        ->contains('status', 'Delivered');
                })
                ->count();

            $pending = $total - $delivered;

            $dispatchItems = $subCounty->schools
                ->flatMap(function ($school) {
                    return $school->dispatchItems;
                });

            $books = $dispatchItems
                ->flatMap(function ($dispatchItem) {
                    return $dispatchItem->books;
                });

            $booksAllocated = $books->sum('allocated_quantity');

            $booksDelivered = $books->sum('received_quantity');

            $booksPending = max(
                0,
                $booksAllocated - $booksDelivered
            );

            $countyTotal += $total;
            $countyDelivered += $delivered;

            $countyBooksAllocated += $booksAllocated;
            $countyBooksDelivered += $booksDelivered;

            return [
                'id' => $subCounty->id,
                'name' => $subCounty->name,

                'total' => $total,
                'delivered' => $delivered,
                'pending' => $pending,

                'books_allocated' => $booksAllocated,
                'books_delivered' => $booksDelivered,
                'books_pending' => $booksPending,

                'progress' => $total > 0
                    ? round(($delivered / $total) * 100)
                    : 0,
            ];
        })
        ->sortBy('progress')
        ->values();

    $countyBooksPending = max(
        0,
        $countyBooksAllocated - $countyBooksDelivered
    );

    $countySummary = [
        'id' => $county->id,
        'name' => $county->name,

        'total' => $countyTotal,
        'delivered' => $countyDelivered,
        'pending' => $countyTotal - $countyDelivered,

        'books_allocated' => $countyBooksAllocated,
        'books_delivered' => $countyBooksDelivered,
        'books_pending' => $countyBooksPending,

        'progress' => $countyTotal
            ? round(($countyDelivered / $countyTotal) * 100)
            : 0,
    ];

    $pdf = Pdf::loadView('pdf.subcounty-progress-pdf', [
        'county' => $countySummary,
        'subCounties' => $subCounties,
    ]);

    $pdf->setPaper('A4', 'portrait');

    return $pdf->stream(
        'subcounty-progress-' . $county->name . '.pdf'
    );
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