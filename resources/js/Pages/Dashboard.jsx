import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import { useState, useEffect } from "react";
import AddCarMakeForm from "@/Components/Forms/AddCarMakeForm";
import AddCarModelForm from "@/Components/Forms/AddCarModelForm";
import AddEcuForm from "@/Components/Forms/AddEcuForm";
import CarMakesList from "@/Components/List/CarMakesList";
import CarModelsList from "@/Components/List/CarModelsList";
import EcuList from "@/Components/List/EcuList";
import {
    fetchCarMakes,
    fetchCarModels,
    addCarMake,
    addCarModel,
    removeCarMake,
    removeCarModel,
} from "@/Services/apiService";

export default function Dashboard() {
    const [carMakes, setCarMakes] = useState([]);
    const [carModels, setCarModels] = useState([]);
    const [selectedCarMake, setSelectedCarMake] = useState(null);
    const [errorMessage, setErrorMessage] = useState("");
    const [ecus, setEcus] = useState([]);
    // NEW: collapse state
    const [showMakes, setShowMakes] = useState(true);
    const [showModels, setShowModels] = useState(true);

    // Fetch car makes and models from the backend
    useEffect(() => {
        fetchCarMakes()
            .then((data) => setCarMakes(data))
            .catch((error) => {
                console.error("Error fetching car makes:", error);
                setErrorMessage("Failed to load car makes.");
            });

        fetchCarModels()
            .then((data) => setCarModels(data))
            .catch((error) => {
                console.error("Error fetching car models:", error);
                setErrorMessage("Failed to load car models.");
            });
    }, []);

    return (
        <AuthenticatedLayout>
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <h1 className="text-xl font-bold mb-4">
                                Add Car Makes, Models
                            </h1>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Car Makes Panel */}
                                <div className="border rounded-lg p-4 bg-gray-50">
                                    <button
                                        type="button"
                                        onClick={() => setShowMakes((s) => !s)}
                                        className="w-full flex justify-between items-center md:cursor-default"
                                        aria-expanded={showMakes}
                                        aria-controls="car-makes-panel"
                                    >
                                        <span className="font-semibold text-sm md:text-base">
                                            Car Makes
                                        </span>
                                        <span className="md:hidden text-xl leading-none select-none">
                                            {showMakes ? "−" : "+"}
                                        </span>
                                    </button>
                                    <div
                                        id="car-makes-panel"
                                        className={`${
                                            showMakes
                                                ? "block"
                                                : "hidden md:block"
                                        } mt-4 space-y-6`}
                                    >
                                        <AddCarMakeForm
                                            carMakes={carMakes}
                                            setCarMakes={setCarMakes}
                                        />
                                        <CarMakesList
                                            carMakes={carMakes}
                                            setCarMakes={setCarMakes}
                                            selectedCarMake={selectedCarMake}
                                            setSelectedCarMake={
                                                setSelectedCarMake
                                            }
                                        />
                                    </div>
                                </div>

                                {/* Car Models Panel */}
                                <div className="border rounded-lg p-4 bg-gray-50">
                                    <button
                                        type="button"
                                        onClick={() => setShowModels((s) => !s)}
                                        className="w-full flex justify-between items-center md:cursor-default"
                                        aria-expanded={showModels}
                                        aria-controls="car-models-panel"
                                    >
                                        <span className="font-semibold text-sm md:text-base">
                                            Car Models
                                        </span>
                                        <span className="md:hidden text-xl leading-none select-none">
                                            {showModels ? "−" : "+"}
                                        </span>
                                    </button>
                                    <div
                                        id="car-models-panel"
                                        className={`${
                                            showModels
                                                ? "block"
                                                : "hidden md:block"
                                        } mt-4`}
                                    >
                                        <AddCarModelForm
                                            carModels={carModels}
                                            setCarModels={setCarModels}
                                            selectedCarMake={selectedCarMake}
                                        />
                                        <CarModelsList
                                            carModels={carModels}
                                            setCarModels={setCarModels}
                                            selectedCarMake={selectedCarMake}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div>
                            <AddEcuForm ecus={ecus} setEcus={setEcus} />
                        </div>
                        <div>
                            <EcuList ecus={ecus} setEcus={setEcus} />
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
