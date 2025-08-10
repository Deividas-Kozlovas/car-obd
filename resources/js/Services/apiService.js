const csrfToken = document
    .querySelector('meta[name="csrf-token"]')
    ?.getAttribute("content");

const headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
    "X-CSRF-TOKEN": csrfToken,
};

// Fetch car makes
export const fetchCarMakes = async () => {
    const response = await fetch("/car-makes", { headers });
    if (!response.ok) {
        throw new Error("Failed to fetch car makes.");
    }
    return response.json();
};

// Fetch car models
export const fetchCarModels = async () => {
    const response = await fetch("/car-models", { headers });
    if (!response.ok) {
        throw new Error("Failed to fetch car models.");
    }
    return response.json();
};

// Add a new car make
export const addCarMake = async (newCarMake) => {
    const response = await fetch("/car-makes", {
        method: "POST",
        headers,
        body: JSON.stringify({ name: newCarMake }),
    });
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to add car make.");
    }
    return response.json();
};

// Add a new car model
export const addCarModel = async (newCarModel, carMakeId) => {
    const response = await fetch("/car-models", {
        method: "POST",
        headers,
        body: JSON.stringify({
            name: newCarModel,
            car_make_id: carMakeId,
        }),
    });
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to add car model.");
    }
    return response.json();
};

// Remove a car make
export const removeCarMake = async (id) => {
    const response = await fetch(`/car-makes/${id}`, {
        method: "DELETE",
        headers,
    });
    if (!response.ok) {
        throw new Error("Failed to delete car make.");
    }
};

// Remove a car model
export const removeCarModel = async (id) => {
    const response = await fetch(`/car-models/${id}`, {
        method: "DELETE",
        headers,
    });
    if (!response.ok) {
        throw new Error("Failed to delete car model.");
    }
};
