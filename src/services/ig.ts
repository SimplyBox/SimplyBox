import supabase from "@/libs/supabase";
import { Message } from "@/types";

export const useInstagramService = (
    companyId: string | undefined,
    selectedConversation: string | null,
    conversations: any[],
    setConversations: (conversations: any[]) => void
) => {
    const sendMessage = async (content: string) => {
        if (!selectedConversation || !content.trim() || !companyId) return;

        const contact = conversations.find(
            (c) => c.id === selectedConversation
        )?.contact;
        if (!contact) return;

        try {
            const { data: integration, error: integrationError } =
                await supabase
                    .from("instagram_integrations")
                    .select("access_token")
                    .eq("company_id", companyId)
                    .single();

            if (integrationError || !integration) {
                throw new Error("Instagram Integration not found");
            }

            const response = await fetch(
                `https://graph.facebook.com/v20.0/me/messages?access_token=${integration.access_token}`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        recipient: { id: contact.identifier },
                        message: { text: content.trim() },
                        messaging_type: "RESPONSE",
                    }),
                }
            );

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Meta API error: ${errorText}`);
            }

            const responseData = await response.json();
            const messageSid = responseData.message_id;

            const newMessage: Omit<Message, "id"> = {
                contact_id: selectedConversation,
                message: content.trim(),
                direction: "outbound",
                message_sid: messageSid,
                status: "sent",
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
                media_url: "",
                media_type: "",
            };

            const { data, error: insertError } = await supabase
                .from("chat_log")
                .insert([newMessage])
                .select()
                .single();

            if (insertError) throw insertError;

            const savedMessage: Message = { ...newMessage, id: data.id };

            setConversations(
                conversations.map((conv) =>
                    conv.id === selectedConversation
                        ? {
                              ...conv,
                              messages: [savedMessage, ...conv.messages],
                              lastMessage: savedMessage.created_at,
                              status: savedMessage.status,
                          }
                        : conv
                )
            );
        } catch (error) {
            console.error("Error sending IG message:", error);
            throw error;
        }
    };

    return { sendMessage };
};
