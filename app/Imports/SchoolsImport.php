<?php

namespace App\Imports;

use App\Models\County;
use App\Models\SubCounty;
use App\Models\School;
use App\Models\Book;
use App\Models\Import;

use Illuminate\Support\Collection;

use Maatwebsite\Excel\Concerns\ToCollection;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Illuminate\Contracts\Queue\ShouldQueue;
use Maatwebsite\Excel\Concerns\WithChunkReading;
use Maatwebsite\Excel\Concerns\WithEvents;

use Maatwebsite\Excel\Events\AfterImport;
use Maatwebsite\Excel\Events\ImportFailed;


class SchoolsImport implements 
    ToCollection,
    WithHeadingRow,
    ShouldQueue,
    WithChunkReading,
    WithEvents
{

    public $importId;


    public function __construct($importId)
    {
        $this->importId = $importId;
    }



    public function chunkSize(): int
    {
        return 500;
    }



    public function collection(Collection $rows)
    {

        foreach ($rows as $row) {


            /*
            |--------------------------------------------------------------------------
            | Skip invalid rows
            |--------------------------------------------------------------------------
            */

            if (
                empty($row['school_name'])
            ) {
                continue;
            }




            /*
            |--------------------------------------------------------------------------
            | County
            |--------------------------------------------------------------------------
            */

            $county = County::firstOrCreate([

                'name' => strtoupper(
                    trim($row['county'])
                )

            ]);





            /*
            |--------------------------------------------------------------------------
            | Sub County
            |--------------------------------------------------------------------------
            */

            $subCounty = SubCounty::firstOrCreate([

                'county_id' => $county->id,

                'name' => strtoupper(
                    trim($row['sub_county'])
                )

            ]);






            /*
            |--------------------------------------------------------------------------
            | School
            |--------------------------------------------------------------------------
            */

            $school = School::updateOrCreate(

                [

                    'uic' => trim($row['uic'])

                ],

                [

                    'school_name' => trim($row['school_name']),


                    'sub_county_id' => $subCounty->id,
                     'county_id'     => $county->id

                ]

            );






            /*
            |--------------------------------------------------------------------------
            | Books and Quantities
            |--------------------------------------------------------------------------
            */

            $bookColumns = [


                'essential_maths_lb' 
                    => 'essential_maths_lb',


                'essential_maths_tg'
                    => 'essential_maths_tg',


                'poetry'
                    => 'poetry',


                'core_mathematics_lb'
                    => 'core_mathematics_lb',

                'core_mathematics_tg'
                    => 'core_mathematics_tg',


                'business_studies_lb'
                    => 'business_studies_lb',


                'business_studies_tg'
                    => 'business_studies_tg',


                'electricity_lb'
                    => 'electricity_lb',


                'electricity_tg'
                    => 'electricity_tg',


                'power_mechanics'
                    => 'power_mechanics',

                'power_mechanics_tg'
                    => 'power_mechanics_tg',

            ];





            foreach ($bookColumns as $column => $bookName) {


                $quantity = $row[$column] ?? 0;




                /*
                |--------------------------------------------------------------------------
                | Ignore formulas, text and blanks
                |--------------------------------------------------------------------------
                */

                if (!is_numeric($quantity)) {

                    continue;

                }



                $quantity = (int) $quantity;



                if ($quantity <= 0) {

                    continue;

                }






                /*
                |--------------------------------------------------------------------------
                | Find Book
                |--------------------------------------------------------------------------
                */

                $book = Book::whereRaw(

                    'LOWER(TRIM(name)) = ?',

                    [

                        strtolower(
                            trim($bookName)
                        )

                    ]

                )->first();






                if ($book) {


                    $school->books()->syncWithoutDetaching([

                        $book->id => [

                            'quantity' => $quantity

                        ]

                    ]);


                }



            }







            /*
            |--------------------------------------------------------------------------
            | Update Progress
            |--------------------------------------------------------------------------
            */

            Import::where('id',$this->importId)
                ->increment('processed_rows');



        }

    }






    public function registerEvents(): array
    {

        return [



            AfterImport::class => function () {


                Import::where('id',$this->importId)

                    ->update([

                        'status' => 'completed'

                    ]);


            },




            ImportFailed::class => function ($event) {


                Import::where('id',$this->importId)

                    ->update([

                        'status' => 'failed',

                        'error_message' =>
                            $event->getException()
                            ->getMessage()

                    ]);


            },



        ];

    }



}