import { Head } from "@inertiajs/react";
import { useState } from "react";

// Helper to read a cookie value by name
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
}

export default function Welcome({ auth, laravelVersion, phpVersion }) {
    const [showLogin, setShowLogin] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");

    const handleRegister = async (e) => {
        e.preventDefault();
        setErrorMessage("");

        const formData = new FormData(e.target);
        const password = formData.get("password");
        const passwordConfirmation = formData.get("password_confirmation");

        if (password !== passwordConfirmation) {
            setErrorMessage("Passwords do not match.");
            return;
        }

        try {
            // Read CSRF tokens
            const csrfToken = document
                .querySelector('meta[name="csrf-token"]')
                .getAttribute("content");
            const xsrfToken = getCookie("XSRF-TOKEN");

            const response = await fetch("/register", {
                method: "POST",
                credentials: "same-origin",
                headers: {
                    "X-CSRF-TOKEN": csrfToken,
                    "X-XSRF-TOKEN": xsrfToken,
                    "X-Requested-With": "XMLHttpRequest",
                    Accept: "application/json",
                },
                body: formData,
            });

            // If fetch followed a redirect to HTML, response.redirected will be true
            if (response.redirected) {
                window.location.href = response.url;
                return;
            }

            // Check content type before parsing JSON
            const contentType = response.headers.get("Content-Type") || "";
            if (!contentType.includes("application/json")) {
                // Probably HTML (error page or redirect)
                window.location.href = response.url;
                return;
            }

            const data = await response.json();
            if (response.ok) {
                console.log("Registration successful:", data);
                window.location.href = data.redirect || "/dashboard";
            } else if (response.status === 419) {
                // CSRF token mismatch or session expired
                setErrorMessage(
                    "Session expired. Please refresh the page and try again."
                );
            } else {
                setErrorMessage(data.message || "Registration failed.");
                console.error("Registration error:", data);
            }
        } catch (error) {
            setErrorMessage("An unexpected error occurred.");
            console.error("Unexpected error:", error);
        }
    };

    return (
        <>
            <Head title="Welcome" />
            <div className="bg-gray-50 text-black/50 dark:bg-black dark:text-white/50">
                <div className="relative flex min-h-screen flex-col items-center justify-center">
                    <div className="relative w-full max-w-2xl px-6 lg:max-w-7xl">
                        <header className="py-10 text-center">
                            <h1 className="text-3xl font-bold text-black dark:text-white">
                                Welcome to Car OBD
                            </h1>
                            <p className="mt-2 text-gray-600 dark:text-gray-400">
                                Manage your car diagnostics with ease.
                            </p>
                        </header>

                        <main className="mt-6">
                            {auth.user ? (
                                <div className="text-center">
                                    <a
                                        href={route("dashboard")}
                                        className="rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
                                    >
                                        Go to Dashboard
                                    </a>
                                </div>
                            ) : (
                                <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md dark:bg-gray-800">
                                    <div className="flex justify-center mb-4">
                                        <button
                                            className={`px-4 py-2 text-sm font-medium ${
                                                showLogin
                                                    ? "bg-blue-500 text-white"
                                                    : "bg-gray-200 text-gray-700"
                                            } rounded-l-lg`}
                                            onClick={() => setShowLogin(true)}
                                        >
                                            Login
                                        </button>
                                        <button
                                            className={`px-4 py-2 text-sm font-medium ${
                                                !showLogin
                                                    ? "bg-blue-500 text-white"
                                                    : "bg-gray-200 text-gray-700"
                                            } rounded-r-lg`}
                                            onClick={() => setShowLogin(false)}
                                        >
                                            Register
                                        </button>
                                    </div>

                                    {showLogin ? (
                                        <form method="POST" action="/login">
                                            <input
                                                type="hidden"
                                                name="_token"
                                                value={document
                                                    .querySelector(
                                                        'meta[name="csrf-token"]'
                                                    )
                                                    .getAttribute("content")}
                                            />
                                            <div className="mb-4">
                                                <label
                                                    htmlFor="email"
                                                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                                                >
                                                    Email
                                                </label>
                                                <input
                                                    type="email"
                                                    id="email"
                                                    name="email"
                                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                                                    required
                                                />
                                            </div>
                                            <div className="mb-4">
                                                <label
                                                    htmlFor="password"
                                                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                                                >
                                                    Password
                                                </label>
                                                <input
                                                    type="password"
                                                    id="password"
                                                    name="password"
                                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                                                    required
                                                />
                                            </div>
                                            <button
                                                type="submit"
                                                className="w-full rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
                                            >
                                                Login
                                            </button>
                                        </form>
                                    ) : (
                                        <form onSubmit={handleRegister}>
                                            <input
                                                type="hidden"
                                                name="_token"
                                                value={document
                                                    .querySelector(
                                                        'meta[name="csrf-token"]'
                                                    )
                                                    .getAttribute("content")}
                                            />
                                            <div className="mb-4">
                                                <label
                                                    htmlFor="name"
                                                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                                                >
                                                    Name
                                                </label>
                                                <input
                                                    type="text"
                                                    id="name"
                                                    name="name"
                                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                                                    required
                                                />
                                            </div>
                                            <div className="mb-4">
                                                <label
                                                    htmlFor="email"
                                                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                                                >
                                                    Email
                                                </label>
                                                <input
                                                    type="email"
                                                    id="email"
                                                    name="email"
                                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                                                    required
                                                />
                                            </div>
                                            <div className="mb-4">
                                                <label
                                                    htmlFor="password"
                                                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                                                >
                                                    Password
                                                </label>
                                                <input
                                                    type="password"
                                                    id="password"
                                                    name="password"
                                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                                                    required
                                                />
                                            </div>
                                            <div className="mb-4">
                                                <label
                                                    htmlFor="password_confirmation"
                                                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                                                >
                                                    Confirm Password
                                                </label>
                                                <input
                                                    type="password"
                                                    id="password_confirmation"
                                                    name="password_confirmation"
                                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                                                    required
                                                />
                                            </div>
                                            {errorMessage && (
                                                <p className="text-red-500 text-sm mb-4">
                                                    {errorMessage}
                                                </p>
                                            )}
                                            <button
                                                type="submit"
                                                className="w-full rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
                                            >
                                                Register
                                            </button>
                                        </form>
                                    )}
                                </div>
                            )}
                        </main>

                        <footer className="py-16 text-center text-sm text-black dark:text-white/70">
                            Laravel v{laravelVersion} (PHP v{phpVersion})
                        </footer>
                    </div>
                </div>
            </div>
        </>
    );
}
