<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Book;

class BookSeeder extends Seeder
{
    public function run(): void
    {
        $books = [

            'essential_maths_lb',
            'essential_maths_tg',
            'poetry',
            'core_mathematics_lb',
            'core_mathematics_tg',
            'business_studies_lb',
            'business_studies_tg',
            'electricity_lb',
            'electricity_tg',
            'power_mechanics_lb',
            'power_mechanics_tg',

        ];


        foreach($books as $book)
        {
            Book::firstOrCreate([
                'name'=>$book
            ]);
        }
    }
}