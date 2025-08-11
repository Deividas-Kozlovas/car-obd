import { useState, useEffect } from "react";
import { FaTrash, FaDownload } from "react-icons/fa";
import ConfirmDeleteModal from "@/Components/Modals/ConfirmDeleteModal";

export default function EcuList({ ecus, setEcus }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);

    useEffect(() => {
        const fetchEcus = async () => {
            try {
                const res = await fetch("/ecus", {
                    headers: { Accept: "application/json" },
                });
                if (!res.ok) throw new Error(`Fetch failed ${res.status}`);
                const data = await res.json();
                setEcus(data);
            } catch (e) {
                console.error("Error fetching ECUs:", e);
            }
        };
        fetchEcus();
    }, [setEcus]);

    const getCsrf = () =>
        document
            .querySelector('meta[name="csrf-token"]')
            ?.getAttribute("content");

    const handleDelete = async () => {
        if (!itemToDelete) return;
        try {
            const res = await fetch(`/ecus/${itemToDelete.id}`, {
                method: "DELETE",
                headers: {
                    Accept: "application/json",
                    "X-CSRF-TOKEN": getCsrf(),
                    "X-Requested-With": "XMLHttpRequest",
                },
            });
            if (res.status !== 204) {
                const txt = await res.text();
                throw new Error(`Delete failed (${res.status}) ${txt}`);
            }
            setEcus(ecus.filter((e) => e.id !== itemToDelete.id));
            closeModal();
        } catch (e) {
            console.error("Error deleting ECU:", e);
            alert("Delete failed");
        }
    };

    const openModal = (ecu) => {
        setItemToDelete(ecu);
        setIsModalOpen(true);
    };
    const closeModal = () => {
        setIsModalOpen(false);
        setItemToDelete(null);
    };

    const relName = (ecu, key) =>
        ecu[key]?.name || ecu[key]?.Name || ecu[key]?.NAME || "";

    const fmtSize = (bytes) => {
        if (!bytes) return "-";
        if (bytes < 1024) return `${bytes} B`;
        const kb = bytes / 1024;
        if (kb < 1024) return `${kb.toFixed(1)} KB`;
        const mb = kb / 1024;
        return `${mb.toFixed(2)} MB`;
    };

    const hasFile = (ecu) =>
        ecu.file_name &&
        typeof ecu.file_name === "string" &&
        ecu.file_name.length > 0;

    return (
        <div className="space-y-6">
            {/* Desktop / Tablet Table */}
            <div className="hidden md:block overflow-x-auto border rounded">
                <table className="min-w-full text-sm">
                    <thead className="bg-gray-100">
                        <tr className="text-left">
                            <th className="p-2 border">ID</th>
                            <th className="p-2 border">Make</th>
                            <th className="p-2 border">Model</th>
                            <th className="p-2 border">Engine</th>
                            <th className="p-2 border">Gearbox</th>
                            <th className="p-2 border">Power</th>
                            <th className="p-2 border">HW</th>
                            <th className="p-2 border">SW</th>
                            <th className="p-2 border">ECU</th>
                            <th className="p-2 border">Year</th>
                            <th className="p-2 border">Flasher</th>
                            <th className="p-2 border">Size</th>
                            <th className="p-2 border hidden lg:table-cell">
                                Price
                            </th>
                            <th className="p-2 border hidden lg:table-cell">
                                Payment
                            </th>
                            <th className="p-2 border hidden xl:table-cell">
                                Orig Ext
                            </th>
                            <th className="p-2 border hidden xl:table-cell">
                                Comp Ext
                            </th>
                            <th className="p-2 border">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {ecus.length === 0 && (
                            <tr>
                                <td
                                    colSpan={17}
                                    className="p-4 text-center border"
                                >
                                    No ECUs found.
                                </td>
                            </tr>
                        )}
                        {ecus.map((ecu) => (
                            <tr key={ecu.id} className="hover:bg-gray-50">
                                <td className="p-2 border">{ecu.id}</td>
                                <td className="p-2 border">
                                    {relName(ecu, "car_make") ||
                                        relName(ecu, "carMake")}
                                </td>
                                <td className="p-2 border">
                                    {relName(ecu, "car_model") ||
                                        relName(ecu, "carModel")}
                                </td>
                                <td className="p-2 border">{ecu.engine}</td>
                                <td className="p-2 border">{ecu.gearbox}</td>
                                <td className="p-2 border">{ecu.power}</td>
                                <td className="p-2 border">{ecu.hw}</td>
                                <td className="p-2 border">{ecu.sw}</td>
                                <td className="p-2 border">{ecu.ecu}</td>
                                <td className="p-2 border">{ecu.year}</td>
                                <td className="p-2 border">{ecu.flasher}</td>
                                <td className="p-2 border">
                                    {fmtSize(ecu.filesize)}
                                </td>
                                <td className="p-2 border hidden lg:table-cell">
                                    {ecu.transfer_price
                                        ? "€" + ecu.transfer_price
                                        : "-"}
                                </td>
                                <td className="p-2 border hidden lg:table-cell">
                                    {ecu.payment_method || "-"}
                                </td>
                                <td className="p-2 border hidden xl:table-cell">
                                    {ecu.original_extension || "-"}
                                </td>
                                <td className="p-2 border hidden xl:table-cell">
                                    {ecu.compressed_extension || "-"}
                                </td>
                                <td className="p-2 border">
                                    <div className="flex gap-3 items-center">
                                        {hasFile(ecu) && (
                                            <a
                                                href={`/ecus/${ecu.id}/download`}
                                                className="text-blue-600 hover:text-blue-800 focus:outline-none focus:ring focus:ring-blue-300 rounded p-1"
                                                title="Download"
                                                aria-label={`Download ECU ${ecu.id}`}
                                            >
                                                <FaDownload />
                                            </a>
                                        )}
                                        <button
                                            onClick={() => openModal(ecu)}
                                            className="text-red-500 hover:text-red-700 focus:outline-none focus:ring focus:ring-red-300 rounded p-1"
                                            title="Delete"
                                            aria-label={`Delete ECU ${ecu.id}`}
                                            type="button"
                                        >
                                            <FaTrash />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden space-y-4">
                {ecus.length === 0 && (
                    <div className="text-center text-sm text-gray-500 border rounded p-4">
                        No ECUs found.
                    </div>
                )}
                {ecus.map((ecu) => (
                    <div
                        key={ecu.id}
                        className="border rounded p-4 bg-white shadow-sm flex flex-col gap-2"
                    >
                        <div className="flex justify-between items-center">
                            <span className="font-semibold">
                                {relName(ecu, "car_make") ||
                                    relName(ecu, "carMake")}{" "}
                                {relName(ecu, "car_model") ||
                                    relName(ecu, "carModel")}
                            </span>
                            <span className="text-xs text-gray-500">
                                #{ecu.id}
                            </span>
                        </div>
                        <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-xs">
                            <label className="font-medium">Engine:</label>
                            <span>{ecu.engine}</span>
                            <label className="font-medium">Gearbox:</label>
                            <span>{ecu.gearbox}</span>
                            <label className="font-medium">Power:</label>
                            <span>{ecu.power}</span>
                            <label className="font-medium">HW/SW:</label>
                            <span>
                                {ecu.hw}/{ecu.sw}
                            </span>
                            <label className="font-medium">Year:</label>
                            <span>{ecu.year}</span>
                            <label className="font-medium">Flasher:</label>
                            <span>{ecu.flasher}</span>
                            <label className="font-medium">Size:</label>
                            <span>{fmtSize(ecu.filesize)}</span>
                            <label className="font-medium">Price:</label>
                            <span>
                                {ecu.transfer_price
                                    ? "€" + ecu.transfer_price
                                    : "-"}
                            </span>
                        </div>
                        <div className="flex gap-4 mt-2">
                            {hasFile(ecu) && (
                                <a
                                    href={`/ecus/${ecu.id}/download`}
                                    className="inline-flex items-center gap-1 text-blue-600 text-sm hover:text-blue-800"
                                >
                                    <FaDownload /> Download
                                </a>
                            )}
                            <button
                                onClick={() => openModal(ecu)}
                                className="inline-flex items-center gap-1 text-red-600 text-sm hover:text-red-800"
                                type="button"
                            >
                                <FaTrash /> Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <ConfirmDeleteModal
                isOpen={isModalOpen}
                onClose={closeModal}
                onConfirm={handleDelete}
                itemName={itemToDelete?.ecu || `ECU #${itemToDelete?.id}`}
            />
        </div>
    );
}
