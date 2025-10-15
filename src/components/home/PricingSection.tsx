import React from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "../ui/card";
import { Check, HelpCircle, X } from "lucide-react";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "../ui/tooltip";
import { useLanguage } from "@/contexts/LanguageContext";

interface PricingFeature {
    key: string;
    included: boolean;
    hasTooltip?: boolean;
}

interface PricingPlan {
    planKey: string;
    features: PricingFeature[];
    popular?: boolean;
}

const PricingSection: React.FC = () => {
    const { t } = useLanguage();

    const plans: PricingPlan[] = [
        {
            planKey: "free",
            features: [
                { key: "companyRegistration", included: true },
                { key: "channels", included: true },
                { key: "messages", included: true },
                { key: "fileUploads", included: true },
                { key: "aiAgent", included: true, hasTooltip: true },
                { key: "kanbanBoard", included: true },
                { key: "analytics", included: true },
                { key: "ecommerce", included: false },
            ],
        },
        {
            planKey: "starter",
            popular: true,
            features: [
                { key: "everythingFree", included: true },
                { key: "channels", included: true },
                { key: "messages", included: true },
                { key: "fileUploads", included: true },
                { key: "teamMembers", included: true },
                { key: "enhancedAI", included: true, hasTooltip: true },
                { key: "advancedKanban", included: true },
                { key: "weeklyAnalytics", included: true },
                { key: "emailSupport", included: true },
            ],
        },
        {
            planKey: "professional",
            features: [
                { key: "everythingStarter", included: true },
                { key: "channels", included: true },
                { key: "messages", included: true },
                { key: "fileUploads", included: true },
                { key: "teamMembers", included: true },
                { key: "advancedAI", included: true, hasTooltip: true },
                { key: "advancedAnalytics", included: true },
                { key: "prioritySupport", included: true },
            ],
        },
        {
            planKey: "enterprise",
            features: [
                { key: "customizable", included: true },
                { key: "marketingAutomation", included: true },
                { key: "crmIntegration", included: true },
                { key: "orderTracking", included: true },
                { key: "freeSetup", included: true },
                { key: "accountManager", included: true },
                { key: "whiteLabel", included: true },
            ],
        },
    ];

    return (
        <section className="w-full py-16 bg-white" id="pricing">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
                        {t("pricing.title")}
                    </h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        {t("pricing.subtitle")}
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {plans.map((plan, index) => (
                        <Card
                            key={index}
                            className={`flex flex-col h-full ${
                                plan.popular
                                    ? "border-primary border-2 shadow-lg"
                                    : "border shadow"
                            } bg-white`}
                        >
                            {plan.popular && (
                                <div className="bg-primary text-primary-foreground text-center rounded-t-md py-1 text-sm font-medium">
                                    {t("pricing.mostPopular")}
                                </div>
                            )}
                            <CardHeader>
                                <CardTitle className="text-2xl font-bold">
                                    {t(`pricing.plans.${plan.planKey}.name`)}
                                </CardTitle>
                                <CardDescription className="text-gray-600">
                                    {t(
                                        `pricing.plans.${plan.planKey}.description`
                                    )}
                                </CardDescription>
                                <div className="mt-4">
                                    <span className="text-3xl font-bold">
                                        {t(
                                            `pricing.plans.${plan.planKey}.price`
                                        )}
                                    </span>
                                    <span className="text-gray-600 ml-1">
                                        {t(
                                            `pricing.plans.${plan.planKey}.period`
                                        )}
                                    </span>
                                </div>
                            </CardHeader>
                            <CardContent className="flex-grow">
                                <ul className="space-y-3">
                                    {plan.features.map(
                                        (feature, featureIndex) => (
                                            <li
                                                key={featureIndex}
                                                className="flex items-start"
                                            >
                                                {feature.included ? (
                                                    <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                                                ) : (
                                                    <X className="h-5 w-5 text-gray-300 mr-2 mt-0.5 flex-shrink-0" />
                                                )}
                                                <span className="text-gray-700">
                                                    {t(
                                                        `pricing.plans.${plan.planKey}.features.${feature.key}`
                                                    )}
                                                    {feature.hasTooltip && (
                                                        <TooltipProvider>
                                                            <Tooltip>
                                                                <TooltipTrigger
                                                                    asChild
                                                                >
                                                                    <HelpCircle className="h-4 w-4 inline-block ml-1 text-gray-400 cursor-help" />
                                                                </TooltipTrigger>
                                                                <TooltipContent>
                                                                    <p className="w-64">
                                                                        {t(
                                                                            `pricing.plans.${plan.planKey}.features.${feature.key}Tooltip`
                                                                        )}
                                                                    </p>
                                                                </TooltipContent>
                                                            </Tooltip>
                                                        </TooltipProvider>
                                                    )}
                                                </span>
                                            </li>
                                        )
                                    )}
                                </ul>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default PricingSection;
