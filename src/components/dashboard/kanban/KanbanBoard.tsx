import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useActivity } from "@/contexts/ActivityContext";
import { useTeam } from "@/contexts/TeamContext";

type KanbanColumn = "todo" | "inProgress" | "done";

interface KanbanCard {
    id: string;
    title: string;
    description: string;
    channel?: "whatsapp" | "email";
    urgency: "low" | "medium" | "high";
    assigned_to?: string;
    status?: "pending" | "in_progress" | "completed";
    created_at?: string;
    updated_at?: string;
}

interface KanbanBoardProps {
    userPlan?: "free" | "starter" | "professional" | "enterprise";
    onUpgradeClick?: () => void;
}

const KanbanBoard: React.FC<KanbanBoardProps> = ({
    userPlan = "free",
    onUpgradeClick = () => {},
}) => {
    const { activities, updateActivity, addActivity } = useActivity();
    const { teamMembers, currentTeamMember } = useTeam();
    const [cards, setCards] = useState<{
        todo: KanbanCard[];
        inProgress: KanbanCard[];
        done: KanbanCard[];
    }>({
        todo: [],
        inProgress: [],
        done: [],
    });
    const [draggedCard, setDraggedCard] = useState<KanbanCard | null>(null);
    const [draggedFrom, setDraggedFrom] = useState<KanbanColumn | null>(null);
    const [selectedCard, setSelectedCard] = useState<KanbanCard | null>(null);
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [isNewCardOpen, setIsNewCardOpen] = useState(false);
    const [newCard, setNewCard] = useState<Partial<KanbanCard>>({
        title: "",
        description: "",
        channel: "whatsapp",
        urgency: "medium",
    });

    useEffect(() => {
        const activityCards = activities.map((activity) => ({
            id: activity.id,
            title: activity.title,
            description: activity.description || "",
            channel: activity.channel as "whatsapp" | "email" | undefined,
            urgency: activity.urgency as "low" | "medium" | "high",
            assigned_to: activity.assigned_to,
            status: activity.status as "pending" | "in_progress" | "completed",
            created_at: activity.created_at,
            updated_at: activity.updated_at,
        }));

        setCards({
            todo: activityCards.filter((card) => card.status === "pending"),
            inProgress: activityCards.filter(
                (card) => card.status === "in_progress"
            ),
            done: activityCards.filter((card) => card.status === "completed"),
        });
    }, [activities]);

    const handleDragStart = (card: KanbanCard, column: KanbanColumn) => {
        setDraggedCard(card);
        setDraggedFrom(column);
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
    };

    const handleDrop = async (targetColumn: KanbanColumn) => {
        if (!draggedCard || !draggedFrom) return;

        try {
            const newStatus =
                targetColumn === "todo"
                    ? "pending"
                    : targetColumn === "inProgress"
                    ? "in_progress"
                    : "completed";
            await updateActivity(draggedCard.id, { status: newStatus });

            setCards((prev) => ({
                ...prev,
                [draggedFrom]: prev[draggedFrom].filter(
                    (card) => card.id !== draggedCard.id
                ),
                [targetColumn]: [...prev[targetColumn], draggedCard],
            }));
        } catch (error) {
            console.error("Error moving card:", error);
        } finally {
            setDraggedCard(null);
            setDraggedFrom(null);
        }
    };

    const openCardDetail = (card: KanbanCard) => {
        setSelectedCard(card);
        setIsDetailOpen(true);
    };

    const handleCreateCard = async () => {
        if (!newCard.title || !currentTeamMember?.company_id) return;

        try {
            const activityToAdd = {
                title: newCard.title,
                description: newCard.description || "",
                channel: newCard.channel,
                urgency: newCard.urgency,
                assigned_to: newCard.assigned_to,
                status: "pending" as "pending" | "in_progress" | "completed",
                company_id: currentTeamMember.company_id,
            };

            await addActivity(activityToAdd);
            setNewCard({
                title: "",
                description: "",
                channel: "whatsapp",
                urgency: "medium",
                assigned_to: undefined,
            });
            setIsNewCardOpen(false);
        } catch (error) {
            console.error("Error creating card:", error);
        }
    };

    const renderUrgencyBadge = (urgency: string) => {
        switch (urgency) {
            case "high":
                return <Badge variant="destructive">High</Badge>;
            case "medium":
                return <Badge variant="secondary">Medium</Badge>;
            default:
                return <Badge variant="outline">Low</Badge>;
        }
    };

    const renderChannelBadge = (channel: string) => {
        switch (channel) {
            case "whatsapp":
                return <Badge className="bg-green-500">WhatsApp</Badge>;
            case "email":
                return <Badge className="bg-blue-500">Email</Badge>;
            default:
                return <Badge>Unknown</Badge>;
        }
    };

    return (
        <div className="p-6 bg-white min-h-screen">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold">Kanban Board</h1>
                    <p className="text-muted-foreground">Manage your tasks</p>
                </div>
                <Button onClick={() => setIsNewCardOpen(true)}>Add Task</Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-[calc(100vh-180px)]">
                {(["todo", "inProgress", "done"] as KanbanColumn[]).map(
                    (column) => (
                        <div
                            key={column}
                            className="bg-slate-50 rounded-lg p-4 overflow-y-auto"
                            onDragOver={handleDragOver}
                            onDrop={() => handleDrop(column)}
                        >
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="font-semibold text-lg">
                                    {column.charAt(0).toUpperCase() +
                                        column.slice(1)}
                                </h2>
                                <Badge variant="outline">
                                    {cards[column].length}
                                </Badge>
                            </div>
                            {cards[column].map((card) => (
                                <div key={card.id} className="mb-3">
                                    <Card
                                        className="cursor-pointer hover:shadow-md transition-shadow"
                                        draggable
                                        onDragStart={() =>
                                            handleDragStart(card, column)
                                        }
                                        onClick={() => openCardDetail(card)}
                                    >
                                        <CardHeader className="p-3 pb-0">
                                            <CardTitle className="text-sm font-medium">
                                                {card.title}
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="p-3 pt-2">
                                            <div className="flex flex-wrap gap-2 mb-2">
                                                {card.channel &&
                                                    renderChannelBadge(
                                                        card.channel
                                                    )}
                                                {renderUrgencyBadge(
                                                    card.urgency
                                                )}
                                            </div>
                                            {card.assigned_to &&
                                                teamMembers &&
                                                teamMembers.length > 0 && (
                                                    <div className="flex items-center text-xs text-muted-foreground mt-1">
                                                        <Avatar className="h-5 w-5 mr-1">
                                                            <AvatarImage
                                                                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${
                                                                    teamMembers.find(
                                                                        (m) =>
                                                                            m.user_id ===
                                                                            card.assigned_to
                                                                    )?.name ||
                                                                    "Unknown"
                                                                }`}
                                                            />
                                                            <AvatarFallback>
                                                                {teamMembers
                                                                    .find(
                                                                        (m) =>
                                                                            m.user_id ===
                                                                            card.assigned_to
                                                                    )
                                                                    ?.name?.charAt(
                                                                        0
                                                                    ) || "?"}
                                                            </AvatarFallback>
                                                        </Avatar>
                                                        <span>
                                                            {teamMembers.find(
                                                                (m) =>
                                                                    m.user_id ===
                                                                    card.assigned_to
                                                            )?.name ||
                                                                "Unknown"}
                                                        </span>
                                                    </div>
                                                )}
                                        </CardContent>
                                    </Card>
                                </div>
                            ))}
                        </div>
                    )
                )}
            </div>
            {selectedCard && (
                <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
                    <DialogContent className="sm:max-w-[500px]">
                        <DialogHeader>
                            <DialogTitle>{selectedCard.title}</DialogTitle>
                            <DialogDescription className="flex gap-2 mt-2">
                                {selectedCard.channel &&
                                    renderChannelBadge(selectedCard.channel)}
                                {renderUrgencyBadge(selectedCard.urgency)}
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div>
                                <h4 className="text-sm font-medium mb-2">
                                    Description
                                </h4>
                                <p className="text-sm text-muted-foreground">
                                    {selectedCard.description}
                                </p>
                            </div>
                            <div>
                                <h4 className="text-sm font-medium mb-2">
                                    Assigned To
                                </h4>
                                <Select
                                    value={
                                        selectedCard.assigned_to || "unassigned"
                                    } // Default to "unassigned" instead of ""
                                    onValueChange={(value) => {
                                        const updatedCard = {
                                            ...selectedCard,
                                            assigned_to:
                                                value === "unassigned"
                                                    ? undefined
                                                    : value,
                                        };
                                        setSelectedCard(updatedCard);
                                        updateActivity(updatedCard.id, {
                                            assigned_to:
                                                updatedCard.assigned_to,
                                        });
                                    }}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select team member" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="unassigned">
                                            Unassigned
                                        </SelectItem>
                                        {teamMembers?.map((member) => (
                                            <SelectItem
                                                key={member.user_id}
                                                value={member.user_id}
                                            >
                                                {member.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button
                                variant="outline"
                                onClick={() => setIsDetailOpen(false)}
                            >
                                Close
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            )}
            <Dialog open={isNewCardOpen} onOpenChange={setIsNewCardOpen}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>Create New Card</DialogTitle>
                        <DialogDescription>
                            Add a new card to your Kanban board.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div>
                            <h4 className="text-sm font-medium mb-2">Title</h4>
                            <Input
                                placeholder="Card title"
                                value={newCard.title || ""}
                                onChange={(e) =>
                                    setNewCard({
                                        ...newCard,
                                        title: e.target.value,
                                    })
                                }
                            />
                        </div>
                        <div>
                            <h4 className="text-sm font-medium mb-2">
                                Description
                            </h4>
                            <Textarea
                                placeholder="Card description"
                                value={newCard.description || ""}
                                onChange={(e) =>
                                    setNewCard({
                                        ...newCard,
                                        description: e.target.value,
                                    })
                                }
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <h4 className="text-sm font-medium mb-2">
                                    Channel
                                </h4>
                                <Select
                                    value={newCard.channel || "whatsapp"}
                                    onValueChange={(value) =>
                                        setNewCard({
                                            ...newCard,
                                            channel: value as
                                                | "whatsapp"
                                                | "email",
                                        })
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select channel" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="whatsapp">
                                            WhatsApp
                                        </SelectItem>
                                        <SelectItem value="email">
                                            Email
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <h4 className="text-sm font-medium mb-2">
                                    Urgency
                                </h4>
                                <Select
                                    value={newCard.urgency || "medium"}
                                    onValueChange={(value) =>
                                        setNewCard({
                                            ...newCard,
                                            urgency: value as
                                                | "low"
                                                | "medium"
                                                | "high",
                                        })
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select urgency" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="low">Low</SelectItem>
                                        <SelectItem value="medium">
                                            Medium
                                        </SelectItem>
                                        <SelectItem value="high">
                                            High
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div>
                            <h4 className="text-sm font-medium mb-2">
                                Assign To
                            </h4>
                            <Select
                                value={newCard.assigned_to || "unassigned"} // Default to "unassigned" instead of ""
                                onValueChange={(value) =>
                                    setNewCard({
                                        ...newCard,
                                        assigned_to:
                                            value === "unassigned"
                                                ? undefined
                                                : value,
                                    })
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select team member" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="unassigned">
                                        Unassigned
                                    </SelectItem>
                                    {teamMembers?.map((member) => (
                                        <SelectItem
                                            key={member.user_id}
                                            value={member.user_id}
                                        >
                                            {member.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setIsNewCardOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button onClick={handleCreateCard}>Create Card</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default KanbanBoard;
