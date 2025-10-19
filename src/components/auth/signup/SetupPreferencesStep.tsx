import React from "react";
import { Button } from "../../ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../../ui/select";
import { Users, ArrowRight } from "lucide-react";

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

interface SetupPreferencesStepProps {
    businessData: BusinessData;
    updateBusinessData: (field: keyof BusinessData, value: any) => void;
    onNext: () => void;
    t: (key: string, options?: Record<string, any>) => string;
}

const SetupPreferencesStep: React.FC<SetupPreferencesStepProps> = ({
    businessData,
    updateBusinessData,
    onNext,
    t,
}) => {
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

    const isFormValid = () => {
        return (
            businessData.teamSize !== "" && businessData.dailyMessages !== ""
        );
    };

    return (
        <div className="space-y-6">
            {/* Team Size */}
            <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                    {t("signup.step2.teamSize.label")}
                </label>
                <div className="relative">
                    <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Select
                        value={businessData.teamSize}
                        onValueChange={(value) =>
                            updateBusinessData("teamSize", value)
                        }
                    >
                        <SelectTrigger className="pl-10 h-12">
                            <SelectValue
                                placeholder={t(
                                    "signup.step2.teamSize.placeholder"
                                )}
                            />
                        </SelectTrigger>
                        <SelectContent>
                            {teamSizes.map((size) => (
                                <SelectItem key={size} value={size}>
                                    {size}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Usage Estimation */}
            <div className="space-y-3">
                <label className="text-sm font-medium text-gray-700">
                    {t("signup.step2.messageVolume.label")}
                </label>
                <Select
                    value={businessData.dailyMessages}
                    onValueChange={(value) =>
                        updateBusinessData("dailyMessages", value)
                    }
                >
                    <SelectTrigger className="h-12">
                        <SelectValue
                            placeholder={t(
                                "signup.step2.messageVolume.placeholder"
                            )}
                        />
                    </SelectTrigger>
                    <SelectContent>
                        {messageVolumes.map((volume) => (
                            <SelectItem key={volume} value={volume}>
                                {volume}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {/* Recommendation */}
            {businessData.dailyMessages && businessData.teamSize && (
                <div className="bg-gradient-to-r from-blue-500/10 to-green-500/10 border border-blue-500/20 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-2">
                        {t("signup.step2.recommendation.title")}
                    </h4>
                    <div className="flex items-center gap-2 mb-2">
                        <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                            {getRecommendedTier()}
                        </span>
                        <span className="text-sm text-gray-600">
                            {t("signup.step2.recommendation.perfectFor")}
                        </span>
                    </div>
                    <p className="text-sm text-gray-600">
                        {t("signup.step2.recommendation.description")}
                    </p>
                </div>
            )}

            <Button
                onClick={onNext}
                className="w-full h-12 bg-green-500 hover:bg-green-600 text-white font-medium disabled:bg-gray-400 disabled:cursor-not-allowed"
                disabled={!isFormValid()}
            >
                {t("signup.step2.continueButton")}
                <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
        </div>
    );
};

export default SetupPreferencesStep;
