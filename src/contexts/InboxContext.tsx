import React, { createContext, useContext } from "react";
import { useAuth } from "./AuthContext";
import { useTagService } from "@/services/tags";
import { useInboxService } from "@/services/inbox";
import { useWhatsAppService } from "@/services/wa";
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
        deleteConversation,
        updateContact,
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
    const { sendMessage } = useWhatsAppService(
        company?.id,
        selectedConversation,
        conversations,
        (conversations) => conversations
    );

    const value: InboxContextType = {
        conversations,
        selectedConversation,
        setSelectedConversation,
        sendMessage,
        togglePinConversation,
        toggleAutoRespond,
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
