import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "../components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Separator } from "../components/ui/separator";
import {
    CheckCircle,
    Download,
    Calendar,
    CreditCard,
    ArrowRight,
    Mail,
    Phone,
} from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";

const PaymentSuccessPage: React.FC = () => {
    const navigate = useNavigate();
    const { state } = useLocation();
    const { t } = useLanguage();

    useEffect(() => {
        if (!state?.orderData) {
            navigate("/dashboard/upgrade");
        }
    }, [state, navigate]);

    if (!state?.orderData) {
        return null;
    }

    const data = state.orderData;

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(amount);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("id-ID", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    const getNextBillingDate = () => {
        const now = new Date();
        if (data.billingCycle === "annual") {
            now.setFullYear(now.getFullYear() + 1);
        } else {
            now.setMonth(now.getMonth() + 1);
        }
        return now.toLocaleDateString("id-ID", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    const downloadReceipt = () => {
        const receiptContent = `
${t("paymentSuccess.receipt.header")}
========================

${t("paymentSuccess.receipt.orderId")}: ${data.orderId}
${t("paymentSuccess.receipt.date")}: ${formatDate(data.timestamp)}
${t("paymentSuccess.receipt.company")}: ${data.companyData.companyName}
${t("paymentSuccess.receipt.email")}: ${data.companyData.email}

${t("paymentSuccess.receipt.planDetails")}
------------
${t("paymentSuccess.receipt.plan")}: ${data.tierName}
${t("paymentSuccess.receipt.billing")}: ${
            data.billingCycle === "monthly"
                ? t("payment.billingCycle.monthly")
                : t("payment.billingCycle.annual")
        }
${t("paymentSuccess.receipt.amount")}: ${formatCurrency(data.amount)}

${t("paymentSuccess.receipt.paymentMethod")}: ${data.paymentMethod}

${t("paymentSuccess.receipt.nextBillingDate")}: ${getNextBillingDate()}

${t("paymentSuccess.receipt.thankYou")}
${t("paymentSuccess.receipt.support")}: dylansiusputra.business@gmail.com
    `;

        const blob = new Blob([receiptContent], { type: "text/plain" });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `SimplyBox-Receipt-${data.orderId}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    };

    const handleGoToDashboard = () => {
        navigate("/dashboard");
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
            {/* Header */}
            <header className="bg-white border-b border-gray-200 px-4 py-4">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <img
                            src="/LogoHorizontal.png"
                            alt="SimplyBox"
                            className="h-8 w-auto"
                        />
                    </div>
                    <a
                        href="mailto:dylansiusputra.business@gmail.com"
                        className="text-blue-500 hover:text-blue-600 font-medium"
                    >
                        {t("paymentSuccess.header.support")}
                    </a>
                </div>
            </header>

            <div className="max-w-4xl mx-auto px-4 py-12">
                {/* Success Animation */}
                <div className="text-center mb-8">
                    <div className="relative inline-block">
                        <div className="absolute inset-0 bg-green-100 rounded-full animate-ping opacity-75"></div>
                        <CheckCircle className="relative h-20 w-20 text-green-500 mx-auto" />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mt-6 mb-2">
                        {t("paymentSuccess.title", {
                            companyName: data.companyData.companyName,
                        })}
                    </h1>
                    <p className="text-xl text-gray-600">
                        {t("paymentSuccess.subtitle")}
                    </p>
                </div>

                {/* Order Summary Card */}
                <Card className="mb-8">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <CreditCard className="h-5 w-5" />
                            {t("paymentSuccess.summary.title")}
                        </CardTitle>
                        <CardDescription>
                            {t("paymentSuccess.summary.orderId", {
                                orderId: data.orderId,
                            })}{" "}
                            • {formatDate(data.timestamp)}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {/* Plan Details */}
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <div>
                                    <h3 className="font-semibold text-gray-900 mb-2">
                                        {t(
                                            "paymentSuccess.summary.planDetails"
                                        )}
                                    </h3>
                                    <div className="space-y-2">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">
                                                {t(
                                                    "paymentSuccess.summary.plan"
                                                )}
                                            </span>
                                            <span className="font-medium">
                                                {data.tierName}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">
                                                {t(
                                                    "paymentSuccess.summary.billingCycle"
                                                )}
                                            </span>
                                            <span className="font-medium capitalize">
                                                {data.billingCycle === "monthly"
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
                                                    "paymentSuccess.summary.paymentMethod"
                                                )}
                                            </span>
                                            <span className="font-medium">
                                                {data.paymentMethod}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">
                                                {t(
                                                    "paymentSuccess.summary.amountPaid"
                                                )}
                                            </span>
                                            <span className="font-bold text-green-500">
                                                {formatCurrency(data.amount)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <h3 className="font-semibold text-gray-900 mb-2">
                                        {t(
                                            "paymentSuccess.summary.contactInfo"
                                        )}
                                    </h3>
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2">
                                            <Mail className="h-4 w-4 text-gray-400" />
                                            <span className="text-gray-600">
                                                {data.companyData.email}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Phone className="h-4 w-4 text-gray-400" />
                                            <span className="text-gray-600">
                                                {data.companyData.phone}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <Separator />

                        {/* Next Billing */}
                        <div className="flex items-center justify-between bg-blue-50 rounded-lg p-4">
                            <div className="flex items-center gap-3">
                                <Calendar className="h-5 w-5 text-blue-500" />
                                <div>
                                    <p className="font-medium text-gray-900">
                                        {t(
                                            "paymentSuccess.summary.nextBillingDate"
                                        )}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        {getNextBillingDate()}
                                    </p>
                                </div>
                            </div>
                            <Badge
                                variant="secondary"
                                className="bg-blue-100 text-blue-800"
                            >
                                {data.billingCycle === "monthly"
                                    ? t("payment.billingCycle.monthly")
                                    : t("payment.billingCycle.annual")}
                            </Badge>
                        </div>
                    </CardContent>
                </Card>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button
                        className="bg-green-500 hover:bg-green-600 text-white px-8 py-3"
                        onClick={handleGoToDashboard}
                    >
                        {t("paymentSuccess.actions.goToDashboard")}
                        <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>

                    <Button
                        variant="outline"
                        className="px-8 py-3"
                        onClick={downloadReceipt}
                    >
                        <Download className="h-4 w-4 mr-2" />
                        {t("paymentSuccess.actions.downloadReceipt")}
                    </Button>
                </div>

                {/* Support Section */}
                <Card className="mt-8 bg-gray-50 border-gray-200">
                    <CardContent className="pt-6">
                        <div className="text-center">
                            <h3 className="font-semibold text-gray-900 mb-2">
                                {t("paymentSuccess.support.title")}
                            </h3>
                            <p className="text-gray-600 mb-4">
                                {t("paymentSuccess.support.description")}
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <a
                                    href="mailto:simplybox.business@gmail.com"
                                    className="inline-flex items-center justify-center px-4 py-2 text-blue-500 hover:text-blue-600 font-medium"
                                >
                                    <Mail className="h-4 w-4 mr-2" />
                                    {t("paymentSuccess.support.emailSupport")}
                                </a>
                                <a
                                    href="https://wa.me/6281510123155"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center justify-center px-4 py-2 text-green-500 hover:text-green-600 font-medium"
                                >
                                    <Phone className="h-4 w-4 mr-2" />
                                    {t(
                                        "paymentSuccess.support.whatsappSupport"
                                    )}
                                </a>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default PaymentSuccessPage;
