<?php

namespace App\Http\Controllers;


use Illuminate\Http\Request;

use Maatwebsite\Excel\Facades\Excel;

use App\Imports\SchoolsImport;

use Inertia\Inertia;

use App\Models\Import;



class SchoolImportController extends Controller
{

public function index()
{
    return Inertia::render('Schools/Import');
}


public function store(Request $request)
{

  $request->validate([
        'file'=>'required|mimes:xlsx,xls,csv'
    ]);


    $file = $request->file('file');


    $path = $file->store('imports');


    $totalRows = \PhpOffice\PhpSpreadsheet\IOFactory::load($file)
    ->getActiveSheet()
    ->getHighestRow() - 1;


$import = Import::create([

    'file_name'=>$file->getClientOriginalName(),

    'status'=>'processing',

    'user_id'=>auth()->id(),

    'total_rows'=>$totalRows,

]);


    Excel::queueImport(
        new SchoolsImport($import->id),
        $path
    );


    return back()->with([
    'success' => 'Import started successfully.',
    'import_id' => $import->id,
]);

}

public function status(Import $import)
{

    return response()->json([

        'status'=>$import->status,

        'processed'=>$import->processed_rows,

        'total'=>$import->total_rows,

        'percentage'=>$import->total_rows > 0
            ? round(
                ($import->processed_rows /
                $import->total_rows) * 100
              )
            : 0

    ]);

}

}