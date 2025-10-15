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
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { Calendar, Clock, User, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
import { useActivity } from "@/contexts/ActivityContext";

type KanbanColumn = "todo" | "inProgress" | "done";

interface KanbanCard {
    id: string;
    title: string;
    description: string;
    channel?: "whatsapp" | "email";
    urgency: "low" | "medium" | "high";
    assigned?: {
        name: string;
        avatar?: string;
    };
    dueDate?: string;
    messageId?: string;
    contactName?: string;
    contactId?: string;
    type?: string;
    priority?: "low" | "medium" | "high";
    status?: "pending" | "in_progress" | "completed";
}

interface KanbanBoardProps {
    userPlan?: "free" | "starter" | "professional" | "enterprise";
    onUpgradeClick?: () => void;
    initialCards?: {
        todo: KanbanCard[];
        inProgress: KanbanCard[];
        done: KanbanCard[];
    };
}

const KanbanBoard: React.FC<KanbanBoardProps> = ({
    userPlan = "free",
    onUpgradeClick = () => {},
    initialCards = {
        todo: [],
        inProgress: [],
        done: [],
    },
}) => {
    const { activities, updateActivity } = useActivity();
    const [cards, setCards] = useState({
        todo: [],
        inProgress: [],
        done: [],
    });

    // Convert activities to kanban cards and sync with activity context
    useEffect(() => {
        let newCards = {
            todo: [] as KanbanCard[],
            inProgress: [] as KanbanCard[],
            done: [] as KanbanCard[],
        };

        if (userPlan === "professional") {
            // Convert activities to kanban cards for professional users
            const activityCards = activities
                .filter((activity) => activity.kanbanColumn)
                .map((activity) => ({
                    id: activity.id,
                    title: activity.title,
                    description: activity.description || "",
                    urgency: (activity.priority || "medium") as
                        | "low"
                        | "medium"
                        | "high",
                    assigned:
                        activity.assignedTo && activity.assignedTo !== "You"
                            ? {
                                  name: activity.assignedTo,
                                  avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${activity.assignedTo}`,
                              }
                            : undefined,
                    dueDate: activity.dueDate
                        ? new Date(activity.dueDate).toISOString().split("T")[0]
                        : undefined,
                    contactName: activity.contactName,
                    contactId: activity.contactId,
                    type: activity.type,
                    priority: activity.priority,
                    status: activity.status,
                }));

            newCards = {
                todo: activityCards.filter(
                    (card) =>
                        activities.find((a) => a.id === card.id)
                            ?.kanbanColumn === "todo"
                ),
                inProgress: activityCards.filter(
                    (card) =>
                        activities.find((a) => a.id === card.id)
                            ?.kanbanColumn === "inProgress"
                ),
                done: activityCards.filter(
                    (card) =>
                        activities.find((a) => a.id === card.id)
                            ?.kanbanColumn === "done"
                ),
            };
        } else {
            // Add demo cards for non-professional users
            newCards = {
                todo: [
                    {
                        id: "demo-1",
                        title: "Product inquiry from John",
                        description:
                            "Customer asking about product availability and pricing",
                        urgency: "high",
                        assigned: {
                            name: "Alex",
                            avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
                        },
                        channel: "whatsapp",
                    },
                    {
                        id: "demo-2",
                        title: "Support request from Sarah",
                        description: "Issue with recent order #12345",
                        urgency: "medium",
                        channel: "email",
                    },
                ],
                inProgress: [
                    {
                        id: "demo-3",
                        title: "Quote request from Budi",
                        description: "Needs pricing for bulk order",
                        urgency: "medium",
                        assigned: {
                            name: "Maya",
                            avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Maya",
                        },
                        dueDate: "2023-06-15",
                        channel: "whatsapp",
                    },
                ],
                done: [
                    {
                        id: "demo-4",
                        title: "Feedback from Andi",
                        description: "Positive review about recent service",
                        urgency: "low",
                        assigned: {
                            name: "Alex",
                            avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
                        },
                        channel: "email",
                    },
                ],
            };
        }

        setCards(newCards);
    }, [activities, userPlan]);

    // Initialize with demo cards immediately
    useEffect(() => {
        if (
            cards.todo.length === 0 &&
            cards.inProgress.length === 0 &&
            cards.done.length === 0
        ) {
            const demoCards = {
                todo: [
                    {
                        id: "demo-1",
                        title: "Product inquiry from John",
                        description:
                            "Customer asking about product availability and pricing",
                        urgency: "high" as const,
                        assigned: {
                            name: "Alex",
                            avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
                        },
                        channel: "whatsapp" as const,
                    },
                    {
                        id: "demo-2",
                        title: "Support request from Sarah",
                        description: "Issue with recent order #12345",
                        urgency: "medium" as const,
                        channel: "email" as const,
                    },
                ],
                inProgress: [
                    {
                        id: "demo-3",
                        title: "Quote request from Budi",
                        description: "Needs pricing for bulk order",
                        urgency: "medium" as const,
                        assigned: {
                            name: "Maya",
                            avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Maya",
                        },
                        dueDate: "2024-06-15",
                        channel: "whatsapp" as const,
                    },
                ],
                done: [
                    {
                        id: "demo-4",
                        title: "Feedback from Andi",
                        description: "Positive review about recent service",
                        urgency: "low" as const,
                        assigned: {
                            name: "Alex",
                            avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
                        },
                        channel: "email" as const,
                    },
                ],
            };
            setCards(demoCards);
        }
    }, []);
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
        dueDate: "",
    });

    // Handle drag start
    const handleDragStart = (card: KanbanCard, column: KanbanColumn) => {
        setDraggedCard(card);
        setDraggedFrom(column);
    };

    // Handle drag over
    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
    };

    // Handle drop
    const handleDrop = (targetColumn: KanbanColumn) => {
        if (!draggedCard || !draggedFrom) return;

        // Update activity in context if it's a real activity (not demo)
        if (!draggedCard.id.startsWith("demo-")) {
            const activity = activities.find((a) => a.id === draggedCard.id);
            if (activity) {
                const newStatus =
                    targetColumn === "todo"
                        ? "pending"
                        : targetColumn === "inProgress"
                        ? "in_progress"
                        : "completed";
                updateActivity(draggedCard.id, {
                    kanbanColumn: targetColumn,
                    status: newStatus as
                        | "pending"
                        | "in_progress"
                        | "completed",
                });
            }
        }

        // Remove from source column
        const updatedCards = {
            ...cards,
            [draggedFrom]: cards[draggedFrom].filter(
                (card) => card.id !== draggedCard.id
            ),
        };

        // Add to target column
        updatedCards[targetColumn] = [
            ...updatedCards[targetColumn],
            draggedCard,
        ];

        setCards(updatedCards);
        setDraggedCard(null);
        setDraggedFrom(null);
    };

    // Open card detail
    const openCardDetail = (card: KanbanCard) => {
        setSelectedCard(card);
        setIsDetailOpen(true);
    };

    // Handle new card creation
    const handleCreateCard = () => {
        if (!newCard.title) return;

        const cardToAdd: KanbanCard = {
            id: `new-${Date.now()}`,
            title: newCard.title,
            description: newCard.description || "",
            channel: newCard.channel as "whatsapp" | "email",
            urgency: newCard.urgency as "low" | "medium" | "high",
            dueDate: newCard.dueDate,
        };

        setCards({
            ...cards,
            todo: [...cards.todo, cardToAdd],
        });

        setNewCard({
            title: "",
            description: "",
            channel: "whatsapp",
            urgency: "medium",
            dueDate: "",
        });

        setIsNewCardOpen(false);
    };

    // Render urgency badge
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

    // Render channel badge
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

    const formatDueDate = (dueDate: string) => {
        const date = new Date(dueDate);
        const now = new Date();
        const diffTime = date.getTime() - now.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays < 0)
            return {
                text: `${Math.abs(diffDays)}d overdue`,
                color: "text-red-600",
            };
        if (diffDays === 0)
            return { text: "Due today", color: "text-orange-600" };
        if (diffDays === 1)
            return { text: "Due tomorrow", color: "text-yellow-600" };
        return { text: `${diffDays}d left`, color: "text-gray-600" };
    };

    return (
        <div className="p-6 bg-white min-h-screen">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold">Kanban Board</h1>
                    <p className="text-muted-foreground">
                        Manage your tasks and activities
                    </p>
                </div>
                <Button onClick={() => setIsNewCardOpen(true)}>Add Task</Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-[calc(100vh-180px)]">
                {/* To Do Column */}
                <div
                    className="bg-slate-50 rounded-lg p-4 overflow-y-auto"
                    onDragOver={handleDragOver}
                    onDrop={() => handleDrop("todo")}
                >
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="font-semibold text-lg">To Do</h2>
                        <Badge variant="outline">{cards.todo.length}</Badge>
                    </div>

                    {cards.todo.map((card) => (
                        <motion.div
                            key={card.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                            className="mb-3"
                        >
                            <Card
                                className="cursor-pointer hover:shadow-md transition-shadow"
                                draggable
                                onDragStart={() =>
                                    handleDragStart(card, "todo")
                                }
                                onClick={() => openCardDetail(card)}
                            >
                                <CardHeader className="p-3 pb-0">
                                    <div className="flex justify-between">
                                        <CardTitle className="text-sm font-medium">
                                            {card.title}
                                        </CardTitle>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-3 pt-2">
                                    <div className="flex flex-wrap gap-2 mb-2">
                                        {card.channel &&
                                            renderChannelBadge(card.channel)}
                                        {renderUrgencyBadge(card.urgency)}
                                    </div>
                                    <div className="flex justify-between items-center mt-2">
                                        {card.assigned && (
                                            <div className="flex items-center">
                                                <Avatar className="h-6 w-6 mr-1">
                                                    <AvatarImage
                                                        src={
                                                            card.assigned.avatar
                                                        }
                                                    />
                                                    <AvatarFallback>
                                                        {card.assigned.name.charAt(
                                                            0
                                                        )}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <span className="text-xs text-muted-foreground">
                                                    {card.assigned.name}
                                                </span>
                                            </div>
                                        )}

                                        {card.dueDate &&
                                            userPlan !== "free" && (
                                                <div className="flex items-center text-xs text-muted-foreground">
                                                    <Calendar className="h-3 w-3 mr-1" />
                                                    <span>{card.dueDate}</span>
                                                </div>
                                            )}
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>

                {/* In Progress Column */}
                <div
                    className="bg-slate-50 rounded-lg p-4 overflow-y-auto"
                    onDragOver={handleDragOver}
                    onDrop={() => handleDrop("inProgress")}
                >
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="font-semibold text-lg">In Progress</h2>
                        <Badge variant="outline">
                            {cards.inProgress.length}
                        </Badge>
                    </div>

                    {cards.inProgress.map((card) => (
                        <motion.div
                            key={card.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                            className="mb-3"
                        >
                            <Card
                                className="cursor-pointer hover:shadow-md transition-shadow"
                                draggable
                                onDragStart={() =>
                                    handleDragStart(card, "inProgress")
                                }
                                onClick={() => openCardDetail(card)}
                            >
                                <CardHeader className="p-3 pb-0">
                                    <div className="flex justify-between">
                                        <CardTitle className="text-sm font-medium">
                                            {card.title}
                                        </CardTitle>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-3 pt-2">
                                    <div className="flex flex-wrap gap-2 mb-2">
                                        {card.channel &&
                                            renderChannelBadge(card.channel)}
                                        {renderUrgencyBadge(card.urgency)}
                                    </div>
                                    <div className="flex justify-between items-center mt-2">
                                        {card.assigned && (
                                            <div className="flex items-center">
                                                <Avatar className="h-6 w-6 mr-1">
                                                    <AvatarImage
                                                        src={
                                                            card.assigned.avatar
                                                        }
                                                    />
                                                    <AvatarFallback>
                                                        {card.assigned.name.charAt(
                                                            0
                                                        )}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <span className="text-xs text-muted-foreground">
                                                    {card.assigned.name}
                                                </span>
                                            </div>
                                        )}

                                        {card.dueDate &&
                                            (userPlan === "starter" ||
                                                userPlan === "professional" ||
                                                userPlan === "enterprise") && (
                                                <TooltipProvider>
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <div className="flex items-center text-xs text-muted-foreground">
                                                                <Calendar className="h-3 w-3 mr-1" />
                                                                <span>
                                                                    {
                                                                        formatDueDate(
                                                                            card.dueDate
                                                                        ).text
                                                                    }
                                                                </span>
                                                            </div>
                                                        </TooltipTrigger>
                                                        <TooltipContent>
                                                            <p>
                                                                Due date:{" "}
                                                                {card.dueDate}
                                                            </p>
                                                        </TooltipContent>
                                                    </Tooltip>
                                                </TooltipProvider>
                                            )}
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>

                {/* Done Column */}
                <div
                    className="bg-slate-50 rounded-lg p-4 overflow-y-auto"
                    onDragOver={handleDragOver}
                    onDrop={() => handleDrop("done")}
                >
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="font-semibold text-lg">Done</h2>
                        <Badge variant="outline">{cards.done.length}</Badge>
                    </div>

                    {cards.done.map((card) => (
                        <motion.div
                            key={card.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                            className="mb-3"
                        >
                            <Card
                                className="cursor-pointer hover:shadow-md transition-shadow"
                                draggable
                                onDragStart={() =>
                                    handleDragStart(card, "done")
                                }
                                onClick={() => openCardDetail(card)}
                            >
                                <CardHeader className="p-3 pb-0">
                                    <div className="flex justify-between">
                                        <CardTitle className="text-sm font-medium">
                                            {card.title}
                                        </CardTitle>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-3 pt-2">
                                    <div className="flex flex-wrap gap-2 mb-2">
                                        {card.channel &&
                                            renderChannelBadge(card.channel)}
                                        {renderUrgencyBadge(card.urgency)}
                                    </div>
                                    <div className="flex justify-between items-center mt-2">
                                        {card.assigned && (
                                            <div className="flex items-center">
                                                <Avatar className="h-6 w-6 mr-1">
                                                    <AvatarImage
                                                        src={
                                                            card.assigned.avatar
                                                        }
                                                    />
                                                    <AvatarFallback>
                                                        {card.assigned.name.charAt(
                                                            0
                                                        )}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <span className="text-xs text-muted-foreground">
                                                    {card.assigned.name}
                                                </span>
                                            </div>
                                        )}

                                        {card.dueDate &&
                                            (userPlan === "starter" ||
                                                userPlan === "professional" ||
                                                userPlan === "enterprise") && (
                                                <div className="flex items-center text-xs text-muted-foreground">
                                                    <Calendar className="h-3 w-3 mr-1" />
                                                    <span>
                                                        {
                                                            formatDueDate(
                                                                card.dueDate
                                                            ).text
                                                        }
                                                    </span>
                                                </div>
                                            )}
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Card Detail Dialog */}
            {selectedCard && (
                <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
                    <DialogContent className="sm:max-w-[500px]">
                        <DialogHeader>
                            <DialogTitle>{selectedCard.title}</DialogTitle>
                            <DialogDescription className="flex gap-2 mt-2">
                                {renderChannelBadge(selectedCard.channel)}
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

                            {selectedCard.assigned && (
                                <div>
                                    <h4 className="text-sm font-medium mb-2">
                                        Assigned to
                                    </h4>
                                    <div className="flex items-center">
                                        <Avatar className="h-8 w-8 mr-2">
                                            <AvatarImage
                                                src={
                                                    selectedCard.assigned.avatar
                                                }
                                            />
                                            <AvatarFallback>
                                                {selectedCard.assigned.name.charAt(
                                                    0
                                                )}
                                            </AvatarFallback>
                                        </Avatar>
                                        <span>
                                            {selectedCard.assigned.name}
                                        </span>
                                    </div>
                                </div>
                            )}

                            {selectedCard.dueDate && (
                                <div>
                                    <h4 className="text-sm font-medium mb-2">
                                        Due Date
                                    </h4>
                                    {userPlan === "starter" ||
                                    userPlan === "professional" ||
                                    userPlan === "enterprise" ? (
                                        <div className="flex items-center">
                                            <Calendar className="h-4 w-4 mr-2" />
                                            <span>{selectedCard.dueDate}</span>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col gap-2">
                                            <p className="text-sm text-muted-foreground">
                                                Due dates are available on
                                                Starter plan and above
                                            </p>
                                            <Button
                                                size="sm"
                                                onClick={onUpgradeClick}
                                            >
                                                Upgrade Now
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            )}

                            {selectedCard.messageId && (
                                <div>
                                    <h4 className="text-sm font-medium mb-2">
                                        Original Message
                                    </h4>
                                    <Button variant="outline" size="sm">
                                        View Message
                                    </Button>
                                </div>
                            )}

                            <div>
                                <h4 className="text-sm font-medium mb-2">
                                    Add Note
                                </h4>
                                <Textarea placeholder="Add a note about this card..." />
                            </div>
                        </div>

                        <DialogFooter>
                            <Button
                                variant="outline"
                                onClick={() => setIsDetailOpen(false)}
                            >
                                Close
                            </Button>
                            <Button>Save Changes</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            )}

            {/* New Card Dialog */}
            <Dialog open={isNewCardOpen} onOpenChange={setIsNewCardOpen}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>Create New Card</DialogTitle>
                        <DialogDescription>
                            Add a new card to your Kanban board. It will be
                            placed in the To Do column.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-4 py-4">
                        <div>
                            <h4 className="text-sm font-medium mb-2">Title</h4>
                            <Input
                                placeholder="Card title"
                                value={newCard.title}
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
                                value={newCard.description}
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
                                    value={newCard.channel}
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
                                    value={newCard.urgency}
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

                        {(userPlan === "starter" ||
                            userPlan === "professional" ||
                            userPlan === "enterprise") && (
                            <div>
                                <h4 className="text-sm font-medium mb-2">
                                    Due Date
                                </h4>
                                <Input
                                    type="date"
                                    value={newCard.dueDate}
                                    onChange={(e) =>
                                        setNewCard({
                                            ...newCard,
                                            dueDate: e.target.value,
                                        })
                                    }
                                />
                            </div>
                        )}
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
