import React, { useState } from "react";
import { Button } from "../components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "../components/ui/card";
import { ArrowLeft } from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";
import { useAuth } from "../contexts/AuthContext";

import BrandSection from "../components/auth/login/BrandSection";
import GoogleLoginButton from "../components/auth/login/GoogleLoginButton";
import LoginForm from "../components/auth/login/LoginForm";
import { useNavigate } from "react-router-dom";

const LoginPage: React.FC = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string>("");
    const { t } = useLanguage();
    const navigate = useNavigate();
    const { signIn, signInWithOAuth } = useAuth();

    const handleBack = () => {
        navigate("/");
    };

    const handleSignUp = () => {
        navigate("/signup");
    };

    const handleSubmit = async (email: string, password: string) => {
        try {
            setIsLoading(true);
            setError("");

            const result = await signIn(email, password);

            if (result.success) {
                console.log("Login successful");
                navigate("/dashboard");
            } else {
                setError(result.error || "Login failed");
            }
        } catch (err) {
            console.error("Login error:", err);
            setError("An unexpected error occurred");
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        try {
            setIsLoading(true);
            setError("");

            const result = await signInWithOAuth(
                window.location.origin + "/dashboard"
            );

            if (result.success) {
                console.log("Google login initiated");
            } else {
                setError(result.error || "Google login failed");
                setIsLoading(false);
            }
        } catch (err) {
            console.error("Google login error:", err);
            setError("An unexpected error occurred");
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex">
            {/* Left Side - Brand Section */}
            <BrandSection t={t} />

            {/* Right Side - Login Form */}
            <div className="w-full lg:w-1/2 lg:ml-[50%] flex items-center justify-center p-8 bg-gray-50 overflow-y-auto">
                <div className="w-full max-w-md">
                    {/* Back button */}
                    <Button
                        variant="ghost"
                        onClick={handleBack}
                        className="mb-8 text-gray-600 hover:text-gray-900 p-0"
                        disabled={isLoading}
                    >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        {t("login.form.backToHome")}
                    </Button>

                    <Card className="border-0 shadow-lg">
                        <CardHeader className="text-center pb-6">
                            <CardTitle className="text-2xl font-bold text-gray-900">
                                {t("login.form.title")}
                            </CardTitle>
                            <CardDescription className="text-gray-600">
                                {t("login.form.subtitle")}
                            </CardDescription>
                        </CardHeader>

                        <CardContent className="space-y-6">
                            {/* Error Message */}
                            {error && (
                                <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
                                    {error}
                                </div>
                            )}

                            {/* Google Login */}
                            <GoogleLoginButton
                                onGoogleLogin={handleGoogleLogin}
                                isLoading={isLoading}
                                t={t}
                            />

                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <span className="w-full border-t border-gray-300" />
                                </div>
                                <div className="relative flex justify-center text-xs uppercase">
                                    <span className="bg-white px-2 text-gray-500">
                                        {t("login.form.or")}
                                    </span>
                                </div>
                            </div>

                            {/* Login Form */}
                            <LoginForm
                                onSubmit={handleSubmit}
                                isLoading={isLoading}
                                t={t}
                            />

                            <div className="text-center text-sm text-gray-600">
                                {t("login.form.noAccount")}{" "}
                                <Button
                                    variant="link"
                                    onClick={handleSignUp}
                                    className="text-blue-500 hover:text-blue-600 p-0"
                                    disabled={isLoading}
                                >
                                    {t("login.form.createAccount")}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
