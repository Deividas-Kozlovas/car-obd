import { useState } from "react";
import { addCarMake } from "@/Services/apiService";

export default function AddCarMakeForm({ carMakes, setCarMakes }) {
    const [newCarMake, setNewCarMake] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!newCarMake.trim()) return;
        setLoading(true);
        setErrorMessage("");
        try {
            const createdCarMake = await addCarMake(newCarMake.trim());
            setCarMakes([...carMakes, createdCarMake]);
            setNewCarMake("");
        } catch (error) {
            console.error("Error adding car make:", error);
            setErrorMessage(error.message || "An unexpected error occurred.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="mb-6">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <div className="flex-1">
                    <label className="sr-only" htmlFor="car-make-input">
                        Car Make
                    </label>
                    <input
                        id="car-make-input"
                        type="text"
                        value={newCarMake}
                        onChange={(e) => setNewCarMake(e.target.value)}
                        placeholder="Enter car make name"
                        className="w-full px-4 py-2 border rounded-md text-sm focus:outline-none focus:ring focus:ring-blue-200"
                        required
                        maxLength={100}
                        disabled={loading}
                    />
                </div>
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full sm:w-auto px-5 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring focus:ring-blue-300 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                    {loading ? "Adding..." : "Add"}
                </button>
            </div>
            {errorMessage && (
                <p className="text-red-500 text-xs mt-2">{errorMessage}</p>
            )}
        </form>
    );
}
