import { useState, useEffect } from "react";
import supabase from "@/libs/supabase";
import { Subscription } from "@/types";
import { getLimitsForTier } from "@/utils/limits";

export const useSubscriptionService = (companyId: string | undefined) => {
    const [subscription, setSubscription] = useState<Subscription | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchSubscription = async (companyId: string) => {
        try {
            setLoading(true);
            const { data: subscriptionData, error: subscriptionError } =
                await supabase
                    .from("subscriptions")
                    .select("*")
                    .eq("company_id", companyId)
                    .maybeSingle();

            if (subscriptionError) {
                console.error(
                    "Error fetching subscription:",
                    subscriptionError
                );
                setSubscription(null);
                return;
            }

            let usageData = null;
            if (subscriptionData) {
                const { data: usage, error: usageError } = await supabase
                    .from("subscription_usage")
                    .select(
                        "messages_used, team_members_used, files_used, messages_limit, team_members_limit, files_limit"
                    )
                    .eq("subscription_id", subscriptionData.id)
                    .maybeSingle();

                if (usageError) {
                    console.error(
                        "Error fetching subscription usage:",
                        usageError
                    );
                } else {
                    usageData = usage;
                }
            }

            setSubscription(
                subscriptionData
                    ? { ...subscriptionData, usage: usageData }
                    : null
            );
        } catch (error) {
            console.error("Error in fetchSubscription:", error);
            setSubscription(null);
        } finally {
            setLoading(false);
        }
    };

    const refreshSubscription = async () => {
        if (companyId) {
            await fetchSubscription(companyId);
        }
    };

    const updateSubscription = async (
        subscriptionData: Partial<Subscription>
    ) => {
        try {
            setLoading(true);
            if (!subscription?.id) {
                throw new Error("No subscription found to update");
            }

            const { error } = await supabase
                .from("subscriptions")
                .update(subscriptionData)
                .eq("id", subscription.id);

            if (error) {
                console.error("Error updating subscription:", error);
                throw error;
            }

            if (subscriptionData.tier) {
                const limits = getLimitsForTier(subscriptionData.tier);

                const { data: usageData, error: usageFetchError } =
                    await supabase
                        .from("subscription_usage")
                        .select("*")
                        .eq("subscription_id", subscription.id)
                        .maybeSingle();

                if (usageFetchError) {
                    console.error(
                        "Error fetching subscription usage:",
                        usageFetchError
                    );
                    throw usageFetchError;
                }

                if (usageData) {
                    const { error: usageUpdateError } = await supabase
                        .from("subscription_usage")
                        .update({
                            messages_used: 0,
                            team_members_used: usageData.team_members_used,
                            files_used: usageData.files_used,
                            messages_limit: limits.messages_limit,
                            team_members_limit: limits.team_members_limit,
                            files_limit: limits.files_limit,
                            updated_at: new Date().toISOString(),
                        })
                        .eq("id", usageData.id);

                    if (usageUpdateError) {
                        console.error(
                            "Error updating subscription usage:",
                            usageUpdateError
                        );
                        throw usageUpdateError;
                    }
                } else {
                    const { error: usageInsertError } = await supabase
                        .from("subscription_usage")
                        .insert([
                            {
                                subscription_id: subscription.id,
                                messages_used: 0,
                                team_members_used: 0,
                                files_used: 0,
                                ...limits,
                            },
                        ]);

                    if (usageInsertError) {
                        console.error(
                            "Error inserting subscription usage:",
                            usageInsertError
                        );
                        throw usageInsertError;
                    }
                }
            }

            await fetchSubscription(companyId!);
        } catch (error) {
            console.error("Error in updateSubscription:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (companyId) {
            fetchSubscription(companyId);

            const usageChannel = supabase
                .channel(`public:subscription_usage:company_id=${companyId}`)
                .on(
                    "postgres_changes",
                    {
                        event: "INSERT",
                        schema: "public",
                        table: "subscription_usage",
                        filter: `subscription_id=eq.${subscription?.id}`,
                    },
                    async (payload) => {
                        console.log(
                            "New subscription usage received:",
                            payload.new
                        );
                        const newUsage = payload.new as Subscription["usage"];

                        if (subscription) {
                            setSubscription({
                                ...subscription,
                                usage: newUsage,
                            });
                        }
                    }
                )
                .on(
                    "postgres_changes",
                    {
                        event: "UPDATE",
                        schema: "public",
                        table: "subscription_usage",
                        filter: `subscription_id=eq.${subscription?.id}`,
                    },
                    async (payload) => {
                        console.log("Subscription usage updated:", payload.new);
                        const updatedUsage =
                            payload.new as Subscription["usage"];

                        if (subscription) {
                            setSubscription({
                                ...subscription,
                                usage: updatedUsage,
                            });
                        }
                    }
                )
                .on(
                    "postgres_changes",
                    {
                        event: "DELETE",
                        schema: "public",
                        table: "subscription_usage",
                        filter: `subscription_id=eq.${subscription?.id}`,
                    },
                    (payload) => {
                        console.log("Subscription usage deleted:", payload.old);
                        if (subscription) {
                            setSubscription({
                                ...subscription,
                                usage: null,
                            });
                        }
                    }
                )
                .subscribe((status) => {
                    console.log("Subscription usage channel status:", status);
                });

            return () => {
                console.log("Cleaning up subscription usage channel...");
                supabase.removeChannel(usageChannel);
            };
        } else {
            setSubscription(null);
            setLoading(false);
        }
    }, [companyId, subscription?.id]);

    return {
        subscription,
        refreshSubscription,
        updateSubscription,
        loading,
    };
};
