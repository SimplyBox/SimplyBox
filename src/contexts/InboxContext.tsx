import React, { createContext, useContext } from "react";
import { useAuth } from "./AuthContext";
import { useTagService } from "@/services/tags";
import { useInboxService } from "@/services/inbox";
import { useWhatsAppService } from "@/services/wa";
import { useInstagramService } from "@/services/ig";
import { useFacebookService } from "@/services/fb";
import { InboxContextType } from "@/types";

const InboxContext = createContext<InboxContextType | undefined>(undefined);

export const useInbox = () => {
    const context = useContext(InboxContext);
    if (context === undefined) {
        throw new Error("useInbox must be used within an InboxProvider");
    }
    return context;
};

export const InboxProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const { company } = useAuth();
    const {
        conversations,
        selectedConversation,
        setSelectedConversation,
        loading,
        togglePinConversation,
        toggleAutoRespond,
        markConversationAsRead,
        deleteConversation,
        updateContact,
        setConversations,
    } = useInboxService(company?.id);
    const {
        availableTags,
        tagsLoading,
        tags,
        tagError,
        newTagName,
        newTagColor,
        editingTag,
        editingValue,
        editingColor,
        setNewTagName,
        setNewTagColor,
        setEditingTag,
        setEditingValue,
        setEditingColor,
        handleAddTag,
        handleEditTag,
        handleSaveEdit,
        handleDeleteTag,
        handleChangeTagColor,
        handleSaveTagChanges,
        handleResetTags,
    } = useTagService(company?.id);
    const { sendMessage: sendWaMessage } = useWhatsAppService(
        company?.id,
        selectedConversation,
        conversations,
        setConversations
    );
    const { sendMessage: sendIgMessage } = useInstagramService(
        company?.id,
        selectedConversation,
        conversations,
        setConversations
    );
    const { sendMessage: sendFbMessage } = useFacebookService(
        company?.id,
        selectedConversation,
        conversations,
        setConversations
    );

    const sendMessage = async (content: string) => {
        if (!selectedConversation) throw new Error("No conversation selected");

        const conversation = conversations.find(
            (c) => c.id === selectedConversation
        );
        if (!conversation) throw new Error("Conversation not found");

        if (conversation.channel === "whatsapp") {
            return sendWaMessage(content);
        } else if (conversation.channel === "instagram") {
            return sendIgMessage(content);
        } else if (conversation.channel === "facebook") {
            return sendFbMessage(content);
        } else {
            console.error(
                "Cannot send message: Unknown channel",
                conversation.channel
            );
            throw new Error("Unknown channel");
        }
    };

    const value: InboxContextType = {
        conversations,
        selectedConversation,
        setSelectedConversation,
        sendMessage,
        togglePinConversation,
        toggleAutoRespond,
        markConversationAsRead,
        deleteConversation,
        updateContact,
        loading,
        availableTags,
        tagsLoading,
        tags,
        tagError,
        newTagName,
        newTagColor,
        editingTag,
        editingValue,
        editingColor,
        setNewTagName,
        setNewTagColor,
        setEditingTag,
        setEditingValue,
        setEditingColor,
        handleAddTag,
        handleEditTag,
        handleSaveEdit,
        handleDeleteTag,
        handleChangeTagColor,
        handleSaveTagChanges,
        handleResetTags,
    };

    return (
        <InboxContext.Provider value={value}>{children}</InboxContext.Provider>
    );
};
