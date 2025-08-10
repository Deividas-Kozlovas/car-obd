<?php

namespace App\Http\Controllers;

use App\Models\CarMake;
use Illuminate\Http\Request;

class CarMakeController extends Controller
{
    /**
     * Display a listing of the car makes.
     */
    public function index()
    {
        return response()->json(CarMake::all());
    }

    /**
     * Store a newly created car make in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:car_makes,name',
        ]);

        $carMake = CarMake::create($validated);

        return response()->json($carMake, 201);
    }

    /**
     * Remove the specified car make from storage.
     */
    public function destroy(CarMake $carMake)
    {
        $carMake->delete();

        return response()->json(['message' => 'Car make deleted successfully.'], 200);
    }
}
