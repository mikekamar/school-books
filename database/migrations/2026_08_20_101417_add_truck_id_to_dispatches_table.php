<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('dispatches', function (Blueprint $table) {
            $table->foreignId('truck_id')
                ->nullable()
                ->after('driver_id')
                ->constrained('trucks')
                ->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('dispatches', function (Blueprint $table) {
            $table->dropForeign(['truck_id']);
            $table->dropColumn('truck_id');
        });
    }
};