import React, { useState } from "react";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";

interface BusinessData {
    businessName: string;
    businessType: string;
    businessNIB: string;
    businessPhone: string;
    businessEmail: string;
    teamSize: string;
    dailyMessages: string;
    ownerName: string;
    ownerPhone: string;
    ownerEmail: string;
    ownerPassword: string;
}

interface AccountSetupStepProps {
    businessData: BusinessData;
    updateBusinessData: (field: keyof BusinessData, value: any) => void;
    onComplete: () => void;
    isLoading: boolean;
    t: (key: string) => string;
}

const AccountSetupStep: React.FC<AccountSetupStepProps> = ({
    businessData,
    updateBusinessData,
    onComplete,
    isLoading,
    t,
}) => {
    const [showPassword, setShowPassword] = useState(false);

    const teamSizes = [
        "1 person (Solo)",
        "2-5 people",
        "6-15 people",
        "15+ people",
    ];

    const messageVolumes = [
        "Less than 20 messages",
        "20-50 messages",
        "50-100 messages",
        "100+ messages",
    ];

    const getRecommendedTier = () => {
        const teamSizeIndex = teamSizes.indexOf(businessData.teamSize);
        const messageVolumeIndex = messageVolumes.indexOf(
            businessData.dailyMessages
        );

        if (teamSizeIndex <= 1 && messageVolumeIndex <= 1)
            return t("signup.step2.recommendation.tiers.starter");
        if (teamSizeIndex <= 2 && messageVolumeIndex <= 2)
            return t("signup.step2.recommendation.tiers.professional");
        return t("signup.step2.recommendation.tiers.enterprise");
    };

    return (
        <div className="space-y-6">
            {/* Owner Account Setup */}
            <div className="bg-gradient-to-r from-green-500/10 to-blue-500/10 border border-green-500/20 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-2">
                    {t("signup.step3.ownerAccount.title")}
                </h4>
                <p className="text-sm text-gray-600">
                    {t("signup.step3.ownerAccount.description")}
                </p>
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                    {t("signup.step3.ownerName.label")}
                </label>
                <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                        type="text"
                        placeholder={t("signup.step3.ownerName.placeholder")}
                        value={businessData.ownerName}
                        onChange={(e) =>
                            updateBusinessData("ownerName", e.target.value)
                        }
                        className="pl-10 h-12"
                        required
                    />
                </div>
                <p className="text-xs text-gray-500">
                    {t("signup.step3.ownerName.helper")}
                </p>
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                    {t("signup.step3.ownerPhone.label")}
                </label>
                <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                        type="text"
                        placeholder={t("signup.step3.ownerPhone.placeholder")}
                        value={businessData.ownerPhone}
                        onChange={(e) =>
                            updateBusinessData("ownerPhone", e.target.value)
                        }
                        className="pl-10 h-12"
                        required
                    />
                </div>
                <p className="text-xs text-gray-500">
                    {t("signup.step3.ownerPhone.helper")}
                </p>
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                    {t("signup.step3.ownerEmail.label")}
                </label>
                <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                        type="email"
                        placeholder={t("signup.step3.ownerEmail.placeholder")}
                        value={businessData.ownerEmail}
                        onChange={(e) =>
                            updateBusinessData("ownerEmail", e.target.value)
                        }
                        className="pl-10 h-12"
                        required
                    />
                </div>
                <p className="text-xs text-gray-500">
                    {t("signup.step3.ownerEmail.helper")}
                </p>
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                    {t("signup.step3.ownerPassword.label")}
                </label>
                <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                        type={showPassword ? "text" : "password"}
                        placeholder={t(
                            "signup.step3.ownerPassword.placeholder"
                        )}
                        value={businessData.ownerPassword}
                        onChange={(e) =>
                            updateBusinessData("ownerPassword", e.target.value)
                        }
                        className="pl-10 pr-10 h-12"
                        required
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                        {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                        ) : (
                            <Eye className="h-4 w-4" />
                        )}
                    </button>
                </div>
                <p className="text-xs text-gray-500">
                    {t("signup.step3.ownerPassword.helper")}
                </p>
            </div>

            {/* Summary */}
            <div className="border rounded-lg p-4 bg-gray-50">
                <h4 className="font-semibold text-gray-900 mb-3">
                    {t("signup.step3.summary.title")}
                </h4>
                <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                        <span className="text-gray-600">
                            {t("signup.step3.summary.business")}
                        </span>
                        <span className="font-medium">
                            {businessData.businessName}
                        </span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-600">
                            {t("signup.step3.summary.type")}
                        </span>
                        <span className="font-medium">
                            {businessData.businessType}
                        </span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-600">
                            {t("signup.step3.summary.team")}
                        </span>
                        <span className="font-medium">
                            {businessData.teamSize}
                        </span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-600">
                            {t("signup.step3.summary.volume")}
                        </span>
                        <span className="font-medium">
                            {businessData.dailyMessages}
                        </span>
                    </div>
                    {businessData.dailyMessages && businessData.teamSize && (
                        <div className="flex justify-between pt-2 border-t">
                            <span className="text-gray-600">
                                {t("signup.step3.summary.recommended")}
                            </span>
                            <span className="font-medium text-blue-500">
                                {getRecommendedTier()}
                            </span>
                        </div>
                    )}
                </div>
            </div>

            {/* CTA Section */}
            <div className="bg-gradient-to-r from-green-500 to-blue-500 rounded-lg p-6 text-white text-center">
                <h4 className="font-bold text-lg mb-2">
                    {t("signup.step3.cta.title")}
                </h4>
                <p className="text-sm text-green-100 mb-4">
                    {t("signup.step3.cta.description")}
                </p>
            </div>

            <Button
                onClick={onComplete}
                className="w-full h-12 bg-blue-500 hover:bg-blue-600 text-white font-medium"
                disabled={isLoading}
            >
                {isLoading
                    ? t("signup.step3.completing")
                    : t("signup.step3.completeButton")}
            </Button>
        </div>
    );
};

export default AccountSetupStep;
