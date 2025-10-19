import React from "react";

interface BrandSectionProps {
    t: (key: string) => any;
}

const BrandSection: React.FC<BrandSectionProps> = ({ t }) => {
    return (
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-500 to-green-500 p-12 flex-col justify-between relative overflow-hidden lg:fixed lg:left-0 lg:top-0 lg:h-screen">
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
                    {t("login.brand.title")}
                </h1>
                <p className="text-xl text-blue-100 mb-8 leading-relaxed">
                    {t("login.brand.subtitle")}
                </p>

                {/* Feature highlights */}
                <div className="space-y-4">
                    {Array.isArray(t("login.brand.features")) &&
                        t("login.brand.features").map(
                            (feature: string, index: number) => (
                                <div
                                    key={index}
                                    className="flex items-center gap-3"
                                >
                                    <div className="w-2 h-2 bg-white rounded-full"></div>
                                    <span className="text-blue-100">
                                        {feature}
                                    </span>
                                </div>
                            )
                        )}
                </div>
            </div>

            {/* Bottom tagline */}
            <div className="text-white/80 text-sm z-10">
                {t("login.brand.tagline")}
            </div>
        </div>
    );
};

export default BrandSection;
