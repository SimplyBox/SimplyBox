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
import { MessageSquare, Mail, Phone, CheckCircle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useWhatsApp } from "@/contexts/WhatsAppContext";
import supabase from "@/libs/supabase";

// Helper functions
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

const SettingsPage = ({ userPlan = "free", currentUsage, onUpgrade }) => {
    const { company, loading: authLoading } = useAuth();
    const {
        integration,
        configureWhatsApp,
        disconnectWhatsApp,
        loading: waLoading,
    } = useWhatsApp();
    const [formData, setFormData] = useState({
        name: "",
        type: "",
        business_email: "",
        whatsapp_number: "",
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    useEffect(() => {
        if (company) {
            setFormData({
                name: company.name || "",
                type: company.type || "",
                business_email: company.business_email || "",
                whatsapp_number: company.whatsapp_number || "",
            });
        }
    }, [company]);

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);
        setSuccess(null);

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

    return (
        <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-semibold mb-4">Settings</h2>
            <p className="text-gray-600 mb-6">
                Configure your account, channels, and preferences.
            </p>
            {error && (
                <div className="bg-red-100 text-red-700 p-3 rounded-md mb-4">
                    {error}
                </div>
            )}
            {success && (
                <div className="bg-green-100 text-green-700 p-3 rounded-md mb-4">
                    {success}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Company Information</CardTitle>
                        <CardDescription>
                            Update your business details
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form className="space-y-4" onSubmit={handleSubmit}>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Company Name
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    className="w-full rounded-md border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Business Type
                                </label>
                                <select
                                    name="type"
                                    value={formData.type}
                                    onChange={handleInputChange}
                                    className="w-full rounded-md border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    required
                                >
                                    <option value="">
                                        Select a business type
                                    </option>
                                    <option value="Retail">Retail</option>
                                    <option value="Service">Service</option>
                                    <option value="Manufacturing">
                                        Manufacturing
                                    </option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Business Email
                                </label>
                                <input
                                    type="email"
                                    name="business_email"
                                    value={formData.business_email}
                                    onChange={handleInputChange}
                                    className="w-full rounded-md border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    WhatsApp Number
                                </label>
                                <input
                                    type="tel"
                                    name="whatsapp_number"
                                    value={formData.whatsapp_number}
                                    onChange={handleInputChange}
                                    className="w-full rounded-md border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    required
                                />
                            </div>
                        </form>
                    </CardContent>
                    <CardFooter>
                        <Button
                            className="w-full"
                            type="submit"
                            onClick={handleSubmit}
                            disabled={isSubmitting || authLoading}
                        >
                            {isSubmitting ? "Saving..." : "Save Changes"}
                        </Button>
                    </CardFooter>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Channel Management</CardTitle>
                        <CardDescription>
                            Connect your communication channels
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="border rounded-lg p-4 bg-green-50">
                                <div className="flex items-center gap-3 mb-3">
                                    <MessageSquare className="h-5 w-5 text-green-600" />
                                    <h3 className="font-semibold text-gray-900">
                                        WhatsApp Integration
                                    </h3>
                                </div>
                                {integration ? (
                                    <div className="bg-green-100 border border-green-200 rounded-lg p-4">
                                        <div className="flex items-center gap-2 mb-2">
                                            <CheckCircle className="h-5 w-5 text-green-600" />
                                            <span className="font-semibold text-green-800">
                                                WhatsApp Business Connected
                                            </span>
                                        </div>
                                        <p className="text-sm text-green-700">
                                            Phone: {integration.phone_number}
                                        </p>
                                        <p className="text-sm text-green-700">
                                            Business ID: {integration.waba_id}
                                        </p>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="mt-3"
                                            onClick={handleWhatsAppDisconnect}
                                            disabled={isSubmitting || waLoading}
                                        >
                                            {isSubmitting
                                                ? "Disconnecting..."
                                                : "Disconnect"}
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="bg-white border rounded-lg p-6 text-center">
                                        <p className="text-sm text-gray-600 mb-4">
                                            Connect your WhatsApp Business
                                            account to enable messaging
                                        </p>
                                        <Button
                                            variant="default"
                                            size="lg"
                                            className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2 mx-auto"
                                            onClick={handleWhatsAppConfigure}
                                            disabled={isSubmitting || waLoading}
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
                                        <Mail className="h-4 w-4 text-blue-600" />
                                    </div>
                                    <div>
                                        <p className="font-medium">Email</p>
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
                                <Button variant="outline" size="sm" disabled>
                                    Connect
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Plan & Billing</CardTitle>
                        <CardDescription>
                            Manage your subscription
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="p-4 border rounded-md mb-4">
                            <div className="flex justify-between items-center mb-2">
                                <h3 className="font-semibold">
                                    {getPlanDisplayName(userPlan)} Plan
                                </h3>
                                <Badge className={getPlanBadgeColor(userPlan)}>
                                    {getPlanDisplayName(userPlan)}
                                </Badge>
                            </div>
                            <p className="text-sm text-gray-600 mb-3">
                                Your plan includes:
                            </p>
                            <ul className="text-sm text-gray-600 space-y-1">
                                <li>
                                    • {currentUsage?.messages?.total || 100}{" "}
                                    messages/month
                                </li>
                                <li>
                                    • {currentUsage?.files?.total || 2} file
                                    uploads
                                </li>
                                <li>
                                    • {currentUsage?.users?.total || 1} team
                                    members
                                </li>
                                {userPlan !== "free" && (
                                    <li>• Enhanced AI responses</li>
                                )}
                                {userPlan === "professional" && (
                                    <li>• Custom AI prompts</li>
                                )}
                            </ul>
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                        {userPlan !== "professional" ? (
                            <Button className="w-full" onClick={onUpgrade}>
                                Upgrade Plan
                            </Button>
                        ) : (
                            <Button variant="outline" className="w-full">
                                Manage Subscription
                            </Button>
                        )}
                    </CardFooter>
                </Card>

                <Card className="md:col-span-2">
                    <CardHeader>
                        <CardTitle>Notifications</CardTitle>
                        <CardDescription>
                            Configure your notification preferences
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-medium">
                                        Email Notifications
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        Receive updates about new messages and
                                        system alerts
                                    </p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        defaultChecked
                                        className="sr-only peer"
                                    />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                </label>
                            </div>
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-medium">
                                        Browser Notifications
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        Get instant notifications in your
                                        browser
                                    </p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        className="sr-only peer"
                                    />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                </label>
                            </div>
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-medium">
                                        Weekly Reports
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        Receive weekly summaries of your
                                        activity
                                    </p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        defaultChecked
                                        className="sr-only peer"
                                    />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                </label>
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button className="w-full">
                            Save Notification Settings
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
};

export default SettingsPage;
