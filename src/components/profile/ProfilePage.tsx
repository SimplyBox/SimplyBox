import React, { useState, useEffect } from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { User, Mail, Calendar, Bell, Key, Camera, Save } from "lucide-react";

interface ProfilePageProps {
    userPlan?: "free" | "starter" | "professional" | "enterprise";
    onSave?: (profileData: any) => void;
    user?: any; // User from AuthContext
    company?: any; // Company from AuthContext
}

const ProfilePage: React.FC<ProfilePageProps> = ({
    userPlan = "free",
    onSave = () => {},
    user,
    company,
}) => {
    const [profileData, setProfileData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        company: "",
        position: "Business Owner",
        location: "Jakarta, Indonesia",
        avatar: "",
        timezone: "Asia/Jakarta",
        language: "en",
        notifications: {
            email: true,
            push: true,
            sms: false,
            marketing: true,
        },
        privacy: {
            profileVisible: true,
            activityStatus: true,
        },
    });

    const [isEditing, setIsEditing] = useState(false);

    // Initialize profile data from AuthContext when component mounts
    useEffect(() => {
        if (user || company) {
            const emailParts = user?.email?.split("@") || ["User", ""];
            const firstName =
                emailParts[0].charAt(0).toUpperCase() + emailParts[0].slice(1);

            setProfileData((prev) => ({
                ...prev,
                firstName: firstName,
                lastName: "",
                email: user?.email || "",
                phone: user?.phone || company?.whatsapp_number || "",
                company: company?.name || "",
                avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${
                    user?.email || "user"
                }`,
            }));
        }
    }, [user, company]);

    const handleInputChange = (field: string, value: any) => {
        setProfileData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleNestedChange = (parent: string, field: string, value: any) => {
        setProfileData((prev) => ({
            ...prev,
            [parent]: {
                ...prev[parent],
                [field]: value,
            },
        }));
    };

    const handleSave = () => {
        onSave(profileData);
        setIsEditing(false);
    };

    const getPlanBadgeColor = (plan: string) => {
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

    const getUserInitials = () => {
        if (profileData.firstName && profileData.lastName) {
            return (
                profileData.firstName.charAt(0) + profileData.lastName.charAt(0)
            );
        } else if (profileData.firstName) {
            return profileData.firstName.substring(0, 2).toUpperCase();
        } else if (user?.email) {
            return user.email.substring(0, 2).toUpperCase();
        }
        return "US";
    };

    const getCreatedDate = () => {
        if (user?.created_at) {
            return new Date(user.created_at).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
            });
        }
        return "Jan 2024";
    };

    return (
        <div className="bg-white min-h-screen">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-12">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6">
                        <div className="relative">
                            <Avatar className="h-24 w-24">
                                <AvatarImage
                                    src={profileData.avatar}
                                    alt="Profile"
                                />
                                <AvatarFallback className="text-2xl">
                                    {getUserInitials()}
                                </AvatarFallback>
                            </Avatar>
                            <Button
                                size="sm"
                                className="absolute -bottom-2 -right-2 rounded-full h-8 w-8 p-0"
                                onClick={() => setIsEditing(true)}
                            >
                                <Camera className="h-4 w-4" />
                            </Button>
                        </div>
                        <div className="text-center md:text-left">
                            <h1 className="text-3xl font-bold">
                                {profileData.firstName}{" "}
                                {profileData.lastName || ""}
                            </h1>
                            <p className="text-blue-100 text-lg">
                                {profileData.position}
                            </p>
                            <p className="text-blue-200">
                                {profileData.company}
                            </p>
                            <div className="flex items-center justify-center md:justify-start mt-2">
                                <Badge
                                    className={`${getPlanBadgeColor(
                                        userPlan
                                    )} mr-2`}
                                >
                                    {userPlan.charAt(0).toUpperCase() +
                                        userPlan.slice(1)}{" "}
                                    Plan
                                </Badge>
                                <span className="text-blue-200 text-sm">
                                    Member since {getCreatedDate()}
                                </span>
                            </div>
                        </div>
                        <div className="ml-auto">
                            <Button
                                variant="secondary"
                                onClick={() => setIsEditing(!isEditing)}
                                className="bg-white text-blue-600 hover:bg-blue-50"
                            >
                                {isEditing ? "Cancel" : "Edit Profile"}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Profile Content */}
            <div className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Profile Information */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Personal Information */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center">
                                    <User className="h-5 w-5 mr-2" />
                                    Personal Information
                                </CardTitle>
                                <CardDescription>
                                    Update your personal details and contact
                                    information
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="firstName">
                                            First Name
                                        </Label>
                                        <Input
                                            id="firstName"
                                            value={profileData.firstName}
                                            onChange={(e) =>
                                                handleInputChange(
                                                    "firstName",
                                                    e.target.value
                                                )
                                            }
                                            disabled={!isEditing}
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="lastName">
                                            Last Name
                                        </Label>
                                        <Input
                                            id="lastName"
                                            value={profileData.lastName}
                                            onChange={(e) =>
                                                handleInputChange(
                                                    "lastName",
                                                    e.target.value
                                                )
                                            }
                                            disabled={!isEditing}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <Label htmlFor="email">Email Address</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={profileData.email}
                                        onChange={(e) =>
                                            handleInputChange(
                                                "email",
                                                e.target.value
                                            )
                                        }
                                        disabled={true} // Email should not be editable as it's from auth
                                        className="bg-gray-50"
                                    />
                                    <p className="text-xs text-gray-500 mt-1">
                                        Email cannot be changed. Please contact
                                        support if needed.
                                    </p>
                                </div>
                                <div>
                                    <Label htmlFor="phone">Phone Number</Label>
                                    <Input
                                        id="phone"
                                        value={profileData.phone}
                                        onChange={(e) =>
                                            handleInputChange(
                                                "phone",
                                                e.target.value
                                            )
                                        }
                                        disabled={!isEditing}
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        {/* Preferences */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center">
                                    <Calendar className="h-5 w-5 mr-2" />
                                    Preferences
                                </CardTitle>
                                <CardDescription>
                                    Customize your experience
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <Label htmlFor="timezone">Timezone</Label>
                                    <Select
                                        value={profileData.timezone}
                                        onValueChange={(value) =>
                                            handleInputChange("timezone", value)
                                        }
                                        disabled={!isEditing}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Asia/Jakarta">
                                                Asia/Jakarta (GMT+7)
                                            </SelectItem>
                                            <SelectItem value="Asia/Singapore">
                                                Asia/Singapore (GMT+8)
                                            </SelectItem>
                                            <SelectItem value="Asia/Tokyo">
                                                Asia/Tokyo (GMT+9)
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div>
                                    <Label htmlFor="language">Language</Label>
                                    <Select
                                        value={profileData.language}
                                        onValueChange={(value) =>
                                            handleInputChange("language", value)
                                        }
                                        disabled={!isEditing}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="en">
                                                English
                                            </SelectItem>
                                            <SelectItem value="id">
                                                Bahasa Indonesia
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Account Information */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center">
                                    <Mail className="h-5 w-5 mr-2" />
                                    Account Info
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div>
                                    <Label className="text-sm text-gray-500">
                                        User ID
                                    </Label>
                                    <p className="text-sm font-mono bg-gray-100 p-2 rounded">
                                        {user?.id?.substring(0, 8) || "N/A"}...
                                    </p>
                                </div>
                                <div>
                                    <Label className="text-sm text-gray-500">
                                        Created
                                    </Label>
                                    <p className="text-sm">
                                        {getCreatedDate()}
                                    </p>
                                </div>
                                <div>
                                    <Label className="text-sm text-gray-500">
                                        Last Login
                                    </Label>
                                    <p className="text-sm">Today</p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Notification Settings */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center">
                                    <Bell className="h-5 w-5 mr-2" />
                                    Notifications
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="email-notifications">
                                        Email Notifications
                                    </Label>
                                    <Switch
                                        id="email-notifications"
                                        checked={
                                            profileData.notifications.email
                                        }
                                        onCheckedChange={(checked) =>
                                            handleNestedChange(
                                                "notifications",
                                                "email",
                                                checked
                                            )
                                        }
                                        disabled={!isEditing}
                                    />
                                </div>
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="push-notifications">
                                        Push Notifications
                                    </Label>
                                    <Switch
                                        id="push-notifications"
                                        checked={profileData.notifications.push}
                                        onCheckedChange={(checked) =>
                                            handleNestedChange(
                                                "notifications",
                                                "push",
                                                checked
                                            )
                                        }
                                        disabled={!isEditing}
                                    />
                                </div>
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="sms-notifications">
                                        SMS Notifications
                                    </Label>
                                    <Switch
                                        id="sms-notifications"
                                        checked={profileData.notifications.sms}
                                        onCheckedChange={(checked) =>
                                            handleNestedChange(
                                                "notifications",
                                                "sms",
                                                checked
                                            )
                                        }
                                        disabled={!isEditing}
                                    />
                                </div>
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="marketing-notifications">
                                        Marketing Updates
                                    </Label>
                                    <Switch
                                        id="marketing-notifications"
                                        checked={
                                            profileData.notifications.marketing
                                        }
                                        onCheckedChange={(checked) =>
                                            handleNestedChange(
                                                "notifications",
                                                "marketing",
                                                checked
                                            )
                                        }
                                        disabled={!isEditing}
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        {/* Security */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center">
                                    <Key className="h-5 w-5 mr-2" />
                                    Security
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <Button
                                    variant="outline"
                                    className="w-full justify-start"
                                >
                                    Change Password
                                </Button>
                                <Button
                                    variant="outline"
                                    className="w-full justify-start"
                                >
                                    Two-Factor Authentication
                                </Button>
                                <Button
                                    variant="outline"
                                    className="w-full justify-start"
                                >
                                    Login History
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Save Button */}
                {isEditing && (
                    <div className="fixed bottom-6 right-6">
                        <Button
                            onClick={handleSave}
                            size="lg"
                            className="shadow-lg"
                        >
                            <Save className="h-4 w-4 mr-2" />
                            Save Changes
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProfilePage;
