import React, {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useState,
} from "react";
import supabase from "../libs/supabase";
import { useAuth } from "./AuthContext";

interface InstagramIntegration {
    id?: string;
    company_id: string;
    meta_page_id: string;
    ig_user_id: string;
    ig_username: string;
    meta_business_id: string;
    access_token: string;
    token_expires_at: string;
    updated_at: string;
}

interface InstagramContextType {
    integration: InstagramIntegration | null;
    loading: boolean;
    configureInstagram: (code: string) => Promise<{
        success: boolean;
        error?: string;
    }>;
    disconnectInstagram: () => Promise<{
        success: boolean;
        error?: string;
    }>;
}

const InstagramContext = createContext<InstagramContextType | undefined>(
    undefined
);

export const useInstagram = () => {
    const context = useContext(InstagramContext);
    if (context === undefined) {
        throw new Error("useInstagram must be used within a InstagramProvider");
    }
    return context;
};

export const InstagramProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const [integration, setIntegration] = useState<InstagramIntegration | null>(
        null
    );
    const [loading, setLoading] = useState(true);
    const { company } = useAuth();

    const fetchInstagramIntegration = async (companyId: string) => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from("instagram_integrations")
                .select("*")
                .eq("company_id", companyId)
                .maybeSingle();

            if (error) {
                console.error("Error fetching Instagram integration:", error);
                return;
            }

            setIntegration(data);
        } catch (error) {
            console.error("Error in fetchInstagramIntegration:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (company?.id) {
            fetchInstagramIntegration(company.id);
        }
    }, [company?.id]);

    const configureInstagram = useCallback(
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
                        body: JSON.stringify({ code, type: "instagram" }),
                    }
                );

                const result = await response.json();

                if (!result.success) {
                    return {
                        success: false,
                        error: result.error || "Failed to configure Instagram",
                    };
                }

                const { data, error } = await supabase
                    .from("instagram_integrations")
                    .upsert([
                        {
                            company_id: company.id,
                            meta_page_id: result.meta_page_id,
                            ig_user_id: result.ig_user_id,
                            ig_username: result.ig_username,
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
                console.error("Instagram configuration error:", error);
                return {
                    success: false,
                    error: "Failed to configure Instagram",
                };
            } finally {
                setLoading(false);
            }
        },
        [company?.id]
    );

    const disconnectInstagram = async (): Promise<{
        success: boolean;
        error?: string;
    }> => {
        try {
            setLoading(true);
            if (!company?.id || !integration?.id) {
                return {
                    success: false,
                    error: "No Instagram integration found",
                };
            }

            const { error } = await supabase
                .from("instagram_integrations")
                .delete()
                .eq("id", integration.id);

            if (error) {
                return { success: false, error: error.message };
            }

            setIntegration(null);
            return { success: true };
        } catch (error) {
            console.error("Instagram disconnection error:", error);
            return { success: false, error: "Failed to disconnect Instagram" };
        } finally {
            setLoading(false);
        }
    };

    const value: InstagramContextType = {
        integration,
        loading,
        configureInstagram,
        disconnectInstagram,
    };

    return (
        <InstagramContext.Provider value={value}>
            {children}
        </InstagramContext.Provider>
    );
};
