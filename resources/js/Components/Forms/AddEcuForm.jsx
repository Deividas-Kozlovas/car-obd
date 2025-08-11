import { useState, useEffect } from "react";
import { fetchCarMakes, fetchCarModels } from "../../Services/apiService";

const PAYMENT_METHODS = [
    { value: "credit_card", label: "Credit Card" },
    { value: "paypal", label: "PayPal" },
    { value: "bank_transfer", label: "Bank Transfer" },
];

const GEARBOX_OPTIONS = [
    { value: "manual", label: "Manual" },
    { value: "automatic", label: "Automatic" },
    { value: "semi_automatic", label: "Semi-Automatic" },
];

export default function AddEcuForm({ ecus, setEcus }) {
    const [formData, setFormData] = useState({
        car_make_id: "",
        car_model_id: "",
        engine: "",
        gearbox: "",
        power: "",
        hw: "",
        sw: "",
        ecu: "",
        year: "",
        flasher: "",
        filesize: "",
        transfer_price: "",
        payment_method: "",
        original_extension: "",
        compressed_extension: "",
    });
    const [file, setFile] = useState(null);
    const [errorMessage, setErrorMessage] = useState("");
    const [carMakes, setCarMakes] = useState([]);
    const [carModels, setCarModels] = useState([]);
    const [filteredCarModels, setFilteredCarModels] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const makes = await fetchCarMakes();
                setCarMakes(makes);
                const models = await fetchCarModels();
                setCarModels(models);
            } catch {
                setErrorMessage("Failed to load car makes or models.");
            }
        };
        fetchData();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === "car_make_id") {
            const filtered = carModels.filter(
                (m) => m.car_make_id === parseInt(value)
            );
            setFilteredCarModels(filtered);
            setFormData((prev) => ({
                ...prev,
                car_make_id: value,
                car_model_id: "",
            }));
            return;
        }

        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => setFile(e.target.files[0]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData();
        Object.keys(formData).forEach((k) => data.append(k, formData[k]));
        if (file) data.append("file", file);

        const csrfToken = document
            .querySelector('meta[name="csrf-token"]')
            .getAttribute("content");
        data.append("_token", csrfToken);

        try {
            const res = await fetch("/ecus", {
                method: "POST",
                body: data,
            });
            if (!res.ok) throw new Error("Failed to add ECU");
            const created = await res.json();
            setEcus([...ecus, created]);
            setFormData({
                car_make_id: "",
                car_model_id: "",
                engine: "",
                gearbox: "",
                power: "",
                hw: "",
                sw: "",
                ecu: "",
                year: "",
                flasher: "",
                filesize: "",
                transfer_price: "",
                payment_method: "",
                original_extension: "",
                compressed_extension: "",
            });
            setFilteredCarModels([]);
            setFile(null);
            setErrorMessage("");
        } catch (err) {
            setErrorMessage(err.message || "Unexpected error.");
        }
    };

    // Ordered fields in two logical groups for layout
    const specFields = [
        { key: "engine", label: "Engine", required: true },
        {
            key: "gearbox",
            label: "Gearbox",
            type: "select",
            options: GEARBOX_OPTIONS,
            required: true,
        },
        { key: "power", label: "Power", required: true },
        { key: "hw", label: "HW", required: true },
        { key: "sw", label: "SW", required: true },
        { key: "ecu", label: "ECU", required: true },
        {
            key: "year",
            label: "Year",
            type: "date", // Changed to date selector
            required: true,
        },
        { key: "flasher", label: "Flasher", required: true },
    ];

    const metaFields = [
        { key: "transfer_price", label: "Transfer Price", type: "number" },
        {
            key: "payment_method",
            label: "Payment Method",
            type: "select",
            options: PAYMENT_METHODS,
        },
        { key: "original_extension", label: "Original Ext" },
        { key: "compressed_extension", label: "Compressed Ext" },
    ];

    const inputField = ({ key, label, type = "text", required, options }) => (
        <div key={key} className="flex flex-col gap-1">
            <label className="text-xs font-medium text-gray-600">
                {label}
                {required && <span className="text-red-500">*</span>}
            </label>
            {type === "select" ? (
                <select
                    name={key}
                    value={formData[key]}
                    onChange={handleChange}
                    required={required}
                    className="px-3 py-2 border rounded-md text-sm focus:ring focus:ring-blue-200"
                >
                    <option value="">Select {label.toLowerCase()}</option>
                    {options.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
            ) : (
                <input
                    type={type}
                    name={key}
                    value={formData[key]}
                    onChange={handleChange}
                    required={required}
                    className="px-3 py-2 border rounded-md text-sm focus:ring focus:ring-blue-200"
                />
            )}
        </div>
    );

    return (
        <form
            onSubmit={handleSubmit}
            className="mb-8 bg-white border rounded-lg p-4 md:p-6 shadow-sm space-y-6"
        >
            <h2 className="text-lg font-semibold">Add ECU</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Column 1 */}
                <div className="space-y-6">
                    <div className="space-y-4">
                        <h3 className="text-sm font-semibold text-gray-700">
                            Vehicle
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 gap-4">
                            <div className="flex flex-col gap-1">
                                <label className="text-xs font-medium text-gray-600">
                                    Car Make
                                    <span className="text-red-500">*</span>
                                </label>
                                <select
                                    name="car_make_id"
                                    value={formData.car_make_id}
                                    onChange={handleChange}
                                    required
                                    className="px-3 py-2 border rounded-md text-sm focus:ring focus:ring-blue-200"
                                >
                                    <option value="">Select make</option>
                                    {carMakes.map((m) => (
                                        <option key={m.id} value={m.id}>
                                            {m.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="flex flex-col gap-1">
                                <label className="text-xs font-medium text-gray-600">
                                    Car Model
                                    <span className="text-red-500">*</span>
                                </label>
                                <select
                                    name="car_model_id"
                                    value={formData.car_model_id}
                                    onChange={handleChange}
                                    required
                                    disabled={!filteredCarModels.length}
                                    className="px-3 py-2 border rounded-md text-sm focus:ring focus:ring-blue-200 disabled:bg-gray-100"
                                >
                                    <option value="">
                                        {filteredCarModels.length
                                            ? "Select model"
                                            : "Select make first"}
                                    </option>
                                    {filteredCarModels.map((m) => (
                                        <option key={m.id} value={m.id}>
                                            {m.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h3 className="text-sm font-semibold text-gray-700">
                            Technical Specs
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {specFields.map(inputField)}
                        </div>
                    </div>
                </div>

                {/* Column 2 */}
                <div className="space-y-6">
                    <div className="space-y-4">
                        <h3 className="text-sm font-semibold text-gray-700">
                            Meta / Pricing
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {metaFields.map(inputField)}
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h3 className="text-sm font-semibold text-gray-700">
                            File
                        </h3>
                        <div className="flex flex-col gap-1">
                            <label className="text-xs font-medium text-gray-600">
                                Upload File
                            </label>
                            <input
                                type="file"
                                onChange={handleFileChange}
                                className="text-sm"
                            />
                            {file && (
                                <p className="text-xs text-gray-500">
                                    {file.name} ({(file.size / 1024).toFixed(1)}{" "}
                                    KB)
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {errorMessage && (
                <div className="text-red-600 text-sm">{errorMessage}</div>
            )}

            <div className="flex justify-end">
                <button
                    type="submit"
                    className="px-5 py-2.5 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring focus:ring-blue-300"
                >
                    Save ECU
                </button>
            </div>
        </form>
    );
}
