<? php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('trucks', function (Blueprint $table) {
            $table->id();

            $table->string('registration_number')->unique();
            $table->string('make')->nullable();          // Isuzu, Mitsubishi
            $table->string('model')->nullable();         // FSR, Canter
            $table->unsignedInteger('capacity')->nullable(); // Optional (books or kg)

            $table->enum('status', [
                'Available',
                'In Transit',
                'Maintenance',
                'Inactive'
            ])->default('Available');

            $table->text('remarks')->nullable();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('trucks');
    }
};