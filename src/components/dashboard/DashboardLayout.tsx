import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Tabs } from "@/components/ui/tabs";
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
    Menu,
    X,
    Sparkles,
    Contact,
    UsersRound,
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

const NavItem = ({
    href,
    icon: Icon,
    label,
    isActive,
    isCollapsed,
    onClick,
}) => {
    const handleClick = (e) => {
        e.preventDefault();
        onClick();
    };

    return (
        <motion.a
            href={href}
            onClick={handleClick}
            whileHover={{
                x: isCollapsed ? 0 : 4,
            }}
            whileTap={{ scale: 0.97 }}
            className={`group flex items-center p-3 rounded-xl text-sm font-medium relative overflow-hidden
            ${
                isActive
                    ? "bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-500 border border-blue-200 shadow-sm"
                    : "text-gray-600"
            }
            ${isCollapsed ? "justify-center" : "justify-start"}`}
        >
            {isActive && (
                <motion.div
                    className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 to-indigo-500"
                    layoutId="activeIndicator"
                />
            )}

            <Icon
                className={`h-5 w-5 flex-shrink-0 transition-colors duration-150
                ${
                    isActive
                        ? "text-blue-600"
                        : "text-gray-500 group-hover:text-blue-500"
                }
                ${isCollapsed ? "" : "mr-3"}`}
            />

            <motion.span
                className={`${
                    isCollapsed ? "hidden" : "block"
                } transition-all duration-150`}
                animate={{
                    opacity: isCollapsed ? 0 : 1,
                    width: isCollapsed ? 0 : "auto",
                }}
            >
                {label}
            </motion.span>
        </motion.a>
    );
};

const UsageItem = ({ icon: Icon, label, used, total }) => (
    <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex items-center p-3 bg-gray-50/50 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors"
        whileHover={{ scale: 1.02 }}
    >
        <Icon className="h-4 w-4 mr-3 text-gray-500 flex-shrink-0" />
        <span className="text-sm text-gray-600">{label}</span>
        <div className="ml-auto text-sm font-medium text-gray-900">
            {used}/{total}
        </div>
    </motion.div>
);

