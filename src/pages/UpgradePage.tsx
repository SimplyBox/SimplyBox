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
import {
    Check,
    Star,
    Zap,
    Users,
    MessageSquare,
    Shield,
    HelpCircle,
    X,
    ArrowLeft,
} from "lucide-react";
import {
    Tooltip,
    TooltipProvider,
    TooltipTrigger,
    TooltipContent,
} from "@/components/ui/tooltip";
import { useLanguage } from "@/contexts/LanguageContext";
import { useNavigate } from "react-router-dom";
import { useSubscription } from "@/contexts/SubscriptionContext";

interface FAQItem {
    question: string;
    answer: string;
}

interface FeatureItem {
    text: string;
    tooltip?: string;
}

interface PricingPlan {
    name: string;
    popular?: boolean;
    disabled?: boolean;
}

const UpgradePage: React.FC = () => {
    const { t } = useLanguage();
    const navigate = useNavigate();
    const { subscription } = useSubscription();

    const activePlan = subscription?.tier;

    const plans: PricingPlan[] = [
        {
            name: "free",
            popular: false,
            disabled:
                activePlan === "free" ||
                activePlan === "starter" ||
                activePlan === "professional" ||
                activePlan === "enterprise",
        },
        {
            name: "starter",
            popular: true,
            disabled: activePlan === "starter",
        },
        {
            name: "professional",
            popular: false,
            disabled: activePlan === "professional",
        },
        {
            name: "enterprise",
            popular: false,
            disabled: activePlan === "enterprise",
        },
    ];

    const faqItems: FAQItem[] = [
        {
            question: t("upgrade.faq.items.1.question"),
            answer: t("upgrade.faq.items.1.answer"),
        },
        {
            question: t("upgrade.faq.items.2.question"),
            answer: t("upgrade.faq.items.2.answer"),
        },
        {
            question: t("upgrade.faq.items.3.question"),
            answer: t("upgrade.faq.items.3.answer"),
        },
        {
            question: t("upgrade.faq.items.4.question"),
            answer: t("upgrade.faq.items.4.answer"),
        },
    ];

    const handleSelectPlan = (plan: string) => {
        if (plan === "free") {
            return;
        }
        if (plan === "enterprise") {
            navigate("/contact-sales", {
                state: { from: "/dashboard/upgrade" },
            });
        } else if (plan === "starter" || plan === "professional") {
            navigate("/dashboard/payment", { state: { selectedTier: plan } });
        }
    };

    const getButtonText = (plan: string) => {
        if (plan === "free") {
            return activePlan === "free"
                ? t("plans.free.buttonText.current")
                : t("plans.free.buttonText.unavailable");
        }
        if (plan === activePlan) {
            return t(`plans.${plan}.buttonText.current`);
        }
        if (
            (activePlan === "professional" && plan === "starter") ||
            (activePlan === "enterprise" &&
                (plan === "starter" || plan === "professional"))
        ) {
            return t(`plans.${plan}.buttonText.downgrade`);
        }
        return t(`plans.${plan}.buttonText.upgrade`);
    };

    const handleBack = () => {
        navigate("/dashboard");
    };

    return (
        <div className="bg-white min-h-screen">
            {/* Back Button */}
            <div className="container mx-auto px-4 py-8">
                <Button
                    variant="ghost"
                    onClick={handleBack}
                    className="text-gray-600 hover:text-gray-900"
                >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    {t("upgrade.backToDashboard")}
                </Button>
            </div>

            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
                <div className="container mx-auto px-4 text-center relative">
                    <h1 className="text-4xl font-bold mb-4">
                        {t("upgrade.title")}
                    </h1>
                    <p className="text-xl text-blue-100 mb-8">
                        {t("upgrade.subtitle")}
                    </p>
                    <div className="flex justify-center items-center space-x-8 text-sm">
                        <div className="flex items-center">
                            <Shield className="h-5 w-5 mr-2" />
                            <span>{t("upgrade.benefits.moneyBack")}</span>
                        </div>
                        <div className="flex items-center">
                            <Zap className="h-5 w-5 mr-2" />
                            <span>
                                {t("upgrade.benefits.instantActivation")}
                            </span>
                        </div>
                        <div className="flex items-center">
                            <Users className="h-5 w-5 mr-2" />
                            <span>{t("upgrade.benefits.support")}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Pricing Cards */}
            <div className="container mx-auto px-4 py-16">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mx-auto">
                    {plans.map((plan) => {
                        const planData = t(`plans.${plan.name}`);
                        const features = planData.features as (
                            | string
                            | FeatureItem
                        )[];

                        return (
                            <Card
                                key={plan.name}
                                className={`relative flex flex-col ${
                                    plan.popular
                                        ? "border-2 border-blue-500 shadow-xl"
                                        : "border border-gray-200"
                                } ${plan.disabled ? "opacity-75" : ""}`}
                            >
                                {plan.popular && (
                                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                                        <Badge className="bg-blue-500 text-white px-4 py-1 text-sm font-semibold pointer-events-none">
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
                                    <div className="mb-4">
                                        <span className="text-4xl font-bold text-gray-900">
                                            {planData.price}
                                        </span>
                                        <span className="text-gray-600 ml-1">
                                            {planData.period}
                                        </span>
                                    </div>
                                </CardHeader>

                                <CardContent className="space-y-4 flex-1">
                                    <div>
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
                                    </div>
                                </CardContent>

                                <CardFooter className="mt-auto">
                                    <Button
                                        className={`w-full ${
                                            plan.popular
                                                ? "bg-blue-600 hover:bg-blue-700"
                                                : ""
                                        }`}
                                        variant={
                                            plan.popular ? "default" : "outline"
                                        }
                                        disabled={plan.disabled}
                                        onClick={() =>
                                            handleSelectPlan(
                                                plan.name.toLowerCase()
                                            )
                                        }
                                    >
                                        {getButtonText(plan.name.toLowerCase())}
                                    </Button>
                                </CardFooter>
                            </Card>
                        );
                    })}
                </div>

                {/* FAQ Section */}
                <div className="mt-20 max-w-4xl mx-auto">
                    <h2 className="text-3xl font-bold text-center mb-12">
                        {t("upgrade.faq.title")}
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {faqItems.map((item, index) => (
                            <div key={index}>
                                <h3 className="font-semibold text-lg mb-2">
                                    {item.question}
                                </h3>
                                <p className="text-gray-600">{item.answer}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Contact Section */}
                <div className="mt-16 text-center">
                    <h3 className="text-2xl font-bold mb-4">
                        {t("upgrade.faq.help.title")}
                    </h3>
                    <p className="text-gray-600 mb-6">
                        {t("upgrade.faq.help.description")}
                    </p>
                    <Button
                        variant="outline"
                        onClick={() =>
                            navigate("/contact-sales", {
                                state: { from: "/dashboard/upgrade" },
                            })
                        }
                    >
                        <MessageSquare className="h-4 w-4 mr-2" />
                        {t("upgrade.faq.help.cta")}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default UpgradePage;
