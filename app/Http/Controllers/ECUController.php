<?php

namespace App\Http\Controllers;

use App\Models\ECU;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;

class ECUController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return ECU::with(['carMake', 'carModel'])->orderByDesc('id')->get();
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'car_make_id' => 'required|exists:car_makes,id',
            'car_model_id' => 'required|exists:car_models,id',
            'engine' => 'required|string|max:255',
            'gearbox' => 'required|string|max:255',
            'power' => 'required|string|max:255',
            'hw' => 'required|string|max:255',
            'sw' => 'required|string|max:255',
            'ecu' => 'required|string|max:255',
            'year' => 'required|integer',
            'flasher' => 'required|string|max:255',
            'transfer_price' => 'nullable|numeric',
            'payment_method' => 'nullable|string|max:255',
            'original_extension' => 'nullable|string|max:10',
            'compressed_extension' => 'nullable|string|max:10',
            'file' => 'nullable|file|max:2097152',
        ]);

        if ($request->hasFile('file')) {
            $file = $request->file('file');
            $path = $file->store('uploads', 'public');
            $validated['file_name'] = $path;
            $validated['filesize'] = $file->getSize();
            $validated['original_extension'] = $file->getClientOriginalExtension();
        }

        $ecu = ECU::create($validated);

        return response()->json($ecu->load(['carMake','carModel']), 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(ECU $eCU)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(ECU $eCU)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, ECU $ecu)
    {
        // Allow partial update (PATCH semantics)
        $validated = $request->validate([
            'car_make_id' => 'sometimes|exists:car_makes,id',
            'car_model_id' => 'sometimes|exists:car_models,id',
            'engine' => 'sometimes|string|max:255',
            'gearbox' => 'sometimes|string|max:255',
            'power' => 'sometimes|string|max:255',
            'hw' => 'sometimes|string|max:255',
            'sw' => 'sometimes|string|max:255',
            'ecu' => 'sometimes|string|max:255',
            'year' => 'sometimes|integer',
            'flasher' => 'sometimes|string|max:255',
            'transfer_price' => 'sometimes|numeric|nullable',
            'payment_method' => 'sometimes|string|max:255|nullable',
            'original_extension' => 'sometimes|string|max:10|nullable',
            'compressed_extension' => 'sometimes|string|max:10|nullable',
            'file' => 'sometimes|file|max:2097152|nullable',
        ]);

        if ($request->hasFile('file')) {
            if ($ecu->file_name) {
                Storage::disk('public')->delete($ecu->file_name);
            }
            $file = $request->file('file');
            $path = $file->store('uploads', 'public');
            $validated['file_name'] = $path;
            $validated['filesize'] = $file->getSize();
            $validated['original_extension'] = $file->getClientOriginalExtension();
        }

        $ecu->fill($validated)->save();

        return response()->json($ecu->fresh()->load(['carMake','carModel']));
    }

    public function download(ECU $ecu)
    {
        \Log::debug('Download request', ['id' => $ecu->id, 'file' => $ecu->file_name]);
        if (!$ecu->file_name || !Storage::disk('public')->exists($ecu->file_name)) {
            \Log::warning('Download abort 404', ['id' => $ecu->id]);
            abort(404);
        }
        $ext = pathinfo($ecu->file_name, PATHINFO_EXTENSION);
        $downloadName = ($ecu->ecu ?: 'ecu').'_'.$ecu->id.($ext ? '.'.$ext : '');
        return Storage::disk('public')->download($ecu->file_name, $downloadName);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(ECU $ecu)
    {
        if ($ecu->file_name) {
            Storage::disk('public')->delete($ecu->file_name);
        }
        $ecu->delete();
        return response()->noContent(); // 204
    }
}
