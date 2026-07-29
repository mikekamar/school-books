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
    Schema::table('dispatch_items', function (Blueprint $table) {
        $table->string('receiver_name')->nullable()->after('remarks');
        $table->string('receiver_phone')->nullable()->after('receiver_name');
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('dispatch_items', function (Blueprint $table) {
            //
        });
    }
};
