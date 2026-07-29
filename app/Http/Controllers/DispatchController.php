<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\Dispatch;
use App\Models\DispatchItem;
use App\Models\County;
use App\Models\School;
use App\Models\User;
use App\Models\SubCounty;
use Inertia\Inertia;
use App\Models\SchoolBook;
use App\Models\DispatchItemBook;

class DispatchController extends Controller
{
    public function index()
    {

         if (auth()->user()->hasRole('Field Agent')) {
        return redirect()->route('dispatches.mine');
    }

    $dispatches = Dispatch::with([
        'county',
        'fieldAgent',
    ])
    ->withCount('items')
    ->latest()
    ->paginate(10)
    ->through(function ($dispatch) {

        $delivered = $dispatch->items()
            ->where('status', 'Delivered')
            ->count();

        return [
            'id' => $dispatch->id,
            'dispatch_number' => $dispatch->dispatch_number,
            'county' => $dispatch->county->name,
            'field_agent' => $dispatch->fieldAgent->name,
            'dispatch_date' => $dispatch->dispatch_date,
            'status' => $dispatch->status,
            'schools' => $dispatch->items_count,
            'delivered' => $delivered,
        ];
    });

    return Inertia::render('Dispatches/Index', [
        'dispatches' => $dispatches,

        'stats' => [
            'total' => Dispatch::count(),
            'pending' => Dispatch::where('status', 'Pending')->count(),
            'progress' => Dispatch::where('status', 'In Progress')->count(),
            'completed' => Dispatch::where('status', 'Completed')->count(),
        ],
    ]);
}

    public function create()
{
    return Inertia::render('Dispatches/Create', [

        'counties' => County::withCount('schools')
            ->orderBy('name')
            ->get(),

        'fieldAgents' => User::role('field agent')
            ->orderBy('name')
            ->get(),

    ]);
}

