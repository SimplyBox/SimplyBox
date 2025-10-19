import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Inbox,
    MessageSquareText,
    Kanban,
    BarChart3,
    ShoppingBag,
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface FeatureSectionProps {
    onTryFree?: () => void;
}

const FeatureSection: React.FC<FeatureSectionProps> = ({
    onTryFree = () => {},
}) => {
    const [waitlistEmail, setWaitlistEmail] = useState("");
    const [isSubmitted, setIsSubmitted] = useState(false);
    const { t } = useLanguage();

    const featureKeys = [
        "unifiedInbox",
        "aiAssistant",
        "kanbanBoard",
        "businessInsights",
    ];
    const platformKeys = ["shopee", "tokopedia", "blibli", "lazada"];

    const handleWaitlistSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitted(true);
        setTimeout(() => {
            setWaitlistEmail("");
            setIsSubmitted(false);
        }, 5000);
    };

    return (
        <section className="w-full py-16 bg-white">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold tracking-tight mb-2">
                        {t("features.title")}
                    </h2>
                    <p className="text-muted-foreground max-w-2xl mx-auto">
                        {t("features.subtitle")}
                    </p>
                </div>

                <Tabs
                    defaultValue="unifiedInbox"
                    className="w-full max-w-5xl mx-auto"
                >
                    <TabsList className="grid grid-cols-2 md:grid-cols-4 w-full mb-8">
                        <TabsTrigger
                            value="unifiedInbox"
                            className="flex items-center gap-2"
                        >
                            <Inbox className="h-4 w-4" />
                            <span className="hidden sm:inline">
                                {t("features.tabs.unifiedInbox")}
                            </span>
                        </TabsTrigger>
                        <TabsTrigger
                            value="aiAssistant"
                            className="flex items-center gap-2"
                        >
                            <MessageSquareText className="h-4 w-4" />
                            <span className="hidden sm:inline">
                                {t("features.tabs.aiAssistant")}
                            </span>
                        </TabsTrigger>
                        <TabsTrigger
                            value="kanbanBoard"
                            className="flex items-center gap-2"
                        >
                            <Kanban className="h-4 w-4" />
                            <span className="hidden sm:inline">
                                {t("features.tabs.kanbanBoard")}
                            </span>
                        </TabsTrigger>
                        <TabsTrigger
                            value="businessInsights"
                            className="flex items-center gap-2"
                        >
                            <BarChart3 className="h-4 w-4" />
                            <span className="hidden sm:inline">
                                {t("features.tabs.businessInsights")}
                            </span>
                        </TabsTrigger>
                    </TabsList>

                    {featureKeys.map((feature, index) => (
                        <TabsContent
                            key={feature}
                            value={feature}
                            className="space-y-4"
                        >
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                                {/* Content side - alternating order */}
                                <div
                                    className={`${
                                        index % 2 === 1
                                            ? "order-1 md:order-2"
                                            : "order-1"
                                    }`}
                                >
                                    <h3 className="text-2xl font-bold mb-4">
                                        {t(`features.items.${feature}.title`)}
                                    </h3>
                                    <p className="text-muted-foreground mb-6">
                                        {t(
                                            `features.items.${feature}.description`
                                        )}
                                    </p>
                                    <ul className="space-y-2">
                                        {Array.isArray(
                                            t(
                                                `features.items.${feature}.benefits`
                                            )
                                        ) &&
                                            t(
                                                `features.items.${feature}.benefits`
                                            ).map(
                                                (
                                                    benefit: string,
                                                    index: number
                                                ) => (
                                                    <li
                                                        key={index}
                                                        className="flex items-center gap-2"
                                                    >
                                                        <div className="h-1.5 w-1.5 rounded-full bg-primary"></div>
                                                        <span>{benefit}</span>
                                                    </li>
                                                )
                                            )}
                                    </ul>
                                    <Button
                                        className="mt-6"
                                        onClick={onTryFree}
                                    >
                                        {t("features.tryFree")}
                                    </Button>
                                </div>

                                {/* Visual side - alternating order and custom content */}
                                <div
                                    className={`${
                                        index % 2 === 1
                                            ? "order-2 md:order-1"
                                            : "order-2"
                                    }`}
                                >
                                    <div className="bg-gray-100 rounded-lg p-4 h-[300px] flex items-center justify-center">
                                        <img
                                            src={
                                                feature === "unifiedInbox"
                                                    ? "features/UnifiedInbox.png"
                                                    : feature === "aiAssistant"
                                                    ? "features/AiAssistant.png"
                                                    : feature === "kanbanBoard"
                                                    ? "features/KanbanBoard.png"
                                                    : "features/BusinessInsights.png"
                                            }
                                            alt={t(
                                                `features.items.${feature}.title`
                                            )}
                                            className="rounded-md shadow-lg max-h-full object-cover"
                                        />
                                    </div>
                                </div>
                            </div>
                        </TabsContent>
                    ))}
                </Tabs>

                {/* E-Commerce Integrations */}
                <div className="mt-24 max-w-5xl mx-auto">
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center gap-2 bg-yellow-100 text-yellow-800 px-4 py-2 rounded-full text-sm font-medium mb-4">
                            <span className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></span>
                            {t("features.comingSoon.badge")}
                        </div>
                        <h3 className="text-2xl font-bold mb-2">
                            {t("features.comingSoon.title")}
                        </h3>
                        <p className="text-muted-foreground max-w-2xl mx-auto">
                            {t("features.comingSoon.description")}
                        </p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
                        {platformKeys.map((platform, index) => (
                            <Card
                                key={index}
                                className="bg-white border hover:shadow-lg transition-shadow"
                            >
                                <CardHeader className="pb-2">
                                    <div className="flex justify-center">
                                        <img
                                            src={`/logos/${
                                                platform
                                                    .charAt(0)
                                                    .toUpperCase() +
                                                platform.slice(1)
                                            }.png`}
                                            alt={t(
                                                `features.comingSoon.platforms.${platform}`
                                            )}
                                            className="h-12 w-12 object-contain"
                                        />
                                    </div>
                                </CardHeader>
                                <CardContent className="text-center">
                                    <CardTitle className="text-lg">
                                        {t(
                                            `features.comingSoon.platforms.${platform}`
                                        )}
                                    </CardTitle>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    <Card className="max-w-md mx-auto bg-gray-50">
                        <CardHeader>
                            <CardTitle>
                                {t("features.comingSoon.waitlist.title")}
                            </CardTitle>
                            <CardDescription>
                                {t("features.comingSoon.waitlist.description")}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {!isSubmitted ? (
                                <form
                                    onSubmit={handleWaitlistSubmit}
                                    className="flex gap-2"
                                >
                                    <Input
                                        type="email"
                                        placeholder={t(
                                            "features.comingSoon.waitlist.placeholder"
                                        )}
                                        value={waitlistEmail}
                                        onChange={(e) =>
                                            setWaitlistEmail(e.target.value)
                                        }
                                        required
                                        className="flex-1"
                                    />
                                    <Button type="submit">
                                        {t(
                                            "features.comingSoon.waitlist.button"
                                        )}
                                    </Button>
                                </form>
                            ) : (
                                <div className="bg-green-50 text-green-700 p-3 rounded-md border border-green-200">
                                    {t("features.comingSoon.waitlist.success")}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </section>
    );
};

export default FeatureSection;
