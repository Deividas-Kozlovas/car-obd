<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CarModel extends Model
{
    use HasFactory;

    protected $table = 'car_models';

    protected $fillable = [
        'car_make_id',
        'name',
    ];

    public $timestamps = true;

    /**
     * Define the relationship with the CarMake model.
     */
    public function carMake()
    {
        return $this->belongsTo(CarMake::class);
    }

    /**
     * Define the relationship with the Ecu model.
     */
    public function ecus()
    {
        return $this->hasMany(Ecu::class);
    }
}
