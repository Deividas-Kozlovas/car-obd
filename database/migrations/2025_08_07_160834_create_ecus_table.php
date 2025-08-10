<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::create('ecus', function (Blueprint $table) {
            $table->id();
            $table->string('make');                     
            $table->string('model');                    
            $table->string('engine');  
            $table->string('gearbox'); // Fixed column type
            $table->string('power');                    
            $table->string('hw');                       
            $table->string('sw');                       
            $table->string('ecu');                      
            $table->year('year');                      
            $table->string('flasher');                  
            $table->unsignedInteger('filesize');        
            $table->string('file_name');                
            $table->decimal('transfer_price', 8, 2);    
            $table->string('payment_method');           
            $table->string('original_extension', 10);   
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
