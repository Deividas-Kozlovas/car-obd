<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ECU extends Model
{
    use HasFactory;

    protected $table = 'ecus';

    protected $fillable = [
        'car_make_id',
        'car_model_id',
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