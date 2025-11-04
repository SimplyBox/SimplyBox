import React, { createContext, useContext, useEffect, useState } from "react";
import { User, Session } from "@supabase/supabase-js";
import supabase from "../libs/supabase";
import { useNavigate, useLocation } from "react-router-dom";
import Loading from "@/components/Loading";

interface Company {
    id: string;
    name: string;
    type: string;
    registration_number: string;
    business_email: string;
    whatsapp_number: string;
    created_at: string;
}

interface AuthUser extends User {
    name?: string;
    phone?: string;
    email?: string;
}

interface SignUpData {
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

interface TeamMemberSignUpData {
    name: string;
    email: string;
    phone: string;
    password: string;
}

interface AuthContextType {
    user: AuthUser | null;
    session: Session | null;
    company: Company | null;
    loading: boolean;
    signUp: (businessData: SignUpData) => Promise<{
        success: boolean;
        needsVerification?: boolean;
        error?: string;
    }>;
    signUpTeamMember: (data: TeamMemberSignUpData) => Promise<{
        success: boolean;
        needsVerification?: boolean;
        error?: string;
    }>;
    signIn: (
        email: string,
        password: string
    ) => Promise<{ success: boolean; error?: string }>;
    signInWithOAuth: (
        redirectTo?: string
    ) => Promise<{ success: boolean; error?: string; existing?: boolean }>;
    signOut: () => Promise<void>;
    resendVerification: (
        email: string
    ) => Promise<{ success: boolean; error?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};

const getLimitsForTier = (tier: string) => {
    switch (tier) {
        case "free":
            return {
                messages_limit: 100,
                team_members_limit: 0,
                files_limit: 2,
            };
        case "starter":
            return {
                messages_limit: 600,
                team_members_limit: 3,
                files_limit: 10,
            };
        case "professional":
            return {
                messages_limit: 2500,
                team_members_limit: 8,
                files_limit: 50,
            };
        case "enterprise":
            return {
                messages_limit: 10000,
                team_members_limit: 50,
                files_limit: 500,
            };
        default:
            throw new Error("Invalid tier");
    }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [session, setSession] = useState<Session | null>(null);
    const [company, setCompany] = useState<Company | null>(null);
    const [loading, setLoading] = useState(true);
    const [isAuthChecked, setIsAuthChecked] = useState(false);
    const hasInitialized = React.useRef(false);
    const navigate = useNavigate();
    const location = useLocation();

    const fetchUserData = async (authUserId: string) => {
        try {
            const { data: profileData, error: profileError } = await supabase
                .from("users")
                .select("id, name, phone, email")
                .eq("auth_user_id", authUserId)
                .maybeSingle();

            if (profileError) {
                console.error("Error fetching profile:", profileError);
                return;
            }

            if (!profileData) {
                console.log("⚠️ No profile found for auth user:", authUserId);
                return;
            }

            setUser(
                (prevUser) =>
                    ({
                        ...prevUser,
                        name: profileData.name,
                        phone: profileData.phone,
                        email: profileData.email,
                    } as AuthUser)
            );

            const { data: teamData, error: teamError } = await supabase
                .from("team")
                .select("company_id")
                .eq("user_id", profileData.id)
                .maybeSingle();

            if (teamError) {
                console.error("Error fetching team data:", teamError);
                return;
            }

            if (!teamData) {
                console.log("⚠️ No team found for profile ID:", profileData.id);
                setCompany(null);
                return;
            }

            const { data: companyData, error: companyError } = await supabase
                .from("companies")
                .select("*")
                .eq("id", teamData.company_id)
                .maybeSingle();

            if (companyError) {
                console.error("Error fetching company data:", companyError);
                return;
            }

            setCompany(companyData);
        } catch (error) {
            console.error("Error in fetchUserData:", error);
        }
    };

    const signUp = async (
        businessData: SignUpData
    ): Promise<{
        success: boolean;
        needsVerification?: boolean;
        error?: string;
    }> => {
        try {
            setLoading(true);

            const { data: authData, error: authError } =
                await supabase.auth.signUp({
                    email: businessData.ownerEmail,
                    password: businessData.ownerPassword,
                    options: {
                        data: {
                            name: businessData.ownerName,
                            phone: businessData.ownerPhone,
                        },
                        emailRedirectTo: window.location.origin + "/dashboard",
                    },
                });

            if (authError) {
                return { success: false, error: authError.message };
            }

            if (!authData.user) {
                return {
                    success: false,
                    error: "Failed to create user account",
                };
            }

            if (!authData.session) {
                const { data: profileData, error: profileError } =
                    await supabase
                        .from("users")
                        .insert([
                            {
                                auth_user_id: authData.user.id,
                                name: businessData.ownerName,
                                phone: businessData.ownerPhone,
                                email: businessData.ownerEmail,
                            },
                        ])
                        .select()
                        .single();

                if (profileError) {
                    await supabase.auth.admin.deleteUser(authData.user.id);
                    return { success: false, error: profileError.message };
                }

                const { data: companyData, error: companyError } =
                    await supabase
                        .from("companies")
                        .insert([
                            {
                                name: businessData.businessName,
                                type: businessData.businessType,
                                registration_number: businessData.businessNIB,
                                business_email: businessData.businessEmail,
                                whatsapp_number: businessData.businessPhone,
                            },
                        ])
                        .select()
                        .single();

                if (companyError) {
                    await supabase.auth.admin.deleteUser(authData.user.id);
                    return { success: false, error: companyError.message };
                }

                const startDate = new Date();
                const endDate = new Date(startDate);
                endDate.setMonth(endDate.getMonth() + 1);

                const { data: subscriptionData, error: subscriptionError } =
                    await supabase
                        .from("subscriptions")
                        .insert([
                            {
                                company_id: companyData.id,
                                tier: "free",
                                status: "active",
                                start_date: startDate.toISOString(),
                                end_date: endDate.toISOString(),
                                billing_cycle: null,
                                price_amount: 0,
                                payment_method: null,
                                auto_renew: false,
                                created_at: new Date().toISOString(),
                            },
                        ])
                        .select()
                        .single();

                if (subscriptionError) {
                    await supabase
                        .from("companies")
                        .delete()
                        .eq("id", companyData.id);
                    await supabase.auth.admin.deleteUser(authData.user.id);
                    return { success: false, error: subscriptionError.message };
                }

                const limits = getLimitsForTier("free");
                const { error: usageError } = await supabase
                    .from("subscription_usage")
                    .insert([
                        {
                            subscription_id: subscriptionData.id,
                            messages_used: 0,
                            team_members_used: 0,
                            files_used: 0,
                            ...limits,
                        },
                    ]);

                if (usageError) {
                    await supabase
                        .from("subscriptions")
                        .delete()
                        .eq("id", subscriptionData.id);
                    await supabase
                        .from("companies")
                        .delete()
                        .eq("id", companyData.id);
                    await supabase.auth.admin.deleteUser(authData.user.id);
                    return { success: false, error: usageError.message };
                }

                const { error: teamError } = await supabase
                    .from("team")
                    .insert([
                        {
                            user_id: profileData.id,
                            company_id: companyData.id,
                            role: "owner",
                        },
                    ]);

                if (teamError) {
                    await supabase
                        .from("companies")
                        .delete()
                        .eq("id", companyData.id);
                    await supabase.auth.admin.deleteUser(authData.user.id);
                    return { success: false, error: teamError.message };
                }

                return { success: true, needsVerification: true };
            } else {
                setSession(authData.session);
                setUser(authData.user as AuthUser);
                await fetchUserData(authData.user.id);
                return { success: true };
            }
        } catch (error) {
            console.error("Signup error:", error);
            return {
                success: false,
                error: "An unexpected error occurred during signup",
            };
        } finally {
            setLoading(false);
        }
    };

    const signUpTeamMember = async (
        data: TeamMemberSignUpData
    ): Promise<{
        success: boolean;
        needsVerification?: boolean;
        error?: string;
    }> => {
        try {
            setLoading(true);

            const { data: authData, error: authError } =
                await supabase.auth.signUp({
                    email: data.email,
                    password: data.password,
                    options: {
                        data: {
                            name: data.name,
                            phone: data.phone,
                        },
                        emailRedirectTo: window.location.origin + "/dashboard",
                    },
                });

            if (authError) {
                return { success: false, error: authError.message };
            }

            if (!authData.user) {
                return {
                    success: false,
                    error: "Failed to create user account",
                };
            }

            if (!authData.session) {
                const { data: profileData, error: profileError } =
                    await supabase
                        .from("users")
                        .insert([
                            {
                                auth_user_id: authData.user.id,
                                name: data.name,
                                phone: data.phone,
                                email: data.email,
                            },
                        ])
                        .select()
                        .single();

                if (profileError) {
                    await supabase.auth.admin.deleteUser(authData.user.id);
                    return { success: false, error: profileError.message };
                }

                return { success: true, needsVerification: true };
            } else {
                setSession(authData.session);
                setUser(authData.user as AuthUser);
                await fetchUserData(authData.user.id);
                return { success: true };
            }
        } catch (error) {
            console.error("Team member signup error:", error);
            return {
                success: false,
                error: "An unexpected error occurred during team member signup",
            };
        } finally {
            setLoading(false);
        }
    };

    const resendVerification = async (
        email: string
    ): Promise<{ success: boolean; error?: string }> => {
        try {
            const { error } = await supabase.auth.resend({
                type: "signup",
                email,
                options: {
                    emailRedirectTo: window.location.origin + "/dashboard",
                },
            });
            if (error) {
                return { success: false, error: error.message };
            }
            return { success: true };
        } catch (error) {
            console.error("Resend verification error:", error);
            return {
                success: false,
                error: "Failed to resend verification email",
            };
        }
    };

    const signIn = async (
        email: string,
        password: string
    ): Promise<{ success: boolean; error?: string }> => {
        try {
            setLoading(true);

            if (!email || !password) {
                return {
                    success: false,
                    error: "Email and password are required",
                };
            }

            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) {
                return { success: false, error: error.message };
            }

            if (data.user && data.session) {
                setSession(data.session);
                setUser(data.user as AuthUser);

                await fetchUserData(data.user.id);

                return { success: true };
            } else {
                return { success: false, error: "Login failed after success." };
            }
        } catch (error) {
            console.error("Sign in error:", error);
            return {
                success: false,
                error: "An unexpected error occurred during sign in",
            };
        } finally {
            setLoading(false);
        }
    };

