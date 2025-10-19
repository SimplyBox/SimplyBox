import React, { useState, useEffect } from "react";
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
import SetupPreferencesStep from "../components/auth/signup/SetupPreferencesStep";
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
    wa_data?: {
        waba_id: string;
        phone_number: string;
        phone_number_id: string;
        meta_business_id: string;
        access_token: string;
    };
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

    // Handle OAuth success and restore form data (tidak berubah)
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const oauthSuccess = urlParams.get("oauth") === "success";
        const tempWaData = localStorage.getItem("temp_wa_data");
        const savedFormData = localStorage.getItem("signup_form_data");
        const savedStep = localStorage.getItem("signup_current_step");

        console.log("SignUpPage useEffect - OAuth check:", {
            oauthSuccess,
            tempWaData: !!tempWaData,
            savedFormData: !!savedFormData,
            savedStep,
        });

        // Restore saved form data if available
        if (savedFormData) {
            try {
                const formData = JSON.parse(savedFormData);
                console.log("Restoring form data:", formData);
                setBusinessData((prev) => ({
                    ...prev,
                    ...formData,
                }));
            } catch (error) {
                console.error("Error parsing saved form data:", error);
            }
        }

        // Restore saved step
        if (savedStep) {
            const stepNumber = parseInt(savedStep, 10);
            if (stepNumber >= 1 && stepNumber <= 3) {
                setCurrentStep(stepNumber);
            }
        }

        // Handle OAuth success
        if (oauthSuccess && tempWaData) {
            try {
                const waData = JSON.parse(tempWaData);
                console.log("Processing OAuth success with WA data:", waData);

                setBusinessData((prev) => ({
                    ...prev,
                    wa_data: waData,
                }));

                // Clean up temporary OAuth storage
                localStorage.removeItem("temp_wa_data");
                localStorage.removeItem("oauth_success");

                // Set to step 2 since OAuth was completed from step 2
                setCurrentStep(2);

                // Clean up URL
                window.history.replaceState(
                    {},
                    document.title,
                    window.location.pathname
                );
            } catch (error) {
                console.error("Error parsing temporary WhatsApp data:", error);
            }
        }
    }, []);

    // Save form data whenever businessData changes (tidak berubah)
    useEffect(() => {
        // Only save if we have some meaningful data
        if (businessData.businessName || businessData.businessType) {
            const formDataToSave = {
                businessName: businessData.businessName,
                businessType: businessData.businessType,
                businessNIB: businessData.businessNIB,
                businessPhone: businessData.businessPhone,
                businessEmail: businessData.businessEmail,
                teamSize: businessData.teamSize,
                dailyMessages: businessData.dailyMessages,
                ownerName: businessData.ownerName,
                ownerPhone: businessData.ownerPhone,
                ownerEmail: businessData.ownerEmail,
                ownerPassword: businessData.ownerPassword,
            };

            localStorage.setItem(
                "signup_form_data",
                JSON.stringify(formDataToSave)
            );
            localStorage.setItem("signup_current_step", currentStep.toString());

            console.log("Auto-saving form data:", formDataToSave);
        }
    }, [businessData, currentStep]);

    const handleBack = () => {
        // Clean up localStorage when going back to home
        localStorage.removeItem("signup_form_data");
        localStorage.removeItem("signup_current_step");
        navigate("/");
    };

    const handleLogin = () => {
        navigate("/login");
    };

    const handleNext = () => {
        if (currentStep === 1) {
            // Validate required fields for step 1
            if (
                !businessData.businessName ||
                !businessData.businessType ||
                !businessData.businessNIB ||
                !businessData.businessPhone ||
                !businessData.businessEmail
            ) {
                setErrorMessage(t("signup.step1.validation.fillRequired"));
                return;
            }
            setErrorMessage("");
            setCurrentStep(2);
        } else if (currentStep === 2) {
            // Validate step 2 fields
            if (!businessData.teamSize || !businessData.dailyMessages) {
                setErrorMessage(t("signup.step2.validation.fillRequired"));
                return;
            }
            setErrorMessage("");
            setCurrentStep(3);
        }
    };

    const handleComplete = async () => {
        // Validate step 3 fields
        if (
            !businessData.ownerName ||
            !businessData.ownerPhone ||
            !businessData.ownerEmail ||
            !businessData.ownerPassword
        ) {
            setErrorMessage(t("signup.step3.validation.fillRequired"));
            return;
        }

        if (businessData.ownerPassword.length < 8) {
            setErrorMessage(t("signup.step3.validation.passwordLength"));
            return;
        }

        setIsLoading(true);
        setErrorMessage("");

        console.log("Completing signup with data:", businessData);

        try {
            const result = await signUp(businessData);

            if (result.success) {
                // Clean up localStorage on successful signup
                localStorage.removeItem("signup_form_data");
                localStorage.removeItem("signup_current_step");

                if (result.needsVerification) {
                    // Navigate ke verify email page, pass email via state
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
        if (currentStep === 2) return "titleStep2";
        return "titleStep3";
    };

    const getStepSubtitle = () => {
        if (currentStep === 1) return "subtitleStep1";
        if (currentStep === 2) return "subtitleStep2";
        return "subtitleStep3";
    };

    const getProgressLabel = () => {
        if (currentStep === 1) return "businessInfo";
        if (currentStep === 2) return "setupPreferences";
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
                    <SetupPreferencesStep
                        businessData={businessData}
                        updateBusinessData={updateBusinessData}
                        onNext={handleNext}
                        t={t}
                    />
                );
            case 3:
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
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-50">
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
                                    total: 3,
                                })}
                            </span>
                            <span className="text-sm text-gray-500">
                                {t(`signup.progress.${getProgressLabel()}`)}
                            </span>
                        </div>
                        <Progress value={currentStep * 33.33} className="h-2" />
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