const Sidebar = ({
    activeTab,
    onTabChange,
    userPlan,
    isCollapsed,
    onCloseMobile,
    currentUsage,
    onUpgrade,
}) => {
    const { t } = useLanguage();

    const navItems = [
        { value: "inbox", label: t("layout.tabs.inbox"), icon: MessageSquare },
        { value: "kanban", label: t("layout.tabs.kanban"), icon: Kanban },
        {
            value: "insights",
            label: t("layout.tabs.insights"),
            icon: BarChart3,
        },
        { value: "contacts", label: t("layout.tabs.contacts"), icon: Contact },
        {
            value: "team",
            label: t("layout.tabs.team"),
            icon: UsersRound,
            plans: ["starter", "professional", "enterprise"],
        },
        { value: "files", label: t("layout.tabs.files"), icon: FileText },
        { value: "settings", label: t("layout.tabs.settings"), icon: Settings },
    ];

    const allowedNavItems = navItems.filter((item) => {
        return item.plans ? item.plans.includes(userPlan) : true;
    });

    const handleNavClick = (value) => {
        onTabChange(value);
        if (onCloseMobile) {
            onCloseMobile();
        }
    };

    return (
        <motion.div
            className={`flex flex-col bg-white border-r border-gray-200
        ${onCloseMobile ? "h-full" : "h-[calc(100vh-65px)] fixed top-16"}
    `}
            initial={false}
            animate={{ width: isCollapsed ? "4rem" : "16rem" }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
        >
            {onCloseMobile && (
                <motion.div
                    className="flex items-center justify-between h-16 p-4 border-b border-gray-200 flex-shrink-0"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                >
                    <motion.img
                        src="/LogoHorizontal.png"
                        alt="SimplyBox"
                        className="h-8 w-auto"
                        whileHover={{ scale: 1.05 }}
                    />
                    <motion.div whileHover={{ scale: 1.1 }}>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={onCloseMobile}
                            className="md:hidden hover:bg-red-50"
                        >
                            <X className="h-6 w-6" />
                        </Button>
                    </motion.div>
                </motion.div>
            )}

            <nav className="flex-1 p-4 space-y-2 flex flex-col justify-start overflow-visible">
                <motion.div
                    className="space-y-2"
                    initial="hidden"
                    animate="visible"
                    variants={{
                        visible: {
                            transition: {
                                staggerChildren: 0.05,
                                delayChildren: 0.1,
                            },
                        },
                    }}
                >
                    {allowedNavItems.map((item, index) => (
                        <motion.div
                            key={item.value}
                            variants={{
                                hidden: { opacity: 0, y: -20 },
                                visible: { opacity: 1, y: 0 },
                            }}
                        >
                            <NavItem
                                href={`?tab=${item.value}`}
                                icon={item.icon}
                                label={item.label}
                                isActive={activeTab === item.value}
                                isCollapsed={isCollapsed}
                                onClick={() => handleNavClick(item.value)}
                            />
                        </motion.div>
                    ))}
                </motion.div>
            </nav>

            <motion.div
                className="p-4 border-t border-gray-200 flex-shrink-0 bg-gradient-to-b from-white to-gray-50"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
            >
                <div className="space-y-4">
                    <motion.div
                        whileHover={{ scale: 1.02 }}
                        className="flex justify-center"
                    >
                        <Badge
                            className={`px-4 py-2 text-xs font-semibold shadow-sm ${getPlanBadgeColor(
                                userPlan
                            )} hover:shadow-md transition-all duration-200`}
                        >
                            {t(`layout.plan.${userPlan || "free"}`)}
                        </Badge>
                    </motion.div>

                    <div className="space-y-3">
                        <UsageItem
                            icon={MessageSquare}
                            label={t("layout.usage.messages")}
                            used={currentUsage?.messages?.used || 0}
                            total={currentUsage?.messages?.total || 100}
                        />
                        <UsageItem
                            icon={FileText}
                            label={t("layout.usage.files")}
                            used={currentUsage?.files?.used || 0}
                            total={currentUsage?.files?.total || 2}
                        />
                        <UsageItem
                            icon={Users}
                            label={t("layout.usage.members")}
                            used={currentUsage?.users?.used || 0}
                            total={currentUsage?.users?.total || 2}
                        />
                    </div>

                    {userPlan !== "enterprise" && (
                        <motion.div
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <Button
                                size="sm"
                                variant="outline"
                                className="w-full bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-600 border-blue-200 hover:from-blue-100 hover:to-indigo-100 hover:border-blue-300 hover:text-blue-700 font-semibold shadow-sm transition-all duration-200"
                                onClick={onUpgrade}
                            >
                                <Sparkles className="h-4 w-4 mr-2" />
                                {t("layout.upgradeButton")}
                            </Button>
                        </motion.div>
                    )}
                </div>
            </motion.div>
        </motion.div>
    );
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
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const handleLogout = async () => {
        try {
            await signOut();
        } catch (error) {
            console.error("Logout error:", error);
        }
    };

    const getUserInitials = () =>
        user?.email ? user.email.substring(0, 2).toUpperCase() : "US";
    const getDisplayName = () => user?.name || "User";

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <header className="bg-white border-b border-gray-200 sticky top-0 z-40 flex-shrink-0">
                <div className="mx-auto p-4 flex items-center justify-between h-16">
                    <div className="flex items-center sm:space-x-4">
                        <motion.img
                            src="/LogoHorizontal.png"
                            alt="SimplyBox"
                            className="h-8 w-auto hidden sm:block"
                            whileHover={{ scale: 1.02 }}
                        />
                        <motion.div
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <Button
                                variant="ghost"
                                size="icon"
                                className="md:hidden"
                                onClick={() => setIsMobileMenuOpen(true)}
                                aria-label="Open navigation menu"
                            >
                                <Menu className="h-6 w-6" />
                            </Button>
                        </motion.div>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="flex bg-gray-100 rounded-full p-1">
                            <button
                                onClick={() => setLanguage("en")}
                                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                                    language === "en"
                                        ? "bg-blue-500 text-white"
                                        : "text-gray-600 hover:text-gray-800"
                                }`}
                            >
                                EN
                            </button>
                            <button
                                onClick={() => setLanguage("id")}
                                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                                    language === "id"
                                        ? "bg-blue-500 text-white"
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
                                <motion.div whileHover={{ scale: 1.02 }}>
                                    <Button
                                        variant="ghost"
                                        className="flex items-center space-x-2 hover:bg-white"
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
                                </motion.div>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-56">
                                <DropdownMenuItem
                                    onClick={onProfileClick}
                                    className="flex items-center cursor-pointer"
                                >
                                    <User className="h-4 w-4 mr-2" />{" "}
                                    {t("layout.profile")}
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                    onClick={handleLogout}
                                    className="flex items-center cursor-pointer text-red-600 focus:text-red-600"
                                >
                                    <LogOut className="h-4 w-4 mr-2" />{" "}
                                    {t("layout.logout")}
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </header>

            <div className="flex flex-1 overflow-hidden">
                <div className="hidden md:flex md:flex-shrink-0 w-64">
                    <div className="flex flex-col w-full h-full">
                        <Sidebar
                            activeTab={activeTab}
                            onTabChange={onTabChange}
                            userPlan={userPlan}
                            isCollapsed={false}
                            onCloseMobile={null}
                            currentUsage={currentUsage}
                            onUpgrade={onUpgrade}
                        />
                    </div>
                </div>

                {/* Mobile Sidebar */}
                <AnimatePresence>
                    {isMobileMenuOpen && (
                        <>
                            <motion.div
                                key="backdrop"
                                className="fixed inset-0 z-40 bg-black bg-opacity-50"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{
                                    duration: 0.3,
                                    ease: "easeInOut",
                                }}
                                onClick={() => setIsMobileMenuOpen(false)}
                            />

                            <motion.div
                                key="sidebar"
                                className="fixed inset-y-0 left-0 z-50 w-64 md:hidden"
                                initial={{ x: "-100%" }}
                                animate={{ x: 0 }}
                                exit={{ x: "-100%" }}
                                transition={{
                                    duration: 0.3,
                                    ease: "easeInOut",
                                }}
                            >
                                <Sidebar
                                    activeTab={activeTab}
                                    onTabChange={onTabChange}
                                    userPlan={userPlan}
                                    isCollapsed={false}
                                    onCloseMobile={() =>
                                        setIsMobileMenuOpen(false)
                                    }
                                    currentUsage={currentUsage}
                                    onUpgrade={onUpgrade}
                                />
                            </motion.div>
                        </>
                    )}
                </AnimatePresence>

                <main className="flex-1 overflow-y-auto">
                    <Tabs value={activeTab} onValueChange={onTabChange}>
                        {children}
                    </Tabs>
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;
