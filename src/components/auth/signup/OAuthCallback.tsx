import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";

const OAuthCallback: React.FC = () => {
    const navigate = useNavigate();
    const [status, setStatus] = useState<"loading" | "success" | "error">(
        "loading"
    );
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        const handleOAuthCallback = async () => {
            const urlParams = new URLSearchParams(window.location.search);
            const code = urlParams.get("code");
            const error = urlParams.get("error");

            if (error) {
                setStatus("error");
                setErrorMessage("OAuth authorization was cancelled or failed.");
                setTimeout(() => {
                    navigate("/signup");
                }, 3000);
                return;
            }

            if (!code) {
                setStatus("error");
                setErrorMessage("No authorization code received.");
                setTimeout(() => {
                    navigate("/signup");
                }, 3000);
                return;
            }

            try {
                // Get Supabase anon key from environment
                const supabaseUrl = "https://xrtnyuslwkacznpvkuwr.supabase.co";
                const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

                if (!supabaseAnonKey) {
                    throw new Error(
                        "Missing VITE_SUPABASE_ANON_KEY environment variable"
                    );
                }

                // Use the correct endpoint with proper authentication
                const response = await fetch(
                    `${supabaseUrl}/functions/v1/meta-oauth-integration`,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${supabaseAnonKey}`,
                            apikey: supabaseAnonKey,
                        },
                        body: JSON.stringify({ code }),
                    }
                );

                const data = await response.json();

                if (!response.ok) {
                    console.error("OAuth error:", data.error, data.details);
                    setStatus("error");
                    setErrorMessage(
                        data.error || "Failed to process OAuth callback"
                    );
                    setTimeout(() => {
                        navigate("/signup");
                    }, 3000);
                    return;
                }

                // Store the OAuth data temporarily in localStorage
                const waData = {
                    waba_id: data.waba_id,
                    phone_number: data.phone_number,
                    phone_number_id: data.phone_number_id,
                    meta_business_id: data.meta_business_id,
                    access_token: data.access_token,
                };

                localStorage.setItem("temp_wa_data", JSON.stringify(waData));
                localStorage.setItem("oauth_success", "true");

                setStatus("success");

                // Redirect back to signup with step 2
                setTimeout(() => {
                    navigate("/signup?oauth=success");
                }, 1500);
            } catch (error) {
                console.error("Error during OAuth callback:", error);
                setStatus("error");
                setErrorMessage(
                    "An unexpected error occurred during OAuth processing."
                );
                setTimeout(() => {
                    navigate("/signup");
                }, 3000);
            }
        };

        handleOAuthCallback();
    }, [navigate]);

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
                            Redirecting you back to signup...
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
                            Redirecting you back to signup...
                        </p>
                    </>
                )}
            </div>
        </div>
    );
};

export default OAuthCallback;
