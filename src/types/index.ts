export interface Message {
    id: string;
    contact_id: string;
    message: string;
    media_url: string | null;
    media_type: string | null;
    direction: string;
    message_sid: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface Contact {
    id: string;
    company_id: string;
    channel: string;
    identifier: string;
    name: string;
    auto_respond: boolean;
    pinned: boolean;
    tags: string[];
    created_at: string;
    updated_at: string;
    notes?: string;
}

export interface Conversation {
    id: string;
    contact: Contact;
    messages: Message[];
    lastMessage: string;
    isPinned: boolean;
    channel: string;
    status: string;
}

export interface Tag {
    id: string;
    name: string;
    color?: string;
    isGlobal?: boolean;
    isNew?: boolean;
    isDeleted?: boolean;
}

export interface Subscription {
    id: string;
    company_id: string;
    tier: "free" | "starter" | "professional" | "enterprise";
    status: "active" | "inactive";
    start_date: string;
    end_date: string;
    billing_cycle: "monthly" | "annual" | null;
    price_amount: number;
    payment_method: string | null;
    auto_renew: boolean;
    created_at: string;
    usage: {
        messages_used: number;
        team_members_used: number;
        files_used: number;
        messages_limit: number;
        team_members_limit: number;
        files_limit: number;
    } | null;
}

export interface TeamMember {
    id: string;
    user_id: string;
    company_id: string;
    role: "owner" | "admin";
    created_at: string;
    name?: string;
    email?: string;
    phone?: string;
}

export interface InvitationData {
    email: string;
    companyId: string;
    role: "admin" | "owner";
    type: string;
    expires: number;
    created: number;
}

export interface InboxContextType {
    conversations: Conversation[];
    selectedConversation: string | null;
    setSelectedConversation: (id: string | null) => void;
    sendMessage: (content: string) => Promise<void>;
    togglePinConversation: (id: string) => Promise<void>;
    toggleAutoRespond: (id: string) => Promise<void>;
    deleteConversation: (id: string) => Promise<void>;
    updateContact: (id: string, updates: Partial<Contact>) => Promise<void>;
    loading: boolean;
    availableTags: string[];
    tagsLoading: boolean;
    tags: Tag[];
    tagError: string | null;
    newTagName: string;
    newTagColor: string;
    editingTag: string | null;
    editingValue: string;
    editingColor: string;
    setNewTagName: (name: string) => void;
    setNewTagColor: (color: string) => void;
    setEditingTag: (tagId: string | null) => void;
    setEditingValue: (value: string) => void;
    setEditingColor: (color: string) => void;
    handleAddTag: () => void;
    handleEditTag: (
        tagId: string,
        currentName: string,
        currentColor: string
    ) => void;
    handleSaveEdit: () => void;
    handleDeleteTag: (tagId: string, tagName: string) => void;
    handleChangeTagColor: (tagId: string, color: string) => void;
    handleSaveTagChanges: () => Promise<void>;
    handleResetTags: () => void;
}

export interface SubscriptionContextType {
    subscription: Subscription | null;
    refreshSubscription: () => Promise<void>;
    updateSubscription: (
        subscriptionData: Partial<Subscription>
    ) => Promise<void>;
}

export interface TeamContextType {
    teamMembers: TeamMember[] | null;
    currentTeamMember: TeamMember | null;
    loading: boolean;
    refreshTeamMembers: () => Promise<void>;
    inviteTeamMember: (
        email: string,
        role: "admin"
    ) => Promise<{ success: boolean; error?: string }>;
    verifyInvitationToken: (token: string) => Promise<{
        success: boolean;
        data?: InvitationData;
        error?: string;
    }>;
    acceptInvitation: (params: {
        token: string;
        invitationData: InvitationData;
        userData: {
            name: string;
            phone: string;
            password: string;
        };
    }) => Promise<{
        success: boolean;
        error?: string;
        needsVerification?: boolean;
    }>;
    removeTeamMember: (userId: string) => Promise<{
        success: boolean;
        error?: string;
    }>;
    isOwner: () => boolean;
    isAdmin: () => boolean;
}
