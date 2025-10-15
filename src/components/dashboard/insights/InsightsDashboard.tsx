import React, { useState } from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    MessageSquare,
    Clock,
    Users,
    TrendingUp,
    Download,
    Calendar,
    BarChart3,
    PieChart,
    Lock,
    ArrowUpRight,
    Star,
} from "lucide-react";

interface InsightsDashboardProps {
    plan: "free" | "starter" | "professional" | "enterprise";
}

const InsightsDashboard: React.FC<InsightsDashboardProps> = ({ plan }) => {
    const [timeRange, setTimeRange] = useState<"week" | "month" | "quarter">(
        "week"
    );

    const exportToCSV = () => {
        const csvData = [
            ["Date", "Messages", "Response Time", "Engagement"],
            ["2024-01-01", "156", "23", "78%"],
            ["2024-01-02", "189", "21", "82%"],
            ["2024-01-03", "167", "25", "75%"],
        ];

        const csvContent = csvData.map((row) => row.join(",")).join("\n");
        const blob = new Blob([csvContent], { type: "text/csv" });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "insights-data.csv";
        a.click();
        window.URL.revokeObjectURL(url);
    };

    const LockedSection = ({
        title,
        description,
        planRequired,
    }: {
        title: string;
        description: string;
        planRequired: string;
    }) => (
        <Card className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gray-50/80 backdrop-blur-sm z-10 flex flex-col items-center justify-center">
                <Lock className="h-8 w-8 text-gray-400 mb-2" />
                <p className="text-sm text-gray-600 text-center mb-3">
                    Upgrade to see {description}
                </p>
                <Button size="sm" variant="outline" className="gap-2">
                    <ArrowUpRight className="h-4 w-4" />
                    Upgrade
                </Button>
            </div>
            <CardHeader>
                <CardTitle className="text-lg">{title}</CardTitle>
                <CardDescription>{description}</CardDescription>
            </CardHeader>
            <CardContent className="h-32"></CardContent>
        </Card>
    );

    return (
        <div className="space-y-8 p-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold">Insights Dashboard</h1>
                    <p className="text-muted-foreground">
                        Track your business communication metrics
                    </p>
                </div>

                <div className="flex items-center space-x-2">
                    <Select
                        value={timeRange}
                        onValueChange={(value) =>
                            setTimeRange(value as "week" | "month" | "quarter")
                        }
                    >
                        <SelectTrigger className="w-[140px]">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="week">Last 7 Days</SelectItem>
                            <SelectItem value="month">This Month</SelectItem>
                            <SelectItem value="quarter">
                                This Quarter
                            </SelectItem>
                        </SelectContent>
                    </Select>

                    <Button
                        variant="outline"
                        onClick={exportToCSV}
                        className="gap-2"
                    >
                        <Download className="h-4 w-4" />
                        Export CSV
                    </Button>
                </div>
            </div>

            {/* Analytics Section - Available for ALL tiers */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Message Volume */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Message Volume
                        </CardTitle>
                        <MessageSquare className="h-4 w-4 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">87</div>
                        <div className="flex items-center space-x-2 mt-4">
                            <div className="flex space-x-1">
                                {[
                                    "Mon",
                                    "Tue",
                                    "Wed",
                                    "Thu",
                                    "Fri",
                                    "Sat",
                                    "Sun",
                                ].map((day, i) => (
                                    <div
                                        key={day}
                                        className="flex flex-col items-center"
                                    >
                                        <div className="flex items-end h-24">
                                            {" "}
                                            {/* tinggi area chart */}
                                            <div
                                                className="w-6 bg-blue-500 rounded-t"
                                                style={{
                                                    height: `${
                                                        [
                                                            40, 60, 45, 80, 90,
                                                            35, 25,
                                                        ][i]
                                                    }px`,
                                                }}
                                            ></div>
                                        </div>
                                        <span className="text-xs text-gray-500 mt-1">
                                            {day}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <p className="text-xs text-green-600 mt-2">
                            ↗ 12% from previous week
                        </p>
                    </CardContent>
                </Card>

                {/* Avg Response Time */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Avg. Response Time
                        </CardTitle>
                        <Clock className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">45 min</div>
                        <div className="flex items-center space-x-2 mt-4">
                            <div className="flex space-x-1">
                                {[
                                    "9am",
                                    "10am",
                                    "11am",
                                    "12pm",
                                    "1pm",
                                    "2pm",
                                    "3pm",
                                ].map((time, i) => (
                                    <div
                                        key={time}
                                        className="flex flex-col items-center"
                                    >
                                        <div className="flex items-end h-28">
                                            <div
                                                className="w-6 bg-green-500 rounded-t"
                                                style={{
                                                    height: `${
                                                        [
                                                            50, 70, 60, 85, 95,
                                                            75, 65,
                                                        ][i]
                                                    }px`,
                                                }}
                                            ></div>
                                        </div>
                                        <span className="text-xs text-gray-500 mt-1">
                                            {time}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <p className="text-xs text-green-600 mt-2">
                            ↗ 8% faster than previous week
                        </p>
                    </CardContent>
                </Card>

                {/* Channel Distribution */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">
                            Channel Distribution
                        </CardTitle>
                        <CardDescription>
                            Message volume by channel
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center justify-center h-32">
                            <div className="relative w-24 h-24">
                                <svg viewBox="0 0 42 42" className="w-24 h-24">
                                    <circle
                                        cx="21"
                                        cy="21"
                                        r="15.915"
                                        fill="transparent"
                                        stroke="#e5e7eb"
                                        strokeWidth="3"
                                    />
                                    <circle
                                        cx="21"
                                        cy="21"
                                        r="15.915"
                                        fill="transparent"
                                        stroke="#22c55e"
                                        strokeWidth="3"
                                        strokeDasharray="60 40"
                                        strokeDashoffset="25"
                                        className="transition-all duration-500"
                                    />
                                    <circle
                                        cx="21"
                                        cy="21"
                                        r="15.915"
                                        fill="transparent"
                                        stroke="#3b82f6"
                                        strokeWidth="3"
                                        strokeDasharray="40 60"
                                        strokeDashoffset="85"
                                        className="transition-all duration-500"
                                    />
                                </svg>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <span className="text-sm font-semibold">
                                        87
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="space-y-2 mt-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                    <span className="text-sm">WhatsApp</span>
                                </div>
                                <span className="text-sm font-medium">60%</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                                    <span className="text-sm">Email</span>
                                </div>
                                <span className="text-sm font-medium">40%</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Enhanced Insights Section */}
            <div>
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold">Enhanced Insights</h2>
                    <Badge
                        variant="outline"
                        className="text-blue-600 border-blue-200"
                    >
                        Starter Plan
                    </Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Peak Hours */}
                    {plan === "starter" ||
                    plan === "professional" ||
                    plan === "enterprise" ? (
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">
                                    Peak Hours
                                </CardTitle>
                                <CardDescription>
                                    When your customers are most active
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm">
                                            9:00 AM - 11:00 AM
                                        </span>
                                        <Badge className="bg-green-100 text-green-800">
                                            Peak
                                        </Badge>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm">
                                            1:00 PM - 3:00 PM
                                        </span>
                                        <Badge className="bg-yellow-100 text-yellow-800">
                                            High
                                        </Badge>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm">
                                            7:00 PM - 9:00 PM
                                        </span>
                                        <Badge className="bg-blue-100 text-blue-800">
                                            Medium
                                        </Badge>
                                    </div>
                                </div>
                                <div className="mt-4 text-center">
                                    <p className="text-sm text-gray-600">
                                        Best time to engage:{" "}
                                        <strong>10:00 AM</strong>
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    ) : (
                        <LockedSection
                            title="Peak Hours"
                            description="when your customers are most active"
                            planRequired="Starter"
                        />
                    )}

                    {/* Customer Engagement */}
                    {plan === "starter" ||
                    plan === "professional" ||
                    plan === "enterprise" ? (
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    Customer Engagement
                                </CardTitle>
                                <Users className="h-4 w-4 text-yellow-500" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">68%</div>
                                <div className="space-y-2 mt-4">
                                    <div className="flex justify-between text-sm">
                                        <span>Reply Rate</span>
                                        <span>72%</span>
                                    </div>
                                    <Progress value={72} className="h-2" />

                                    <div className="flex justify-between text-sm">
                                        <span>Read Rate</span>
                                        <span>89%</span>
                                    </div>
                                    <Progress value={89} className="h-2" />

                                    <div className="flex justify-between text-sm">
                                        <span>Click Rate</span>
                                        <span>43%</span>
                                    </div>
                                    <Progress value={43} className="h-2" />
                                </div>
                                <p className="text-xs text-green-600 mt-2">
                                    ↗ 5% from previous week
                                </p>
                            </CardContent>
                        </Card>
                    ) : (
                        <LockedSection
                            title="Customer Engagement"
                            description="Upgrade to see customer engagement"
                            planRequired="Starter"
                        />
                    )}
                </div>
            </div>

            {/* Advanced Insights Section */}
            <div>
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold">Advanced Insights</h2>
                    <Badge
                        variant="outline"
                        className="text-purple-600 border-purple-200"
                    >
                        Professional Plan
                    </Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Customer Satisfaction */}
                    {plan === "professional" || plan === "enterprise" ? (
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">
                                    Customer Satisfaction
                                </CardTitle>
                                <CardDescription>
                                    Rating distribution
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    {[5, 4, 3, 2, 1].map((stars) => (
                                        <div
                                            key={stars}
                                            className="flex items-center gap-3"
                                        >
                                            <div className="flex items-center gap-1 w-12">
                                                <span className="text-sm">
                                                    {stars}
                                                </span>
                                                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                            </div>
                                            <Progress
                                                value={
                                                    stars === 5
                                                        ? 65
                                                        : stars === 4
                                                        ? 25
                                                        : stars === 3
                                                        ? 8
                                                        : stars === 2
                                                        ? 2
                                                        : 0
                                                }
                                                className="flex-1 h-2"
                                            />
                                            <span className="text-sm text-gray-600 w-8">
                                                {stars === 5
                                                    ? "65"
                                                    : stars === 4
                                                    ? "25"
                                                    : stars === 3
                                                    ? "8"
                                                    : stars === 2
                                                    ? "2"
                                                    : "0"}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-4 text-center">
                                    <div className="text-2xl font-bold">
                                        4.5
                                    </div>
                                    <p className="text-sm text-gray-600">
                                        Average rating
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    ) : (
                        <LockedSection
                            title="Customer Satisfaction"
                            description="customer satisfaction ratings"
                            planRequired="Starter"
                        />
                    )}
                    {/* Sentiment Trend Analysis */}
                    {plan === "professional" || plan === "enterprise" ? (
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">
                                    Sentiment Trend Analysis
                                </CardTitle>
                                <CardDescription>
                                    Customer satisfaction over time
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm">
                                            Positive Sentiment
                                        </span>
                                        <div className="flex items-center gap-2">
                                            <Progress
                                                value={78}
                                                className="w-20 h-2"
                                            />
                                            <span className="text-sm font-medium">
                                                78%
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm">
                                            Neutral Sentiment
                                        </span>
                                        <div className="flex items-center gap-2">
                                            <Progress
                                                value={18}
                                                className="w-20 h-2"
                                            />
                                            <span className="text-sm font-medium">
                                                18%
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm">
                                            Negative Sentiment
                                        </span>
                                        <div className="flex items-center gap-2">
                                            <Progress
                                                value={4}
                                                className="w-20 h-2"
                                            />
                                            <span className="text-sm font-medium">
                                                4%
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-4">
                                    <div className="flex items-center space-x-2">
                                        {[
                                            "Week 1",
                                            "Week 2",
                                            "Week 3",
                                            "Week 4",
                                        ].map((week, i) => (
                                            <div
                                                key={week}
                                                className="flex flex-col items-center flex-1"
                                            >
                                                <div
                                                    className="w-full bg-green-500 rounded"
                                                    style={{
                                                        height: `${
                                                            [60, 70, 75, 78][i]
                                                        }px`,
                                                    }}
                                                ></div>
                                                <span className="text-xs text-gray-500 mt-1">
                                                    {week}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="mt-4 p-3 bg-green-50 rounded-lg">
                                    <p className="text-sm text-center text-green-700">
                                        <TrendingUp className="h-4 w-4 inline mr-1" />
                                        Sentiment improving by{" "}
                                        <strong>12%</strong> this month
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    ) : (
                        <LockedSection
                            title="Sentiment Trend Analysis"
                            description="customer sentiment trends"
                            planRequired="Professional"
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default InsightsDashboard;
