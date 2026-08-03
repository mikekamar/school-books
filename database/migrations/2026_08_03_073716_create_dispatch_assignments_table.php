<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('dispatch_assignments', function (Blueprint $table) {
            $table->id();

            $table->foreignId('dispatch_id')
                ->constrained()
                ->cascadeOnDelete();

            $table->foreignId('sub_county_id')
                ->constrained()
                ->cascadeOnDelete();

            $table->foreignId('field_agent_id')
                ->constrained('users')
                ->cascadeOnDelete();

            $table->foreignId('assigned_by')
                ->constrained('users')
                ->cascadeOnDelete();

            $table->timestamps();

            $table->unique(['dispatch_id', 'sub_county_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('dispatch_assignments');
    }
};