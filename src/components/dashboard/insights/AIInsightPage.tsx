import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, TrendingUp, Target, Zap, ArrowUpRight } from "lucide-react";

const AIInsightPage = ({ userPlan = "free", onUpgrade }) => {
    if (userPlan === "professional" || userPlan === "enterprise") {
        return (
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-8">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Sparkles className="h-8 w-8 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">
                        AI-Powered Business Insights
                    </h2>
                    <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                        Advanced AI analysis of your business communications
                        with actionable recommendations.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="bg-white rounded-lg p-6 shadow-sm">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                            📊 Performance Insights
                        </h3>
                        <div className="space-y-3">
                            <div className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg">
                                <div className="w-2 h-2 bg-green-500 rounded-full mt-2" />
                                <div>
                                    <p className="text-sm font-medium text-green-900">
                                        Response Time Optimization
                                    </p>
                                    <p className="text-xs text-green-700">
                                        Your average response time improved by
                                        23% this month
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
                                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2" />
                                <div>
                                    <p className="text-sm font-medium text-blue-900">
                                        Peak Activity Detection
                                    </p>
                                    <p className="text-xs text-blue-700">
                                        Most customer inquiries occur between
                                        2-4 PM
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start space-x-3 p-3 bg-purple-50 rounded-lg">
                                <div className="w-2 h-2 bg-purple-500 rounded-full mt-2" />
                                <div>
                                    <p className="text-sm font-medium text-purple-900">
                                        Conversion Patterns
                                    </p>
                                    <p className="text-xs text-purple-700">
                                        WhatsApp leads show 34% higher
                                        conversion rates
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg p-6 shadow-sm">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                            🎯 AI Recommendations
                        </h3>
                        <div className="space-y-3">
                            <div className="p-3 border border-gray-200 rounded-lg">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm font-medium">
                                        Optimize Response Strategy
                                    </span>
                                    <Badge
                                        variant="outline"
                                        className="text-xs"
                                    >
                                        High Impact
                                    </Badge>
                                </div>
                                <p className="text-xs text-gray-600">
                                    Schedule follow-ups during peak hours for
                                    15% better engagement
                                </p>
                            </div>
                            <div className="p-3 border border-gray-200 rounded-lg">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm font-medium">
                                        Channel Prioritization
                                    </span>
                                    <Badge
                                        variant="outline"
                                        className="text-xs"
                                    >
                                        Medium Impact
                                    </Badge>
                                </div>
                                <p className="text-xs text-gray-600">
                                    Focus resources on WhatsApp for higher
                                    conversion rates
                                </p>
                            </div>
                            <div className="p-3 border border-gray-200 rounded-lg">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm font-medium">
                                        Customer Satisfaction
                                    </span>
                                    <Badge
                                        variant="outline"
                                        className="text-xs"
                                    >
                                        Low Impact
                                    </Badge>
                                </div>
                                <p className="text-xs text-gray-600">
                                    Maintain current service quality - ratings
                                    are excellent
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Upgrade prompt for lower tier plans
    return (
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-8">
            <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Sparkles className="h-8 w-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    AI-Powered Insights
                </h2>
                <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                    Get intelligent recommendations and predictive analytics to
                    optimize your business communications and boost customer
                    engagement.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white rounded-lg p-6 shadow-sm">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                            <TrendingUp className="h-6 w-6 text-blue-600" />
                        </div>
                        <h3 className="font-semibold text-gray-900 mb-2">
                            Predictive Analytics
                        </h3>
                        <p className="text-sm text-gray-600">
                            Forecast customer behavior and optimize response
                            strategies
                        </p>
                    </div>
                    <div className="bg-white rounded-lg p-6 shadow-sm">
                        <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                            <Target className="h-6 w-6 text-green-600" />
                        </div>
                        <h3 className="font-semibold text-gray-900 mb-2">
                            Smart Recommendations
                        </h3>
                        <p className="text-sm text-gray-600">
                            AI-driven suggestions to improve conversion rates
                        </p>
                    </div>
                    <div className="bg-white rounded-lg p-6 shadow-sm">
                        <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                            <Zap className="h-6 w-6 text-purple-600" />
                        </div>
                        <h3 className="font-semibold text-gray-900 mb-2">
                            Automated Insights
                        </h3>
                        <p className="text-sm text-gray-600">
                            Real-time analysis and actionable business
                            intelligence
                        </p>
                    </div>
                </div>
                <Button
                    className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                    onClick={onUpgrade}
                >
                    <ArrowUpRight className="h-4 w-4 mr-2" />
                    Upgrade for AI Insights
                </Button>
            </div>
        </div>
    );
};

export default AIInsightPage;
