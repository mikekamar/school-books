<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('dispatch_items', function (Blueprint $table) {
            $table->id();

            $table->foreignId('dispatch_id')
                ->constrained()
                ->cascadeOnDelete();

            $table->foreignId('school_id')
                ->constrained()
                ->cascadeOnDelete();

           $table->enum('status', [
                'Pending',
                'Partial',
                'Delivered'
            ])->default('Pending');

            $table->timestamp('delivered_at')->nullable();

            $table->text('remarks')->nullable();
            $table->foreignId('assigned_to')
                ->nullable()
                ->constrained('users')
                ->nullOnDelete();

            $table->foreignId('assigned_by')
                ->nullable()
                ->constrained('users')
                ->nullOnDelete();

            $table->timestamp('assigned_at')->nullable();

            $table->timestamps();

            $table->unique([
                'dispatch_id',
                'school_id'
            ]);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('dispatch_items');
    }
};
