import React from "react";
import { Button } from "../components/ui/button";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "../components/ui/card";
import { ArrowLeft, Lock, FileText, Download } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useNavigate } from "react-router-dom";

const TermsOfServicePage: React.FC = () => {
    const { t, language, setLanguage } = useLanguage();
    const navigate = useNavigate();

    const handleBack = () => {
        navigate(-1);
    };

    const sections = [
        {
            id: "1",
            key: "sections.1",
        },
        {
            id: "2",
            key: "sections.2",
            subsections: ["1", "2"],
        },
        {
            id: "3",
            key: "sections.3",
        },
        {
            id: "4",
            key: "sections.4",
            subsections: ["1", "2", "3"],
        },
        {
            id: "5",
            key: "sections.5",
            subsections: ["1", "2"],
        },
        {
            id: "6",
            key: "sections.6",
        },
        {
            id: "7",
            key: "sections.7",
            subsections: ["1", "2"],
        },
        {
            id: "8",
            key: "sections.8",
            subsections: ["1", "2"],
        },
        {
            id: "9",
            key: "sections.9",
        },
        {
            id: "10",
            key: "sections.10",
            subsections: ["1", "2", "3"],
        },
        {
            id: "11",
            key: "sections.11",
        },
        {
            id: "12",
            key: "sections.12",
            subsections: ["1", "2", "3"],
        },
    ];

    const scrollToSection = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            const offset = 80;
            const elementPosition =
                element.getBoundingClientRect().top + window.pageYOffset;
            window.scrollTo({
                top: elementPosition - offset,
                behavior: "smooth",
            });
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
            <div className="container mx-auto px-4 py-8 max-w-7xl flex">
                {/* Sidebar */}
                <div className="hidden lg:block w-64 mr-8">
                    <Card className="sticky top-8 bg-white border-gray-200 max-h-[calc(100vh-4rem)] overflow-y-auto">
                        <CardHeader>
                            <CardTitle className="text-lg font-semibold text-gray-900">
                                {t("termsOfService.sidebar.title") ||
                                    "Table of Contents"}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            {sections.map((section) => (
                                <div key={section.id}>
                                    <button
                                        onClick={() =>
                                            scrollToSection(section.id)
                                        }
                                        className="text-left w-full text-sm text-gray-600 hover:text-[#3A9BDC] transition-colors"
                                    >
                                        {t(
                                            `termsOfService.${section.key}.title`
                                        ) || section.id}
                                    </button>
                                    {section.subsections && (
                                        <div className="ml-4 space-y-1 mt-1">
                                            {section.subsections.map(
                                                (subId) => (
                                                    <button
                                                        key={subId}
                                                        onClick={() =>
                                                            scrollToSection(
                                                                `${section.id}-${subId}`
                                                            )
                                                        }
                                                        className="text-left w-full text-xs text-gray-500 hover:text-[#2ECC71] transition-colors"
                                                    >
                                                        {t(
                                                            `termsOfService.${section.key}.subsections.${subId}.title`
                                                        ) || subId}
                                                    </button>
                                                )
                                            )}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>

                {/* Main Content */}
                <div className="flex-1">
                    <div className="flex items-center justify-between mb-8">
                        <Button
                            variant="ghost"
                            onClick={handleBack}
                            className="text-gray-600 hover:text-gray-900"
                        >
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            {t("termsOfService.backToHome")}
                        </Button>

                        <div className="flex bg-gray-100 rounded-full p-1">
                            <button
                                onClick={() => setLanguage("en")}
                                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                                    language === "en"
                                        ? "bg-[#3A9BDC] text-white"
                                        : "text-gray-600 hover:text-gray-800"
                                }`}
                            >
                                EN
                            </button>
                            <button
                                onClick={() => setLanguage("id")}
                                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                                    language === "id"
                                        ? "bg-[#3A9BDC] text-white"
                                        : "text-gray-600 hover:text-gray-800"
                                }`}
                            >
                                ID
                            </button>
                        </div>
                    </div>

                    {/* Hero Section */}
                    <div className="text-center mb-12">
                        <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
                            <Lock className="h-4 w-4" />
                            {t("termsOfService.hero.tagline")}
                        </div>
                        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                            {t("termsOfService.hero.title")}
                        </h1>
                        <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed mb-4">
                            {t("termsOfService.hero.subtitle")}
                        </p>
                        <p className="flex items-center justify-center gap-4 text-sm text-gray-500 mb-4">
                            <span>{t("termsOfService.hero.lastUpdated")}</span>
                            <span className="h-3 w-px bg-gray-400"></span>
                            <span>
                                {t("termsOfService.hero.effectiveDate")}
                            </span>
                        </p>
                        <div className="flex justify-center">
                            <Button
                                onClick={() => {
                                    const file =
                                        language === "id"
                                            ? "/docs/privacy-policy-id.pdf"
                                            : "/docs/privacy-policy-en.pdf";

                                    const link = document.createElement("a");
                                    link.href = file;
                                    link.download = file.split("/").pop();
                                    document.body.appendChild(link);
                                    link.click();
                                    document.body.removeChild(link);
                                }}
                                className="px-4 py-2 gap-2 rounded-md text-white"
                            >
                                <Download className="w-4 h-4" />
                                {t("termsOfService.downloadPdf")}
                            </Button>
                        </div>
                    </div>

                    {/* Content Sections */}
                    <div className="space-y-12">
                        {sections.map((section) => (
                            <Card
                                key={section.id}
                                id={section.id}
                                className="bg-white border-gray-200"
                            >
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2 text-xl">
                                        <FileText className="h-5 w-5 text-[#3A9BDC]" />
                                        {t(
                                            `termsOfService.${section.key}.title`
                                        ) || section.id}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {t(
                                        `termsOfService.${section.key}.content`
                                    ) &&
                                        (typeof t(
                                            `termsOfService.${section.key}.content`
                                        ) === "string" ? (
                                            <p className="text-gray-600">
                                                {t(
                                                    `termsOfService.${section.key}.content`
                                                ) || "No content available"}
                                            </p>
                                        ) : Array.isArray(
                                              t(
                                                  `termsOfService.${section.key}.content`
                                              )
                                          ) ? (
                                            <ul className="list-disc pl-5 space-y-3 text-gray-600">
                                                {t(
                                                    `termsOfService.${section.key}.content`
                                                ).map(
                                                    (
                                                        item: string,
                                                        index: number
                                                    ) => (
                                                        <li key={index}>
                                                            {item}
                                                        </li>
                                                    )
                                                )}
                                            </ul>
                                        ) : null)}

                                    {section.subsections && (
                                        <div className="space-y-6 mt-4">
                                            {section.subsections.map(
                                                (subId) => (
                                                    <div
                                                        key={subId}
                                                        id={`${section.id}-${subId}`}
                                                    >
                                                        <h4 className="font-semibold text-gray-900 mb-2">
                                                            {t(
                                                                `termsOfService.${section.key}.subsections.${subId}.title`
                                                            ) || subId}
                                                        </h4>
                                                        {Array.isArray(
                                                            t(
                                                                `termsOfService.${section.key}.subsections.${subId}.content`
                                                            )
                                                        ) ? (
                                                            <ul className="list-disc pl-5 space-y-3 text-gray-600">
                                                                {t(
                                                                    `termsOfService.${section.key}.subsections.${subId}.content`
                                                                ).map(
                                                                    (
                                                                        item: string,
                                                                        index: number
                                                                    ) => (
                                                                        <li
                                                                            key={
                                                                                index
                                                                            }
                                                                        >
                                                                            {
                                                                                item
                                                                            }
                                                                        </li>
                                                                    )
                                                                )}
                                                            </ul>
                                                        ) : (
                                                            <p className="text-gray-600">
                                                                {t(
                                                                    `termsOfService.${section.key}.subsections.${subId}.content`
                                                                ) ||
                                                                    "No content available"}
                                                            </p>
                                                        )}
                                                    </div>
                                                )
                                            )}
                                        </div>
                                    )}
                                    {section.key === "sections.7" && (
                                        <p className="text-gray-600 mt-4">
                                            {t(
                                                `termsOfService.${section.key}.contact`
                                            ) ||
                                                "Contact our Data Protection Officer for more information."}
                                        </p>
                                    )}
                                    {section.key === "sections.12" && (
                                        <div className="mt-4">
                                            <p className="text-gray-600">
                                                {t(
                                                    `termsOfService.${section.key}.companyInfo.name`
                                                ) || "SimplyBox Indonesia"}
                                                <br />
                                                {t(
                                                    `termsOfService.${section.key}.companyInfo.address`
                                                ) || "Surakarta"}
                                                <br />
                                                {t(
                                                    `termsOfService.${section.key}.companyInfo.phone`
                                                ) || "+6281510123155"}
                                            </p>
                                            <p className="text-gray-600 mt-2">
                                                {t(
                                                    `termsOfService.${section.key}.legalNote`
                                                ) ||
                                                    "This Privacy Policy is governed by Indonesian law."}
                                            </p>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TermsOfServicePage;
