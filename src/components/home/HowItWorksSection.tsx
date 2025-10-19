import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";

const HowItWorksSection: React.FC = () => {
    const { t } = useLanguage();

    const stepsData = [
        { key: "connect" },
        { key: "organize" },
        { key: "grow" },
    ];

    return (
        <section className="py-16 px-4 md:px-8 lg:px-16">
            <div className="max-w-7xl mx-auto">
                <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
                    {t("howItWorks.title")}
                </h2>
                <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                    {stepsData.map((step, index) => (
                        <div
                            key={`step-${index}`}
                            className="flex flex-col items-center text-center max-w-xs"
                        >
                            <div className="w-16 h-16 rounded-full bg-blue-500 text-white flex items-center justify-center text-2xl font-bold mb-4">
                                {index + 1}
                            </div>
                            <h3 className="text-xl font-semibold mb-2">
                                {t(`howItWorks.steps.${step.key}.title`)}
                            </h3>
                            <p className="text-gray-600 leading-relaxed">
                                {t(`howItWorks.steps.${step.key}.description`)}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default HowItWorksSection;
