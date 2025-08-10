<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('car_models', function (Blueprint $table) {
            $table->id();
            $table->foreignId('car_make_id')->constrained('car_makes')->cascadeOnDelete(); // Define foreign key once
            $table->string('name'); // Define the name column
            $table->timestamps();
        });

        Schema::table('ecus', function (Blueprint $table) {
            $table->foreignId('car_model_id')
                  ->nullable()
                  ->constrained('car_models')
                  ->cascadeOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('ecus', function (Blueprint $table) {
            $table->dropConstrainedForeignId('car_model_id');
        });

        Schema::dropIfExists('car_models');
    }
};
