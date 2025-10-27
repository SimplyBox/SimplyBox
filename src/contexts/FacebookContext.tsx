// src/contexts/FacebookContext.tsx
import React, {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useState,
} from "react";
import supabase from "../libs/supabase";
import { useAuth } from "./AuthContext";

interface FacebookIntegration {
    id?: string;
    company_id: string;
    meta_page_id: string;
    page_name: string;
    meta_business_id: string;
    access_token: string;
    token_expires_at: string;
    updated_at: string;
}

interface FacebookContextType {
    integration: FacebookIntegration | null;
    loading: boolean;
    configureFacebook: (code: string) => Promise<{
        success: boolean;
        error?: string;
    }>;
    disconnectFacebook: () => Promise<{
        success: boolean;
        error?: string;
    }>;
}

const FacebookContext = createContext<FacebookContextType | undefined>(
    undefined
);

export const useFacebook = () => {
    const context = useContext(FacebookContext);
    if (context === undefined) {
        throw new Error("useFacebook must be used within a FacebookProvider");
    }
    return context;
};

export const FacebookProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const [integration, setIntegration] = useState<FacebookIntegration | null>(
        null
    );
    const [loading, setLoading] = useState(true);
    const { company } = useAuth();

    const fetchFacebookIntegration = async (companyId: string) => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from("facebook_integrations")
                .select("*")
                .eq("company_id", companyId)
                .maybeSingle();

            if (error) {
                console.error("Error fetching Facebook integration:", error);
                return;
            }

            setIntegration(data);
        } catch (error) {
            console.error("Error in fetchFacebookIntegration:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (company?.id) {
            fetchFacebookIntegration(company.id);
        }
    }, [company?.id]);

    const configureFacebook = useCallback(
        async (
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
                        body: JSON.stringify({ code, type: "facebook" }),
                    }
                );

                const result = await response.json();

                if (!result.success) {
                    return {
                        success: false,
                        error: result.error || "Failed to configure Facebook",
                    };
                }

                const { data, error } = await supabase
                    .from("facebook_integrations")
                    .upsert([
                        {
                            company_id: company.id,
                            meta_page_id: result.meta_page_id,
                            page_name: result.page_name, // Simpan page_name
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
                console.error("Facebook configuration error:", error);
                return {
                    success: false,
                    error: "Failed to configure Facebook",
                };
            } finally {
                setLoading(false);
            }
        },
        [company?.id]
    );

    const disconnectFacebook = async (): Promise<{
        success: boolean;
        error?: string;
    }> => {
        try {
            setLoading(true);
            if (!company?.id || !integration?.id) {
                return {
                    success: false,
                    error: "No Facebook integration found",
                };
            }

            const { error } = await supabase
                .from("facebook_integrations")
                .delete()
                .eq("id", integration.id);

            if (error) {
                return { success: false, error: error.message };
            }

            setIntegration(null);
            return { success: true };
        } catch (error) {
            console.error("Facebook disconnection error:", error);
            return { success: false, error: "Failed to disconnect Facebook" };
        } finally {
            setLoading(false);
        }
    };

    const value: FacebookContextType = {
        integration,
        loading,
        configureFacebook,
        disconnectFacebook,
    };

    return (
        <FacebookContext.Provider value={value}>
            {children}
        </FacebookContext.Provider>
    );
};
