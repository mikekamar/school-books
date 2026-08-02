<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;
use Inertia\Inertia;
use App\Http\Controllers\SchoolImportController;
use App\Http\Controllers\DispatchController;
use App\Http\Controllers\ReportController;
use App\Models\DispatchItemBook;
use Illuminate\Support\Facades\DB;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::get(
        '/imports/{import}/status',
        [SchoolImportController::class,'status']
    )
    ->name('imports.status');
    Route::resource('dispatches', DispatchController::class);

    Route::get('/my-dispatches', [DispatchController::class, 'myDispatches'])
        ->name('dispatches.mine')->middleware('role:Field Agent');

    Route::patch(
        '/dispatch-items/{dispatchItem}/deliver',
        [DispatchController::class, 'deliverSchool']
        )->name('dispatch-items.deliver');

    Route::post('/dispatch-items/bulk-deliver', [DispatchController::class, 'bulkDeliver'])
    ->name('dispatch-items.bulk-deliver');

    Route::get(
    '/dispatches/{dispatch}/subcounty/{subCounty}',
    [DispatchController::class, 'subCountyDispatch']
    )->name('dispatches.subcounty');

    Route::get(
    '/dispatches/{dispatch}/sub-counties/{subCounty}/shortages',
    [DispatchController::class, 'subCountyShortages']
    )->name('dispatches.subcounty.shortages');

    Route::middleware(['role:Admin|Store Manager'])->group(function () {

    Route::get('/reports/subcounty-reconciliation/{dispatch?}', [DispatchController::class, 'subCountyReconciliation'])
        ->name('reports.subcounty-reconciliation');

    });
    Route::prefix('reports')->name('reports.')->group(function () {

        Route::get('/delivery-summary', [ReportController::class, 'deliverySummary'])
            ->name('delivery-summary');

        Route::get('/outstanding-schools', [ReportController::class, 'outstandingSchools'])
            ->name('outstanding-schools');

        Route::get('/county-progress', [ReportController::class, 'countyProgress'])
            ->name('county-progress');

        Route::get('/county/{county}/sub-counties', [ReportController::class, 'subCountyProgress'])
            ->name('subcounty-progress');

        Route::get('/sub-counties/{subCounty}/schools', [ReportController::class, 'schools'])
            ->name('schools');

        Route::get('/schools/{school}', [ReportController::class, 'school'])
            ->name('school');

    });

    Route::post(
    '/dispatches/{dispatch}/assign-subcounty',
    [DispatchController::class, 'assignSubCounty']
    )->name('dispatches.assignSubCounty');
});

Route::get(
    '/dispatch-items/{dispatchItem}/verify',
    [DispatchController::class, 'verifyDelivery']
)->name('dispatch-items.verify');

Route::post(
    '/dispatch-items/{dispatchItem}/complete',
    [DispatchController::class, 'completeDelivery']
)->name('dispatch-items.complete');

Route::post(
    '/dispatch-items/confirm-complete',
    [DispatchController::class, 'confirmCompleteDeliveries']
)->name('dispatch-items.confirm-complete');

Route::middleware(['permission:manage users'])
    ->group(function () {


        Route::get('/users',
            [UserController::class,'index']
        )->name('users.index');



        Route::get('/users/create',
            [UserController::class,'create']
        )->name('users.create');



        Route::post('/users',
            [UserController::class,'store']
        )->name('users.store');



        Route::get('/users/{user}/edit',
            [UserController::class,'edit']
        )->name('users.edit');



        Route::put('/users/{user}',
            [UserController::class,'update']
        )->name('users.update');



        Route::delete('/users/{user}',
            [UserController::class,'destroy']
        )->name('users.destroy');


        Route::get('/users/{user}/password',
            [UserController::class,'password']
        )->name('users.password.edit');


        Route::put('/users/{user}/password',
            [UserController::class,'updatePassword']
        )->name('users.password.update');



    });

    Route::middleware(['permission:import schools'])
    ->group(function(){


    Route::get(
        '/schools/import',
        [SchoolImportController::class,'index']
    )
    ->name('schools.import');


    Route::post(
        '/schools/import',
        [SchoolImportController::class,'store']
    )
    ->name('schools.import.store');

    
});
       

require __DIR__.'/auth.php';
