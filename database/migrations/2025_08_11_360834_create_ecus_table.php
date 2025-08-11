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
        Schema::create('ecus', function (Blueprint $table) {
            $table->id();
            $table->foreignId('car_make_id')->constrained('car_makes')->cascadeOnDelete();
            $table->foreignId('car_model_id')->nullable()->constrained('car_models')->nullOnDelete();
            $table->string('engine');
            $table->string('gearbox');
            $table->string('power');
            $table->string('hw');
            $table->string('sw');
            $table->string('ecu');
            $table->year('year');
            $table->string('flasher');
            $table->unsignedInteger('filesize')->nullable();
            $table->string('file_name')->nullable();
            $table->decimal('transfer_price', 8, 2)->nullable();
            $table->string('payment_method')->nullable();
            $table->string('original_extension', 10)->nullable();
            $table->string('compressed_extension', 10)->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ecus');
    }
};
