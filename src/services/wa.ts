import supabase from "@/libs/supabase";
import { Message } from "@/types";

export const useWhatsAppService = (
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
                    .from("whatsapp_integrations")
                    .select("phone_number_id, access_token")
                    .eq("company_id", companyId)
                    .single();

            if (integrationError || !integration) {
                throw new Error("Integration not found");
            }

            const response = await fetch(
                `https://graph.facebook.com/v20.0/${integration.phone_number_id}/messages`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${integration.access_token}`,
                    },
                    body: JSON.stringify({
                        messaging_product: "whatsapp",
                        to: contact.identifier,
                        type: "text",
                        text: { body: content.trim() },
                    }),
                }
            );

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Meta API error: ${errorText}`);
            }

            const responseData = await response.json();
            const messageSid = responseData.messages[0].id;

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
            console.error("Error sending message:", error);
            throw error;
        }
    };

    return { sendMessage };
};
