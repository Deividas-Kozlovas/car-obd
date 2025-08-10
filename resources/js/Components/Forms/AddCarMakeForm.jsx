import { useState } from "react";
import { addCarMake } from "@/Services/apiService";

export default function AddCarMakeForm({ carMakes, setCarMakes }) {
    const [newCarMake, setNewCarMake] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const createdCarMake = await addCarMake(newCarMake);
            setCarMakes([...carMakes, createdCarMake]);
            setNewCarMake("");
        } catch (error) {
            console.error("Error adding car make:", error);
            setErrorMessage(error.message || "An unexpected error occurred.");
        }
    };

    return (
        <form onSubmit={handleSubmit} className="mb-6">
            <div className="flex items-center gap-2">
                <input
                    type="text"
                    value={newCarMake}
                    onChange={(e) => setNewCarMake(e.target.value)}
                    placeholder="Enter car make name"
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
