<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('dispatch_item_books', function (Blueprint $table) {

            $table->id();

            $table->foreignId('dispatch_item_id')
                ->constrained()
                ->cascadeOnDelete();

            $table->foreignId('book_id')
                ->constrained()
                ->cascadeOnDelete();

            // Quantity that was supposed to be delivered
            $table->integer('allocated_quantity');

            // Quantity actually received by the school
            $table->integer('received_quantity')->default(0);

            // Damaged books
            $table->integer('damaged_quantity')->default(0);

            $table->text('remarks')->nullable();

            $table->timestamps();

            $table->unique([
                'dispatch_item_id',
                'book_id'
            ]);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('dispatch_item_books');
    }
};