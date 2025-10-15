import React from "react";
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
import { MessageSquare, Mail, Phone } from "lucide-react";

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
    return (
        <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-semibold mb-4">Settings</h2>
            <p className="text-gray-600 mb-6">
                Configure your account, channels, and preferences.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Company Information</CardTitle>
                        <CardDescription>
                            Update your business details
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Company Name
                                </label>
                                <input
                                    type="text"
                                    className="w-full rounded-md border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    defaultValue="Your Company"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Business Type
                                </label>
                                <select className="w-full rounded-md border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                                    <option>Retail</option>
                                    <option>Service</option>
                                    <option>Manufacturing</option>
                                    <option>Other</option>
                                </select>
                            </div>
                        </form>
                    </CardContent>
                    <CardFooter>
                        <Button className="w-full">Save Changes</Button>
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
                            <div className="flex items-center justify-between p-3 border rounded-md">
                                <div className="flex items-center">
                                    <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center mr-3">
                                        <MessageSquare className="h-4 w-4 text-green-600" />
                                    </div>
                                    <div>
                                        <p className="font-medium">WhatsApp</p>
                                        <p className="text-xs text-gray-500">
                                            Connected
                                        </p>
                                    </div>
                                </div>
                                <Button variant="outline" size="sm">
                                    Configure
                                </Button>
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
                        <CardTitle>Language & Localization</CardTitle>
                        <CardDescription>
                            Set your preferred language
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Interface Language
                                </label>
                                <select className="w-full rounded-md border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                                    <option>English</option>
                                    <option>Bahasa Indonesia</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Time Zone
                                </label>
                                <select className="w-full rounded-md border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                                    <option>Asia/Jakarta (GMT+7)</option>
                                    <option>Asia/Singapore (GMT+8)</option>
                                    <option>Asia/Tokyo (GMT+9)</option>
                                </select>
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button className="w-full">Save Preferences</Button>
                    </CardFooter>
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
