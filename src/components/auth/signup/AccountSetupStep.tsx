import React, { useState } from "react";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
} from "../../ui/select";
import { Mail, Lock, Eye, EyeOff, Phone, User } from "lucide-react";

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

interface AccountSetupStepProps {
    businessData: BusinessData;
    updateBusinessData: (field: keyof BusinessData, value: any) => void;
    onComplete: () => void;
    isLoading: boolean;
    t: (key: string) => string;
}

const AccountSetupStep: React.FC<AccountSetupStepProps> = ({
    businessData,
    updateBusinessData,
    onComplete,
    isLoading,
    t,
}) => {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [confirmPassword, setConfirmPassword] = useState("");
    const [selectedCountryCode, setSelectedCountryCode] = useState("+62");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [errors, setErrors] = useState({
        ownerName: "",
        ownerPhone: "",
        ownerEmail: "",
        ownerPassword: "",
        confirmPassword: "",
    });

    const teamSizes = [
        "1 person (Solo)",
        "2-5 people",
        "6-15 people",
        "15+ people",
    ];

    const messageVolumes = [
        "Less than 20 messages",
        "20-50 messages",
        "50-100 messages",
        "100+ messages",
    ];

    const countryCodes = [
        { code: "+62", label: "Indonesia" },
        { code: "+1", label: "United States" },
        { code: "+44", label: "United Kingdom" },
        { code: "+81", label: "Japan" },
        { code: "+65", label: "Singapore" },
    ];

    const getRecommendedTier = () => {
        const teamSizeIndex = teamSizes.indexOf(businessData.teamSize);
        const messageVolumeIndex = messageVolumes.indexOf(
            businessData.dailyMessages
        );

        if (teamSizeIndex <= 1 && messageVolumeIndex <= 1)
            return t("signup.step2.recommendation.tiers.starter");
        if (teamSizeIndex <= 2 && messageVolumeIndex <= 2)
            return t("signup.step2.recommendation.tiers.professional");
        return t("signup.step2.recommendation.tiers.enterprise");
    };

    const validateName = (name: string) => {
        const isValid = name.length <= 50;
        setErrors((prev) => ({
            ...prev,
            ownerName:
                isValid || name === ""
                    ? ""
                    : t("signup.step3.ownerName.maxLength"),
        }));
        return isValid;
    };

    const validatePhone = (phone: string) => {
        const phoneWithoutCode = phone.replace(/^\+\d{1,3}\s?/, "");
        const isValid = /^\d{8,15}$/.test(phoneWithoutCode);
        setErrors((prev) => ({
            ...prev,
            ownerPhone:
                isValid || phone === ""
                    ? ""
                    : t("signup.step3.ownerPhone.invalid"),
        }));
        return isValid;
    };

    const validateEmail = (email: string) => {
        const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        setErrors((prev) => ({
            ...prev,
            ownerEmail:
                isValid || email === ""
                    ? ""
                    : t("signup.step3.ownerEmail.invalid"),
        }));
        return isValid;
    };

    const validatePassword = (password: string) => {
        const hasUpperCase = /[A-Z]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);
        const hasNumber = /\d/.test(password);
        const hasSymbol = /[!@#$%^&*(),.?":{}|<>]/.test(password);
        const isMinLength = password.length >= 8;
        const isValid =
            hasUpperCase &&
            hasLowerCase &&
            hasNumber &&
            hasSymbol &&
            isMinLength;
        setErrors((prev) => ({
            ...prev,
            ownerPassword:
                isValid || password === ""
                    ? ""
                    : t("signup.step3.ownerPassword.invalid"),
        }));
        return isValid;
    };

    const validateConfirmPassword = (confirm: string) => {
        const isValid = confirm === businessData.ownerPassword;
        setErrors((prev) => ({
            ...prev,
            confirmPassword:
                isValid || confirm === ""
                    ? ""
                    : t("signup.step3.confirmPassword.mismatch"),
        }));
        return isValid;
    };

    const isFormValid = () => {
        return (
            businessData.ownerName !== "" &&
            businessData.ownerPhone !== "" &&
            businessData.ownerEmail !== "" &&
            businessData.ownerPassword !== "" &&
            confirmPassword !== ""
        );
    };

    const handleCompleteClick = () => {
        const isNameValid = validateName(businessData.ownerName);
        const isPhoneValid = validatePhone(businessData.ownerPhone);
        const isEmailValid = validateEmail(businessData.ownerEmail);
        const isPasswordValid = validatePassword(businessData.ownerPassword);
        const isConfirmPasswordValid = validateConfirmPassword(confirmPassword);

        if (
            isNameValid &&
            isPhoneValid &&
            isEmailValid &&
            isPasswordValid &&
            isConfirmPasswordValid &&
            isFormValid()
        ) {
            onComplete();
        }
    };

    const handlePhoneChange = (value: string) => {
        setPhoneNumber(value);
        updateBusinessData("ownerPhone", `${selectedCountryCode} ${value}`);
        setErrors((prev) => ({ ...prev, ownerPhone: "" }));
    };

    const handleCountryCodeChange = (code: string) => {
        setSelectedCountryCode(code);
        updateBusinessData("ownerPhone", `${code} ${phoneNumber}`);
    };

    const handleEmailChange = (value: string) => {
        updateBusinessData("ownerEmail", value);
        setErrors((prev) => ({ ...prev, ownerEmail: "" }));
    };

    const handleNameChange = (value: string) => {
        updateBusinessData("ownerName", value);
        setErrors((prev) => ({ ...prev, ownerName: "" }));
    };

    const handlePasswordChange = (value: string) => {
        updateBusinessData("ownerPassword", value);
        setErrors((prev) => ({ ...prev, ownerPassword: "" }));
    };

    const handleConfirmPasswordChange = (value: string) => {
        setConfirmPassword(value);
        setErrors((prev) => ({ ...prev, confirmPassword: "" }));
    };

    return (
        <div className="space-y-6">
            {/* Owner Account Setup */}
            <div className="bg-gradient-to-r from-green-500/10 to-blue-500/10 border border-green-500/20 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-2">
                    {t("signup.step3.ownerAccount.title")}
                </h4>
                <p className="text-sm text-gray-600">
                    {t("signup.step3.ownerAccount.description")}
                </p>
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                    {t("signup.step3.ownerName.label")}
                </label>
                <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                        type="text"
                        placeholder={t("signup.step3.ownerName.placeholder")}
                        value={businessData.ownerName}
                        onChange={(e) => handleNameChange(e.target.value)}
                        className={`pl-10 h-12 ${
                            errors.ownerName ? "border-red-500" : ""
                        }`}
                        required
                    />
                </div>
                {errors.ownerName && (
                    <p className="text-xs text-red-500">{errors.ownerName}</p>
                )}
                <p className="text-xs text-gray-500">
                    {t("signup.step3.ownerName.helper")}
                </p>
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                    {t("signup.step3.ownerPhone.label")}
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
                                "signup.step3.ownerPhone.placeholder"
                            )}
                            value={phoneNumber}
                            onChange={(e) => handlePhoneChange(e.target.value)}
                            className={`pl-10 h-12 ${
                                errors.ownerPhone ? "border-red-500" : ""
                            }`}
                            required
                        />
                    </div>
                </div>
                {errors.ownerPhone && (
                    <p className="text-xs text-red-500">{errors.ownerPhone}</p>
                )}
                <p className="text-xs text-gray-500">
                    {t("signup.step3.ownerPhone.helper")}
                </p>
                {phoneNumber && (
                    <p className="text-xs text-gray-600">
                        Full number:{" "}
                        <span className="font-medium">
                            {selectedCountryCode} {phoneNumber}
                        </span>
                    </p>
                )}
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                    {t("signup.step3.ownerEmail.label")}
                </label>
                <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                        type="email"
                        placeholder={t("signup.step3.ownerEmail.placeholder")}
                        value={businessData.ownerEmail}
                        onChange={(e) => handleEmailChange(e.target.value)}
                        className={`pl-10 h-12 ${
                            errors.ownerEmail ? "border-red-500" : ""
                        }`}
                        required
                    />
                </div>
                {errors.ownerEmail && (
                    <p className="text-xs text-red-500">{errors.ownerEmail}</p>
                )}
                <p className="text-xs text-gray-500">
                    {t("signup.step3.ownerEmail.helper")}
                </p>
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                    {t("signup.step3.ownerPassword.label")}
                </label>
                <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                        type={showPassword ? "text" : "password"}
                        placeholder={t(
                            "signup.step3.ownerPassword.placeholder"
                        )}
                        value={businessData.ownerPassword}
                        onChange={(e) => handlePasswordChange(e.target.value)}
                        className={`pl-10 pr-10 h-12 ${
                            errors.ownerPassword ? "border-red-500" : ""
                        }`}
                        required
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                        {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                        ) : (
                            <Eye className="h-4 w-4" />
                        )}
                    </button>
                </div>
                {errors.ownerPassword && (
                    <p className="text-xs text-red-500">
                        {errors.ownerPassword}
                    </p>
                )}
                <p className="text-xs text-gray-500">
                    {t("signup.step3.ownerPassword.helper")}
                </p>
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                    {t("signup.step3.confirmPassword.label")}
                </label>
                <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder={t(
                            "signup.step3.confirmPassword.placeholder"
                        )}
                        value={confirmPassword}
                        onChange={(e) =>
                            handleConfirmPasswordChange(e.target.value)
                        }
                        className={`pl-10 pr-10 h-12 ${
                            errors.confirmPassword ? "border-red-500" : ""
                        }`}
                        required
                    />
                    <button
                        type="button"
                        onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                        }
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                        {showConfirmPassword ? (
                            <EyeOff className="h-4 w-4" />
                        ) : (
                            <Eye className="h-4 w-4" />
                        )}
                    </button>
                </div>
                {errors.confirmPassword && (
                    <p className="text-xs text-red-500">
                        {errors.confirmPassword}
                    </p>
                )}
                <p className="text-xs text-gray-500">
                    {t("signup.step3.confirmPassword.helper")}
                </p>
            </div>

            {/* Summary */}
            <div className="border rounded-lg p-4 bg-gray-50">
                <h4 className="font-semibold text-gray-900 mb-3">
                    {t("signup.step3.summary.title")}
                </h4>
                <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                        <span className="text-gray-600">
                            {t("signup.step3.summary.business")}
                        </span>
                        <span className="font-medium">
                            {businessData.businessName}
                        </span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-600">
                            {t("signup.step3.summary.type")}
                        </span>
                        <span className="font-medium">
                            {businessData.businessType}
                        </span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-600">
                            {t("signup.step3.summary.team")}
                        </span>
                        <span className="font-medium">
                            {businessData.teamSize}
                        </span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-600">
                            {t("signup.step3.summary.volume")}
                        </span>
                        <span className="font-medium">
                            {businessData.dailyMessages}
                        </span>
                    </div>
                    {businessData.dailyMessages && businessData.teamSize && (
                        <div className="flex justify-between pt-2 border-t">
                            <span className="text-gray-600">
                                {t("signup.step3.summary.recommended")}
                            </span>
                            <span className="font-medium text-blue-500">
                                {getRecommendedTier()}
                            </span>
                        </div>
                    )}
                </div>
            </div>

            {/* CTA Section */}
            <div className="bg-gradient-to-r from-green-500 to-blue-500 rounded-lg p-6 text-white text-center">
                <h4 className="font-bold text-lg mb-2">
                    {t("signup.step3.cta.title")}
                </h4>
                <p className="text-sm text-green-100 mb-4">
                    {t("signup.step3.cta.description")}
                </p>
            </div>

            <Button
                onClick={handleCompleteClick}
                className="w-full h-12 bg-blue-500 hover:bg-blue-600 text-white font-medium disabled:bg-gray-400 disabled:cursor-not-allowed"
                disabled={isLoading || !isFormValid()}
            >
                {isLoading
                    ? t("signup.step3.completing")
                    : t("signup.step3.completeButton")}
            </Button>
        </div>
    );
};

export default AccountSetupStep;
