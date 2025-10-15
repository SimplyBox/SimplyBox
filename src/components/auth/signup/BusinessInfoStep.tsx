import React from "react";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../../ui/select";
import { Building2, Mail, Phone, FileText, ArrowRight } from "lucide-react";

interface BusinessData {
    businessName: string;
    businessType: string;
    businessNIB: string;
    businessPhone: string;
    businessEmail: string;
    teamSize: string;
    dailyMessages: string;
    ownerEmail: string;
    ownerPassword: string;
}

interface BusinessInfoStepProps {
    businessData: BusinessData;
    updateBusinessData: (field: keyof BusinessData, value: any) => void;
    onNext: () => void;
    t: (key: string) => string;
}

const BusinessInfoStep: React.FC<BusinessInfoStepProps> = ({
    businessData,
    updateBusinessData,
    onNext,
    t,
}) => {
    const businessTypes = [
        "E-commerce",
        "Services",
        "F&B (Food & Beverage)",
        "Retail",
        "Manufacturing",
        "Consulting",
        "Healthcare",
        "Education",
        "Real Estate",
        "Other",
    ];

    return (
        <div className="space-y-4">
            <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                    {t("signup.step1.businessName.label")}
                </label>
                <div className="relative">
                    <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                        placeholder={t("signup.step1.businessName.placeholder")}
                        value={businessData.businessName}
                        onChange={(e) =>
                            updateBusinessData("businessName", e.target.value)
                        }
                        className="pl-10 h-12"
                        required
                    />
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                    {t("signup.step1.businessType.label")}
                </label>
                <Select
                    value={businessData.businessType}
                    onValueChange={(value) =>
                        updateBusinessData("businessType", value)
                    }
                >
                    <SelectTrigger className="h-12">
                        <SelectValue
                            placeholder={t(
                                "signup.step1.businessType.placeholder"
                            )}
                        />
                    </SelectTrigger>
                    <SelectContent>
                        {businessTypes.map((type) => (
                            <SelectItem key={type} value={type}>
                                {type}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                    {t("signup.step1.businessNIB.label")}
                </label>
                <div className="relative">
                    <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                        placeholder={t("signup.step1.businessNIB.placeholder")}
                        value={businessData.businessNIB}
                        onChange={(e) =>
                            updateBusinessData("businessNIB", e.target.value)
                        }
                        className="pl-10 h-12"
                        required
                    />
                </div>
                <p className="text-xs text-gray-500">
                    {t("signup.step1.businessNIB.helper")}
                </p>
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                    {t("signup.step1.businessPhone.label")}
                </label>
                <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                        placeholder={t(
                            "signup.step1.businessPhone.placeholder"
                        )}
                        value={businessData.businessPhone}
                        onChange={(e) =>
                            updateBusinessData("businessPhone", e.target.value)
                        }
                        className="pl-10 h-12"
                        required
                    />
                </div>
                <p className="text-xs text-gray-500">
                    {t("signup.step1.businessPhone.helper")}
                </p>
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                    {t("signup.step1.businessEmail.label")}
                </label>
                <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                        type="email"
                        placeholder={t(
                            "signup.step1.businessEmail.placeholder"
                        )}
                        value={businessData.businessEmail}
                        onChange={(e) =>
                            updateBusinessData("businessEmail", e.target.value)
                        }
                        className="pl-10 h-12"
                        required
                    />
                </div>
            </div>

            <Button
                onClick={onNext}
                className="w-full h-12 bg-[#2ECC71] hover:bg-[#27AE60] text-white font-medium"
            >
                {t("signup.step1.continueButton")}
                <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
        </div>
    );
};

export default BusinessInfoStep;
