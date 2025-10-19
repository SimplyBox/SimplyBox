import React, { createContext, useContext, useEffect, useState } from "react";
import supabase from "../libs/supabase";
import { useAuth } from "./AuthContext";

interface WhatsAppIntegration {
    id?: string;
    company_id: string;
    waba_id: string;
    phone_number: string;
    phone_number_id: string;
    meta_business_id: string;
    access_token: string;
    token_expires_at: string;
    updated_at: string;
}

interface WhatsAppContextType {
    integration: WhatsAppIntegration | null;
    loading: boolean;
    configureWhatsApp: (code: string) => Promise<{
        success: boolean;
        error?: string;
    }>;
    disconnectWhatsApp: () => Promise<{
        success: boolean;
        error?: string;
    }>;
}

const WhatsAppContext = createContext<WhatsAppContextType | undefined>(
    undefined
);

export const useWhatsApp = () => {
    const context = useContext(WhatsAppContext);
    if (context === undefined) {
        throw new Error("useWhatsApp must be used within a WhatsAppProvider");
    }
    return context;
};

export const WhatsAppProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const [integration, setIntegration] = useState<WhatsAppIntegration | null>(
        null
    );
    const [loading, setLoading] = useState(true);
    const { company } = useAuth();

    const fetchWhatsAppIntegration = async (companyId: string) => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from("whatsapp_integrations")
                .select("*")
                .eq("company_id", companyId)
                .maybeSingle();

            if (error) {
                console.error("Error fetching WhatsApp integration:", error);
                return;
            }

            setIntegration(data);
        } catch (error) {
            console.error("Error in fetchWhatsAppIntegration:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (company?.id) {
            fetchWhatsAppIntegration(company.id);
        }
    }, [company?.id]);

    const configureWhatsApp = async (
        code: string
    ): Promise<{
        success: boolean;
        error?: string;
    }> => {
        try {
            setLoading(true);
            if (!company?.id) {
                return { success: false, error: "No company found" };
            }

            const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
            if (!supabaseAnonKey) {
                throw new Error(
                    "Missing VITE_SUPABASE_ANON_KEY environment variable"
                );
            }
            const response = await fetch(
                "https://xrtnyuslwkacznpvkuwr.supabase.co/functions/v1/meta-oauth-integration",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${supabaseAnonKey}`,
                        apikey: supabaseAnonKey,
                    },
                    body: JSON.stringify({ code }),
                }
            );

            const result = await response.json();

            if (!result.success) {
                return {
                    success: false,
                    error: result.error || "Failed to configure WhatsApp",
                };
            }

            const { data, error } = await supabase
                .from("whatsapp_integrations")
                .upsert([
                    {
                        company_id: company.id,
                        waba_id: result.waba_id,
                        phone_number: result.phone_number,
                        phone_number_id: result.phone_number_id,
                        meta_business_id: result.meta_business_id,
                        access_token: result.access_token,
                        token_expires_at:
                            result.token_expires_at ||
                            new Date(
                                Date.now() + 60 * 24 * 60 * 60 * 1000
                            ).toISOString(),
                        updated_at: new Date().toISOString(),
                    },
                ])
                .select()
                .single();

            if (error) {
                return { success: false, error: error.message };
            }

            setIntegration(data);
            return { success: true };
        } catch (error) {
            console.error("WhatsApp configuration error:", error);
            return { success: false, error: "Failed to configure WhatsApp" };
        } finally {
            setLoading(false);
        }
    };

    const disconnectWhatsApp = async (): Promise<{
        success: boolean;
        error?: string;
    }> => {
        try {
            setLoading(true);
            if (!company?.id || !integration?.id) {
                return {
                    success: false,
                    error: "No WhatsApp integration found",
                };
            }

            const { error } = await supabase
                .from("whatsapp_integrations")
                .delete()
                .eq("id", integration.id);

            if (error) {
                return { success: false, error: error.message };
            }

            setIntegration(null);
            return { success: true };
        } catch (error) {
            console.error("WhatsApp disconnection error:", error);
            return { success: false, error: "Failed to disconnect WhatsApp" };
        } finally {
            setLoading(false);
        }
    };

    const value: WhatsAppContextType = {
        integration,
        loading,
        configureWhatsApp,
        disconnectWhatsApp,
    };

    return (
        <WhatsAppContext.Provider value={value}>
            {children}
        </WhatsAppContext.Provider>
    );
};
