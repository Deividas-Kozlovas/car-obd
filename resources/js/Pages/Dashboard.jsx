import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import { useState, useEffect } from "react";
import AddCarMakeForm from "@/Components/Forms/AddCarMakeForm";
import AddCarModelForm from "@/Components/Forms/AddCarModelForm";
import CarMakesList from "@/Components/List/CarMakesList";
import CarModelsList from "@/Components/List/CarModelsList";
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
                                Manage Car Makes and Models
                            </h1>

                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <AddCarMakeForm
                                        carMakes={carMakes}
                                        setCarMakes={setCarMakes}
                                    />
                                    <CarMakesList
                                        carMakes={carMakes}
                                        setCarMakes={setCarMakes}
                                        selectedCarMake={selectedCarMake}
                                        setSelectedCarMake={setSelectedCarMake}
                                    />
                                </div>

                                <div>
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
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
