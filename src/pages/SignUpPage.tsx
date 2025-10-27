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
import { Progress } from "../components/ui/progress";
import { useLanguage } from "../contexts/LanguageContext";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

import BrandSection from "../components/auth/signup/BrandSection";
import BusinessInfoStep from "../components/auth/signup/BusinessInfoStep";
import AccountSetupStep from "../components/auth/signup/AccountSetupStep";

interface BusinessData {
    businessName: string;
    businessType: string;
    businessNIB: string;
    businessPhone: string;
    businessEmail: string;
    teamSize: string;
    dailyMessages: string;
    ownerName: string;
    ownerPhone: string;
    ownerEmail: string;
    ownerPassword: string;
}

const SignUpPage: React.FC = () => {
    const [currentStep, setCurrentStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [businessData, setBusinessData] = useState<BusinessData>({
        businessName: "",
        businessType: "",
        businessNIB: "",
        businessPhone: "",
        businessEmail: "",
        teamSize: "",
        dailyMessages: "",
        ownerName: "",
        ownerPhone: "",
        ownerEmail: "",
        ownerPassword: "",
    });

    const { t } = useLanguage();
    const { signUp } = useAuth();
    const navigate = useNavigate();

    const handleBack = () => {
        navigate("/");
    };

    const handleLogin = () => {
        navigate("/login");
    };

    const handleNext = () => {
        setErrorMessage("");
        setCurrentStep(2);
    };

    const handleComplete = async () => {
        if (
            !businessData.ownerName ||
            !businessData.ownerPhone ||
            !businessData.ownerEmail ||
            !businessData.ownerPassword
        ) {
            setErrorMessage(t("signup.step2.validation.fillRequired"));
            return;
        }

        if (businessData.ownerPassword.length < 8) {
            setErrorMessage(t("signup.step2.validation.passwordLength"));
            return;
        }

        setIsLoading(true);
        setErrorMessage("");

        try {
            const result = await signUp(businessData);

            if (result.success) {
                if (result.needsVerification) {
                    navigate("/verify-email", {
                        state: { email: businessData.ownerEmail },
                    });
                } else {
                    navigate("/dashboard");
                }
            } else {
                setErrorMessage(
                    result.error || "An error occurred during signup"
                );
            }
        } catch (error) {
            console.error("Signup error:", error);
            setErrorMessage("An unexpected error occurred. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const updateBusinessData = (field: keyof BusinessData, value: any) => {
        setBusinessData((prev) => ({ ...prev, [field]: value }));
        if (errorMessage) {
            setErrorMessage("");
        }
    };

    const getStepTitle = () => {
        if (currentStep === 1) return "titleStep1";
        return "titleStep2";
    };

    const getStepSubtitle = () => {
        if (currentStep === 1) return "subtitleStep1";
        return "subtitleStep2";
    };

    const getProgressLabel = () => {
        if (currentStep === 1) return "businessInfo";
        return "accountSetup";
    };

    const renderStepContent = () => {
        switch (currentStep) {
            case 1:
                return (
                    <BusinessInfoStep
                        businessData={businessData}
                        updateBusinessData={updateBusinessData}
                        onNext={handleNext}
                        t={t}
                    />
                );
            case 2:
                return (
                    <AccountSetupStep
                        businessData={businessData}
                        updateBusinessData={updateBusinessData}
                        onComplete={handleComplete}
                        isLoading={isLoading}
                        t={t}
                    />
                );
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen flex">
            <BrandSection currentStep={currentStep} t={t} />

            {/* Right Side - Form */}
            <div className="w-full lg:w-1/2 lg:ml-[50%] flex items-center justify-center p-8 bg-gray-50 overflow-y-auto">
                <div className="w-full max-w-md">
                    {/* Back button */}
                    <Button
                        variant="ghost"
                        onClick={handleBack}
                        className="mb-8 text-gray-600 hover:text-gray-900 p-0"
                    >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        {t("signup.form.backToHome")}
                    </Button>

                    {/* Progress indicator */}
                    <div className="mb-8">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-gray-600">
                                {t("signup.progress.step", {
                                    current: currentStep,
                                    total: 2,
                                })}
                            </span>
                            <span className="text-sm text-gray-500">
                                {t(`signup.progress.${getProgressLabel()}`)}
                            </span>
                        </div>
                        <Progress value={currentStep * 50} className="h-2" />{" "}
                    </div>

                    <Card className="border-0 shadow-lg">
                        <CardHeader className="text-center pb-6">
                            <CardTitle className="text-2xl font-bold text-gray-900">
                                {t(`signup.form.${getStepTitle()}`)}
                            </CardTitle>
                            <CardDescription className="text-gray-600">
                                {t(`signup.form.${getStepSubtitle()}`)}
                            </CardDescription>
                        </CardHeader>

                        <CardContent className="space-y-6">
                            {/* Error Message */}
                            {errorMessage && (
                                <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-700 text-sm">
                                    {errorMessage}
                                </div>
                            )}

                            {renderStepContent()}

                            <div className="text-center text-sm text-gray-600">
                                {t("signup.form.haveAccount")}{" "}
                                <Button
                                    variant="link"
                                    onClick={handleLogin}
                                    className="text-blue-500 hover:text-blue-600 p-0"
                                >
                                    {t("signup.form.signIn")}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default SignUpPage;
