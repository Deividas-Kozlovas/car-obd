<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CarMake extends Model
{
    protected $table = 'car_makes';

    protected $fillable = [
        'name',
    ];

    public $timestamps = true;

    // Define the relationship with CarModel
    public function carModels()
    {
        return $this->hasMany(CarModel::class, 'car_make_id');
    }

    // Define the relationship with ECU
    public function ecus()
    {
        return $this->hasMany(ECU::class, 'car_make_id');
    }
}
