import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTeam } from "@/contexts/TeamContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
} from "@/components/ui/select";
import { Mail, Lock, Eye, EyeOff, Phone, User } from "lucide-react";
import Loading from "@/components/Loading";

interface InvitationData {
    email: string;
    companyId: string;
    role: "admin" | "owner";
    type: string;
    expires: number;
    created: number;
}

const AcceptInvitationPage: React.FC = () => {
    const { t } = useLanguage();
    const navigate = useNavigate();
    const location = useLocation();
    const { verifyInvitationToken, acceptInvitation } = useTeam();
    const [loading, setLoading] = useState(true);
    const [invitationData, setInvitationData] = useState<InvitationData | null>(
        null
    );
    const [name, setName] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [selectedCountryCode, setSelectedCountryCode] = useState("+62");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [errors, setErrors] = useState({
        name: "",
        phone: "",
        password: "",
        confirmPassword: "",
    });

    const query = new URLSearchParams(location.search);
    const token = query.get("token");

    const countryCodes = [
        { code: "+62", label: "Indonesia" },
        { code: "+1", label: "United States" },
        { code: "+44", label: "United Kingdom" },
        { code: "+81", label: "Japan" },
        { code: "+65", label: "Singapore" },
    ];

    useEffect(() => {
        if (token) {
            handleVerifyToken(token);
        } else {
            setErrors((prev) => ({
                ...prev,
                name: t("acceptInvitation.errorNoToken"),
            }));
            setLoading(false);
        }
    }, [token]);

    const handleVerifyToken = async (token: string) => {
        const result = await verifyInvitationToken(token);

        if (result.success && result.data) {
            setInvitationData(result.data);
            setLoading(false);
        } else {
            setErrors((prev) => ({
                ...prev,
                name: result.error || t("acceptInvitation.errorInvalidToken"),
            }));
            navigate(
                `/error?message=${encodeURIComponent(
                    result.error || t("acceptInvitation.errorInvalidToken")
                )}`
            );
            setLoading(false);
        }
    };

    const validateName = (name: string) => {
        const isValid = name.length <= 50;
        setErrors((prev) => ({
            ...prev,
            name:
                isValid || name === ""
                    ? ""
                    : t("acceptInvitation.name.maxLength"),
        }));
        return isValid;
    };

    const validatePhone = (phone: string) => {
        const phoneWithoutCode = phone.replace(/^\+\d{1,3}\s?/, "");
        const isValid = /^\d{8,15}$/.test(phoneWithoutCode);
        setErrors((prev) => ({
            ...prev,
            phone:
                isValid || phone === ""
                    ? ""
                    : t("acceptInvitation.phone.invalid"),
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
            password:
                isValid || password === ""
                    ? ""
                    : t("acceptInvitation.password.invalid"),
        }));
        return isValid;
    };

    const validateConfirmPassword = (confirm: string) => {
        const isValid = confirm === password;
        setErrors((prev) => ({
            ...prev,
            confirmPassword:
                isValid || confirm === ""
                    ? ""
                    : t("acceptInvitation.confirmPassword.mismatch"),
        }));
        return isValid;
    };

    const isFormValid = () => {
        return (
            name !== "" &&
            phoneNumber !== "" &&
            password !== "" &&
            confirmPassword !== ""
        );
    };

    const handleAcceptInvitation = async () => {
        const isNameValid = validateName(name);
        const fullPhoneNumber = `${selectedCountryCode} ${phoneNumber}`;
        const isPhoneValid = validatePhone(fullPhoneNumber);
        const isPasswordValid = validatePassword(password);
        const isConfirmPasswordValid = validateConfirmPassword(confirmPassword);

        if (
            !invitationData ||
            !isNameValid ||
            !isPhoneValid ||
            !isPasswordValid ||
            !isConfirmPasswordValid ||
            !isFormValid()
        ) {
            return;
        }

        if (!token) {
            setErrors((prev) => ({
                ...prev,
                name: t("acceptInvitation.errorNoToken"),
            }));
            return;
        }

        setLoading(true);
        setErrors({ name: "", phone: "", password: "", confirmPassword: "" });

        const result = await acceptInvitation({
            token,
            invitationData,
            userData: {
                name,
                phone: fullPhoneNumber,
                password,
            },
        });

        if (result.success) {
            if (result.needsVerification) {
                navigate("/verify-email", {
                    state: { email: invitationData.email },
                });
            } else {
                navigate("/dashboard");
            }
        } else {
            setErrors((prev) => ({
                ...prev,
                name: result.error || t("acceptInvitation.errorFailed"),
            }));
            setLoading(false);
        }
    };

    if (loading) {
        return <Loading />;
    }

    if (errors.name && !invitationData) {
        return (
            <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
                <h2 className="text-2xl font-bold mb-4 text-red-600">
                    {t("acceptInvitation.errorTitle")}
                </h2>
                <p className="mb-4">{errors.name}</p>
                <Button
                    onClick={() => navigate("/")}
                    className="w-full h-12 bg-blue-500 text-white font-medium hover:bg-blue-600"
                >
                    {t("acceptInvitation.backToHome")}
                </Button>
            </div>
        );
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
            <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md space-y-6">
                <h2 className="text-2xl font-bold">
                    {t("acceptInvitation.title")}
                </h2>
                <p className="text-sm text-gray-600">
                    {t("acceptInvitation.description", {
                        role: invitationData?.role,
                    })}
                </p>
                <p className="text-sm text-gray-600">
                    {t("acceptInvitation.emailLabel")}:{" "}
                    <strong>{invitationData?.email}</strong>
                </p>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                        {t("acceptInvitation.fullName.label")}
                    </label>
                    <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                            type="text"
                            placeholder={t(
                                "acceptInvitation.fullName.placeholder"
                            )}
                            value={name}
                            onChange={(e) => {
                                setName(e.target.value);
                                validateName(e.target.value);
                            }}
                            className={`pl-10 h-12 ${
                                errors.name ? "border-red-500" : ""
                            }`}
                            required
                        />
                    </div>
                    {errors.name && (
                        <p className="text-xs text-red-500">{errors.name}</p>
                    )}
                    <p className="text-xs text-gray-500">
                        {t("acceptInvitation.fullName.helper")}
                    </p>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                        {t("acceptInvitation.phoneNumber.label")}
                    </label>
                    <div className="flex space-x-2">
                        <Select
                            value={selectedCountryCode}
                            onValueChange={(code) => {
                                setSelectedCountryCode(code);
                                validatePhone(`${code} ${phoneNumber}`);
                            }}
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
                                    "acceptInvitation.phoneNumber.placeholder"
                                )}
                                value={phoneNumber}
                                onChange={(e) => {
                                    setPhoneNumber(e.target.value);
                                    validatePhone(
                                        `${selectedCountryCode} ${e.target.value}`
                                    );
                                }}
                                className={`pl-10 h-12 ${
                                    errors.phone ? "border-red-500" : ""
                                }`}
                                required
                            />
                        </div>
                    </div>
                    {errors.phone && (
                        <p className="text-xs text-red-500">{errors.phone}</p>
                    )}
                    <p className="text-xs text-gray-500">
                        {t("acceptInvitation.phoneNumber.helper")}
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
                        {t("acceptInvitation.password.label")}
                    </label>
                    <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                            type={showPassword ? "text" : "password"}
                            placeholder={t(
                                "acceptInvitation.password.placeholder"
                            )}
                            value={password}
                            onChange={(e) => {
                                setPassword(e.target.value);
                                validatePassword(e.target.value);
                            }}
                            className={`pl-10 pr-10 h-12 ${
                                errors.password ? "border-red-500" : ""
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
                    {errors.password && (
                        <p className="text-xs text-red-500">
                            {errors.password}
                        </p>
                    )}
                    <p className="text-xs text-gray-500">
                        {t("acceptInvitation.password.helper")}
                    </p>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                        {t("acceptInvitation.confirmPassword.label")}
                    </label>
                    <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder={t(
                                "acceptInvitation.confirmPassword.placeholder"
                            )}
                            value={confirmPassword}
                            onChange={(e) => {
                                setConfirmPassword(e.target.value);
                                validateConfirmPassword(e.target.value);
                            }}
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
                        {t("acceptInvitation.confirmPassword.helper")}
                    </p>
                </div>

                <Button
                    onClick={handleAcceptInvitation}
                    disabled={loading || !isFormValid()}
                    className="w-full h-12 bg-blue-500 hover:bg-blue-600 text-white font-medium disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                    {loading
                        ? t("acceptInvitation.accepting")
                        : t("acceptInvitation.acceptButton")}
                </Button>
            </div>
        </div>
    );
};

export default AcceptInvitationPage;
