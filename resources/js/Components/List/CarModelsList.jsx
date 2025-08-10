import { useState } from "react";
import { FaTrash } from "react-icons/fa";
import { removeCarModel } from "@/Services/apiService";
import ConfirmDeleteModal from "@/Components/Modals/ConfirmDeleteModal";

export default function CarModelsList({
    carModels,
    setCarModels,
    selectedCarMake,
}) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);
    const [showAll, setShowAll] = useState(false);

    const handleDelete = async () => {
        try {
            await removeCarModel(itemToDelete.id);
            setCarModels(
                carModels.filter((carModel) => carModel.id !== itemToDelete.id)
            );
            setIsModalOpen(false);
        } catch (error) {
            console.error("Error deleting car model:", error);
        }
    };

    const openModal = (carModel) => {
        setItemToDelete(carModel);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setItemToDelete(null);
    };

    const filteredCarModels = carModels.filter(
        (carModel) => carModel.car_make_id === selectedCarMake?.id
    );
    const displayedCarModels = showAll
        ? filteredCarModels
        : filteredCarModels.slice(0, 2);

    return (
        <div>
            <ul className="flex flex-wrap gap-2">
                {displayedCarModels.map((carModel) => (
                    <li
                        key={carModel.id}
                        className="flex items-center gap-2 px-3 py-1 border rounded-md"
                    >
                        <span className="truncate">{carModel.name}</span>
                        <button
                            onClick={() => openModal(carModel)}
                            className="text-red-500 hover:text-red-700"
                        >
                            <FaTrash />
                        </button>
                    </li>
                ))}
            </ul>
            {filteredCarModels.length > 2 && (
                <button
                    onClick={() => setShowAll(!showAll)}
                    className="mt-2 text-blue-500 hover:underline"
                >
                    {showAll ? "See Less" : "See More"}
                </button>
            )}
            <ConfirmDeleteModal
                isOpen={isModalOpen}
                onClose={closeModal}
                onConfirm={handleDelete}
                itemName={itemToDelete?.name}
            />
        </div>
    );
}
