import React, { useState, useEffect } from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    MessageSquare,
    Mail,
    Phone,
    CheckCircle,
    Instagram,
    AlertTriangle,
} from "lucide-react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { useWhatsApp } from "@/contexts/WhatsAppContext";
import { useSubscription } from "@/contexts/SubscriptionContext";
import supabase from "@/libs/supabase";

const getPlanBadgeColor = (plan) => {
    switch (plan) {
        case "free":
            return "bg-gray-200 text-gray-700";
        case "starter":
            return "bg-blue-100 text-blue-700";
        case "professional":
            return "bg-green-100 text-green-700";
        default:
            return "bg-gray-200 text-gray-700";
    }
};

const getPlanDisplayName = (plan) => {
    switch (plan) {
        case "free":
            return "Free";
        case "starter":
            return "Starter";
        case "professional":
            return "Professional";
        default:
            return "Free";
    }
};

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

const SettingsPage = ({ userPlan = "free", currentUsage, onUpgrade }) => {
    const { company, loading: authLoading } = useAuth();
    const {
        integration,
        configureWhatsApp,
        disconnectWhatsApp,
        loading: waLoading,
    } = useWhatsApp();
    const { subscription } = useSubscription();
    const [formData, setFormData] = useState({
        name: "",
        type: "",
        business_email: "",
        whatsapp_number: "",
    });
    const [errors, setErrors] = useState({
        type: "",
        business_email: "",
        whatsapp_number: "",
    });
    const [selectedCountryCode, setSelectedCountryCode] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        if (company) {
            const whatsappNumber = company.whatsapp_number || "";
            const countryCodeMatch = whatsappNumber.match(/^\+\d{1,3}\s?/);
            const phone = countryCodeMatch
                ? whatsappNumber.replace(countryCodeMatch[0], "")
                : whatsappNumber;
            const countryCode = countryCodeMatch
                ? countryCodeMatch[0].trim()
                : "+62";
            setSelectedCountryCode(countryCode);
            setPhoneNumber(phone);
            setFormData({
                name: company.name || "",
                type: company.type || "",
                business_email: company.business_email || "",
                whatsapp_number: whatsappNumber,
            });
        }
    }, [company]);

    const validateType = (type: string) => {
        const isValid = type !== "";
        setErrors((prev) => ({
            ...prev,
            type: isValid ? "" : "Business type is required",
        }));
        return isValid;
    };

    const validatePhone = (phone: string) => {
        const phoneWithoutCode = phone.replace(/^\+\d{1,3}\s?/, "");
        const isValid = /^\d{8,15}$/.test(phoneWithoutCode);
        setErrors((prev) => ({
            ...prev,
            whatsapp_number: isValid ? "" : "Phone number must be 8-15 digits",
        }));
        return isValid;
    };

    const validateEmail = (email: string) => {
        const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        setErrors((prev) => ({
            ...prev,
            business_email: isValid ? "" : "Invalid email format",
        }));
        return isValid;
    };

    const isFormValid = () => {
        return (
            formData.name !== "" &&
            formData.type !== "" &&
            formData.business_email !== "" &&
            formData.whatsapp_number !== ""
        );
    };

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (name === "business_email") {
            setErrors((prev) => ({ ...prev, business_email: "" }));
        }
    };

    const handlePhoneChange = (value: string) => {
        setPhoneNumber(value);
        const fullPhoneNumber = `${selectedCountryCode} ${value}`;
        setFormData((prev) => ({
            ...prev,
            whatsapp_number: fullPhoneNumber,
        }));
        setErrors((prev) => ({ ...prev, whatsapp_number: "" }));
    };

    const handleCountryCodeChange = (code: string) => {
        setSelectedCountryCode(code);
        const fullPhoneNumber = `${code} ${phoneNumber}`;
        setFormData((prev) => ({
            ...prev,
            whatsapp_number: fullPhoneNumber,
        }));
        setErrors((prev) => ({ ...prev, whatsapp_number: "" }));
    };

    const handleCancelEdit = () => {
        if (company) {
            const whatsappNumber = company.whatsapp_number || "";
            const countryCodeMatch = whatsappNumber.match(/^\+\d{1,3}\s?/);
            const phone = countryCodeMatch
                ? whatsappNumber.replace(countryCodeMatch[0], "")
                : whatsappNumber;
            const countryCode = countryCodeMatch
                ? countryCodeMatch[0].trim()
                : "+62";
            setSelectedCountryCode(countryCode);
            setPhoneNumber(phone);
            setFormData({
                name: company.name || "",
                type: company.type || "",
                business_email: company.business_email || "",
                whatsapp_number: whatsappNumber,
            });
        }
        setErrors({ type: "", business_email: "", whatsapp_number: "" });
        setIsEditing(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);
        setSuccess(null);

        const isTypeValid = validateType(formData.type);
        const isPhoneValid = validatePhone(formData.whatsapp_number);
        const isEmailValid = validateEmail(formData.business_email);

        if (!isTypeValid || !isPhoneValid || !isEmailValid || !isFormValid()) {
            setIsSubmitting(false);
            return;
        }

        try {
            if (!company?.id) {
                throw new Error("No company found");
            }

            const { error } = await supabase
                .from("companies")
                .update({
                    name: formData.name,
                    type: formData.type,
                    business_email: formData.business_email,
                    whatsapp_number: formData.whatsapp_number,
                })
                .eq("id", company.id);

            if (error) {
                throw new Error(error.message);
            }

            setSuccess("Company information updated successfully");
        } catch (err) {
            setError(err.message || "Failed to update company information");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleWhatsAppConfigure = async () => {
        try {
            const appId = import.meta.env.VITE_META_APP_ID;
            const redirectUri = `${window.location.origin}/dashboard/oauth/callback`;

            if (!appId || !redirectUri) {
                throw new Error("Missing Meta App ID or Redirect URI");
            }

            const scope =
                "whatsapp_business_management,whatsapp_business_messaging,business_management";
            const authUrl = `https://www.facebook.com/v16.0/dialog/oauth?client_id=${encodeURIComponent(
                appId
            )}&redirect_uri=${encodeURIComponent(
                redirectUri
            )}&response_type=code&scope=${encodeURIComponent(scope)}`;

            window.location.href = authUrl;
        } catch (error) {
            setError("Failed to initiate WhatsApp configuration");
            console.error("WhatsApp configuration error:", error);
        }
    };

    const handleWhatsAppDisconnect = async () => {
        setIsSubmitting(true);
        setError(null);
        setSuccess(null);

        try {
            const { success, error } = await disconnectWhatsApp();
            if (success) {
                setSuccess("WhatsApp disconnected successfully");
            } else {
                setError(error || "Failed to disconnect WhatsApp");
            }
        } catch (err) {
            setError("Failed to disconnect WhatsApp");
            console.error("WhatsApp disconnection error:", err);
        } finally {
            setIsSubmitting(false);
        }
    };

    const getUsagePercentage = (used: number, limit: number) => {
        return limit > 0 ? (used / limit) * 100 : 0;
    };

    const isUsageHigh = (used: number, limit: number) => {
        return getUsagePercentage(used, limit) >= 80;
    };

    const hasHighUsage = subscription?.usage
        ? isUsageHigh(
              subscription.usage.messages_used,
              subscription.usage.messages_limit
          ) ||
          isUsageHigh(
              subscription.usage.files_used,
              subscription.usage.files_limit
          ) ||
          isUsageHigh(
              subscription.usage.team_members_used,
              subscription.usage.team_members_limit
          )
        : false;

    return (
        <div className="h-full bg-gray-50">
            <div className="mx-auto p-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold mb-2">Settings</h1>
                        <p className="text-gray-600">
                            Configure your account, channels, and preferences.
                        </p>
                    </div>
                </div>
                {error && (
                    <div className="bg-red-100 text-red-700 p-3 rounded-md mb-6">
                        {error}
                    </div>
                )}
                {success && (
                    <div className="bg-green-100 text-green-700 p-3 rounded-md mb-6">
                        {success}
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                        <CardHeader className="flex flex-row justify-between items-center">
                            <div>
                                <CardTitle className="text-lg font-bold">
                                    Company Information
                                </CardTitle>
                                <CardDescription>
                                    Update your business details
                                </CardDescription>
                            </div>
                            {!isEditing && (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setIsEditing(true)}
                                >
                                    Edit
                                </Button>
                            )}
                        </CardHeader>
                        <CardContent>
                            {isEditing ? (
                                <form
                                    className="space-y-4"
                                    onSubmit={handleSubmit}
                                >
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-gray-700">
                                            Company Name
                                        </label>
                                        <div className="relative">
                                            <Input
                                                type="text"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleInputChange}
                                                className="h-12 w-full rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-gray-700">
                                            Business Type
                                        </label>
                                        <Select
                                            value={formData.type}
                                            onValueChange={(value) => {
                                                setFormData((prev) => ({
                                                    ...prev,
                                                    type: value,
                                                }));
                                                setErrors((prev) => ({
                                                    ...prev,
                                                    type: "",
                                                }));
                                            }}
                                        >
                                            <SelectTrigger className="h-12">
                                                <SelectValue placeholder="Select a business type" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {businessTypes.map((type) => (
                                                    <SelectItem
                                                        key={type}
                                                        value={type}
                                                    >
                                                        {type}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {errors.type && (
                                            <p className="text-xs text-red-500">
                                                {errors.type}
                                            </p>
                                        )}
                                    </div>
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-gray-700">
                                            Business Email
                                        </label>
                                        <div className="relative">
                                            <Input
                                                type="email"
                                                name="business_email"
                                                value={formData.business_email}
                                                onChange={handleInputChange}
                                                className={`h-12 w-full rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                                    errors.business_email
                                                        ? "border-red-500"
                                                        : ""
                                                }`}
                                                required
                                            />
                                        </div>
                                        {errors.business_email && (
                                            <p className="text-xs text-red-500">
                                                {errors.business_email}
                                            </p>
                                        )}
                                    </div>
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-gray-700">
                                            WhatsApp Number
                                        </label>
                                        <div className="flex space-x-2">
                                            <Select
                                                value={selectedCountryCode}
                                                onValueChange={
                                                    handleCountryCodeChange
                                                }
                                            >
                                                <SelectTrigger className="w-32 h-12">
                                                    <span>
                                                        {selectedCountryCode}
                                                    </span>
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {countryCodes.map(
                                                        (country) => (
                                                            <SelectItem
                                                                key={
                                                                    country.code
                                                                }
                                                                value={
                                                                    country.code
                                                                }
                                                            >
                                                                <div className="flex items-center gap-2">
                                                                    <span>
                                                                        {
                                                                            country.code
                                                                        }
                                                                    </span>
                                                                    <span className="text-gray-500 text-sm">
                                                                        {
                                                                            country.label
                                                                        }
                                                                    </span>
                                                                </div>
                                                            </SelectItem>
                                                        )
                                                    )}
                                                </SelectContent>
                                            </Select>
                                            <div className="relative flex-1">
                                                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                                <Input
                                                    placeholder="Enter phone number"
                                                    value={phoneNumber}
                                                    onChange={(e) =>
                                                        handlePhoneChange(
                                                            e.target.value
                                                        )
                                                    }
                                                    className={`pl-10 h-12 w-full rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                                        errors.whatsapp_number
                                                            ? "border-red-500"
                                                            : ""
                                                    }`}
                                                    required
                                                />
                                            </div>
                                        </div>
                                        {errors.whatsapp_number && (
                                            <p className="text-xs text-red-500">
                                                {errors.whatsapp_number}
                                            </p>
                                        )}
                                        {phoneNumber && (
                                            <p className="text-xs text-gray-600">
                                                Full number:{" "}
                                                <span className="font-medium">
                                                    {selectedCountryCode}{" "}
                                                    {phoneNumber}
                                                </span>
                                            </p>
                                        )}
                                    </div>
                                </form>
                            ) : (
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-gray-700">
                                            Company Name
                                        </label>
                                        <p className="text-gray-900">
                                            {formData.name || "N/A"}
                                        </p>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-gray-700">
                                            Business Type
                                        </label>
                                        <p className="text-gray-900">
                                            {formData.type || "N/A"}
                                        </p>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-gray-700">
                                            Business Email
                                        </label>
                                        <p className="text-gray-900">
                                            {formData.business_email || "N/A"}
                                        </p>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-gray-700">
                                            WhatsApp Number
                                        </label>
                                        <p className="text-gray-900">
                                            {formData.whatsapp_number || "N/A"}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                        {isEditing && (
                            <CardFooter className="flex justify-end space-x-2">
                                <Button
                                    variant="outline"
                                    onClick={handleCancelEdit}
                                    disabled={isSubmitting}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    className="bg-blue-600 hover:bg-blue-700 text-white"
                                    type="submit"
                                    onClick={handleSubmit}
                                    disabled={
                                        isSubmitting ||
                                        authLoading ||
                                        !isFormValid() ||
                                        !!errors.type ||
                                        !!errors.business_email ||
                                        !!errors.whatsapp_number
                                    }
                                >
                                    {isSubmitting
                                        ? "Saving..."
                                        : "Save Changes"}
                                </Button>
                            </CardFooter>
                        )}
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center text-lg font-bold">
                                <MessageSquare className="h-5 w-5 mr-2" />
                                Channel Management
                            </CardTitle>
                            <CardDescription>
                                Connect your communication channels
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="border rounded-lg p-4 bg-green-50">
                                    <div className="flex items-center gap-3 mb-2">
                                        <MessageSquare className="h-5 w-5 text-green-600" />
                                        <h3 className="font-semibold text-gray-900">
                                            WhatsApp Integration
                                        </h3>
                                    </div>
                                    {integration ? (
                                        <div className="flex items-center justify-between p-2 bg-green-100 border border-green-200 rounded-lg">
                                            <div className="flex items-center gap-2">
                                                <CheckCircle className="h-5 w-5 text-green-600" />
                                                <div>
                                                    <p className="font-semibold text-green-800">
                                                        WhatsApp Business
                                                        Connected
                                                    </p>
                                                    <p className="text-sm text-green-700">
                                                        Phone:{" "}
                                                        {
                                                            integration.phone_number
                                                        }
                                                    </p>
                                                    <p className="text-sm text-green-700">
                                                        Business ID:{" "}
                                                        {integration.waba_id}
                                                    </p>
                                                </div>
                                            </div>
                                            <Button
                                                variant="destructive"
                                                size="sm"
                                                className="mt-0"
                                                onClick={
                                                    handleWhatsAppDisconnect
                                                }
                                                disabled={
                                                    isSubmitting || waLoading
                                                }
                                            >
                                                {isSubmitting
                                                    ? "Disconnecting..."
                                                    : "Disconnect"}
                                            </Button>
                                        </div>
                                    ) : (
                                        <div className="flex items-center justify-between p-4 bg-white border rounded-lg">
                                            <p className="text-sm text-gray-600">
                                                Connect your WhatsApp Business
                                                account to enable messaging
                                            </p>
                                            <Button
                                                variant="default"
                                                size="lg"
                                                className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
                                                onClick={
                                                    handleWhatsAppConfigure
                                                }
                                                disabled={
                                                    isSubmitting || waLoading
                                                }
                                            >
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    viewBox="0 0 48 48"
                                                    className="h-5 w-5"
                                                >
                                                    <path
                                                        fill="#fff"
                                                        d="M24 4C12.954 4 4 12.954 4 24c0 9.852 7.378 18.002 17 19.723V30h-5v-6h5v-4.5 c0-5.016 2.985-7.75 7.556-7.75 2.191 0 4.481.39 4.481.39v5h-2.524 c-2.49 0-3.263 1.548-3.263 3.134V24h5.557l-1 6h-4.557v13.723 C36.622 42.002 44 33.852 44 24c0-11.046-8.954-20-20-20z"
                                                    />
                                                </svg>
                                                Connect with Meta
                                            </Button>
                                        </div>
                                    )}
                                </div>

                                <div className="flex items-center justify-between p-3 border rounded-md">
                                    <div className="flex items-center">
                                        <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                                            <Instagram className="h-4 w-4 text-blue-600" />
                                        </div>
                                        <div>
                                            <p className="font-medium">
                                                Instagram
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                Connected
                                            </p>
                                        </div>
                                    </div>
                                    <Button variant="outline" size="sm">
                                        Configure
                                    </Button>
                                </div>

                                <div className="flex items-center justify-between p-3 border rounded-md bg-gray-50">
                                    <div className="flex items-center">
                                        <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                                            <Phone className="h-4 w-4 text-gray-600" />
                                        </div>
                                        <div>
                                            <div className="flex items-center">
                                                <p className="font-medium">
                                                    E-commerce
                                                </p>
                                                <Badge className="ml-2 bg-yellow-100 text-yellow-800 text-xs">
                                                    Coming Soon
                                                </Badge>
                                            </div>
                                            <p className="text-xs text-gray-500">
                                                Connect your online store
                                            </p>
                                        </div>
                                    </div>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        disabled
                                    >
                                        Connect
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center text-lg font-bold">
                                Plan & Billing
                            </CardTitle>
                            <CardDescription>
                                Manage your subscription
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="p-4 border rounded-md mb-4">
                                <div className="flex justify-between items-center mb-2">
                                    <h3 className="font-semibold">
                                        {getPlanDisplayName(
                                            subscription?.tier || userPlan
                                        )}{" "}
                                        Plan
                                    </h3>
                                    <Badge
                                        className={getPlanBadgeColor(
                                            subscription?.tier || userPlan
                                        )}
                                    >
                                        {getPlanDisplayName(
                                            subscription?.tier || userPlan
                                        )}
                                    </Badge>
                                </div>
                                <p className="text-sm text-gray-600 mb-3">
                                    Your plan usage:
                                </p>
                                {subscription?.usage && (
                                    <div className="space-y-4">
                                        {/* Messages */}
                                        <div>
                                            <div className="flex justify-between text-sm text-gray-600 mb-1">
                                                <span>
                                                    Messages:{" "}
                                                    {
                                                        subscription.usage
                                                            .messages_used
                                                    }{" "}
                                                    /{" "}
                                                    {
                                                        subscription.usage
                                                            .messages_limit
                                                    }
                                                </span>
                                                <span>
                                                    {Math.round(
                                                        getUsagePercentage(
                                                            subscription.usage
                                                                .messages_used,
                                                            subscription.usage
                                                                .messages_limit
                                                        )
                                                    )}
                                                    %
                                                </span>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-2.5">
                                                <div
                                                    className={`h-2.5 rounded-full ${
                                                        isUsageHigh(
                                                            subscription.usage
                                                                .messages_used,
                                                            subscription.usage
                                                                .messages_limit
                                                        )
                                                            ? "bg-red-600"
                                                            : "bg-blue-600"
                                                    }`}
                                                    style={{
                                                        width: `${Math.min(
                                                            getUsagePercentage(
                                                                subscription
                                                                    .usage
                                                                    .messages_used,
                                                                subscription
                                                                    .usage
                                                                    .messages_limit
                                                            ),
                                                            100
                                                        )}%`,
                                                    }}
                                                ></div>
                                            </div>
                                        </div>

                                        {/* File Uploads */}
                                        <div>
                                            <div className="flex justify-between text-sm text-gray-600 mb-1">
                                                <span>
                                                    File Uploads:{" "}
                                                    {
                                                        subscription.usage
                                                            .files_used
                                                    }{" "}
                                                    /{" "}
                                                    {
                                                        subscription.usage
                                                            .files_limit
                                                    }
                                                </span>
                                                <span>
                                                    {Math.round(
                                                        getUsagePercentage(
                                                            subscription.usage
                                                                .files_used,
                                                            subscription.usage
                                                                .files_limit
                                                        )
                                                    )}
                                                    %
                                                </span>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-2.5">
                                                <div
                                                    className={`h-2.5 rounded-full ${
                                                        isUsageHigh(
                                                            subscription.usage
                                                                .files_used,
                                                            subscription.usage
                                                                .files_limit
                                                        )
                                                            ? "bg-red-600"
                                                            : "bg-blue-600"
                                                    }`}
                                                    style={{
                                                        width: `${Math.min(
                                                            getUsagePercentage(
                                                                subscription
                                                                    .usage
                                                                    .files_used,
                                                                subscription
                                                                    .usage
                                                                    .files_limit
                                                            ),
                                                            100
                                                        )}%`,
                                                    }}
                                                ></div>
                                            </div>
                                        </div>

                                        {/* Team Members */}
                                        <div>
                                            <div className="flex justify-between text-sm text-gray-600 mb-1">
                                                <span>
                                                    Team Members:{" "}
                                                    {
                                                        subscription.usage
                                                            .team_members_used
                                                    }{" "}
                                                    /{" "}
                                                    {
                                                        subscription.usage
                                                            .team_members_limit
                                                    }
                                                </span>
                                                <span>
                                                    {Math.round(
                                                        getUsagePercentage(
                                                            subscription.usage
                                                                .team_members_used,
                                                            subscription.usage
                                                                .team_members_limit
                                                        )
                                                    )}
                                                    %
                                                </span>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-2.5">
                                                <div
                                                    className={`h-2.5 rounded-full ${
                                                        isUsageHigh(
                                                            subscription.usage
                                                                .team_members_used,
                                                            subscription.usage
                                                                .team_members_limit
                                                        )
                                                            ? "bg-red-600"
                                                            : "bg-blue-600"
                                                    }`}
                                                    style={{
                                                        width: `${Math.min(
                                                            getUsagePercentage(
                                                                subscription
                                                                    .usage
                                                                    .team_members_used,
                                                                subscription
                                                                    .usage
                                                                    .team_members_limit
                                                            ),
                                                            100
                                                        )}%`,
                                                    }}
                                                ></div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {hasHighUsage &&
                                    subscription?.tier !== "professional" && (
                                        <div className="mt-4 p-3 bg-yellow-100 text-yellow-700 rounded-md flex items-center">
                                            <AlertTriangle className="h-5 w-5 mr-2" />
                                            <div>
                                                <p className="text-sm font-medium">
                                                    Warning: You are approaching
                                                    your plan's limits.
                                                </p>
                                                <p className="text-sm">
                                                    Consider upgrading your plan
                                                    to avoid interruptions.
                                                </p>
                                            </div>
                                        </div>
                                    )}
                            </div>
                        </CardContent>
                        <CardFooter>
                            {subscription?.tier !== "professional" ? (
                                <Button
                                    className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                                    onClick={onUpgrade}
                                >
                                    Upgrade Plan
                                </Button>
                            ) : (
                                <Button variant="outline" className="w-full">
                                    Manage Subscription
                                </Button>
                            )}
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default SettingsPage;
