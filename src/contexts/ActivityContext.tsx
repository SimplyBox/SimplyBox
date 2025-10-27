import React, {
    createContext,
    useContext,
    useState,
    useEffect,
    useCallback,
} from "react";
import supabase from "@/libs/supabase";
import { useTeam } from "./TeamContext";

export interface Activity {
    id: string;
    title: string;
    description?: string;
    channel?: "whatsapp" | "instagram" | "facebook";
    urgency: "low" | "medium" | "high";
    assigned_to?: string;
    status: "pending" | "in_progress" | "completed";
    company_id: string;
    created_at: string;
    updated_at?: string;
}

interface ActivityContextType {
    activities: Activity[];
    addActivity: (
        activity: Omit<Activity, "id" | "created_at" | "updated_at">
    ) => Promise<void>;
    updateActivity: (id: string, updates: Partial<Activity>) => Promise<void>;
    deleteActivity: (id: string) => Promise<void>;
    loading: boolean;
}

const ActivityContext = createContext<ActivityContextType | undefined>(
    undefined
);

export const useActivity = () => {
    const context = useContext(ActivityContext);
    if (!context) {
        throw new Error("useActivity must be used within an ActivityProvider");
    }
    return context;
};

export const ActivityProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const [activities, setActivities] = useState<Activity[]>([]);
    const [loading, setLoading] = useState(true);
    const { currentTeamMember } = useTeam();

    const fetchActivities = useCallback(async () => {
        if (!currentTeamMember?.company_id) return;
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from("kanban_board")
                .select("*")
                .eq("company_id", currentTeamMember.company_id);
            if (error) throw error;
            setActivities(data || []);
        } catch (error) {
            console.error("Error fetching activities:", error);
            setActivities([]);
        } finally {
            setLoading(false);
        }
    }, [currentTeamMember?.company_id]);

    const addActivity = useCallback(
        async (
            newActivity: Omit<Activity, "id" | "created_at" | "updated_at">
        ) => {
            if (!currentTeamMember?.company_id) return;
            try {
                const { data, error } = await supabase
                    .from("kanban_board")
                    .insert({
                        ...newActivity,
                        company_id: currentTeamMember.company_id,
                    })
                    .select();
                if (error) throw error;
                if (data) setActivities((prev) => [data[0], ...prev]);
            } catch (error) {
                console.error("Error adding activity:", error);
            }
        },
        [currentTeamMember?.company_id]
    );

    const updateActivity = useCallback(
        async (id: string, updates: Partial<Activity>) => {
            try {
                const { error } = await supabase
                    .from("kanban_board")
                    .update(updates)
                    .eq("id", id);
                if (error) throw error;
                setActivities((prev) =>
                    prev.map((act) =>
                        act.id === id
                            ? {
                                  ...act,
                                  ...updates,
                                  updated_at: new Date().toISOString(),
                              }
                            : act
                    )
                );
            } catch (error) {
                console.error("Error updating activity:", error);
            }
        },
        []
    );

    const deleteActivity = useCallback(async (id: string) => {
        try {
            const { error } = await supabase
                .from("kanban_board")
                .delete()
                .eq("id", id);
            if (error) throw error;
            setActivities((prev) => prev.filter((act) => act.id !== id));
        } catch (error) {
            console.error("Error deleting activity:", error);
        }
    }, []);

    useEffect(() => {
        fetchActivities();
    }, [fetchActivities]);

    const value: ActivityContextType = {
        activities,
        addActivity,
        updateActivity,
        deleteActivity,
        loading,
    };

    return (
        <ActivityContext.Provider value={value}>
            {children}
        </ActivityContext.Provider>
    );
};
