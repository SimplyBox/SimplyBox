import React from "react";
import { CheckCircle, MessageSquare, Mail, Zap, Lock } from "lucide-react";

interface BrandSectionProps {
    currentStep: number;
    t: (key: string) => string;
}

const BrandSection: React.FC<BrandSectionProps> = ({ currentStep, t }) => {
    const stepOneFeatures = [
        "unifyChannels",
        "aiResponses",
        "followUpTracking",
        "teamCollaboration",
    ];

    const stepTwoFeatures = [
        "whatsappApi",
        "emailIntegration",
        "personalizedRecommendations",
    ];

    const stepThreeFeatures = ["secureData", "instantAccess", "fullControl"];

    const getCurrentFeatures = () => {
        if (currentStep === 1) return stepOneFeatures;
        if (currentStep === 2) return stepTwoFeatures;
        return stepThreeFeatures;
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

    const getFeatureIcon = (feature: string) => {
        if (currentStep === 1) {
            return <CheckCircle className="w-5 h-5 text-white" />;
        } else if (currentStep === 2) {
            if (feature === "whatsappApi") {
                return <MessageSquare className="w-5 h-5 text-white" />;
            } else if (feature === "emailIntegration") {
                return <Mail className="w-5 h-5 text-white" />;
            } else {
                return <Zap className="w-5 h-5 text-white" />;
            }
        } else {
            return <Lock className="w-5 h-5 text-white" />;
        }
    };

    return (
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#2ECC71] to-[#3A9BDC] p-12 flex-col justify-between relative overflow-hidden">
            {/* Background decorative elements */}
            <div className="absolute top-20 right-20 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
            <div className="absolute bottom-40 left-20 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
            <div className="absolute top-1/2 left-1/3 w-16 h-16 bg-white/10 rounded-full blur-lg"></div>

            {/* Logo */}
            <div className="flex items-center gap-3 z-10">
                <img
                    src="/LogoHorizontal.png"
                    alt="SimplyBox Logo"
                    className="h-12 mb-4 brightness-0 invert"
                />
            </div>

            {/* Main Content */}
            <div className="text-white z-10">
                <h1 className="text-4xl font-bold mb-6">
                    {t(`signup.brand.${getStepTitle()}`)}
                </h1>
                <p className="text-xl text-green-100 mb-8 leading-relaxed">
                    {t(`signup.brand.${getStepSubtitle()}`)}
                </p>

                {/* Step-specific content */}
                <div className="space-y-4">
                    {getCurrentFeatures().map((feature) => (
                        <div key={feature} className="flex items-center gap-3">
                            {getFeatureIcon(feature)}
                            <span className="text-green-100">
                                {t(`signup.brand.features.${feature}`)}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Bottom tagline */}
            <div className="text-white/80 text-sm z-10">
                {t("signup.brand.tagline")}
            </div>
        </div>
    );
};

export default BrandSection;
