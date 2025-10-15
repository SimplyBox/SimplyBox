import { useState, useEffect, useCallback } from "react";
import supabase from "@/libs/supabase";
import { TeamMember, InvitationData } from "@/types";
import { getLimitsForTier } from "@/utils/limits";

export const useTeamService = (
    userId: string | undefined,
    companyId: string | undefined,
    signUpTeamMember: (data: {
        name: string;
        email: string;
        phone: string;
        password: string;
    }) => Promise<{
        success: boolean;
        error?: string;
        needsVerification?: boolean;
    }>
) => {
    const [teamMembers, setTeamMembers] = useState<TeamMember[] | null>(null);
    const [currentTeamMember, setCurrentTeamMember] =
        useState<TeamMember | null>(null);
    const [loading, setLoading] = useState(false);

    const fetchTeamMembersData = useCallback(async (companyId: string) => {
        if (!companyId) {
            console.warn("No company ID provided for fetching team members");
            return;
        }

        try {
            setLoading(true);
            console.log("Fetching team members for company:", companyId);

            const { data: teamData, error: teamError } = await supabase
                .from("team")
                .select("id, user_id, company_id, role, created_at")
                .eq("company_id", companyId);

            if (teamError) {
                console.error("Error fetching team data:", teamError);
                setTeamMembers([]);
                return;
            }

            if (!teamData || teamData.length === 0) {
                console.log("No team members found");
                setTeamMembers([]);
                return;
            }

            const userIds = teamData.map((team) => team.user_id);

            const { data: userData, error: userError } = await supabase
                .from("users")
                .select("id, name, phone, email")
                .in("id", userIds);

            if (userError) {
                console.error("Error fetching user data:", userError);
                setTeamMembers([]);
                return;
            }

            const formattedMembers: TeamMember[] = teamData.map((team) => {
                const userProfile = userData?.find(
                    (u) => u.id === team.user_id
                );

                return {
                    id: team.id,
                    user_id: team.user_id,
                    company_id: team.company_id,
                    role: team.role,
                    created_at: team.created_at,
                    name: userProfile?.name || "Unknown",
                    email: userProfile?.email || "Unknown",
                    phone: userProfile?.phone || undefined,
                };
            });

            console.log("Formatted team members:", formattedMembers);
            setTeamMembers(formattedMembers);
        } catch (error) {
            console.error("Error fetching team members:", error);
            setTeamMembers([]);
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchCurrentTeamMember = useCallback(
        async (userId: string, companyId: string) => {
            try {
                const { data: profileData, error: profileError } =
                    await supabase
                        .from("users")
                        .select("id, name, phone, email")
                        .eq("auth_user_id", userId)
                        .maybeSingle();

                if (profileError || !profileData) {
                    console.error("Error fetching profile:", profileError);
                    return;
                }

                const { data: teamData, error: teamError } = await supabase
                    .from("team")
                    .select("*")
                    .eq("user_id", profileData.id)
                    .eq("company_id", companyId)
                    .maybeSingle();

                if (teamError || !teamData) {
                    console.error("Error fetching team data:", teamError);
                    setCurrentTeamMember(null);
                    return;
                }

                const teamMember: TeamMember = {
                    id: teamData.id,
                    user_id: teamData.user_id,
                    company_id: teamData.company_id,
                    role: teamData.role,
                    created_at: teamData.created_at,
                    name: profileData.name,
                    email: profileData.email,
                    phone: profileData.phone,
                };

                setCurrentTeamMember(teamMember);
            } catch (error) {
                console.error("Error fetching current team member:", error);
                setCurrentTeamMember(null);
            }
        },
        []
    );

    const refreshTeamMembers = useCallback(async () => {
        if (!companyId) {
            console.warn(
                "No company ID available, skipping team members refresh"
            );
            return;
        }

        await fetchTeamMembersData(companyId);
    }, [companyId, fetchTeamMembersData]);

    const inviteTeamMember = async (
        email: string,
        role: "admin"
    ): Promise<{ success: boolean; error?: string }> => {
        try {
            if (!companyId) {
                return { success: false, error: "No company found" };
            }

            if (!userId) {
                return { success: false, error: "User information incomplete" };
            }

            const { data: userData } = await supabase
                .from("users")
                .select("name")
                .eq("auth_user_id", userId)
                .single();

            if (!userData?.name) {
                return { success: false, error: "User information incomplete" };
            }

            const { data: subscriptionData, error: subscriptionError } =
                await supabase
                    .from("subscriptions")
                    .select("id, tier")
                    .eq("company_id", companyId)
                    .single();

            if (subscriptionError) {
                return { success: false, error: subscriptionError.message };
            }

            const limits = getLimitsForTier(subscriptionData.tier);
            if (
                teamMembers &&
                teamMembers.length >= limits.team_members_limit
            ) {
                return { success: false, error: "Team member limit reached" };
            }

            const { data: companyData } = await supabase
                .from("companies")
                .select("name")
                .eq("id", companyId)
                .single();

            const { data, error } = await supabase.functions.invoke(
                "send-team-invitation",
                {
                    body: {
                        email,
                        companyId,
                        role,
                        inviterName: userData.name,
                        companyName: companyData?.name || "Unknown",
                    },
                }
            );

            if (error) {
                return { success: false, error: error.message };
            }

            return { success: true };
        } catch (error: any) {
            console.error("Invite team member error:", error);
            return {
                success: false,
                error: error.message || "Failed to invite team member",
            };
        }
    };

    const verifyInvitationToken = async (
        token: string
    ): Promise<{
        success: boolean;
        data?: InvitationData;
        error?: string;
    }> => {
        try {
            const { data, error } = await supabase
                .from("invitation_tokens")
                .select("data, expires_at")
                .eq("token", token)
                .eq("used", false)
                .gt("expires_at", new Date().toISOString())
                .single();

            if (error || !data) {
                return {
                    success: false,
                    error: "Invalid or expired invitation",
                };
            }

            return {
                success: true,
                data: data.data as InvitationData,
            };
        } catch (err: any) {
            return {
                success: false,
                error: err.message || "Failed to verify invitation",
            };
        }
    };

    const acceptInvitation = async (params: {
        token: string;
        invitationData: InvitationData;
        userData: {
            name: string;
            phone: string;
            password: string;
        };
    }): Promise<{
        success: boolean;
        error?: string;
        needsVerification?: boolean;
    }> => {
        try {
            const { token, invitationData, userData } = params;

            const signUpData = {
                name: userData.name,
                email: invitationData.email,
                phone: userData.phone,
                password: userData.password,
            };

            const {
                success,
                error: signUpError,
                needsVerification,
            } = await signUpTeamMember(signUpData);

            if (!success || signUpError) {
                return {
                    success: false,
                    error: signUpError || "Failed to create user account",
                };
            }

            const { data: userQueryData, error: userError } = await supabase
                .from("users")
                .select("id")
                .eq("email", invitationData.email)
                .single();

            if (userError || !userQueryData) {
                return {
                    success: false,
                    error:
                        "Failed to retrieve user data: " +
                        (userError?.message || "User not found"),
                };
            }

            const { error: teamError } = await supabase.from("team").insert({
                user_id: userQueryData.id,
                company_id: invitationData.companyId,
                role: invitationData.role,
                created_at: new Date().toISOString(),
            });

            if (teamError) {
                const { data: userWithAuthId } = await supabase
                    .from("users")
                    .select("auth_user_id")
                    .eq("id", userQueryData.id)
                    .single();

                if (userWithAuthId?.auth_user_id) {
                    await supabase.auth.admin.deleteUser(
                        userWithAuthId.auth_user_id
                    );
                }

                return {
                    success: false,
                    error: "Failed to add user to team: " + teamError.message,
                };
            }

            const { error: updateError } = await supabase
                .from("invitation_tokens")
                .update({ used: true })
                .eq("token", token);

            if (updateError) {
                await supabase
                    .from("team")
                    .delete()
                    .eq("user_id", userQueryData.id)
                    .eq("company_id", invitationData.companyId);

                const { data: userWithAuthId } = await supabase
                    .from("users")
                    .select("auth_user_id")
                    .eq("id", userQueryData.id)
                    .single();

                if (userWithAuthId?.auth_user_id) {
                    await supabase.auth.admin.deleteUser(
                        userWithAuthId.auth_user_id
                    );
                }

                return {
                    success: false,
                    error:
                        "Failed to mark token as used: " + updateError.message,
                };
            }

            const { data: subscriptionData, error: subscriptionError } =
                await supabase
                    .from("subscriptions")
                    .select("id")
                    .eq("company_id", invitationData.companyId)
                    .single();

            if (subscriptionData && !subscriptionError) {
                const { data: currentUsage, error: usageGetError } =
                    await supabase
                        .from("subscription_usage")
                        .select("team_members_used")
                        .eq("subscription_id", subscriptionData.id)
                        .single();

                if (!usageGetError && currentUsage) {
                    const { error: usageUpdateError } = await supabase
                        .from("subscription_usage")
                        .update({
                            team_members_used:
                                currentUsage.team_members_used + 1,
                        })
                        .eq("subscription_id", subscriptionData.id);

                    if (usageUpdateError) {
                        console.warn(
                            "Failed to update team members usage:",
                            usageUpdateError
                        );
                    }
                }
            }

            if (!needsVerification) {
                await refreshTeamMembers();
            }

            return {
                success: true,
                needsVerification: needsVerification,
            };
        } catch (err: any) {
            return {
                success: false,
                error: err.message || "Failed to accept invitation",
            };
        }
    };

    const removeTeamMember = async (
        userId: string
    ): Promise<{
        success: boolean;
        error?: string;
    }> => {
        try {
            if (!companyId) {
                return { success: false, error: "No company found" };
            }

            const memberToRemove = teamMembers?.find(
                (member) => member.user_id === userId
            );
            if (memberToRemove?.role === "owner") {
                return {
                    success: false,
                    error: "Cannot remove the team owner",
                };
            }

            const { error: teamError } = await supabase
                .from("team")
                .delete()
                .eq("user_id", userId)
                .eq("company_id", companyId);

            if (teamError) {
                return {
                    success: false,
                    error: "Failed to remove team member: " + teamError.message,
                };
            }

            const { data: subscriptionData, error: subscriptionError } =
                await supabase
                    .from("subscriptions")
                    .select("id")
                    .eq("company_id", companyId)
                    .single();

            if (subscriptionData && !subscriptionError) {
                const { data: currentUsage, error: usageGetError } =
                    await supabase
                        .from("subscription_usage")
                        .select("team_members_used")
                        .eq("subscription_id", subscriptionData.id)
                        .single();

                if (!usageGetError && currentUsage) {
                    const { error: usageUpdateError } = await supabase
                        .from("subscription_usage")
                        .update({
                            team_members_used: Math.max(
                                0,
                                currentUsage.team_members_used - 1
                            ),
                        })
                        .eq("subscription_id", subscriptionData.id);

                    if (usageUpdateError) {
                        console.warn(
                            "Failed to update team members usage:",
                            usageUpdateError
                        );
                    }
                }
            }

            await fetchTeamMembersData(companyId);

            return { success: true };
        } catch (error) {
            console.error("Remove team member error:", error);
            return {
                success: false,
                error: "Failed to remove team member",
            };
        }
    };

    const isOwner = (): boolean => {
        return currentTeamMember?.role === "owner";
    };

    const isAdmin = (): boolean => {
        return currentTeamMember?.role === "admin";
    };

    useEffect(() => {
        if (userId && companyId) {
            fetchCurrentTeamMember(userId, companyId);
            fetchTeamMembersData(companyId);
        } else {
            setCurrentTeamMember(null);
            setTeamMembers(null);
        }
    }, [userId, companyId, fetchCurrentTeamMember, fetchTeamMembersData]);

    return {
        teamMembers,
        currentTeamMember,
        loading,
        refreshTeamMembers,
        inviteTeamMember,
        verifyInvitationToken,
        acceptInvitation,
        removeTeamMember,
        isOwner,
        isAdmin,
    };
};
