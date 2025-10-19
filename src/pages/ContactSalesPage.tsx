import React from "react";
import { Button } from "../components/ui/button";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "../components/ui/card";
import { ArrowLeft, MessageCircle, Mail, Star, Clock, Zap } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useLocation, useNavigate } from "react-router-dom";

const ContactSalesPage: React.FC = () => {
    const { t } = useLanguage();
    const navigate = useNavigate();
    const location = useLocation();

    const handleBack = () => {
        const from = location.state?.from;
        if (from) {
            navigate(from);
        } else {
            navigate(-1);
        }
    };

    const getBackButtonText = () => {
        const from = location.state?.from;
        if (from === "/dashboard/upgrade") {
            return t("contactSales.backToPlans");
        }
        return t("contactSales.backToHome");
    };

    const handleWhatsAppClick = () => {
        window.open(
            "https://wa.me/628811710715?text=Hi%20SimplyBox%20team%2C%20I%27m%20interested%20in%20discussing%20how%20SimplyBox%20can%20help%20streamline%20my%20business%20communications.%20Can%20we%20schedule%20a%20demo%3F",
            "_blank"
        );
    };

    const handleEmailClick = () => {
        window.open(
            "mailto:admin@simplybox.id?subject=SimplyBox%20Demo%20Request&body=Hi%20SimplyBox%20team%2C%0A%0AI%27m%20interested%20in%20seeing%20how%20SimplyBox%20can%20help%20my%20business%20manage%20customer%20communications%20more%20effectively.%0A%0ACould%20we%20schedule%20a%20personalized%20demo%3F%0A%0AThank%20you!",
            "_blank"
        );
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
            <div className="container mx-auto px-4 py-8 max-w-7xl">
                <Button
                    variant="ghost"
                    onClick={handleBack}
                    className="mb-8 text-gray-600 hover:text-gray-900"
                >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    {getBackButtonText()}
                </Button>

                {/* Hero Section */}
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
                        <Zap className="h-4 w-4" />
                        {t("contactSales.hero.tagline")}
                    </div>
                    <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                        {t("contactSales.hero.titlePrefix")}{" "}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-green-500">
                            {t("contactSales.hero.titleHighlight")}
                        </span>{" "}
                        {t("contactSales.hero.titleSuffix")}
                    </h1>
                    <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed mb-8">
                        {t("contactSales.hero.subtitle")}
                    </p>

                    {/* Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto">
                        <div className="text-center">
                            <div className="text-3xl font-bold text-blue-500 mb-2">
                                {t("contactSales.stats.responseTime.value")}
                            </div>
                            <div className="text-sm text-gray-600">
                                {t("contactSales.stats.responseTime.label")}
                            </div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl font-bold text-green-500 mb-2">
                                {t("contactSales.stats.salesConversions.value")}
                            </div>
                            <div className="text-sm text-gray-600">
                                {t("contactSales.stats.salesConversions.label")}
                            </div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl font-bold text-purple-600 mb-2">
                                {t("contactSales.stats.timeSaved.value")}
                            </div>
                            <div className="text-sm text-gray-600">
                                {t("contactSales.stats.timeSaved.label")}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Contact Header */}
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">
                        {t("contactSales.contactOptions.title")}
                    </h2>
                    <p className="text-gray-600 leading-relaxed max-w-3xl mx-auto">
                        {t("contactSales.contactOptions.subtitle")}
                    </p>
                </div>

                {/* Main Content Grid */}
                <div className="grid lg:grid-cols-2 gap-12 mb-12 items-stretch">
                    {/* Left Column - Contact Options */}
                    <div className="flex flex-col">
                        <div className="space-y-4 flex-1 flex flex-col">
                            <Card
                                className="border-2 border-green-200 hover:border-green-300 transition-all duration-300 hover:shadow-lg cursor-pointer group flex-1"
                                onClick={handleWhatsAppClick}
                            >
                                <CardContent className="p-6 h-full flex items-center">
                                    <div className="flex items-center gap-4 w-full">
                                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center group-hover:bg-green-200 transition-colors">
                                            <MessageCircle className="h-6 w-6 text-green-600" />
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="text-lg font-semibold text-gray-900 mb-1">
                                                {t(
                                                    "contactSales.contactOptions.whatsapp.title"
                                                )}
                                            </h4>
                                            <p className="text-md text-gray-600 mb-2">
                                                {t(
                                                    "contactSales.contactOptions.whatsapp.description"
                                                )}
                                            </p>
                                            <p className="text-md font-medium text-green-700">
                                                {t(
                                                    "contactSales.contactOptions.whatsapp.phone"
                                                )}
                                            </p>
                                        </div>
                                        <div className="text-green-600 group-hover:translate-x-1 transition-transform">
                                            →
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card
                                className="border-2 border-blue-200 hover:border-blue-300 transition-all duration-300 hover:shadow-lg cursor-pointer group flex-1"
                                onClick={handleEmailClick}
                            >
                                <CardContent className="p-6 h-full flex items-center">
                                    <div className="flex items-center gap-4 w-full">
                                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                                            <Mail className="h-6 w-6 text-blue-600" />
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="text-lg font-semibold text-gray-900 mb-1">
                                                {t(
                                                    "contactSales.contactOptions.email.title"
                                                )}
                                            </h4>
                                            <p className="text-md text-gray-600 mb-2">
                                                {t(
                                                    "contactSales.contactOptions.email.description"
                                                )}
                                            </p>
                                            <p className="text-md font-medium text-blue-700">
                                                {t(
                                                    "contactSales.contactOptions.email.address"
                                                )}
                                            </p>
                                        </div>
                                        <div className="text-blue-600 group-hover:translate-x-1 transition-transform">
                                            →
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>

                    {/* Right Column - Demo Benefits */}
                    <div className="flex flex-col">
                        <Card className="bg-gradient-to-br from-gray-50 to-blue-50 border-0 flex-1">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-xl">
                                    <Star className="h-5 w-5 text-yellow-500" />
                                    {t("contactSales.demoBenefits.title")}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-start gap-3">
                                    <div className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0">
                                        <svg
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                            className="h-5 w-5"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M5 13l4 4L19 7"
                                            />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-900">
                                            {t(
                                                "contactSales.demoBenefits.items.whatsappIntegration.title"
                                            )}
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            {t(
                                                "contactSales.demoBenefits.items.whatsappIntegration.description"
                                            )}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0">
                                        <svg
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                            className="h-5 w-5"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M5 13l4 4L19 7"
                                            />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-900">
                                            {t(
                                                "contactSales.demoBenefits.items.aiResponses.title"
                                            )}
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            {t(
                                                "contactSales.demoBenefits.items.aiResponses.description"
                                            )}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0">
                                        <svg
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                            className="h-5 w-5"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M5 13l4 4L19 7"
                                            />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-900">
                                            {t(
                                                "contactSales.demoBenefits.items.roiAnalysis.title"
                                            )}
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            {t(
                                                "contactSales.demoBenefits.items.roiAnalysis.description"
                                            )}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0">
                                        <svg
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                            className="h-5 w-5"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M5 13l4 4L19 7"
                                            />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-900">
                                            {t(
                                                "contactSales.demoBenefits.items.implementationRoadmap.title"
                                            )}
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            {t(
                                                "contactSales.demoBenefits.items.implementationRoadmap.description"
                                            )}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Business Hours Section */}
                <div className="mb-16">
                    <Card className="bg-white border border-gray-200">
                        <CardContent className="p-6 text-center">
                            <Clock className="h-8 w-8 text-gray-600 mx-auto mb-4" />
                            <h4 className="font-semibold text-gray-900 mb-2">
                                {t("contactSales.businessHours.title")}
                            </h4>
                            <div className="space-y-1 text-sm text-gray-600">
                                <p>
                                    {t(
                                        "contactSales.businessHours.mondayFriday"
                                    )}
                                </p>
                                <p>
                                    {t("contactSales.businessHours.saturday")}
                                </p>
                                <p className="text-gray-500">
                                    {t(
                                        "contactSales.businessHours.responseTime"
                                    )}
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default ContactSalesPage;
