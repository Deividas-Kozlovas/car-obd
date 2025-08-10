<?php

namespace App\Http\Controllers;

use App\Models\CarModel;
use Illuminate\Http\Request;

class CarModelController extends Controller
{
    // Display a listing of car models
    public function index()
    {
        $carModels = CarModel::all();
        return response()->json($carModels);
    }

    // Show the form for creating a new resource
    public function create()
    {
        // No implementation needed for API-based controllers
    }

    // Store a new car model
    public function store(Request $request)
    {
        // Check if 'name' is an object and extract the 'model' value
        if (is_array($request->input('model'))) {
            $request->merge([
                'name' => $request->input('model.model'), // Extract 'model' from 'name'
                'car_make_id' => $request->input('model.car_make_id'), // Extract 'car_make_id' from 'name'
            ]);
        }

        // Validate the request data
        $validatedData = $request->validate([
            'name' => 'required|string', // Ensure 'name' is a string
            'car_make_id' => 'required|integer', // Ensure 'car_make_id' is an integer
        ]);

        // Create the car model
        $carModel = CarModel::create([
            'name' => $validatedData['name'],
            'car_make_id' => $validatedData['car_make_id'],
        ]);

        // Return the created resource with a 201 status
        return response()->json($carModel, 201);
    }

    // Show a specific car model
    public function show(CarModel $carModel)
    {
        return response()->json($carModel);
    }

    // Show the form for editing the specified resource
    public function edit(string $id)
    {
        // No implementation needed for API-based controllers
    }

    // Update a specific car model
    public function update(Request $request, CarModel $carModel)
    {
        $validated = $request->validate([
            'car_make_id' => 'required|exists:car_makes,id', // Ensure car_make_id exists in car_makes table
            'model' => 'required|string|max:255',
        ]);

        $carModel->update($validated);

        return response()->json($carModel);
    }

    // Delete a specific car model
    public function destroy(CarModel $carModel)
    {
        $carModel->delete();
        return response()->json(['message' => 'Car model deleted successfully']);
    }
}