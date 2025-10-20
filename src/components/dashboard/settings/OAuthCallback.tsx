import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useWhatsApp } from "@/contexts/WhatsAppContext";

const OAuthCallback: React.FC = () => {
    const navigate = useNavigate();
    const { configureWhatsApp } = useWhatsApp();
    const [status, setStatus] = useState<"loading" | "success" | "error">(
        "loading"
    );
    const [errorMessage, setErrorMessage] = useState("");

    const hasProcessed = useRef(false);

    useEffect(() => {
        if (hasProcessed.current) {
            return;
        }

        const handleOAuthCallback = async () => {
            const urlParams = new URLSearchParams(window.location.search);
            const code = urlParams.get("code");
            const error = urlParams.get("error");

            if (error) {
                setStatus("error");
                setErrorMessage("OAuth authorization was cancelled or failed.");
                setTimeout(() => {
                    navigate("/dashboard?tab=settings");
                }, 3000);
                return;
            }

            if (!code) {
                setStatus("error");
                setErrorMessage("No authorization code received.");
                setTimeout(() => {
                    navigate("/dashboard?tab=settings");
                }, 3000);
                return;
            }

            try {
                hasProcessed.current = true;

                const { success, error } = await configureWhatsApp(code);
                if (success) {
                    setStatus("success");
                    setTimeout(() => {
                        navigate("/dashboard?tab=settings");
                    }, 1500);
                } else {
                    setStatus("error");
                    setErrorMessage(
                        error || "Failed to process WhatsApp configuration"
                    );
                    setTimeout(() => {
                        navigate("/dashboard?tab=settings");
                    }, 3000);
                }
            } catch (err) {
                console.error("Error during OAuth callback:", err);
                setStatus("error");
                setErrorMessage(
                    "An unexpected error occurred during OAuth processing."
                );
                setTimeout(() => {
                    navigate("/dashboard?tab=settings");
                }, 3000);
            }
        };

        handleOAuthCallback();
    }, []);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
                {status === "loading" && (
                    <>
                        <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
                        <h2 className="text-xl font-semibold text-gray-900 mb-2">
                            Processing OAuth...
                        </h2>
                        <p className="text-gray-600">
                            Please wait while we connect your WhatsApp Business
                            account.
                        </p>
                    </>
                )}

                {status === "success" && (
                    <>
                        <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg
                                className="h-5 w-5 text-green-600"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M5 13l4 4L19 7"
                                />
                            </svg>
                        </div>
                        <h2 className="text-xl font-semibold text-gray-900 mb-2">
                            Connection Successful!
                        </h2>
                        <p className="text-gray-600">
                            Your WhatsApp Business account has been connected.
                            Redirecting you back to settings...
                        </p>
                    </>
                )}

                {status === "error" && (
                    <>
                        <div className="h-8 w-8 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg
                                className="h-5 w-5 text-red-600"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                        </div>
                        <h2 className="text-xl font-semibold text-gray-900 mb-2">
                            Connection Failed
                        </h2>
                        <p className="text-gray-600 mb-4">{errorMessage}</p>
                        <p className="text-sm text-gray-500">
                            Redirecting you back to settings...
                        </p>
                    </>
                )}
            </div>
        </div>
    );
};

export default OAuthCallback;
