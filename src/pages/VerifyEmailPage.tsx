import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "../components/ui/card";
import { useAuth } from "../contexts/AuthContext";
import { useLanguage } from "../contexts/LanguageContext";

const VerifyEmailPage: React.FC = () => {
    const { t } = useLanguage();
    const { resendVerification } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const email = location.state?.email || "";
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const handleResend = async () => {
        if (!email) {
            setError(t("verifyEmail.errorNoEmail"));
            return;
        }
        setIsLoading(true);
        setMessage("");
        setError("");

        const result = await resendVerification(email);
        if (result.success) {
            setMessage(t("verifyEmail.successMessage"));
        } else {
            setError(result.error || t("verifyEmail.errorFailed"));
        }
        setIsLoading(false);
    };

    const handleBackToLogin = () => {
        navigate("/login");
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <Card className="w-full max-w-md border-0 shadow-lg">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl font-bold text-gray-900">
                        {t("verifyEmail.title")}
                    </CardTitle>
                    <CardDescription className="text-gray-600">
                        {t("verifyEmail.description", { email: email })}
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                    {message && (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-green-700 text-sm">
                            {message}
                        </div>
                    )}
                    {error && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-700 text-sm">
                            {error}
                        </div>
                    )}
                    <Button
                        onClick={handleResend}
                        disabled={isLoading || !email}
                        className="w-full"
                    >
                        {isLoading
                            ? t("verifyEmail.resending")
                            : t("verifyEmail.resendButton")}
                    </Button>
                    <Button
                        variant="outline"
                        onClick={handleBackToLogin}
                        className="w-full"
                    >
                        {t("verifyEmail.backToLogin")}
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
};

export default VerifyEmailPage;
