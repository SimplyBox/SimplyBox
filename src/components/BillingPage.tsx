import React, { useState } from "react";
import { Button } from "./ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "./ui/card";
import { Badge } from "./ui/badge";
import {
    ArrowLeft,
    CreditCard,
    Download,
    Calendar,
    CheckCircle,
    AlertCircle,
} from "lucide-react";

interface BillingPageProps {
    onBack: () => void;
    onUpgrade: () => void;
}

const BillingPage: React.FC<BillingPageProps> = ({ onBack, onUpgrade }) => {
    const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">(
        "monthly"
    );

    const currentPlan = {
        name: "Professional",
        price: billingCycle === "monthly" ? 699000 : 6990000,
        cycle: billingCycle,
        nextBilling: "2024-09-30",
        status: "active",
    };

    const paymentHistory = [
        {
            id: "1",
            date: "2024-08-30",
            amount: 699000,
            status: "paid",
            invoice: "INV-2024-001",
            description: "Professional Plan - Monthly",
        },
        {
            id: "2",
            date: "2024-07-30",
            amount: 699000,
            status: "paid",
            invoice: "INV-2024-002",
            description: "Professional Plan - Monthly",
        },
        {
            id: "3",
            date: "2024-06-30",
            amount: 699000,
            status: "paid",
            invoice: "INV-2024-003",
            description: "Professional Plan - Monthly",
        },
    ];

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(amount);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto px-4 py-8 max-w-6xl">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <Button
                            variant="ghost"
                            onClick={onBack}
                            className="text-gray-600 hover:text-gray-900"
                        >
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back to Dashboard
                        </Button>
                        <h1 className="text-2xl font-bold text-gray-900">
                            Billing & Subscription
                        </h1>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Current Plan */}
                    <div className="lg:col-span-2 space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center justify-between">
                                    <span>Current Plan</span>
                                    <Badge
                                        variant="secondary"
                                        className="bg-green-100 text-green-800"
                                    >
                                        {currentPlan.status === "active"
                                            ? "Active"
                                            : "Inactive"}
                                    </Badge>
                                </CardTitle>
                                <CardDescription>
                                    Manage your subscription and billing
                                    preferences
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900">
                                            {currentPlan.name} Plan
                                        </h3>
                                        <p className="text-sm text-gray-600">
                                            {formatCurrency(currentPlan.price)}{" "}
                                            /{" "}
                                            {currentPlan.cycle === "monthly"
                                                ? "month"
                                                : "year"}
                                        </p>
                                    </div>
                                    <Button
                                        onClick={onUpgrade}
                                        variant="outline"
                                    >
                                        Upgrade Plan
                                    </Button>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="flex items-center gap-3">
                                        <Calendar className="h-5 w-5 text-[#3A9BDC]" />
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">
                                                Next Billing Date
                                            </p>
                                            <p className="text-sm text-gray-600">
                                                {currentPlan.nextBilling}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <CreditCard className="h-5 w-5 text-[#3A9BDC]" />
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">
                                                Payment Method
                                            </p>
                                            <p className="text-sm text-gray-600">
                                                Bank Transfer
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Billing Cycle Toggle */}
                                <div className="border-t pt-4">
                                    <h4 className="text-sm font-medium text-gray-900 mb-3">
                                        Billing Cycle
                                    </h4>
                                    <div className="flex gap-2">
                                        <Button
                                            variant={
                                                billingCycle === "monthly"
                                                    ? "default"
                                                    : "outline"
                                            }
                                            size="sm"
                                            onClick={() =>
                                                setBillingCycle("monthly")
                                            }
                                            className={
                                                billingCycle === "monthly"
                                                    ? "bg-[#3A9BDC] hover:bg-[#2980B9]"
                                                    : ""
                                            }
                                        >
                                            Monthly
                                        </Button>
                                        <Button
                                            variant={
                                                billingCycle === "annual"
                                                    ? "default"
                                                    : "outline"
                                            }
                                            size="sm"
                                            onClick={() =>
                                                setBillingCycle("annual")
                                            }
                                            className={
                                                billingCycle === "annual"
                                                    ? "bg-[#3A9BDC] hover:bg-[#2980B9]"
                                                    : ""
                                            }
                                        >
                                            Annual (Save 20%)
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Payment History */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Payment History</CardTitle>
                                <CardDescription>
                                    View and download your payment receipts
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {paymentHistory.map((payment) => (
                                        <div
                                            key={payment.id}
                                            className="flex items-center justify-between p-4 border rounded-lg"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="flex items-center justify-center w-10 h-10 bg-green-100 rounded-full">
                                                    <CheckCircle className="h-5 w-5 text-green-600" />
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-900">
                                                        {payment.description}
                                                    </p>
                                                    <p className="text-sm text-gray-600">
                                                        {payment.date}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <div className="text-right">
                                                    <p className="font-medium text-gray-900">
                                                        {formatCurrency(
                                                            payment.amount
                                                        )}
                                                    </p>
                                                    <p className="text-sm text-gray-600">
                                                        {payment.invoice}
                                                    </p>
                                                </div>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                >
                                                    <Download className="h-4 w-4 mr-2" />
                                                    Receipt
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Quick Actions */}
                    <div className="lg:col-span-1">
                        <Card>
                            <CardHeader>
                                <CardTitle>Quick Actions</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <Button
                                    onClick={onUpgrade}
                                    className="w-full bg-[#2ECC71] hover:bg-[#27AE60] text-white"
                                >
                                    Upgrade Plan
                                </Button>
                                <Button variant="outline" className="w-full">
                                    Update Payment Method
                                </Button>
                                <Button variant="outline" className="w-full">
                                    Download All Receipts
                                </Button>
                                <Button variant="outline" className="w-full">
                                    Billing Support
                                </Button>
                            </CardContent>
                        </Card>

                        {/* Usage Summary */}
                        <Card className="mt-6">
                            <CardHeader>
                                <CardTitle>Current Usage</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span>Messages this month</span>
                                        <span>1,247 / 2,500</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div
                                            className="bg-[#3A9BDC] h-2 rounded-full"
                                            style={{ width: "50%" }}
                                        ></div>
                                    </div>
                                </div>
                                <div>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span>Team members</span>
                                        <span>3 / 8</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div
                                            className="bg-[#2ECC71] h-2 rounded-full"
                                            style={{ width: "37.5%" }}
                                        ></div>
                                    </div>
                                </div>
                                <div>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span>File uploads</span>
                                        <span>23 / 50</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div
                                            className="bg-[#3A9BDC] h-2 rounded-full"
                                            style={{ width: "46%" }}
                                        ></div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BillingPage;
