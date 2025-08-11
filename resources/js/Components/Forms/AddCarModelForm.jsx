import { useState } from "react";
import { addCarModel } from "@/Services/apiService";

export default function AddCarModelForm({
    carModels,
    setCarModels,
    selectedCarMake,
}) {
    const [newCarModel, setNewCarModel] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedCarMake) {
            setErrorMessage("Select a car make first.");
            return;
        }
        if (!newCarModel.trim()) return;

        setErrorMessage("");
        setLoading(true);
        try {
            const created = await addCarModel(
                newCarModel.trim(),
                selectedCarMake.id
            );
            setCarModels([...carModels, created]);
            setNewCarModel("");
        } catch (err) {
            console.error("Error adding car model:", err);
            setErrorMessage(err.message || "An unexpected error occurred.");
        } finally {
            setLoading(false);
        }
    };

    const disabled = loading || !selectedCarMake;

    return (
        <form onSubmit={handleSubmit} className="mb-6">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <div className="flex-1">
                    <label className="sr-only" htmlFor="car-model-input">
                        Car Model
                    </label>
                    <input
                        id="car-model-input"
                        type="text"
                        value={newCarModel}
                        onChange={(e) => setNewCarModel(e.target.value)}
                        placeholder={
                            selectedCarMake
                                ? `New model for ${selectedCarMake.name}`
                                : "Select a make first"
                        }
                        className="w-full px-4 py-2 border rounded-md text-sm focus:outline-none focus:ring focus:ring-blue-200 disabled:bg-gray-100"
                        required
                        maxLength={100}
                        disabled={disabled}
                    />
                </div>
                <button
                    type="submit"
                    disabled={disabled}
                    className="w-full sm:w-auto px-5 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring focus:ring-blue-300 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                    {loading
                        ? "Adding..."
                        : !selectedCarMake
                        ? "Select Make"
                        : "Add"}
                </button>
            </div>
            {errorMessage && (
                <p className="text-red-500 text-xs mt-2">{errorMessage}</p>
            )}
        </form>
    );
}
