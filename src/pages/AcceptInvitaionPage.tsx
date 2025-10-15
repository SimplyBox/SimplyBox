import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTeam } from "@/contexts/TeamContext";
import { useLanguage } from "@/contexts/LanguageContext";
import Loading from "@/components/Loading";

interface InvitationData {
    email: string;
    companyId: string;
    role: "admin" | "owner";
    type: string;
    expires: number;
    created: number;
}

const AcceptInvitationPage: React.FC = () => {
    const { t } = useLanguage();
    const navigate = useNavigate();
    const location = useLocation();
    const { verifyInvitationToken, acceptInvitation } = useTeam();
    const [loading, setLoading] = useState(true);
    const [invitationData, setInvitationData] = useState<InvitationData | null>(
        null
    );
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);

    const query = new URLSearchParams(location.search);
    const token = query.get("token");

    useEffect(() => {
        if (token) {
            handleVerifyToken(token);
        } else {
            setError(t("acceptInvitation.errorNoToken"));
            setLoading(false);
        }
    }, [token]);

    const handleVerifyToken = async (token: string) => {
        const result = await verifyInvitationToken(token);

        if (result.success && result.data) {
            setInvitationData(result.data);
            setLoading(false);
        } else {
            setError(result.error || t("acceptInvitation.errorInvalidToken"));
            navigate(
                `/error?message=${encodeURIComponent(
                    result.error || t("acceptInvitation.errorInvalidToken")
                )}`
            );
            setLoading(false);
        }
    };

    const handleAcceptInvitation = async () => {
        if (
            !invitationData ||
            !name ||
            !phone ||
            !password ||
            password.length < 6
        ) {
            setError(t("acceptInvitation.errorValidation"));
            return;
        }

        if (!token) {
            setError(t("acceptInvitation.errorNoToken"));
            return;
        }

        setLoading(true);
        setError(null);

        const result = await acceptInvitation({
            token,
            invitationData,
            userData: {
                name,
                phone,
                password,
            },
        });

        if (result.success) {
            if (result.needsVerification) {
                navigate("/verify-email", {
                    state: { email: invitationData.email },
                });
            } else {
                navigate("/dashboard");
            }
        } else {
            setError(result.error || t("acceptInvitation.errorFailed"));
            setLoading(false);
        }
    };

    if (loading) {
        return <Loading />;
    }

    if (error) {
        return (
            <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
                <h2 className="text-2xl font-bold mb-4 text-red-600">
                    {t("acceptInvitation.errorTitle")}
                </h2>
                <p className="mb-4">{error}</p>
                <button
                    onClick={() => navigate("/")}
                    className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600"
                >
                    {t("acceptInvitation.backToHome")}
                </button>
            </div>
        );
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
            <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
                <h2 className="text-2xl font-bold mb-4">
                    {t("acceptInvitation.title")}
                </h2>
                <p className="mb-4">
                    {t("acceptInvitation.description", {
                        role: invitationData?.role,
                    })}
                </p>
                <p className="mb-4">
                    {t("acceptInvitation.emailLabel")}:{" "}
                    <strong>{invitationData?.email}</strong>
                </p>

                <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">
                        {t("acceptInvitation.fullName.label")}
                    </label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder={t("acceptInvitation.fullName.placeholder")}
                        className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">
                        {t("acceptInvitation.phoneNumber.label")}
                    </label>
                    <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder={t(
                            "acceptInvitation.phoneNumber.placeholder"
                        )}
                        className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">
                        {t("acceptInvitation.password.label")}
                    </label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder={t("acceptInvitation.password.placeholder")}
                        className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        minLength={6}
                        required
                    />
                    <p className="text-sm text-gray-500 mt-1">
                        {t("acceptInvitation.password.helper")}
                    </p>
                </div>

                {error && <p className="text-red-500 mb-4">{error}</p>}

                <button
                    onClick={handleAcceptInvitation}
                    disabled={
                        !name || !phone || !password || password.length < 6
                    }
                    className="w-full bg-blue-500 text-white py-3 rounded-lg disabled:bg-gray-300 hover:bg-blue-600 disabled:cursor-not-allowed"
                >
                    {t("acceptInvitation.acceptButton")}
                </button>
            </div>
        </div>
    );
};

export default AcceptInvitationPage;
