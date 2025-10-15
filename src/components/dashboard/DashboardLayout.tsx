import React, { useState, useEffect } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    MessageSquare,
    Users,
    BarChart3,
    Settings,
    Kanban,
    FileText,
    ChevronDown,
    User,
    LogOut,
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";

const getPlanBadgeColor = (plan) => {
    switch (plan) {
        case "free":
            return "bg-gray-200 text-gray-700 hover:bg-gray-300 hover:text-gray-800";
        case "starter":
            return "bg-blue-100 text-blue-700 hover:bg-blue-200 hover:text-blue-800";
        case "professional":
            return "bg-green-100 text-green-700 hover:bg-green-200 hover:text-green-800";
        case "enterprise":
            return "bg-purple-100 text-purple-700 hover:bg-purple-200 hover:text-purple-800";
        default:
            return "bg-gray-200 text-gray-700 hover:bg-gray-300 hover:text-gray-800";
    }
};

const DashboardLayout = ({
    children,
    activeTab,
    onTabChange,
    userPlan,
    currentUsage,
    onUpgrade,
    onProfileClick,
}) => {
    const { t, language, setLanguage } = useLanguage();
    const { user, company, signOut } = useAuth();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const handleTabChange = (tab: string) => {
        onTabChange(tab);
    };

    const handleLogout = async () => {
        try {
            await signOut();
        } catch (error) {
            console.error("Logout error:", error);
        }
    };

    const getUserInitials = () => {
        if (user?.email) {
            return user.email.substring(0, 2).toUpperCase();
        }
        return "US";
    };

    const getDisplayName = () => {
        if (user?.name) {
            return user.name;
        }
        return "User";
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Tabs
                value={activeTab}
                onValueChange={handleTabChange}
                className="w-full"
            >
                <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
                    <div className="container mx-auto px-4 py-3 flex items-center justify-between">
                        <div className="flex items-center">
                            <img
                                src="/LogoHorizontal.png"
                                alt="SimplyBox"
                                className="h-8 w-auto"
                            />
                        </div>
                        <div className="flex items-center space-x-6">
                            <div className="hidden md:flex items-center space-x-6">
                                <div className="flex items-center space-x-4 text-sm">
                                    <div className="flex items-center">
                                        <MessageSquare className="h-4 w-4 mr-1 text-gray-500" />
                                        <span className="text-gray-600">
                                            {t("layout.usage.messages", {
                                                used:
                                                    currentUsage?.messages
                                                        ?.used || 0,
                                                total:
                                                    currentUsage?.messages
                                                        ?.total || 100,
                                            })}
                                        </span>
                                    </div>
                                    <div className="flex items-center">
                                        <FileText className="h-4 w-4 mr-1 text-gray-500" />
                                        <span className="text-gray-600">
                                            {t("layout.usage.files", {
                                                used:
                                                    currentUsage?.files?.used ||
                                                    0,
                                                total:
                                                    currentUsage?.files
                                                        ?.total || 2,
                                            })}
                                        </span>
                                    </div>
                                </div>
                                <Badge
                                    className={`${getPlanBadgeColor(
                                        userPlan
                                    )} px-3 py-1`}
                                >
                                    {t(`layout.plan.${userPlan || "free"}`)}
                                </Badge>
                                {userPlan !== "enterprise" && (
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        className="text-blue-600 border-blue-600 hover:bg-blue-50 px-4"
                                        onClick={onUpgrade}
                                    >
                                        {t("layout.upgradeButton")}
                                    </Button>
                                )}
                            </div>
                            <div className="flex items-center gap-3">
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
                                <DropdownMenu
                                    open={isDropdownOpen}
                                    onOpenChange={setIsDropdownOpen}
                                >
                                    <DropdownMenuTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            className="flex items-center space-x-2 p-2 hover:bg-gray-100"
                                        >
                                            <Avatar className="h-8 w-8">
                                                <AvatarImage
                                                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${
                                                        user?.email || "user"
                                                    }`}
                                                />
                                                <AvatarFallback>
                                                    {getUserInitials()}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="hidden sm:flex flex-col items-start">
                                                <span className="text-sm font-medium text-gray-900">
                                                    {getDisplayName()}
                                                </span>
                                                {company && (
                                                    <span className="text-xs text-gray-500">
                                                        {company.name}
                                                    </span>
                                                )}
                                            </div>
                                            <ChevronDown className="h-4 w-4 text-gray-500" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent
                                        align="end"
                                        className="w-56"
                                    >
                                        <div className="px-2 py-2">
                                            <div className="flex items-center space-x-2">
                                                <Avatar className="h-8 w-8">
                                                    <AvatarImage
                                                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${
                                                            user?.email ||
                                                            "user"
                                                        }`}
                                                    />
                                                    <AvatarFallback>
                                                        {getUserInitials()}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-medium text-gray-900">
                                                        {getDisplayName()}
                                                    </span>
                                                    <span className="text-xs text-gray-500">
                                                        {user?.email}
                                                    </span>
                                                    {company && (
                                                        <span className="text-xs text-gray-500">
                                                            {company.name}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem
                                            onClick={() => {
                                                onProfileClick();
                                                setIsDropdownOpen(false);
                                            }}
                                            className="flex items-center cursor-pointer"
                                        >
                                            <User className="h-4 w-4 mr-2" />
                                            Profile Settings
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem
                                            onClick={handleLogout}
                                            className="flex items-center cursor-pointer text-red-600 focus:text-red-600"
                                        >
                                            <LogOut className="h-4 w-4 mr-2" />
                                            Logout
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </div>
                    </div>
                    <div className="container mx-auto px-4">
                        <TabsList className="bg-transparent w-full justify-start">
                            <TabsTrigger
                                value="inbox"
                                className="data-[state=active]:border-b-2 data-[state=active]:border-blue-600 rounded-none px-4 py-2"
                            >
                                <MessageSquare className="h-4 w-4 mr-2" />
                                {t("layout.tabs.inbox")}
                            </TabsTrigger>
                            <TabsTrigger
                                value="kanban"
                                className="data-[state=active]:border-b-2 data-[state=active]:border-blue-600 rounded-none px-4 py-2"
                            >
                                <Kanban className="h-4 w-4 mr-2" />
                                {t("layout.tabs.kanban")}
                            </TabsTrigger>
                            <TabsTrigger
                                value="insights"
                                className="data-[state=active]:border-b-2 data-[state=active]:border-blue-600 rounded-none px-4 py-2"
                            >
                                <BarChart3 className="h-4 w-4 mr-2" />
                                {t("layout.tabs.insights")}
                            </TabsTrigger>
                            <TabsTrigger
                                value="contacts"
                                className="data-[state=active]:border-b-2 data-[state=active]:border-blue-600 rounded-none px-4 py-2"
                            >
                                <Users className="h-4 w-4 mr-2" />
                                {t("layout.tabs.contacts")}
                            </TabsTrigger>
                            {(userPlan === "starter" ||
                                userPlan === "professional") && (
                                <TabsTrigger
                                    value="team"
                                    className="data-[state=active]:border-b-2 data-[state=active]:border-blue-600 rounded-none px-4 py-2"
                                >
                                    <Users className="h-4 w-4 mr-2" />
                                    {t("layout.tabs.team")}
                                </TabsTrigger>
                            )}
                            <TabsTrigger
                                value="files"
                                className="data-[state=active]:border-b-2 data-[state=active]:border-blue-600 rounded-none px-4 py-2"
                            >
                                <FileText className="h-4 w-4 mr-2" />
                                {t("layout.tabs.files")}
                            </TabsTrigger>
                            <TabsTrigger
                                value="settings"
                                className="data-[state=active]:border-b-2 data-[state=active]:border-blue-600 rounded-none px-4 py-2"
                            >
                                <Settings className="h-4 w-4 mr-2" />
                                {t("layout.tabs.settings")}
                            </TabsTrigger>
                        </TabsList>
                    </div>
                </header>
                <main className="container mx-auto px-4">{children}</main>
            </Tabs>
        </div>
    );
};

export default DashboardLayout;
