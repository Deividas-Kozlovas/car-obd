import { useState } from "react";
import { FaTrash } from "react-icons/fa";
import { removeCarMake } from "@/Services/apiService";
import ConfirmDeleteModal from "@/Components/Modals/ConfirmDeleteModal";

export default function CarMakesList({
    carMakes,
    setCarMakes,
    selectedCarMake,
    setSelectedCarMake,
}) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);
    const [showAll, setShowAll] = useState(false);

    // Calculate how many items fit into two lines
    const itemsPerLine = 4; // Adjust this based on your layout (e.g., 4 items per line)
    const itemsToShow = itemsPerLine * 2; // Two lines of items
    const displayedCarMakes = showAll
        ? carMakes
        : carMakes.slice(0, itemsToShow);

    const handleDelete = async () => {
        try {
            await removeCarMake(itemToDelete.id);
            setCarMakes(
                carMakes.filter((carMake) => carMake.id !== itemToDelete.id)
            );
            if (selectedCarMake?.id === itemToDelete.id) {
                setSelectedCarMake(null);
            }
            setIsModalOpen(false);
        } catch (error) {
            console.error("Error deleting car make:", error);
        }
    };

    const openModal = (carMake) => {
        setItemToDelete(carMake);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setItemToDelete(null);
    };

    return (
        <div>
            <ul className="flex flex-wrap gap-2">
                {displayedCarMakes.map((carMake) => (
                    <li
                        key={carMake.id}
                        onClick={() => setSelectedCarMake(carMake)}
                        className={`flex items-center gap-2 px-3 py-1 border rounded-md cursor-pointer ${
                            selectedCarMake?.id === carMake.id
                                ? "bg-gray-200 border-gray-400"
                                : "border-gray-300"
                        }`}
                    >
                        <span className="truncate">{carMake.name}</span>
                        <button
                            onClick={(e) => {
                                e.stopPropagation(); // Prevent triggering the selection
                                openModal(carMake);
                            }}
                            className="text-red-500 hover:text-red-700"
                        >
                            <FaTrash />
                        </button>
                    </li>
                ))}
            </ul>
            {carMakes.length > itemsToShow && (
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