    const signInWithOAuth = async (
        redirectTo?: string
    ): Promise<{ success: boolean; error?: string; existing?: boolean }> => {
        try {
            setLoading(true);

            const { data, error: authError } =
                await supabase.auth.signInWithOAuth({
                    provider: "google",
                    options: {
                        redirectTo:
                            redirectTo || window.location.origin + "/dashboard",
                    },
                });

            if (authError) {
                return { success: false, error: authError.message };
            }

            return { success: true };
        } catch (error) {
            console.error("OAuth sign in error:", error);
            return {
                success: false,
                error: "An unexpected error occurred during OAuth",
            };
        } finally {
            setLoading(false);
        }
    };

    const signOut = async () => {
        try {
            setLoading(true);
            const { error } = await supabase.auth.signOut();
            if (error) {
                console.error("Sign out error:", error);
            }

            setUser(null);
            setSession(null);
            setCompany(null);
            navigate("/", { replace: true });
        } catch (error) {
            console.error("Sign out error:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (hasInitialized.current) return;
        hasInitialized.current = true;

        console.log("useEffect triggered for auth state listener");

        const initializeAuth = async () => {
            try {
                const {
                    data: { session },
                    error,
                } = await supabase.auth.getSession();
                console.log("Session fetched:", session, "Error:", error);

                if (error) {
                    console.error("Error getting session:", error);
                    setIsAuthChecked(true);
                    return;
                }

                if (session) {
                    console.log(
                        "Session found, setting user and fetching data"
                    );
                    setSession(session);
                    setUser(session.user as AuthUser);
                    await fetchUserData(session.user.id);

                    if (location.pathname === "/") {
                        navigate("/dashboard", { replace: true });
                    }
                } else if (location.pathname.startsWith("/dashboard")) {
                    console.log(
                        "No session but accessing dashboard route, redirect to root"
                    );
                    navigate("/", { replace: true });
                } else {
                    console.log("No session found");
                }
            } catch (error) {
                console.error("Error initializing auth:", error);
            } finally {
                setLoading(false);
                setIsAuthChecked(true);
            }
        };

        initializeAuth();

        const { data: authListener } = supabase.auth.onAuthStateChange(
            (event, session) => {
                console.log("Auth state changed:", event, session);
                if (event === "SIGNED_IN" && session) {
                    setSession(session);
                    setUser(session.user as AuthUser);
                    fetchUserData(session.user.id);
                    if (location.pathname === "/") {
                        navigate("/dashboard", { replace: true });
                    }
                } else if (event === "SIGNED_OUT") {
                    setUser(null);
                    setSession(null);
                    setCompany(null);
                    if (location.pathname.startsWith("/dashboard")) {
                        navigate("/", { replace: true });
                    }
                }
            }
        );

        return () => {
            authListener.subscription.unsubscribe();
        };
    }, [navigate, location.pathname]);

    const value: AuthContextType = {
        user,
        session,
        company,
        loading,
        signUp,
        signUpTeamMember,
        signIn,
        signInWithOAuth,
        signOut,
        resendVerification,
    };

    if (!isAuthChecked) {
        return <Loading />;
    }

    return (
        <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    );
};
