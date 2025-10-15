import React, { createContext, useContext, useState, useCallback } from "react";

export interface Activity {
    id: string;
    type: "message" | "note" | "task" | "call" | "meeting";
    title: string;
    description?: string;
    timestamp: Date;
    status: "pending" | "in_progress" | "completed";
    assignedTo?: string;
    dueDate?: Date;
    contactId?: string;
    contactName?: string;
    priority: "low" | "medium" | "high";
    kanbanColumn: "todo" | "inProgress" | "done";
}

interface ActivityContextType {
    activities: Activity[];
    addActivity: (activity: Omit<Activity, "id">) => void;
    updateActivity: (id: string, updates: Partial<Activity>) => void;
    deleteActivity: (id: string) => void;
    getActivitiesByContact: (contactId: string) => Activity[];
    getKanbanActivities: () => Activity[];
    moveActivityToKanban: (
        activityId: string,
        column: Activity["kanbanColumn"]
    ) => void;
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
    const [activities, setActivities] = useState<Activity[]>([
        {
            id: "1",
            type: "task",
            title: "Follow up on bulk order inquiry",
            description: "Send detailed pricing for 100+ units to Budi Santoso",
            timestamp: new Date("2024-01-16T09:00:00"),
            status: "pending",
            assignedTo: "You",
            dueDate: new Date("2024-01-18T17:00:00"),
            contactId: "1",
            contactName: "Budi Santoso",
            priority: "high",
            kanbanColumn: "todo",
        },
        {
            id: "2",
            type: "call",
            title: "Schedule product demo call",
            description: "Demo our latest features to Sari Dewi",
            timestamp: new Date("2024-01-17T10:00:00"),
            status: "pending",
            assignedTo: "Sarah",
            dueDate: new Date("2024-01-19T14:00:00"),
            contactId: "2",
            contactName: "Sari Dewi",
            priority: "medium",
            kanbanColumn: "inProgress",
        },
        {
            id: "3",
            type: "meeting",
            title: "Contract negotiation meeting",
            description: "Finalize terms with Ahmad Rahman",
            timestamp: new Date("2024-01-15T14:30:00"),
            status: "completed",
            assignedTo: "John",
            dueDate: new Date("2024-01-20T10:00:00"),
            contactId: "3",
            contactName: "Ahmad Rahman",
            priority: "high",
            kanbanColumn: "done",
        },
    ]);

    const addActivity = useCallback((newActivity: Omit<Activity, "id">) => {
        const activity: Activity = {
            ...newActivity,
            id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        };
        setActivities((prev) => [activity, ...prev]);
    }, []);

    const updateActivity = useCallback(
        (id: string, updates: Partial<Activity>) => {
            setActivities((prev) =>
                prev.map((activity) =>
                    activity.id === id ? { ...activity, ...updates } : activity
                )
            );
        },
        []
    );

    const deleteActivity = useCallback((id: string) => {
        setActivities((prev) => prev.filter((activity) => activity.id !== id));
    }, []);

    const getActivitiesByContact = useCallback(
        (contactId: string) => {
            return activities.filter(
                (activity) => activity.contactId === contactId
            );
        },
        [activities]
    );

    const getKanbanActivities = useCallback(() => {
        return activities.filter(
            (activity) =>
                activity.type === "task" ||
                activity.type === "call" ||
                activity.type === "meeting"
        );
    }, [activities]);

    const moveActivityToKanban = useCallback(
        (activityId: string, column: Activity["kanbanColumn"]) => {
            updateActivity(activityId, {
                kanbanColumn: column,
                status: column === "done" ? "completed" : "pending",
            });
        },
        [updateActivity]
    );

    const value: ActivityContextType = {
        activities,
        addActivity,
        updateActivity,
        deleteActivity,
        getActivitiesByContact,
        getKanbanActivities,
        moveActivityToKanban,
    };

    return (
        <ActivityContext.Provider value={value}>
            {children}
        </ActivityContext.Provider>
    );
};
