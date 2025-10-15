import React, { createContext, useContext } from "react";
import { useAuth } from "./AuthContext";
import { useSubscriptionService } from "@/services/subscription";
import { SubscriptionContextType } from "@/types";
import Loading from "@/components/Loading";

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(
    undefined
);

export const useSubscription = () => {
    const context = useContext(SubscriptionContext);
    if (context === undefined) {
        throw new Error(
            "useSubscription must be used within a SubscriptionProvider"
        );
    }
    return context;
};

export const SubscriptionProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const { company, loading: authLoading } = useAuth();
    const {
        subscription,
        refreshSubscription,
        updateSubscription,
        loading: subscriptionLoading,
    } = useSubscriptionService(company?.id);

    const value: SubscriptionContextType = {
        subscription,
        refreshSubscription,
        updateSubscription,
    };

    if (authLoading || subscriptionLoading) {
        return <Loading />;
    }

    return (
        <SubscriptionContext.Provider value={value}>
            {children}
        </SubscriptionContext.Provider>
    );
};
