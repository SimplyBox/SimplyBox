import React, {
    createContext,
    useContext,
    useState,
    useEffect,
    ReactNode,
} from "react";

type Language = "en" | "id";

interface LanguageContextType {
    language: Language;
    setLanguage: (language: Language) => void;
    t: (
        key: string,
        params?: Record<string, string | number>,
        fallback?: string
    ) => any;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
    undefined
);

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error("useLanguage must be used within a LanguageProvider");
    }
    return context;
};

interface LanguageProviderProps {
    children: ReactNode;
}

import dateEn from "@/translations/en/date.json";
import dateId from "@/translations/id/date.json";
import plansEn from "@/translations/en/plans.json";
import plansId from "@/translations/id/plans.json";
import homeEn from "@/translations/en/home.json";
import homeId from "@/translations/id/home.json";
import authEn from "@/translations/en/auth.json";
import authId from "@/translations/id/auth.json";
import dashboardEn from "@/translations/en/dashboard.json";
import dashboardId from "@/translations/id/dashboard.json";
import contactSalesEn from "@/translations/en/contactSales.json";
import contactSalesId from "@/translations/id/contactSales.json";
import paymentEn from "@/translations/en/payment.json";
import paymentId from "@/translations/id/payment.json";
import privacyPolicyEn from "@/translations/en/privacyPolicy.json";
import privacyPolicyId from "@/translations/id/privacyPolicy.json";
import termsOfServiceEn from "@/translations/en/termsOfService.json";
import termsOfServiceId from "@/translations/id/termsOfService.json";

const translations = {
    en: {
        ...dateEn,
        ...plansEn,
        ...homeEn,
        ...authEn,
        ...dashboardEn,
        ...contactSalesEn,
        ...paymentEn,
        ...privacyPolicyEn,
        ...termsOfServiceEn,
    },
    id: {
        ...dateId,
        ...plansId,
        ...homeId,
        ...authId,
        ...dashboardId,
        ...contactSalesId,
        ...paymentId,
        ...privacyPolicyId,
        ...termsOfServiceId,
    },
};

export const LanguageProvider: React.FC<LanguageProviderProps> = ({
    children,
}) => {
    const [language, setLanguageState] = useState<Language>("en");

    useEffect(() => {
        const savedLanguage = localStorage.getItem(
            "simplybox_language"
        ) as Language;
        if (
            savedLanguage &&
            (savedLanguage === "en" || savedLanguage === "id")
        ) {
            setLanguageState(savedLanguage);
        }
    }, []);

    const setLanguage = (newLanguage: Language) => {
        setLanguageState(newLanguage);
        localStorage.setItem("simplybox_language", newLanguage);
    };

    const t = (
        key: string,
        params?: Record<string, string | number>,
        fallback?: string
    ): string => {
        const keys = key.split(".");
        let value: any = translations[language];

        for (const k of keys) {
            if (value && typeof value === "object" && k in value) {
                value = value[k];
            } else {
                return fallback || key;
            }
        }

        // Jika nilai adalah string dan ada params, lakukan penggantian
        if (typeof value === "string" && params) {
            return value.replace(/\{\{(\w+)\}\}/g, (match, paramKey) => {
                return params[paramKey]?.toString() || match;
            });
        }

        // Kembalikan nilai apa adanya (bisa string, array, atau lainnya)
        return value !== undefined ? value : fallback || key;
    };

    const value: LanguageContextType = {
        language,
        setLanguage,
        t,
    };

    return (
        <LanguageContext.Provider value={value}>
            {children}
        </LanguageContext.Provider>
    );
};
