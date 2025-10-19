import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "../components/ui/button";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Separator } from "../components/ui/separator";
import {
    Tabs,
    TabsList,
    TabsTrigger,
    TabsContent,
} from "../components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "../components/ui/radio-group";
import { Label } from "../components/ui/label";
import { Checkbox } from "../components/ui/checkbox";
import {
    ArrowLeft,
    Check,
    Copy,
    CreditCard,
    QrCode,
    Smartphone,
    Shield,
    Lock,
} from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";
import { useSubscription } from "../contexts/SubscriptionContext";
import { useAuth } from "../contexts/AuthContext";

interface PricingFeature {
    key: string;
    included: boolean;
}

interface TierData {
    name: string;
    monthlyPrice: number;
    annualPrice: number;
    discount: number;
    channels: number;
    popular?: boolean;
    features: PricingFeature[];
}

const BANKS = [
    { name: "BCA", account: "1234567890", holder: "PT SimplyBox Indonesia" },
    {
        name: "Mandiri",
        account: "9876543210",
        holder: "PT SimplyBox Indonesia",
    },
    { name: "BNI", account: "5555666677", holder: "PT SimplyBox Indonesia" },
    { name: "BRI", account: "1111222233", holder: "PT SimplyBox Indonesia" },
];

const EWALLETS = [
    { name: "GoPay", icon: "🟢", color: "bg-green-500" },
    { name: "OVO", icon: "🟣", color: "bg-purple-500" },
    { name: "DANA", icon: "🔵", color: "bg-blue-500" },
];