    public function store(Request $request)
{
    $validated = $request->validate([
        'county_id' => ['required', 'exists:counties,id'],
        'field_agent_id' => ['required', 'exists:users,id'],
        'dispatch_date' => ['required', 'date'],
        'remarks' => ['nullable', 'string'],
    ]);

    DB::transaction(function () use ($validated) {

        $dispatch = Dispatch::create([
            'dispatch_number' => $this->generateDispatchNumber(),
            'county_id' => $validated['county_id'],
            'field_agent_id' => $validated['field_agent_id'],
            'created_by' => auth()->id(),
            'dispatch_date' => $validated['dispatch_date'],
            'remarks' => $validated['remarks'] ?? null,
            'status' => 'Pending',
        ]);

        $schools = School::where('county_id', $validated['county_id'])->get();

        foreach ($schools as $school) {

           $dispatchItem = $dispatch->items()->create([
                'school_id' => $school->id,
                'assigned_to' => $validated['field_agent_id'],
                'assigned_by' => auth()->id(),
                'assigned_at' => now(),
                'status' => 'Pending',
            ]);

            // Get all allocated books for this school
    $schoolBooks = SchoolBook::where('school_id', $school->id)->get();

    foreach ($schoolBooks as $schoolBook) {

        DispatchItemBook::create([

            'dispatch_item_id'   => $dispatchItem->id,

            'book_id'            => $schoolBook->book_id,

            'allocated_quantity' => $schoolBook->quantity,

            'received_quantity'  => 0,

            'damaged_quantity'   => 0,

            'remarks'            => null,

        ]);

    }

        }

    });

    return redirect()
        ->route('dispatches.index')
        ->with('success', 'Dispatch created successfully.');
}

public function show(Dispatch $dispatch)
{
    // Only the assigned county field agent can view the dispatch
    $isCountyAgent = $dispatch->field_agent_id == auth()->id();

    $isAssignedAgent = $dispatch->items()
        ->where('assigned_to', auth()->id())
        ->exists();

    if (
        auth()->user()->hasRole('Field Agent') &&
        !$isCountyAgent &&
        !$isAssignedAgent
    ) {
        abort(403, 'Unauthorized.');
    }

    $dispatch->load([
        'county',
        'fieldAgent',
        'creator',
        'items.school.subCounty',
        'items.assignee',
    ]);

    if ($isCountyAgent) {

    $items = $dispatch->items;

} else {

    $items = $dispatch->items
        ->where('assigned_to', auth()->id())
        ->values();

}

    $totalSchools = $items->count();

    $delivered = $items
        ->where('status', 'Delivered')
        ->count();

    $partial = $items
        ->where('status', 'Partial')
        ->count();

    $pending = $items
        ->where('status', 'Pending')
        ->count();

    $progress = $totalSchools > 0
        ? round(($delivered / $totalSchools) * 100)
        : 0;

    $fieldAgents = User::role('field agent')
        ->orderBy('name')
        ->get(['id', 'name']);

    $subCounties = $items
        ->pluck('school.subCounty')
        ->filter()
        ->unique('id')
        ->values();

    return Inertia::render('Dispatches/Show', [

        'dispatch' => [

            'id' => $dispatch->id,
            'dispatch_number' => $dispatch->dispatch_number,
            'dispatch_date' => $dispatch->dispatch_date,
            'status' => $dispatch->status,
            'remarks' => $dispatch->remarks,

            'county' => [
                'id' => $dispatch->county->id,
                'name' => $dispatch->county->name,
            ],

            'field_agent' => [
                'id' => $dispatch->fieldAgent->id,
                'name' => $dispatch->fieldAgent->name,
            ],

            'creator' => [
                'id' => $dispatch->creator->id,
                'name' => $dispatch->creator->name,
            ],

            'items' => $items->map(function ($item) {

                return [

                    'id' => $item->id,

                    'status' => $item->status,
                    'delivered_at' => $item->delivered_at,
                    'remarks' => $item->remarks,

                    'receiver_name' => $item->receiver_name,
                    'receiver_phone' => $item->receiver_phone,

                    'assigned_to' => $item->assigned_to,
                    'assigned_by' => $item->assigned_by,
                    'assigned_at' => $item->assigned_at,

                    'assignee' => $item->assignee
                        ? [
                            'id' => $item->assignee->id,
                            'name' => $item->assignee->name,
                        ]
                        : null,

                    'school' => [
                        'id' => $item->school->id,
                        'school_name' => $item->school->school_name,
                        'uic' => $item->school->uic,
                        'sub_county' => $item->school->subCounty?->name,
                        'sub_county_id' => $item->school->sub_county_id,
                    ],
                    

                ];
            })->values(),

        ],

        'fieldAgents' => $fieldAgents,
        'subCounties' => $subCounties,

        'stats' => [

        'total' => $totalSchools,

        'delivered' => $delivered,

        'partial' => $partial,

        'pending' => $pending,

        'progress' => $totalSchools > 0
            ? round(($delivered / $totalSchools) * 100)
            : 0,

    ],

    ]);
}

public function edit(Dispatch $dispatch)
{
    if ($dispatch->status != 'Pending') {

        return back()->with(
            'error',
            'Only pending dispatches can be edited.'
        );

    }

    return Inertia::render('Dispatches/Edit', [

        'dispatch' => $dispatch,

        'counties' => County::orderBy('name')->get(),

        'fieldAgents' => User::role('field agent')->get(),

    ]);
}

public function update(Request $request, Dispatch $dispatch)
{
    if ($dispatch->status !== 'Pending') {

        return back()->with(
            'error',
            'Cannot edit this dispatch.'
        );

    }

    $validated = $request->validate([

        'field_agent_id' => 'required|exists:users,id',

        'dispatch_date' => 'required|date',

        'remarks' => 'nullable|string',

    ]);

    $dispatch->update($validated);

    return redirect()
        ->route('dispatches.index')
        ->with('success', 'Dispatch updated.');
}

private function generateDispatchNumber(): string
{
    $year = now()->year;

    $lastDispatch = Dispatch::whereYear('created_at', $year)
        ->latest('id')
        ->first();

    $nextNumber = 1;

    if ($lastDispatch) {
        $lastSequence = (int) substr($lastDispatch->dispatch_number, -5);
        $nextNumber = $lastSequence + 1;
    }

    return sprintf('DSP-%d-%05d', $year, $nextNumber);
}

public function myDispatches()
{
    $dispatches = Dispatch::where(function ($query) {

        // Original county dispatch
        $query->where('field_agent_id', auth()->id());

    })
    ->orWhereHas('items', function ($query) {

        // Delegated schools
        $query->where('assigned_to', auth()->id());

    })
    ->with('county', 'items.school.subCounty', 'items.assignee')
    ->latest()
    ->get()
    ->unique('id')
    ->values();

    return Inertia::render('Dispatches/MyDispatches', [
        'dispatches' => $dispatches->map(function ($dispatch) {
$isCountyAgent = $dispatch->field_agent_id == auth()->id();

    // County agent sees all subcounties
    if ($isCountyAgent) {

        $assignedSubCounties = $dispatch->items
            ->groupBy(function ($item) {
                return $item->school->subCounty?->id;
            })
            ->map(function ($items) {

                $first = $items->first();

                return [

                    'id' => $first->school->subCounty->id,

                    'name' => $first->school->subCounty->name,

                    'schools' => $items->count(),

                    'assigned_to' => $first->assignee
                        ? $first->assignee->name
                        : 'Not Assigned',

                ];

            })
            ->values();

    } else {

        // Delegated field agent only sees their own assigned subcounties
        $assignedSubCounties = $dispatch->items
            ->where('assigned_to', auth()->id())
            ->groupBy(function ($item) {
                return $item->school->subCounty?->id;
            })
            ->map(function ($items) {

                $first = $items->first();

                return [

                    'id' => $first->school->subCounty->id,

                    'name' => $first->school->subCounty->name,

                    'schools' => $items->count(),

                ];

            })
            ->values();
    }

            return [

                'id' => $dispatch->id,

                'dispatch_number' => $dispatch->dispatch_number,

                'dispatch_date' => $dispatch->dispatch_date,

                'status' => $dispatch->status,

                'county' => $dispatch->county->name,

                'assigned_subcounties' => $assignedSubCounties,

            ];

        }),

    ]);
}

public function deliverSchool(Request $request, DispatchItem $dispatchItem)
{
    $request->validate([
        'receiver_name' => ['required', 'string', 'max:255'],
        'receiver_phone' => ['nullable', 'string', 'max:30'],
        'remarks' => ['nullable', 'string'],
    ]);

    $dispatch = $dispatchItem->dispatch;

    if (
        auth()->user()->hasRole('Field Agent') &&
         $dispatchItem->assigned_to != auth()->id()
    ) {
        abort(403);
    }

    $dispatchItem->update([
        'status' => 'Delivered',
        'delivered_at' => now(),
        'receiver_name' => $request->receiver_name,
        'receiver_phone' => $request->receiver_phone,
        'remarks' => $request->remarks,
    ]);

    $total = $dispatch->items()->count();

    $delivered = $dispatch->items()
        ->where('status', 'Delivered')
        ->count();

    if ($delivered == 0) {
        $dispatch->status = 'Pending';
    } elseif ($delivered < $total) {
        $dispatch->status = 'In Transit';
    } else {
        $dispatch->status = 'Completed';
    }

    $dispatch->save();

    return back()->with('success', 'School marked as delivered successfully.');
}

public function bulkDeliver(Request $request)
{
    $request->validate([
        'items' => ['required', 'array'],
    ]);

    DispatchItem::whereIn('id', $request->items)
        ->update([
            'status' => 'Delivered',
            'delivered_at' => now(),
        ]);

    return back()->with('success', 'Selected schools marked as delivered.');
}

public function assignSubCounty(Request $request, Dispatch $dispatch)
{
     
    $validated = $request->validate([
        'sub_county_id' => ['required', 'exists:sub_counties,id'],
        'field_agent_id' => ['required', 'exists:users,id'],
    ]);

    // Only the county field agent or an admin can assign
    if (
        auth()->user()->hasRole('Field Agent') &&
        $dispatch->field_agent_id != auth()->id()
    ) {
        abort(403);
    }

    $updated = DispatchItem::where('dispatch_id', $dispatch->id)
        ->whereHas('school', function ($query) use ($validated) {

            $query->where(
                'sub_county_id',
                $validated['sub_county_id']
            );

        })
        ->update([

            'assigned_to' => $validated['field_agent_id'],

            'assigned_by' => auth()->id(),

            'assigned_at' => now(),

        ]);

    return back()->with(
        'success',
        "{$updated} schools assigned successfully."
    );
}

public function subCountyDispatch(Dispatch $dispatch, SubCounty $subCounty)
{
    $user = auth()->user();

    // User must have schools assigned in this sub county
    $hasAccess = DispatchItem::where('dispatch_id', $dispatch->id)
        ->where('assigned_to', $user->id)
        ->whereHas('school', function ($query) use ($subCounty) {
            $query->where('sub_county_id', $subCounty->id);
        })
        ->exists();

    if (!$hasAccess) {
        abort(403, 'Unauthorized.');
    }

    $items = DispatchItem::with([
            'school',
            'school.subCounty',
        ])
        ->where('dispatch_id', $dispatch->id)
        ->where('assigned_to', $user->id)
        ->whereHas('school', function ($query) use ($subCounty) {
            $query->where('sub_county_id', $subCounty->id);
        })
        ->get();

    $total = $items->count();

    $delivered = $items
        ->where('status', 'Delivered')
        ->count();

    $partial = $items
        ->where('status', 'Partial')
        ->count();

    $pending = $items
        ->where('status', 'Pending')
        ->count();

    return Inertia::render('Dispatches/SubCountyDispatch', [

        'dispatch' => [

    'id' => $dispatch->id,

    'dispatch_number' => $dispatch->dispatch_number,

    'dispatch_date' => $dispatch->dispatch_date,

    'status' => $dispatch->status,

    'remarks' => $dispatch->remarks,

    'field_agent' => [
        'id' => $dispatch->fieldAgent->id,
        'name' => $dispatch->fieldAgent->name,
    ],

    'county' => [
        'id' => $dispatch->county->id,
        'name' => $dispatch->county->name,
    ],

    'creator' => [
        'id' => $dispatch->creator->id,
        'name' => $dispatch->creator->name,
    ],

    'subCounty' => [
        'id' => $subCounty->id,
        'name' => $subCounty->name,
    ],

    'items' => $items->map(function ($item) {

        return [

            'id' => $item->id,

            'status' => $item->status,

            'delivered_at' => $item->delivered_at,

            'remarks' => $item->remarks,

            'receiver_name' => $item->receiver_name,

            'receiver_phone' => $item->receiver_phone,

            'assigned_to' => $item->assigned_to,

            'assigned_by' => $item->assigned_by,

            'assigned_at' => $item->assigned_at,

            'school' => [

                'id' => $item->school->id,

                'school_name' => $item->school->school_name,

                'uic' => $item->school->uic,

                'sub_county' => $item->school->subCounty?->name,

                'sub_county_id' => $item->school->sub_county_id,

            ],

        ];

    })->values(),

],

        'stats' => [

        'total' => $total,

        'delivered' => $delivered,

        'partial' => $partial,

        'pending' => $pending,

        'progress' => $total
            ? round(($delivered / $total) * 100)
            : 0,

    ],

    ]);
}

public function verifyDelivery(DispatchItem $dispatchItem)
{
    $user = auth()->user();

    // Only assigned user can verify
    if (
        $dispatchItem->assigned_to != $user->id &&
        $dispatchItem->dispatch->field_agent_id != $user->id
    ) {
        abort(403);
    }

    $dispatchItem->load([
        'school.subCounty',
        'books.book',
    ]);

    return Inertia::render('Dispatches/VerifyDelivery', [

        'dispatchItem' => [

            'id' => $dispatchItem->id,

            'school' => [

                'id' => $dispatchItem->school->id,

                'school_name' => $dispatchItem->school->school_name,

                'uic' => $dispatchItem->school->uic,

                'sub_county' => $dispatchItem->school->subCounty?->name,

            ],

            'books' => $dispatchItem->books->map(function ($book) {

                return [

                    'id' => $book->id,

                    'book_id' => $book->book_id,

                    'title' => $book->book->name,

                    'allocated_quantity' => $book->allocated_quantity,

                    'received_quantity' => $book->received_quantity,

                    'damaged_quantity' => $book->damaged_quantity,

                    'remarks' => $book->remarks,

                ];

            }),

        ],

    ]);
}

public function completeDelivery(Request $request, DispatchItem $dispatchItem)
{
    $user = auth()->user();

    // Security
    if (
        $dispatchItem->assigned_to != $user->id &&
        $dispatchItem->dispatch->field_agent_id != $user->id
    ) {
        abort(403);
    }

    $validated = $request->validate([

        'receiver_name' => 'required|string|max:255',

        'receiver_phone' => 'nullable|string|max:30',

        'remarks' => 'nullable|string',

        'books' => 'required|array',

        'books.*.id' => 'required|exists:dispatch_item_books,id',

        'books.*.received_quantity' => 'required|integer|min:0',

        'books.*.damaged_quantity' => 'required|integer|min:0',

        'books.*.remarks' => 'nullable|string',

    ]);

    DB::transaction(function () use ($validated, $dispatchItem) {

        foreach ($validated['books'] as $book) {

            DispatchItemBook::where('id', $book['id'])

                ->where('dispatch_item_id', $dispatchItem->id)

                ->update([

                    'received_quantity' => $book['received_quantity'],

                    'damaged_quantity' => $book['damaged_quantity'],

                    'remarks' => $book['remarks'],

                ]);

        }

        $books = $dispatchItem->books()->get();

        $allDelivered = true;
        $allPending = true;

        foreach ($books as $book) {

            if ($book->received_quantity > 0) {
                $allPending = false;
            }

            if ($book->received_quantity < $book->allocated_quantity) {
                $allDelivered = false;
            }
        }

        if ($allPending) {

            $status = 'Pending';

        } elseif ($allDelivered) {

            $status = 'Delivered';

        } else {

            $status = 'Partial';

        }

        $dispatchItem->update([

            'receiver_name' => $validated['receiver_name'],

            'receiver_phone' => $validated['receiver_phone'],

            'remarks' => $validated['remarks'],

            'status' => $status,

            'delivered_at' => now(),

        ]);

        $dispatch = $dispatchItem->dispatch;

        $total = $dispatch->items()->count();

        $delivered = $dispatch->items()

            ->where('status', 'Delivered')

            ->count();

        if ($delivered == 0) {

            $dispatch->status = 'Pending';

        } elseif ($delivered < $total) {

            $dispatch->status = 'In Transit';

        } else {

            $dispatch->status = 'Completed';

        }

        $dispatch->save();

    });

    return redirect()

        ->route('dispatches.mine', $dispatchItem->dispatch_id)

        ->with('success', 'Delivery verified successfully.');

}

public function confirmCompleteDeliveries(Request $request)
{
    $validated = $request->validate([

        'selected_dispatch_items' => [
            'required',
            'array',
            'min:1',
        ],

        'selected_dispatch_items.*' => [
            'exists:dispatch_items,id',
        ],

    ]);

    DB::transaction(function () use ($validated) {

        $dispatchItems = DispatchItem::with('books')
            ->whereIn(
                'id',
                $validated['selected_dispatch_items']
            )
            ->get();

        foreach ($dispatchItems as $dispatchItem) {

            // Mark school as delivered
            $dispatchItem->update([

                'status' => 'Delivered',

                'delivered_at' => now(),

            ]);

            // Copy allocated quantities to received quantities
            foreach ($dispatchItem->books as $book) {

                $book->update([

                    'received_quantity' => $book->allocated_quantity,

                    'damaged_quantity' => 0,

                    'remarks' => null,

                ]);

            }

        }

    });

    return back()->with(
        'success',
        'Selected schools delivered successfully.'
    );
}

public function subCountyShortages(
    Dispatch $dispatch,
    SubCounty $subCounty
) {
    // Get all dispatch items for this dispatch and subcounty
    $items = DispatchItem::with([
        'school.subCounty',
        'books.book',
    ])
        ->where('dispatch_id', $dispatch->id)
        ->whereHas('school', function ($query) use ($subCounty) {
            $query->where('sub_county_id', $subCounty->id);
        })
        ->get();

    // Keep only schools that have shortages
    $itemsWithShortages = $items->filter(function ($item) {
        return $item->books->contains(function ($book) {
            return $book->received_quantity < $book->allocated_quantity;
        });
    });

    // Format the data for React
    $schools = $itemsWithShortages->map(function ($item) {

        $books = $item->books
            ->filter(function ($book) {
                return $book->received_quantity < $book->allocated_quantity;
            })
            ->map(function ($book) {

                $shortage = max(
                    0,
                    $book->allocated_quantity - $book->received_quantity
                );

                return [
                    'id' => $book->id,
                    'book' => $book->book->name,
                    'allocated' => $book->allocated_quantity,
                    'received' => $book->received_quantity,
                    'damaged' => $book->damaged_quantity,
                    'shortage' => $shortage,
                    'remarks' => $book->remarks,
                ];
            })
            ->values();

        return [

            'dispatch_item_id' => $item->id,

            'school' => [
                'id' => $item->school->id,
                'name' => $item->school->school_name,
                'uic' => $item->school->uic,
                'sub_county' => $item->school->subCounty?->name,
            ],

            'status' => $item->status,

            'books' => $books,

            'total_missing' => $books->sum('shortage'),

            'receiver_name' => $item->receiver_name,

            'receiver_phone' => $item->receiver_phone,

            'remarks' => $item->remarks,

            'delivered_at' => $item->delivered_at,
        ];
    })->values();

    // Summary statistics
    $stats = [
        'schools_with_shortages' => $schools->count(),
        'missing_books' => $schools->sum('total_missing'),
    ];

    return Inertia::render('Dispatches/SubCountyShortages', [
        'dispatch' => [
            'id' => $dispatch->id,
            'dispatch_number' => $dispatch->dispatch_number,
        ],

        'subCounty' => [
            'id' => $subCounty->id,
            'name' => $subCounty->name,
        ],

        'stats' => $stats,

        'schools' => $schools,
    ]);
}
            
}
