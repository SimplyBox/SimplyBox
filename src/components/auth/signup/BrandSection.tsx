import React from "react";
import { CheckCircle, MessageSquare, Mail, Zap, Lock } from "lucide-react";

interface BrandSectionProps {
    currentStep: number;
    t: (key: string) => any;
}

const BrandSection: React.FC<BrandSectionProps> = ({ currentStep, t }) => {
    const getFeatures = () => {
        if (currentStep === 1) return t("signup.brand.featuresStep1");
        if (currentStep === 2) return t("signup.brand.featuresStep2");
        return t("signup.brand.featuresStep3");
    };

    const getStepTitle = () => `titleStep${currentStep}`;
    const getStepSubtitle = () => `subtitleStep${currentStep}`;

    const getFeatureIcon = (index: number) => {
        if (currentStep === 1)
            return <CheckCircle className="w-5 h-5 text-white" />;
        if (currentStep === 2) {
            const icons = [<MessageSquare />, <Mail />, <Zap />];
            return React.cloneElement(icons[index % icons.length], {
                className: "w-5 h-5 text-white",
            });
        }
        return <Lock className="w-5 h-5 text-white" />;
    };

    const features = Array.isArray(getFeatures()) ? getFeatures() : [];

    return (
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-green-500 to-blue-500 p-12 flex-col justify-between relative overflow-hidden">
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

                {/* Features list */}
                <div className="space-y-4">
                    {features.map((feature: string, index: number) => (
                        <div key={index} className="flex items-center gap-3">
                            {getFeatureIcon(index)}
                            <span className="text-green-100">{feature}</span>
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
