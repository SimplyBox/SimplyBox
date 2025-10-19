import React from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "../ui/card";
import { Check, HelpCircle, Star } from "lucide-react";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "../ui/tooltip";
import { useLanguage } from "@/contexts/LanguageContext";
import { Badge } from "../ui/badge";

interface FeatureItem {
    text: string;
    tooltip?: string;
}

interface PricingPlan {
    planKey: string;
    popular?: boolean;
}

const PricingSection: React.FC = () => {
    const { t } = useLanguage();

    const plans: PricingPlan[] = [
        { planKey: "free" },
        { planKey: "starter", popular: true },
        { planKey: "professional" },
        { planKey: "enterprise" },
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
                    {plans.map((plan) => {
                        const planData = t(`plans.${plan.planKey}`);
                        const features = planData.features as (
                            | string
                            | FeatureItem
                        )[];

                        return (
                            <Card
                                key={plan.planKey}
                                className={`relative flex flex-col ${
                                    plan.popular
                                        ? "border-primary border-2 shadow-lg"
                                        : "border shadow"
                                } bg-white`}
                            >
                                {plan.popular && (
                                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                                        <Badge className="bg-primary text-white px-4 py-1 text-sm font-semibold pointer-events-none">
                                            <Star className="h-4 w-4 mr-1" />
                                            {t("plans.mostPopular")}
                                        </Badge>
                                    </div>
                                )}

                                <CardHeader className="text-center pb-4">
                                    <CardTitle className="text-2xl font-bold">
                                        {planData.name}
                                    </CardTitle>
                                    <CardDescription className="text-gray-600 mb-4">
                                        {planData.description}
                                    </CardDescription>
                                    <div className="mt-4">
                                        <span className="text-4xl font-bold text-gray-900">
                                            {planData.price}
                                        </span>
                                        {planData.period && (
                                            <span className="text-gray-600 ml-1">
                                                {planData.period}
                                            </span>
                                        )}
                                    </div>
                                </CardHeader>

                                <CardContent className="flex-1">
                                    <ul className="space-y-2">
                                        {features.map((feature, index) => {
                                            const item =
                                                typeof feature === "string"
                                                    ? { text: feature }
                                                    : feature;

                                            return (
                                                <li
                                                    key={index}
                                                    className="flex items-start"
                                                >
                                                    <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                                                    <span className="text-sm text-gray-700">
                                                        {item.text}
                                                        {item.tooltip && (
                                                            <TooltipProvider>
                                                                <Tooltip>
                                                                    <TooltipTrigger
                                                                        asChild
                                                                    >
                                                                        <HelpCircle className="h-4 w-4 inline-block ml-1 text-gray-400 cursor-help" />
                                                                    </TooltipTrigger>
                                                                    <TooltipContent>
                                                                        <p className="w-64">
                                                                            {
                                                                                item.tooltip
                                                                            }
                                                                        </p>
                                                                    </TooltipContent>
                                                                </Tooltip>
                                                            </TooltipProvider>
                                                        )}
                                                    </span>
                                                </li>
                                            );
                                        })}
                                    </ul>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default PricingSection;
