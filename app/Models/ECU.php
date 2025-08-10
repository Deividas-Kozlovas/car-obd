<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ECU extends Model
{
    protected $table = 'ecus';

    protected $fillable = [
        'make',
        'model',
        'engine',
        'gearbox',
        'power',
        'hw',
        'sw',
        'ecu',
        'year',
        'flasher',
        'filesize',
        'file_name',
        'transfer_price',
        'payment_method',
        'original_extension',
        'compressed_extension',
        'car_make_id',
        'car_model_id', // Add this to the fillable array
    ];

    public $timestamps = true;

    public function carMake()
    {
        return $this->belongsTo(CarMake::class, 'car_make_id');
    }

    public function carModel()
    {
        return $this->belongsTo(CarModel::class, 'car_model_id');
    }
}