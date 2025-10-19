import React, { useEffect } from "react";
import { Button } from "../../ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../../ui/select";
import { Users, MessageSquare, ArrowRight, CheckCircle } from "lucide-react";

interface BusinessData {
    businessName: string;
    businessType: string;
    businessNIB: string;
    businessPhone: string;
    businessEmail: string;
    teamSize: string;
    dailyMessages: string;
    ownerEmail: string;
    ownerPassword: string;
    wa_data?: {
        waba_id: string;
        phone_number: string;
        phone_number_id: string;
        meta_business_id: string;
        access_token: string;
    };
}

interface SetupPreferencesStepProps {
    businessData: BusinessData;
    updateBusinessData: (field: keyof BusinessData, value: any) => void;
    onNext: () => void;
    t: (key: string, options?: Record<string, any>) => string;
}

// Perbaikan untuk OAuth handler di SetupPreferencesStep.tsx

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

    const handleMetaOAuth = () => {
        // Save current form data before OAuth redirect
        const currentFormData = {
            businessName: businessData.businessName,
            businessType: businessData.businessType,
            businessNIB: businessData.businessNIB,
            businessPhone: businessData.businessPhone,
            businessEmail: businessData.businessEmail,
            teamSize: businessData.teamSize,
            dailyMessages: businessData.dailyMessages,
            ownerEmail: businessData.ownerEmail,
            ownerPassword: businessData.ownerPassword,
        };

        localStorage.setItem(
            "signup_form_data",
            JSON.stringify(currentFormData)
        );
        localStorage.setItem("signup_current_step", "2");

        console.log("Saving form data before OAuth:", currentFormData);

        const appId = import.meta.env.VITE_META_APP_ID;
        const redirectUri = `${window.location.origin}/oauth/callback`;

        if (!appId || !redirectUri) {
            console.error("Missing Meta App ID or Redirect URI");
            return;
        }

        const authUrl = `https://www.facebook.com/v16.0/dialog/oauth?client_id=${encodeURIComponent(
            appId
        )}&redirect_uri=${encodeURIComponent(
            redirectUri
        )}&response_type=code&scope=business_management,whatsapp_business_management`;

        window.location.href = authUrl;
    };

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get("code");

        if (code) {
            console.log(
                "OAuth code found in SetupPreferencesStep, cleaning URL"
            );
            window.history.replaceState(
                {},
                document.title,
                window.location.pathname
            );
        }
    }, []);

    return (
        <div className="space-y-6">
            {/* WhatsApp Integration */}
            <div className="border rounded-lg p-4 bg-green-50">
                <div className="flex items-center gap-3 mb-3">
                    <MessageSquare className="h-5 w-5 text-green-600" />
                    <h3 className="font-semibold text-gray-900">
                        {t("signup.step2.whatsapp.title")}
                    </h3>
                </div>
                <p className="text-sm text-gray-600 mb-3">
                    {t("signup.step2.whatsapp.description", {
                        phone: businessData.businessPhone,
                    })}
                </p>

                {/* WhatsApp Connection Status */}
                {businessData.wa_data ? (
                    <div className="bg-green-100 border border-green-200 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                            <CheckCircle className="h-5 w-5 text-green-600" />
                            <span className="font-semibold text-green-800">
                                WhatsApp Business Connected
                            </span>
                        </div>
                        <p className="text-sm text-green-700">
                            Phone: {businessData.wa_data.phone_number}
                        </p>
                        <p className="text-sm text-green-700">
                            Business ID: {businessData.wa_data.waba_id}
                        </p>
                    </div>
                ) : (
                    <div className="bg-white border rounded-lg p-6 text-center">
                        <p className="text-sm text-gray-600 mb-4">
                            {t("signup.step2.whatsapp.oauthInstruction")}
                        </p>
                        <Button
                            variant="default"
                            size="lg"
                            className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2 mx-auto"
                            onClick={handleMetaOAuth}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 48 48"
                                className="h-5 w-5"
                            >
                                <path
                                    fill="#fff"
                                    d="M24 4C12.954 4 4 12.954 4 24c0 9.852 7.378 18.002 17 19.723V30h-5v-6h5v-4.5 c0-5.016 2.985-7.75 7.556-7.75 2.191 0 4.481.39 4.481.39v5h-2.524 c-2.49 0-3.263 1.548-3.263 3.134V24h5.557l-1 6h-4.557v13.723 C36.622 42.002 44 33.852 44 24c0-11.046-8.954-20-20-20z"
                                />
                            </svg>
                            {t("signup.step2.whatsapp.connectMeta")}
                        </Button>
                    </div>
                )}
            </div>

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
                className="w-full h-12 bg-green-500 hover:bg-green-600 text-white font-medium"
            >
                {t("signup.step2.continueButton")}
                <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
        </div>
    );
};

export default SetupPreferencesStep;
