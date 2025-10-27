import React, { useState } from "react";
import { Button } from "../ui/button";
import { PlayCircle } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { useLanguage } from "@/contexts/LanguageContext";

interface HeroSectionProps {
    onLanguageChange?: (language: "en" | "id") => void;
    onTryFree?: () => void;
    onLogin?: () => void;
    onSignUp?: () => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({
    onLanguageChange = () => {},
    onTryFree = () => {},
    onLogin = () => {},
    onSignUp = () => {},
}) => {
    const [showDemo, setShowDemo] = useState(false);
    const { t, language } = useLanguage();

    return (
        <div className="relative w-full bg-gradient-to-b from-blue-50 to-white overflow-hidden">
            {/* Simple Header - Conditional based on auth state */}
            <div className="absolute top-0 right-0 z-10 p-6">
                <div className="flex items-center gap-3">
                    <>
                        <Button
                            variant="ghost"
                            className="text-gray-700 hover:text-gray-900 font-medium"
                            onClick={() => onLogin && onLogin()}
                        >
                            Login
                        </Button>
                        <Button
                            className="bg-green-500 hover:bg-green-600 text-white font-medium px-6"
                            onClick={() => onSignUp && onSignUp()}
                        >
                            Sign Up
                        </Button>
                    </>
                </div>
            </div>

            {/* Background elements */}
            <div className="absolute top-20 right-0 w-64 h-64 bg-blue-100 rounded-full opacity-20 blur-3xl"></div>
            <div className="absolute bottom-10 left-10 w-48 h-48 bg-yellow-100 rounded-full opacity-20 blur-3xl"></div>

            {/* Hero Content */}
            <div className="py-16 md:py-24 px-4 md:px-8 lg:px-16">
                <div className="container mx-auto max-w-7xl">
                    <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
                        {/* Left Content */}
                        <div className="flex-1 text-left space-y-8">
                            {/* Logo positioned like reference */}
                            <div className="mb-8">
                                <img
                                    src="/LogoFull.png"
                                    alt="SimplyBox"
                                    className="h-24 w-auto"
                                />
                            </div>

                            {/* Hero content */}
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                                {t("hero.title")}
                            </h1>

                            <p className="text-xl md:text-2xl text-gray-600 leading-relaxed max-w-2xl">
                                {t("hero.subtitle")}
                            </p>

                            {/* CTA Buttons */}
                            <div className="flex flex-col sm:flex-row gap-4">
                                <Button
                                    size="lg"
                                    className="bg-green-500 hover:bg-green-600 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                                    onClick={onTryFree}
                                >
                                    {t("hero.tryFree")}
                                </Button>
                                <Button
                                    variant="outline"
                                    size="lg"
                                    className="border-2 border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white px-8 py-4 text-lg font-semibold rounded-xl transition-all duration-300 transform hover:scale-105"
                                    onClick={() => setShowDemo(true)}
                                >
                                    <PlayCircle className="mr-2 h-5 w-5" />
                                    {t("hero.watchDemo")}
                                </Button>
                            </div>

                            {/* Language toggle */}
                            <div className="mt-8 flex items-center gap-3">
                                <span className="text-gray-600 text-sm">
                                    {t("hero.languageLabel")}
                                </span>
                                <div className="flex bg-gray-100 rounded-full p-1">
                                    <button
                                        onClick={() => onLanguageChange("en")}
                                        className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                                            language === "en"
                                                ? "bg-blue-500 text-white"
                                                : "text-gray-600 hover:text-gray-800"
                                        }`}
                                    >
                                        EN
                                    </button>
                                    <button
                                        onClick={() => onLanguageChange("id")}
                                        className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                                            language === "id"
                                                ? "bg-blue-500 text-white"
                                                : "text-gray-600 hover:text-gray-800"
                                        }`}
                                    >
                                        ID
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Right Content - Dashboard Preview */}
                        <div className="flex-1 relative z-10">
                            <div className="relative bg-white rounded-3xl shadow-2xl p-8 max-w-lg mx-auto border border-gray-100">
                                {/* AI Badge */}
                                <div className="absolute -top-4 left-8 bg-gradient-to-r from-blue-500 to-green-500 text-white px-6 py-3 rounded-full text-sm font-semibold shadow-lg">
                                    {t("hero.aiPowered")}
                                </div>

                                {/* Dashboard mockup */}
                                <div className="bg-white rounded-lg shadow-lg p-4 mb-4">
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center gap-2">
                                            <div className="w-3 h-3 rounded-full bg-red-400"></div>
                                            <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                                            <div className="w-3 h-3 rounded-full bg-green-400"></div>
                                        </div>
                                        <div className="text-xs text-gray-500">
                                            SimplyBox Dashboard
                                        </div>
                                    </div>

                                    {/* Header */}
                                    <div className="flex items-center justify-between mb-8 pt-6">
                                        <h3 className="text-xl font-bold text-gray-800">
                                            {t("hero.dashboardTitle")}
                                        </h3>
                                        <div className="w-4 h-4 bg-green-400 rounded-full animate-pulse shadow-sm"></div>
                                    </div>

                                    {/* Message Items */}
                                    <div className="space-y-5 mb-8">
                                        <div className="flex items-center p-4 bg-green-50 rounded-xl border-l-4 border-green-400 hover:shadow-md transition-shadow">
                                            <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white font-bold mr-4 shadow-sm">
                                                W
                                            </div>
                                            <div className="flex-1">
                                                <p className="font-semibold text-gray-800">
                                                    {t("hero.whatsappBusiness")}
                                                </p>
                                                <p className="text-sm text-gray-600">
                                                    {t(
                                                        "hero.newCustomerInquiry"
                                                    )}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3 p-2 bg-gray-50 rounded">
                                            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                                                @
                                            </div>
                                            <div className="flex-1">
                                                <div className="text-xs font-medium">
                                                    Instagram
                                                </div>
                                                <div className="text-xs text-gray-600">
                                                    New message
                                                </div>
                                            </div>
                                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                        </div>
                                        <div className="flex items-center gap-3 p-2 bg-gray-50 rounded">
                                            <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                                                S
                                            </div>
                                            <div className="flex-1">
                                                <div className="text-xs font-medium">
                                                    Shopee
                                                </div>
                                                <div className="text-xs text-gray-600">
                                                    Product question
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Stats */}
                                <div className="grid grid-cols-3 gap-4">
                                    <div className="bg-blue-50 p-4 rounded-xl text-center hover:bg-blue-100 transition-colors">
                                        <div className="text-3xl font-bold text-blue-500">
                                            {t("hero.stats.response.value")}
                                        </div>
                                        <div className="text-xs text-gray-600 font-medium">
                                            {t("hero.stats.response.label")}
                                        </div>
                                    </div>
                                    <div className="bg-green-50 p-4 rounded-xl text-center hover:bg-green-100 transition-colors">
                                        <div className="text-3xl font-bold text-green-500">
                                            {t("hero.stats.leads.value")}
                                        </div>
                                        <div className="text-xs text-gray-600 font-medium">
                                            {t("hero.stats.leads.label")}
                                        </div>
                                    </div>
                                    <div className="bg-yellow-50 p-4 rounded-xl text-center hover:bg-yellow-100 transition-colors">
                                        <div className="text-3xl font-bold text-yellow-500">
                                            {t("hero.stats.timeSaved.value")}
                                        </div>
                                        <div className="text-xs text-gray-600 font-medium">
                                            {t("hero.stats.timeSaved.label")}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Demo Video Dialog */}
            <Dialog open={showDemo} onOpenChange={setShowDemo}>
                <DialogContent className="max-w-4xl">
                    <DialogHeader>
                        <DialogTitle>{t("hero.demoTitle")}</DialogTitle>
                    </DialogHeader>
                    <div className="aspect-video bg-gray-100 rounded-md flex items-center justify-center">
                        <p className="text-gray-500">
                            {t("hero.demoPlaceholder")}
                        </p>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default HeroSection;
