import { useState, useEffect } from "react";
import supabase from "@/libs/supabase";
import { Conversation, Contact, Message } from "@/types";

export const useInboxService = (companyId: string | undefined) => {
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [selectedConversation, setSelectedConversation] = useState<
        string | null
    >(null);
    const [loading, setLoading] = useState(true);

    const fetchConversations = async () => {
        if (!companyId) {
            setLoading(false);
            return;
        }
        setLoading(true);
        try {
            const { data: contacts, error: contactsError } = await supabase
                .from("contacts")
                .select("*")
                .eq("company_id", companyId);

            if (contactsError) throw contactsError;

            const conversationPromises = contacts.map(async (contact) => {
                const { data: messages } = await supabase
                    .from("chat_log")
                    .select("*")
                    .eq("contact_id", contact.id)
                    .order("created_at", { ascending: false });

                return {
                    id: contact.id,
                    contact,
                    messages: messages || [],
                    lastMessage:
                        messages?.[0]?.created_at || contact.created_at,
                    isPinned: contact.pinned,
                    channel: contact.channel,
                    status: messages?.[0]?.status || "pending",
                };
            });

            const fetchedConversations = await Promise.all(
                conversationPromises
            );
            setConversations(fetchedConversations);
        } catch (error) {
            console.error("Error fetching conversations:", error);
        } finally {
            setLoading(false);
        }
    };

    const togglePinConversation = async (id: string) => {
        const contact = conversations.find((c) => c.id === id)?.contact;
        if (!contact || !companyId) return;

        const newPinnedState = !contact.pinned;

        try {
            const { error } = await supabase
                .from("contacts")
                .update({ pinned: newPinnedState })
                .eq("id", id)
                .eq("company_id", companyId);

            if (error) throw error;

            setConversations((prev) =>
                prev.map((conv) =>
                    conv.id === id
                        ? {
                              ...conv,
                              contact: {
                                  ...conv.contact,
                                  pinned: newPinnedState,
                              },
                              isPinned: newPinnedState,
                          }
                        : conv
                )
            );
        } catch (error) {
            console.error("Error toggling pin:", error);
        }
    };

    const toggleAutoRespond = async (id: string) => {
        const contact = conversations.find((c) => c.id === id)?.contact;
        if (!contact || !companyId) return;

        const newAutoRespondState = !contact.auto_respond;

        try {
            const { error } = await supabase
                .from("contacts")
                .update({ auto_respond: newAutoRespondState })
                .eq("id", id)
                .eq("company_id", companyId);

            if (error) throw error;

            setConversations((prev) =>
                prev.map((conv) =>
                    conv.id === id
                        ? {
                              ...conv,
                              contact: {
                                  ...conv.contact,
                                  auto_respond: newAutoRespondState,
                              },
                          }
                        : conv
                )
            );
        } catch (error) {
            console.error("Error toggling auto respond:", error);
        }
    };

    const deleteConversation = async (id: string) => {
        if (!companyId) return;

        try {
            const { error: messagesError } = await supabase
                .from("chat_log")
                .delete()
                .eq("contact_id", id);

            if (messagesError) throw messagesError;

            const { error: contactError } = await supabase
                .from("contacts")
                .delete()
                .eq("id", id)
                .eq("company_id", companyId);

            if (contactError) throw contactError;

            setConversations((prev) => prev.filter((conv) => conv.id !== id));
            if (selectedConversation === id) {
                setSelectedConversation(null);
            }
        } catch (error) {
            console.error("Error deleting conversation:", error);
        }
    };

    const updateContact = async (id: string, updates: Partial<Contact>) => {
        if (!companyId) return;

        try {
            const { error } = await supabase
                .from("contacts")
                .update(updates)
                .eq("id", id)
                .eq("company_id", companyId);

            if (error) throw error;

            setConversations((prev) =>
                prev.map((conv) =>
                    conv.id === id
                        ? {
                              ...conv,
                              contact: { ...conv.contact, ...updates },
                              isPinned: updates.pinned ?? conv.isPinned,
                              channel: updates.channel ?? conv.channel,
                          }
                        : conv
                )
            );
        } catch (error) {
            console.error("Error updating contact:", error);
        }
    };

    useEffect(() => {
        fetchConversations();

        if (!companyId) return;

        const chatChannel = supabase
            .channel("public:chat_log")
            .on(
                "postgres_changes",
                {
                    event: "INSERT",
                    schema: "public",
                    table: "chat_log",
                },
                async (payload) => {
                    console.log("New message received:", payload.new);
                    const newMessage = payload.new as Message;

                    const { data: contact } = await supabase
                        .from("contacts")
                        .select("company_id")
                        .eq("id", newMessage.contact_id)
                        .single();

                    if (contact?.company_id !== companyId) return;

                    setConversations((prev) => {
                        return prev.map((conv) => {
                            if (conv.id === newMessage.contact_id) {
                                const messageExists = conv.messages.some(
                                    (msg) => msg.id === newMessage.id
                                );
                                if (!messageExists) {
                                    return {
                                        ...conv,
                                        messages: [
                                            newMessage,
                                            ...conv.messages,
                                        ],
                                        lastMessage: newMessage.created_at,
                                        status: newMessage.status,
                                    };
                                }
                            }
                            return conv;
                        });
                    });
                }
            )
            .on(
                "postgres_changes",
                {
                    event: "UPDATE",
                    schema: "public",
                    table: "chat_log",
                },
                async (payload) => {
                    const updatedMessage = payload.new as Message;
                    const { data: contact } = await supabase
                        .from("contacts")
                        .select("company_id")
                        .eq("id", updatedMessage.contact_id)
                        .single();

                    if (contact?.company_id !== companyId) return;

                    setConversations((prev) =>
                        prev.map((conv) => {
                            if (conv.id === updatedMessage.contact_id) {
                                return {
                                    ...conv,
                                    messages: conv.messages.map((msg) =>
                                        msg.id === updatedMessage.id
                                            ? updatedMessage
                                            : msg
                                    ),
                                    status: updatedMessage.status,
                                };
                            }
                            return conv;
                        })
                    );
                }
            )
            .subscribe();

        const contactChannel = supabase
            .channel("public:contacts")
            .on(
                "postgres_changes",
                {
                    event: "INSERT",
                    schema: "public",
                    table: "contacts",
                    filter: `company_id=eq.${companyId}`,
                },
                async (payload) => {
                    const newContact = payload.new as Contact;
                    const { data: messages } = await supabase
                        .from("chat_log")
                        .select("*")
                        .eq("contact_id", newContact.id)
                        .order("created_at", { ascending: false });

                    const newConversation: Conversation = {
                        id: newContact.id,
                        contact: newContact,
                        messages: messages || [],
                        lastMessage:
                            messages?.[0]?.created_at || newContact.created_at,
                        isPinned: newContact.pinned,
                        channel: newContact.channel,
                        status: messages?.[0]?.status || "pending",
                    };

                    setConversations((prev) => {
                        const contactExists = prev.some(
                            (conv) => conv.id === newContact.id
                        );
                        if (!contactExists) {
                            return [newConversation, ...prev];
                        }
                        return prev;
                    });
                }
            )
            .on(
                "postgres_changes",
                {
                    event: "UPDATE",
                    schema: "public",
                    table: "contacts",
                    filter: `company_id=eq.${companyId}`,
                },
                (payload) => {
                    const updatedContact = payload.new as Contact;
                    setConversations((prev) =>
                        prev.map((conv) =>
                            conv.id === updatedContact.id
                                ? {
                                      ...conv,
                                      contact: updatedContact,
                                      isPinned: updatedContact.pinned,
                                      channel: updatedContact.channel,
                                  }
                                : conv
                        )
                    );
                }
            )
            .on(
                "postgres_changes",
                {
                    event: "DELETE",
                    schema: "public",
                    table: "contacts",
                    filter: `company_id=eq.${companyId}`,
                },
                (payload) => {
                    const deletedContact = payload.old as { id: string };
                    setConversations((prev) =>
                        prev.filter((conv) => conv.id !== deletedContact.id)
                    );
                    if (selectedConversation === deletedContact.id) {
                        setSelectedConversation(null);
                    }
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(chatChannel);
            supabase.removeChannel(contactChannel);
        };
    }, [companyId]);

    return {
        conversations,
        selectedConversation,
        setSelectedConversation,
        loading,
        fetchConversations,
        togglePinConversation,
        toggleAutoRespond,
        deleteConversation,
        updateContact,
    };
};
