import { useState } from "react";
import { FaTrash } from "react-icons/fa";
import { removeCarModel } from "@/Services/apiService";
import ConfirmDeleteModal from "@/Components/ConfirmDeleteModal";

export default function CarModelsList({
    carModels,
    setCarModels,
    selectedCarMake,
}) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);

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

    return (
        <>
            <ul className="flex flex-wrap gap-2">
                {carModels
                    .filter(
                        (carModel) =>
                            carModel.car_make_id === selectedCarMake?.id
                    )
                    .map((carModel) => (
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
            <ConfirmDeleteModal
                isOpen={isModalOpen}
                onClose={closeModal}
                onConfirm={handleDelete}
                itemName={itemToDelete?.name}
            />
        </>
    );
}
