import React, { useRef, useEffect, useState } from "react";
import { useInbox } from "@/contexts/InboxContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useNavigate, useSearchParams } from "react-router-dom";
import { getDateLabel } from "@/utils/date";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
    Send,
    Pin,
    Trash2,
    MessageSquare,
    MoreVertical,
    Zap,
    RefreshCw,
    Search,
    Instagram,
    AlertTriangle,
    ArrowLeft,
    Facebook,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
    DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";

interface InteractiveInboxProps {
    conversationId?: string;
}

const InteractiveInbox: React.FC<InteractiveInboxProps> = ({
    conversationId,
}) => {
    const {
        conversations,
        selectedConversation,
        setSelectedConversation,
        sendMessage,
        togglePinConversation,
        toggleAutoRespond,
        markConversationAsRead,
        deleteConversation,
        loading,
    } = useInbox();
    const { t } = useLanguage();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [messageText, setMessageText] = React.useState("");
    const [filter, setFilter] = React.useState<"all" | "pinned">("all");
    const [channelFilter, setChannelFilter] = React.useState<
        "all" | "whatsapp" | "instagram" | "facebook"
    >("all");
    const [searchQuery, setSearchQuery] = useState("");
    const [isSending, setIsSending] = React.useState(false);
    const [viewingImage, setViewingImage] = useState<string | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (
            conversationId &&
            conversations.some((c) => c.id === conversationId)
        ) {
            setSelectedConversation(conversationId);
        } else {
            const paramConversationId = searchParams.get("conversation");
            if (
                paramConversationId &&
                conversations.some((c) => c.id === paramConversationId)
            ) {
                setSelectedConversation(paramConversationId);
            }
        }
    }, [conversationId, searchParams, conversations, setSelectedConversation]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [selectedConversation, conversations]);

    const sortedConversations = [...conversations].sort((a, b) => {
        if (a.isPinned && !b.isPinned) return -1;
        if (!a.isPinned && b.isPinned) return 1;
        return (
            new Date(b.lastMessage).getTime() -
            new Date(a.lastMessage).getTime()
        );
    });

    const filteredConversations = sortedConversations.filter((conv) => {
        const matchesFilter = filter === "pinned" ? conv.isPinned : true;
        const matchesChannel =
            channelFilter === "all" || conv.channel === channelFilter;
        const matchesSearch = conv.contact.name
            .toLowerCase()
            .includes(searchQuery.toLowerCase());
        return matchesFilter && matchesChannel && matchesSearch;
    });

    const getChannelIcon = (channel: string) => {
        switch (channel) {
            case "whatsapp":
                return <MessageSquare className="h-4 w-4 text-green-600" />;
            case "instagram":
                return <Instagram className="h-4 w-4 text-purple-600" />;
            case "facebook":
                return <Facebook className="h-4 w-4 text-blue-600" />;
            default:
                return <MessageSquare className="h-4 w-4" />;
        }
    };

    const selectedConv = conversations.find(
        (c) => c.id === selectedConversation
    );

    const isWhatsAppWindowExpired = () => {
        if (!selectedConv || selectedConv.channel !== "whatsapp") return false;

        const lastInboundMessage = selectedConv.messages
            .filter((m) => m.direction === "inbound")
            .sort(
                (a, b) =>
                    new Date(b.created_at).getTime() -
                    new Date(a.created_at).getTime()
            )[0];

        if (!lastInboundMessage) return true;

        const lastMessageTime = new Date(
            lastInboundMessage.created_at
        ).getTime();
        const currentTime = new Date().getTime();
        const hoursDiff = (currentTime - lastMessageTime) / (1000 * 60 * 60);

        return hoursDiff > 24;
    };

    const handleSendMessage = async () => {
        if (!messageText.trim() || isSending || !selectedConv) return;

        if (selectedConv.channel === "whatsapp" && isWhatsAppWindowExpired()) {
            console.warn("Cannot send WA message: 24-hour window expired.");
            return;
        }

        setIsSending(true);
        try {
            await sendMessage(messageText);
            setMessageText("");
        } catch (error) {
            console.error("Failed to send message:", error);
        } finally {
            setIsSending(false);
        }
    };

    const handleContactClick = (contactId: string) => {
        navigate(`/dashboard?tab=contacts&contact=${contactId}`);
    };

    const handleSelectConversation = (conversationId: string) => {
        const targetConversation = conversations.find(
            (c) => c.id === conversationId
        );
        setSelectedConversation(conversationId);
        navigate(`/dashboard?tab=inbox&conversation=${conversationId}`);

        if (targetConversation && targetConversation.contact.unread_count > 0) {
            markConversationAsRead(targetConversation.contact.id);
        }
    };

    return (
        <div className="flex h-[calc(100vh-65px)] bg-gray-50">
            {/* Conversations List */}
            <div
                className={`w-full lg:w-1/3 bg-white border-r border-gray-200 flex flex-col ${
                    selectedConversation ? "hidden lg:flex" : "flex"
                }`}
            >
                <div className="p-4 border-b border-gray-200">
                    <h2 className="text-3xl font-bold mb-3">
                        {t("InboxPage.title")}
                    </h2>
                    <div className="mb-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input
                                type="text"
                                placeholder={t("InboxPage.searchPlaceholder")}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10 pr-4 py-2 w-full"
                            />
                        </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 mb-4">
                        <Button
                            variant={filter === "all" ? "default" : "ghost"}
                            size="sm"
                            onClick={() => setFilter("all")}
                            className="text-sm px-3 py-2 min-w-[60px]"
                        >
                            {t("InboxPage.filterAll")}
                        </Button>
                        <Button
                            variant={filter === "pinned" ? "default" : "ghost"}
                            size="sm"
                            onClick={() => setFilter("pinned")}
                            className="text-sm px-3 py-2 min-w-[70px]"
                        >
                            {t("InboxPage.filterPinned")}
                        </Button>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="text-sm px-3 py-2 min-w-[100px]"
                                >
                                    {t(
                                        `InboxPage.filterChannel${
                                            channelFilter
                                                .charAt(0)
                                                .toUpperCase() +
                                            channelFilter.slice(1)
                                        }`
                                    )}
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DropdownMenuLabel>
                                    {t("InboxPage.filterChannel")}
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                    onClick={() => setChannelFilter("all")}
                                >
                                    {t("InboxPage.filterChannelAll")}
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onClick={() => setChannelFilter("whatsapp")}
                                >
                                    {t("InboxPage.filterChannelWhatsapp")}
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onClick={() =>
                                        setChannelFilter("instagram")
                                    }
                                >
                                    {t("InboxPage.filterChannelInstagram")}
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onClick={() => setChannelFilter("facebook")}
                                >
                                    {t("InboxPage.filterChannelFacebook")}
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto">
                    {loading ? (
                        <div className="p-4 text-center text-gray-500">
                            {t("InboxPage.loadingConversations")}
                        </div>
                    ) : filteredConversations.length === 0 ? (
                        <div className="p-4 text-center text-gray-500">
                            {t("InboxPage.noConversations")}
                        </div>
                    ) : (
                        <AnimatePresence>
                            {filteredConversations.map((conversation) => (
                                <motion.div
                                    key={conversation.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                                        selectedConversation === conversation.id
                                            ? "bg-blue-50 border-l-4 border-l-blue-500"
                                            : ""
                                    }`}
                                    onClick={() =>
                                        handleSelectConversation(
                                            conversation.id
                                        )
                                    }
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-start space-x-3 flex-1">
                                            <Avatar
                                                className="h-10 w-10 cursor-pointer"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleContactClick(
                                                        conversation.contact.id
                                                    );
                                                }}
                                            >
                                                <AvatarFallback>
                                                    {conversation.contact.name.charAt(
                                                        0
                                                    )}
                                                </AvatarFallback>
                                            </Avatar>

                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center justify-between">
                                                    <h3
                                                        className="text-sm font-medium truncate cursor-pointer"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleContactClick(
                                                                conversation
                                                                    .contact.id
                                                            );
                                                        }}
                                                    >
                                                        {
                                                            conversation.contact
                                                                .name
                                                        }
                                                    </h3>
                                                    <div className="flex items-center space-x-1">
                                                        {getChannelIcon(
                                                            conversation.channel
                                                        )}
                                                        {conversation.isPinned && (
                                                            <Pin className="h-3 w-3 text-blue-500 fill-current" />
                                                        )}
                                                    </div>
                                                </div>

                                                <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                                                    {conversation.messages[0]
                                                        ?.message ||
                                                        t(
                                                            "InboxPage.noMessages"
                                                        )}
                                                </p>

                                                <div className="flex items-center justify-between mt-2">
                                                    <span className="text-xs text-gray-500">
                                                        {new Date(
                                                            conversation.lastMessage
                                                        ).toLocaleTimeString(
                                                            [],
                                                            {
                                                                hour: "2-digit",
                                                                minute: "2-digit",
                                                            }
                                                        )}
                                                    </span>

                                                    <div className="flex items-center space-x-1">
                                                        {conversation.contact
                                                            .unread_count >
                                                            0 && (
                                                            <motion.div
                                                                initial={{
                                                                    scale: 0.5,
                                                                    opacity: 0,
                                                                }}
                                                                animate={{
                                                                    scale: 1,
                                                                    opacity: 1,
                                                                }}
                                                                transition={{
                                                                    type: "spring",
                                                                    stiffness: 500,
                                                                    damping: 30,
                                                                }}
                                                            >
                                                                <Badge
                                                                    variant="default"
                                                                    className="bg-blue-600 text-white text-xs h-5 w-5 rounded-full flex items-center justify-center pointer-events-none"
                                                                >
                                                                    {
                                                                        conversation
                                                                            .contact
                                                                            .unread_count
                                                                    }
                                                                </Badge>
                                                            </motion.div>
                                                        )}
                                                        <DropdownMenu>
                                                            <DropdownMenuTrigger
                                                                asChild
                                                            >
                                                                <Button
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    className="h-6 w-6 p-0"
                                                                >
                                                                    <MoreVertical className="h-3 w-3" />
                                                                </Button>
                                                            </DropdownMenuTrigger>
                                                            <DropdownMenuContent align="end">
                                                                <DropdownMenuItem
                                                                    onClick={(
                                                                        e
                                                                    ) => {
                                                                        e.stopPropagation();
                                                                        togglePinConversation(
                                                                            conversation.id
                                                                        );
                                                                    }}
                                                                >
                                                                    <Pin className="h-4 w-4 mr-2" />
                                                                    {conversation.isPinned
                                                                        ? t(
                                                                              "InboxPage.unpin"
                                                                          )
                                                                        : t(
                                                                              "InboxPage.pin"
                                                                          )}
                                                                </DropdownMenuItem>
                                                                <DropdownMenuSeparator />
                                                                <DropdownMenuItem
                                                                    onClick={(
                                                                        e
                                                                    ) => {
                                                                        e.stopPropagation();
                                                                        deleteConversation(
                                                                            conversation.id
                                                                        );
                                                                    }}
                                                                    className="text-red-600"
                                                                >
                                                                    <Trash2 className="h-4 w-4 mr-2" />
                                                                    {t(
                                                                        "InboxPage.delete"
                                                                    )}
                                                                </DropdownMenuItem>
                                                            </DropdownMenuContent>
                                                        </DropdownMenu>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    )}
                </div>
            </div>

            {/* Chat Area */}
            {/* 3. className diubah untuk responsif */}
            <div
                className={`flex-1 flex flex-col ${
                    selectedConversation ? "flex" : "hidden lg:flex"
                }`}
            >
                {selectedConv ? (
                    <>
                        {/* Chat Header */}
                        <div className="bg-white border-b border-gray-200 p-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                    {/* 4. Tombol "Back" ditambahkan */}
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="lg:hidden"
                                        onClick={() => {
                                            setSelectedConversation(null);
                                            navigate("/dashboard?tab=inbox");
                                        }}
                                    >
                                        <ArrowLeft className="h-5 w-5" />
                                    </Button>

                                    <Avatar
                                        className="h-10 w-10 cursor-pointer"
                                        onClick={() =>
                                            handleContactClick(
                                                selectedConv.contact.id
                                            )
                                        }
                                    >
                                        <AvatarFallback>
                                            {selectedConv.contact.name.charAt(
                                                0
                                            )}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <h3
                                            className="font-semibold cursor-pointer"
                                            onClick={() =>
                                                handleContactClick(
                                                    selectedConv.contact.id
                                                )
                                            }
                                        >
                                            {selectedConv.contact.name}
                                        </h3>
                                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                                            {getChannelIcon(
                                                selectedConv.channel
                                            )}
                                            <span>
                                                {
                                                    selectedConv.contact
                                                        .identifier
                                                }
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-2">
                                    <div className="hidden md:flex items-center gap-3">
                                        <span className="text-gray-600 text-xs">
                                            {t("InboxPage.autoRespond")}
                                        </span>
                                        <div className="flex bg-gray-100 rounded-full p-1">
                                            <button
                                                onClick={() =>
                                                    toggleAutoRespond(
                                                        selectedConv.id
                                                    )
                                                }
                                                className={`px-2 py-0.5 rounded-full text-xs font-medium transition-colors ${
                                                    selectedConv.contact
                                                        .auto_respond
                                                        ? "bg-blue-500 text-white"
                                                        : "text-gray-600"
                                                }`}
                                            >
                                                {t("InboxPage.autoRespondOn")}
                                            </button>
                                            <button
                                                onClick={() =>
                                                    toggleAutoRespond(
                                                        selectedConv.id
                                                    )
                                                }
                                                className={`px-2 py-0.5 rounded-full text-xs font-medium transition-colors ${
                                                    !selectedConv.contact
                                                        .auto_respond
                                                        ? "bg-blue-500 text-white"
                                                        : "text-gray-600"
                                                }`}
                                            >
                                                {t("InboxPage.autoRespondOff")}
                                            </button>
                                        </div>
                                    </div>

                                    <Badge
                                        variant={
                                            selectedConv.status === "read"
                                                ? "default"
                                                : "secondary"
                                        }
                                    >
                                        {t(
                                            `InboxPage.status.${selectedConv.status}`
                                        )}
                                    </Badge>

                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="h-8 w-8 p-0"
                                            >
                                                <MoreVertical className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem
                                                onClick={() =>
                                                    togglePinConversation(
                                                        selectedConv.id
                                                    )
                                                }
                                            >
                                                <Pin
                                                    className={`h-4 w-4 mr-2 ${
                                                        selectedConv.isPinned
                                                            ? "fill-blue-400 text-blue-400"
                                                            : ""
                                                    }`}
                                                />
                                                {selectedConv.isPinned
                                                    ? t("InboxPage.unpin")
                                                    : t("InboxPage.pin")}
                                            </DropdownMenuItem>

                                            <DropdownMenuSeparator className="md:hidden" />
                                            <DropdownMenuItem
                                                className="md:hidden"
                                                onClick={() =>
                                                    toggleAutoRespond(
                                                        selectedConv.id
                                                    )
                                                }
                                            >
                                                <Zap className="h-4 w-4 mr-2" />
                                                <span>
                                                    {t("InboxPage.autoRespond")}
                                                    :{" "}
                                                    {selectedConv.contact
                                                        .auto_respond
                                                        ? t(
                                                              "InboxPage.autoRespondOn"
                                                          )
                                                        : t(
                                                              "InboxPage.autoRespondOff"
                                                          )}
                                                </span>
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator />

                                            <DropdownMenuItem
                                                onClick={() =>
                                                    deleteConversation(
                                                        selectedConv.id
                                                    )
                                                }
                                                className="text-red-600"
                                            >
                                                <Trash2 className="h-4 w-4 mr-2" />
                                                {t("InboxPage.delete")}
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                            </div>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                            {selectedConv.messages.length > 0 ? (
                                (() => {
                                    const messagesByDate: {
                                        [
                                            key: string
                                        ]: typeof selectedConv.messages;
                                    } = {};
                                    selectedConv.messages
                                        .slice()
                                        .reverse()
                                        .forEach((message) => {
                                            const date = new Date(
                                                message.created_at
                                            );
                                            const dateKey = date.toDateString();
                                            if (!messagesByDate[dateKey]) {
                                                messagesByDate[dateKey] = [];
                                            }
                                            messagesByDate[dateKey].push(
                                                message
                                            );
                                        });

                                    return Object.entries(messagesByDate).map(
                                        ([dateKey, messages]) => (
                                            <div
                                                key={dateKey}
                                                className="space-y-2"
                                            >
                                                <div className="text-center my-4">
                                                    <span className="inline-block bg-gray-200 text-gray-700 text-xs font-medium px-3 py-1 rounded-full">
                                                        {getDateLabel(
                                                            new Date(dateKey),
                                                            t
                                                        )}
                                                    </span>
                                                </div>
                                                {messages.map((message) => (
                                                    <motion.div
                                                        key={message.id}
                                                        initial={{
                                                            opacity: 0,
                                                            y: 10,
                                                        }}
                                                        animate={{
                                                            opacity: 1,
                                                            y: 0,
                                                        }}
                                                        className={`flex ${
                                                            message.direction ===
                                                            "inbound"
                                                                ? "justify-start"
                                                                : "justify-end"
                                                        }`}
                                                    >
                                                        <div
                                                            className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                                                                message.direction ===
                                                                "outbound"
                                                                    ? "bg-blue-500 text-white"
                                                                    : "bg-white border border-gray-200"
                                                            }`}
                                                        >
                                                            <>
                                                                {message.media_url &&
                                                                    message.media_type?.startsWith(
                                                                        "image/"
                                                                    ) && (
                                                                        <img
                                                                            src={
                                                                                message.media_url
                                                                            }
                                                                            className={`rounded-lg max-w-[300px] max-h-[300px] w-auto object-cover cursor-pointer transition-all hover:brightness-90 ${
                                                                                message.message &&
                                                                                message.message !==
                                                                                    "[User sent an image]"
                                                                                    ? "mb-2"
                                                                                    : ""
                                                                            }`}
                                                                            onClick={() =>
                                                                                setViewingImage(
                                                                                    message.media_url
                                                                                )
                                                                            }
                                                                        />
                                                                    )}

                                                                {(!message.media_url ||
                                                                    (message.message &&
                                                                        message.message !==
                                                                            "[Image]")) && (
                                                                    <p className="text-sm">
                                                                        {message.message
                                                                            .split(
                                                                                "\n"
                                                                            )
                                                                            .map(
                                                                                (
                                                                                    line,
                                                                                    index
                                                                                ) => (
                                                                                    <span
                                                                                        key={
                                                                                            index
                                                                                        }
                                                                                    >
                                                                                        {
                                                                                            line
                                                                                        }
                                                                                        {index <
                                                                                            message.message.split(
                                                                                                "\n"
                                                                                            )
                                                                                                .length -
                                                                                                1 && (
                                                                                            <br />
                                                                                        )}
                                                                                    </span>
                                                                                )
                                                                            )}
                                                                    </p>
                                                                )}
                                                            </>
                                                            <div className="flex items-center justify-between mt-1">
                                                                <span
                                                                    className={`text-xs ${
                                                                        message.direction ===
                                                                        "outbound"
                                                                            ? "text-blue-100"
                                                                            : "text-gray-500"
                                                                    }`}
                                                                >
                                                                    {new Date(
                                                                        message.created_at
                                                                    ).toLocaleTimeString(
                                                                        [],
                                                                        {
                                                                            hour: "2-digit",
                                                                            minute: "2-digit",
                                                                        }
                                                                    )}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </motion.div>
                                                ))}
                                            </div>
                                        )
                                    );
                                })()
                            ) : (
                                <div className="text-center text-gray-500">
                                    {t("InboxPage.noMessages")}
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Area */}
                        <div className="bg-white border-t border-gray-200 p-4">
                            {selectedConv.channel === "whatsapp" &&
                            isWhatsAppWindowExpired() ? (
                                <div className="flex items-center space-x-2 bg-yellow-50 border border-yellow-200 p-3 rounded-lg">
                                    <AlertTriangle className="h-5 w-5 text-yellow-600" />
                                    <p className="text-sm text-yellow-800">
                                        {t("InboxPage.whatsappWindowExpired")}
                                    </p>
                                </div>
                            ) : (
                                <div className="flex items-center space-x-2">
                                    <Textarea
                                        value={messageText}
                                        onChange={(e) =>
                                            setMessageText(e.target.value)
                                        }
                                        placeholder={t(
                                            "InboxPage.messagePlaceholder"
                                        )}
                                        className="flex-1 min-h-[40px] max-h-32 resize-none"
                                        disabled={
                                            selectedConv.channel ===
                                                "whatsapp" &&
                                            isWhatsAppWindowExpired()
                                        }
                                        onKeyDown={(e) => {
                                            if (
                                                e.key === "Enter" &&
                                                !e.shiftKey
                                            ) {
                                                e.preventDefault();
                                                handleSendMessage();
                                            }
                                        }}
                                    />

                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-8 w-8 p-0"
                                        disabled
                                    >
                                        <Zap className="h-4 w-4" />
                                    </Button>

                                    <Button
                                        onClick={handleSendMessage}
                                        disabled={
                                            !messageText.trim() ||
                                            isSending ||
                                            (selectedConv.channel ===
                                                "whatsapp" &&
                                                isWhatsAppWindowExpired())
                                        }
                                        className="h-10"
                                    >
                                        {isSending ? (
                                            <motion.div
                                                animate={{ rotate: 360 }}
                                                transition={{
                                                    duration: 1,
                                                    repeat: Infinity,
                                                    ease: "linear",
                                                }}
                                            >
                                                <RefreshCw className="h-4 w-4" />
                                            </motion.div>
                                        ) : (
                                            <Send className="h-4 w-4" />
                                        )}
                                    </Button>
                                </div>
                            )}
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex items-center justify-center bg-gray-50">
                        <div className="text-center">
                            <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">
                                {t("InboxPage.selectConversationTitle")}
                            </h3>
                            <p className="text-gray-600">
                                {t("InboxPage.selectConversationDescription")}
                            </p>
                        </div>
                    </div>
                )}
            </div>
            {viewingImage && (
                <div
                    className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
                    onClick={() => setViewingImage(null)}
                >
                    <button
                        className="absolute top-4 right-4 text-white text-4xl font-bold opacity-70 hover:opacity-100 transition-opacity z-60"
                        onClick={() => setViewingImage(null)}
                    >
                        &times;
                    </button>

                    <img
                        src={viewingImage}
                        className="max-w-[90vw] max-h-[90vh] object-contain rounded-lg shadow-xl"
                        onClick={(e) => e.stopPropagation()}
                    />
                </div>
            )}
        </div>
    );
};

export default InteractiveInbox;
