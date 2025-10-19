import React, { useState } from "react";
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
    ownerName: string;
    ownerPhone: string;
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
    const [errors, setErrors] = useState({
        businessNIB: "",
        businessPhone: "",
        businessEmail: "",
    });

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

    const countryCodes = [
        { code: "+62", label: "Indonesia" },
        { code: "+1", label: "United States" },
        { code: "+44", label: "United Kingdom" },
        { code: "+81", label: "Japan" },
        { code: "+65", label: "Singapore" },
    ];

    const [selectedCountryCode, setSelectedCountryCode] = useState("+62");
    const [phoneNumber, setPhoneNumber] = useState("");

    const validateNIB = (nib: string) => {
        const isValid = /^\d{13}$/.test(nib);
        setErrors((prev) => ({
            ...prev,
            businessNIB:
                isValid || nib === ""
                    ? ""
                    : t("signup.step1.businessNIB.invalid"),
        }));
        return isValid;
    };

    const validatePhone = (phone: string) => {
        const phoneWithoutCode = phone.replace(/^\+\d{1,3}/, "");
        const isValid = /^\d{8,15}$/.test(phoneWithoutCode);
        setErrors((prev) => ({
            ...prev,
            businessPhone:
                isValid || phone === ""
                    ? ""
                    : t("signup.step1.businessPhone.invalid"),
        }));
        return isValid;
    };

    const validateEmail = (email: string) => {
        const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        setErrors((prev) => ({
            ...prev,
            businessEmail:
                isValid || email === ""
                    ? ""
                    : t("signup.step1.businessEmail.invalid"),
        }));
        return isValid;
    };

    const isFormValid = () => {
        return (
            businessData.businessName !== "" &&
            businessData.businessType !== "" &&
            businessData.businessNIB !== "" &&
            businessData.businessPhone !== "" &&
            businessData.businessEmail !== ""
        );
    };

    const handleNextClick = () => {
        const isNIBValid = validateNIB(businessData.businessNIB);
        const isPhoneValid = validatePhone(businessData.businessPhone);
        const isEmailValid = validateEmail(businessData.businessEmail);

        if (isNIBValid && isPhoneValid && isEmailValid && isFormValid()) {
            onNext();
        }
    };

    const handlePhoneChange = (value: string) => {
        setPhoneNumber(value);
        updateBusinessData("businessPhone", selectedCountryCode + value);
        setErrors((prev) => ({ ...prev, businessPhone: "" }));
    };

    const handleCountryCodeChange = (code: string) => {
        setSelectedCountryCode(code);
        updateBusinessData("businessPhone", code + phoneNumber);
    };

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
                        onChange={(e) => {
                            updateBusinessData("businessNIB", e.target.value);
                            setErrors((prev) => ({ ...prev, businessNIB: "" }));
                        }}
                        className={`pl-10 h-12 ${
                            errors.businessNIB ? "border-red-500" : ""
                        }`}
                        required
                    />
                </div>
                {errors.businessNIB && (
                    <p className="text-xs text-red-500">{errors.businessNIB}</p>
                )}
                <p className="text-xs text-gray-500">
                    {t("signup.step1.businessNIB.helper")}
                </p>
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                    {t("signup.step1.businessPhone.label")}
                </label>
                <div className="flex space-x-2">
                    <Select
                        value={selectedCountryCode}
                        onValueChange={handleCountryCodeChange}
                    >
                        <SelectTrigger className="w-32 h-12">
                            <span>{selectedCountryCode}</span>
                        </SelectTrigger>
                        <SelectContent>
                            {countryCodes.map((country) => (
                                <SelectItem
                                    key={country.code}
                                    value={country.code}
                                >
                                    <div className="flex items-center gap-2">
                                        <span>{country.code}</span>
                                        <span className="text-gray-500 text-sm">
                                            {country.label}
                                        </span>
                                    </div>
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <div className="relative flex-1">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                            placeholder={t(
                                "signup.step1.businessPhone.placeholder"
                            )}
                            value={phoneNumber}
                            onChange={(e) => handlePhoneChange(e.target.value)}
                            className={`pl-10 h-12 ${
                                errors.businessPhone ? "border-red-500" : ""
                            }`}
                            required
                        />
                    </div>
                </div>
                {errors.businessPhone && (
                    <p className="text-xs text-red-500">
                        {errors.businessPhone}
                    </p>
                )}
                <p className="text-xs text-gray-500">
                    {t("signup.step1.businessPhone.helper")}
                </p>
                {phoneNumber && (
                    <p className="text-xs text-gray-600">
                        Full number:{" "}
                        <span className="font-medium">
                            {selectedCountryCode}
                            {phoneNumber}
                        </span>
                    </p>
                )}
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
                        onChange={(e) => {
                            updateBusinessData("businessEmail", e.target.value);
                            setErrors((prev) => ({
                                ...prev,
                                businessEmail: "",
                            }));
                        }}
                        className={`pl-10 h-12 ${
                            errors.businessEmail ? "border-red-500" : ""
                        }`}
                        required
                    />
                </div>
                {errors.businessEmail && (
                    <p className="text-xs text-red-500">
                        {errors.businessEmail}
                    </p>
                )}
            </div>

            <Button
                onClick={handleNextClick}
                className="w-full h-12 bg-green-500 hover:bg-green-600 text-white font-medium disabled:bg-gray-400 disabled:cursor-not-allowed"
                disabled={!isFormValid()}
            >
                {t("signup.step1.continueButton")}
                <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
        </div>
    );
};

export default BusinessInfoStep;
