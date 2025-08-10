import { useState } from "react";
import { addCarModel } from "@/Services/apiService";

export default function AddCarModelForm({
    carModels,
    setCarModels,
    selectedCarMake,
}) {
    const [newCarModel, setNewCarModel] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!selectedCarMake) {
            setErrorMessage("Please select a car make first.");
            return;
        }

        try {
            const createdCarModel = await addCarModel(
                newCarModel,
                selectedCarMake.id
            );
            setCarModels([...carModels, createdCarModel]);
            setNewCarModel("");
        } catch (error) {
            console.error("Error adding car model:", error);
            setErrorMessage(error.message || "An unexpected error occurred.");
        }
    };

    return (
        <form onSubmit={handleSubmit} className="mb-6">
            <div className="flex items-center gap-2">
                <input
                    type="text"
                    value={newCarModel}
                    onChange={(e) => setNewCarModel(e.target.value)}
                    placeholder="Enter car model name"
                    className="flex-1 px-4 py-2 border rounded-md"
                    required
                />
                <button
                    type="submit"
                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                >
                    Add
                </button>
            </div>
            {errorMessage && (
                <p className="text-red-500 text-sm mt-2">{errorMessage}</p>
            )}
        </form>
    );
}