const PaymentPage: React.FC = () => {
    const navigate = useNavigate();
    const { state } = useLocation();
    const selectedTier = state?.selectedTier;
    const { t } = useLanguage();
    const { subscription, updateSubscription } = useSubscription();
    const { company } = useAuth();
    const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">(
        "monthly"
    );
    const [paymentMethod, setPaymentMethod] = useState("bank");
    const [selectedBank, setSelectedBank] = useState("");
    const [selectedEWallet, setSelectedEWallet] = useState("");
    const [isProcessing, setIsProcessing] = useState(false);
    const [autoRenew, setAutoRenew] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const tierFeatures: Record<string, PricingFeature[]> = {
        starter: [
            { key: "everythingFree", included: true },
            { key: "channels", included: true },
            { key: "messages", included: true },
            { key: "fileUploads", included: true },
            { key: "teamMembers", included: true },
            { key: "enhancedAI", included: true },
            { key: "advancedKanban", included: true },
            { key: "weeklyAnalytics", included: true },
            { key: "emailSupport", included: true },
        ],
        professional: [
            { key: "everythingStarter", included: true },
            { key: "channels", included: true },
            { key: "messages", included: true },
            { key: "fileUploads", included: true },
            { key: "teamMembers", included: true },
            { key: "advancedAI", included: true },
            { key: "advancedAnalytics", included: true },
            { key: "prioritySupport", included: true },
        ],
    };

    // Ambil data tier dari terjemahan
    const tierData: TierData = {
        name: t(`payment.plans.${selectedTier}.name`),
        monthlyPrice: Number(
            t(`payment.plans.${selectedTier}.monthlyPrice`).replace(
                /[^0-9]/g,
                ""
            )
        ),
        annualPrice: Number(
            t(`payment.plans.${selectedTier}.annualPrice`).replace(
                /[^0-9]/g,
                ""
            )
        ),
        discount: Number(t(`payment.plans.${selectedTier}.discount`)),
        channels: Number(t(`payment.plans.${selectedTier}.channels`)),
        popular: selectedTier === "starter",
        features: tierFeatures[selectedTier] || [],
    };

    const calculatePrice = () => {
        return billingCycle === "annual"
            ? tierData.annualPrice
            : tierData.monthlyPrice;
    };

    const calculateSavings = () => {
        const monthlyTotal = tierData.monthlyPrice * 12;
        const annualTotal = tierData.annualPrice;
        return monthlyTotal - annualTotal;
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(amount);
    };

    const getPaymentMethodDisplay = () => {
        if (paymentMethod === "bank" && selectedBank) {
            return `${t("payment.paymentMethods.bank")}: ${selectedBank}`;
        } else if (paymentMethod === "qris") {
            return t("payment.paymentMethods.qris");
        } else if (paymentMethod === "ewallet" && selectedEWallet) {
            return `${t("payment.paymentMethods.ewallet")}: ${selectedEWallet}`;
        }
        return t("payment.paymentDetail.notSelected");
    };

    const handlePayment = async () => {
        setIsProcessing(true);

        try {
            if (subscription && subscription.id) {
                let paymentMethodValue: string | null = null;
                if (paymentMethod === "bank" && selectedBank) {
                    paymentMethodValue = `${t(
                        "payment.paymentMethods.bank"
                    )}: ${selectedBank}`;
                } else if (paymentMethod === "qris") {
                    paymentMethodValue = t("payment.paymentMethods.qris");
                } else if (paymentMethod === "ewallet" && selectedEWallet) {
                    paymentMethodValue = `${t(
                        "payment.paymentMethods.ewallet"
                    )}: ${selectedEWallet}`;
                }

                await updateSubscription({
                    tier: selectedTier,
                    billing_cycle: billingCycle,
                    price_amount: calculatePrice(),
                    status: "active",
                    start_date: new Date().toISOString(),
                    end_date:
                        billingCycle === "monthly"
                            ? new Date(
                                  new Date().setMonth(new Date().getMonth() + 1)
                              ).toISOString()
                            : new Date(
                                  new Date().setFullYear(
                                      new Date().getFullYear() + 1
                                  )
                              ).toISOString(),
                    auto_renew: autoRenew,
                    payment_method: paymentMethodValue,
                });

                const orderData = {
                    tier: selectedTier,
                    tierName: tierData.name,
                    billingCycle,
                    amount: calculatePrice(),
                    paymentMethod: paymentMethodValue,
                    companyData: {
                        email: company?.business_email || "",
                        phone: company?.whatsapp_number || "",
                        companyName: company?.name || "",
                    },
                    orderId: `SB-${Date.now()}`,
                    timestamp: new Date().toISOString(),
                };

                navigate("/dashboard/payment-success", {
                    state: { orderData },
                });
                setIsProcessing(false);
            } else {
                throw new Error(t("payment.errors.noSubscription"));
            }
        } catch (error) {
            console.error("Payment processing error:", error);
            setErrors({
                general: t("payment.errors.paymentFailed"),
            });
            setIsProcessing(false);
        }
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
    };

    const handleBack = () => {
        navigate("/dashboard/upgrade");
    };

    useEffect(() => {
        if (!selectedTier) {
            navigate("/dashboard/upgrade");
        }
    }, [selectedTier, navigate]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
            {/* Header */}
            <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 px-4 py-4 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <img
                            src="/LogoHorizontal.png"
                            alt="SimplyBox"
                            className="h-8 w-auto cursor-pointer"
                            onClick={handleBack}
                        />
                    </div>
                    <a
                        href="mailto:dylansiusputra.business@gmail.com"
                        className="text-blue-500 hover:text-blue-600 font-medium"
                    >
                        {t("payment.header.helpLink")}
                    </a>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="mb-8">
                    <Button
                        variant="ghost"
                        onClick={handleBack}
                        className="text-gray-600 hover:text-gray-900 mb-4"
                    >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        {t("payment.backToPlans")}
                    </Button>
                    <div className="text-center mb-6">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">
                            {t("payment.title")}
                        </h1>
                        <p className="text-gray-600">{t("payment.subtitle")}</p>
                    </div>
                </div>

                <div className="grid lg:grid-cols-2 gap-8">
                    {/* Order Summary */}
                    <Card className="h-fit shadow-lg border-0 bg-white/90 backdrop-blur-sm">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-xl">
                                <div className="w-2 h-8 bg-gradient-to-b from-blue-500 to-green-500 rounded-full"></div>
                                {t("payment.orderSummary.title")}
                                {tierData.popular && (
                                    <Badge className="bg-gradient-to-r from-green-500 to-green-600 text-white border-0">
                                        ⭐ {t("payment.mostPopular")}
                                    </Badge>
                                )}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {/* Tier Info */}
                            <div>
                                <h3 className="text-2xl font-bold text-gray-900">
                                    {tierData.name}
                                    <span className="text-lg font-normal text-gray-600 ml-2">
                                        -{" "}
                                        {formatCurrency(
                                            billingCycle === "annual"
                                                ? tierData.annualPrice / 12
                                                : tierData.monthlyPrice
                                        )}
                                        {t(
                                            `payment.plans.${selectedTier}.period`
                                        )}
                                    </span>
                                </h3>
                            </div>

                            {/* Billing Cycle Toggle */}
                            <div className="space-y-3">
                                <Label className="text-sm font-medium">
                                    {t("payment.billingCycle.label")}
                                </Label>
                                <RadioGroup
                                    value={billingCycle}
                                    onValueChange={(
                                        value: "monthly" | "annual"
                                    ) => setBillingCycle(value)}
                                    className="space-y-2"
                                >
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem
                                            value="monthly"
                                            id="monthly"
                                        />
                                        <Label htmlFor="monthly">
                                            {t("payment.billingCycle.monthly")}
                                        </Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem
                                            value="annual"
                                            id="annual"
                                        />
                                        <Label
                                            htmlFor="annual"
                                            className="flex items-center gap-2"
                                        >
                                            {t("payment.billingCycle.annual")}
                                            <Badge
                                                variant="secondary"
                                                className="bg-green-100 text-green-800"
                                            >
                                                {t(
                                                    "payment.billingCycle.save",
                                                    {
                                                        discount:
                                                            tierData.discount,
                                                    }
                                                )}
                                            </Badge>
                                        </Label>
                                    </div>
                                </RadioGroup>
                                {billingCycle === "annual" && (
                                    <p className="text-sm text-green-600">
                                        {t("payment.billingCycle.savings", {
                                            amount: formatCurrency(
                                                calculateSavings()
                                            ),
                                        })}
                                    </p>
                                )}
                            </div>

                            {/* Features */}
                            <div className="space-y-3">
                                <Label className="text-sm font-medium">
                                    {t("payment.features.label")}
                                </Label>
                                <div className="space-y-2">
                                    {tierData.features.map((feature, index) => (
                                        <div
                                            key={index}
                                            className="flex items-start gap-2"
                                        >
                                            <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                                            <span className="text-sm text-gray-600">
                                                {t(
                                                    `payment.plans.${selectedTier}.features.${feature.key}`
                                                )}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <Separator />

                            {/* Total */}
                            <div className="space-y-2">
                                <div className="flex justify-between text-lg font-semibold">
                                    <span>{t("payment.totalDue")}</span>
                                    <span>
                                        {formatCurrency(calculatePrice())}
                                    </span>
                                </div>
                                {billingCycle === "annual" && (
                                    <p className="text-sm text-gray-500">
                                        {t("payment.effectivePrice", {
                                            amount: formatCurrency(
                                                calculatePrice() / 12
                                            ),
                                        })}
                                    </p>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Payment Methods and Details */}
                    <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-xl">
                                <div className="w-2 h-8 bg-gradient-to-b from-green-500 to-blue-500 rounded-full"></div>
                                {t("payment.paymentMethods.title")}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {/* Payment Method Section */}
                            <div className="space-y-4">
                                <Tabs
                                    value={paymentMethod}
                                    onValueChange={setPaymentMethod}
                                    className="w-full"
                                >
                                    <TabsList className="grid w-full grid-cols-3 bg-gray-100 p-1 rounded-lg">
                                        <TabsTrigger
                                            value="bank"
                                            className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm"
                                        >
                                            <CreditCard className="h-4 w-4" />
                                            <span className="hidden sm:inline">
                                                {t(
                                                    "payment.paymentMethods.bank"
                                                )}
                                            </span>
                                            <span className="sm:hidden">
                                                {t(
                                                    "payment.paymentMethods.bankShort"
                                                )}
                                            </span>
                                        </TabsTrigger>
                                        <TabsTrigger
                                            value="qris"
                                            className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm"
                                        >
                                            <QrCode className="h-4 w-4" />
                                            {t("payment.paymentMethods.qris")}
                                        </TabsTrigger>
                                        <TabsTrigger
                                            value="ewallet"
                                            className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm"
                                        >
                                            <Smartphone className="h-4 w-4" />
                                            <span className="hidden sm:inline">
                                                {t(
                                                    "payment.paymentMethods.ewallet"
                                                )}
                                            </span>
                                            <span className="sm:hidden">
                                                {t(
                                                    "payment.paymentMethods.ewalletShort"
                                                )}
                                            </span>
                                        </TabsTrigger>
                                    </TabsList>

                                    <TabsContent
                                        value="bank"
                                        className="space-y-4"
                                    >
                                        <div>
                                            <Label>
                                                {t(
                                                    "payment.paymentMethods.selectBank"
                                                )}
                                            </Label>
                                            <RadioGroup
                                                value={selectedBank}
                                                onValueChange={setSelectedBank}
                                            >
                                                {BANKS.map((bank) => (
                                                    <div
                                                        key={bank.name}
                                                        className="flex items-center space-x-2"
                                                    >
                                                        <RadioGroupItem
                                                            value={bank.name}
                                                            id={bank.name}
                                                        />
                                                        <Label
                                                            htmlFor={bank.name}
                                                        >
                                                            {bank.name}
                                                        </Label>
                                                    </div>
                                                ))}
                                            </RadioGroup>
                                            {errors.bank && (
                                                <p className="text-sm text-red-500 mt-1">
                                                    {errors.bank}
                                                </p>
                                            )}
                                        </div>

                                        {selectedBank && (
                                            <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 shadow-sm">
                                                <CardContent className="pt-4">
                                                    <div className="space-y-3">
                                                        <p className="font-semibold text-gray-900 flex items-center gap-2">
                                                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                                            {t(
                                                                "payment.paymentMethods.transferDetails"
                                                            )}
                                                        </p>
                                                        <div className="flex items-center justify-between">
                                                            <div>
                                                                <p className="text-sm text-gray-600">
                                                                    {t(
                                                                        "payment.paymentMethods.accountNumber"
                                                                    )}
                                                                </p>
                                                                <p className="font-mono font-medium">
                                                                    {
                                                                        BANKS.find(
                                                                            (
                                                                                b
                                                                            ) =>
                                                                                b.name ===
                                                                                selectedBank
                                                                        )
                                                                            ?.account
                                                                    }
                                                                </p>
                                                            </div>
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={() =>
                                                                    copyToClipboard(
                                                                        BANKS.find(
                                                                            (
                                                                                b
                                                                            ) =>
                                                                                b.name ===
                                                                                selectedBank
                                                                        )
                                                                            ?.account ||
                                                                            ""
                                                                    )
                                                                }
                                                            >
                                                                <Copy className="h-4 w-4" />
                                                            </Button>
                                                        </div>
                                                        <p className="text-sm">
                                                            <span className="text-gray-600">
                                                                {t(
                                                                    "payment.paymentMethods.accountHolder"
                                                                )}
                                                                :
                                                            </span>{" "}
                                                            {
                                                                BANKS.find(
                                                                    (b) =>
                                                                        b.name ===
                                                                        selectedBank
                                                                )?.holder
                                                            }
                                                        </p>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        )}
                                    </TabsContent>

                                    <TabsContent
                                        value="qris"
                                        className="space-y-4"
                                    >
                                        <div className="text-center space-y-4">
                                            <div className="bg-gradient-to-br from-white to-gray-50 border-2 border-dashed border-gray-300 rounded-xl p-8 hover:border-green-500 transition-colors">
                                                <div className="relative">
                                                    <QrCode className="h-32 w-32 mx-auto text-gray-400 mb-4" />
                                                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-green-500/10 rounded-lg"></div>
                                                </div>
                                                <p className="text-gray-700 font-medium">
                                                    {t(
                                                        "payment.paymentMethods.qrCodePlaceholder"
                                                    )}
                                                </p>
                                                <p className="text-sm text-gray-500">
                                                    {t(
                                                        "payment.paymentMethods.qrCodeDescription"
                                                    )}
                                                </p>
                                                <div className="flex justify-center gap-2 mt-3">
                                                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                                                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse delay-100"></div>
                                                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse delay-200"></div>
                                                </div>
                                            </div>
                                        </div>
                                    </TabsContent>

                                    <TabsContent
                                        value="ewallet"
                                        className="space-y-4"
                                    >
                                        <div>
                                            <Label>
                                                {t(
                                                    "payment.paymentMethods.selectEWallet"
                                                )}
                                            </Label>
                                            <RadioGroup
                                                value={selectedEWallet}
                                                onValueChange={
                                                    setSelectedEWallet
                                                }
                                            >
                                                {EWALLETS.map((wallet) => (
                                                    <div
                                                        key={wallet.name}
                                                        className="flex items-center space-x-2"
                                                    >
                                                        <RadioGroupItem
                                                            value={wallet.name}
                                                            id={wallet.name}
                                                        />
                                                        <Label
                                                            htmlFor={
                                                                wallet.name
                                                            }
                                                            className="flex items-center gap-2"
                                                        >
                                                            <span className="text-lg">
                                                                {wallet.icon}
                                                            </span>
                                                            {wallet.name}
                                                        </Label>
                                                    </div>
                                                ))}
                                            </RadioGroup>
                                            {errors.ewallet && (
                                                <p className="text-sm text-red-500 mt-1">
                                                    {errors.ewallet}
                                                </p>
                                            )}
                                        </div>
                                    </TabsContent>
                                </Tabs>
                            </div>

                            <Separator />

                            {/* Payment Detail Section */}
                            <div className="space-y-4">
                                <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                                    <div className="w-1.5 h-6 bg-blue-500 rounded-full"></div>
                                    {t("payment.paymentDetail.title")}
                                </h4>
                                <div className="space-y-3 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">
                                            {t(
                                                "payment.paymentDetail.selectedPlan"
                                            )}
                                        </span>
                                        <span className="font-medium">
                                            {tierData.name}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">
                                            {t(
                                                "payment.paymentDetail.billingCycle"
                                            )}
                                        </span>
                                        <span className="font-medium">
                                            {billingCycle === "monthly"
                                                ? t(
                                                      "payment.billingCycle.monthly"
                                                  )
                                                : t(
                                                      "payment.billingCycle.annual"
                                                  )}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">
                                            {t(
                                                "payment.paymentDetail.totalAmount"
                                            )}
                                        </span>
                                        <span className="font-medium">
                                            {formatCurrency(calculatePrice())}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">
                                            {t(
                                                "payment.paymentDetail.paymentMethod"
                                            )}
                                        </span>
                                        <span className="font-medium">
                                            {getPaymentMethodDisplay()}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">
                                            {t(
                                                "payment.paymentDetail.autoRenew"
                                            )}
                                        </span>
                                        <span className="font-medium">
                                            {autoRenew
                                                ? t("payment.paymentDetail.yes")
                                                : t("payment.paymentDetail.no")}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="auto-renew"
                                    checked={autoRenew}
                                    onCheckedChange={(checked) =>
                                        setAutoRenew(checked === true)
                                    }
                                />
                                <Label htmlFor="auto-renew" className="text-sm">
                                    {t("payment.autoRenew")}
                                </Label>
                            </div>

                            <div className="space-y-4">
                                <Button
                                    className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold py-3 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02]"
                                    onClick={handlePayment}
                                    disabled={isProcessing}
                                >
                                    {isProcessing ? (
                                        <>
                                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                            {t("payment.processing")}
                                        </>
                                    ) : (
                                        <>
                                            <Lock className="h-5 w-5 mr-2" />
                                            {t(
                                                "payment.completePurchase"
                                            )} •{" "}
                                            {formatCurrency(calculatePrice())}
                                        </>
                                    )}
                                </Button>
                            </div>

                            <p className="text-xs text-gray-500 text-center leading-relaxed">
                                🔒 {t("payment.termsAndPrivacy.text")}{" "}
                                <a
                                    href="#"
                                    className="text-blue-500 hover:underline font-medium"
                                >
                                    {t("payment.termsAndPrivacy.termsLink")}
                                </a>{" "}
                                {t("payment.termsAndPrivacy.and")}{" "}
                                <a
                                    href="#"
                                    className="text-blue-500 hover:underline font-medium"
                                >
                                    {t("payment.termsAndPrivacy.privacyLink")}
                                </a>
                            </p>

                            <div className="flex items-center justify-center gap-6 pt-4 border-t border-gray-100">
                                <div className="flex items-center gap-2 text-xs text-gray-600 bg-green-50 px-3 py-1 rounded-full">
                                    <Shield className="h-3 w-3 text-green-600" />
                                    <span className="font-medium">
                                        {t("payment.security.ssl")}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2 text-xs text-gray-600 bg-blue-50 px-3 py-1 rounded-full">
                                    <Lock className="h-3 w-3 text-blue-600" />
                                    <span className="font-medium">
                                        {t("payment.security.bankLevel")}
                                    </span>
                                </div>
                            </div>

                            {errors.general && (
                                <p className="text-sm text-red-500 text-center">
                                    {errors.general}
                                </p>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default PaymentPage;
