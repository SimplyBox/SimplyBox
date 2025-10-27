import React, { useState, useEffect, useRef, useMemo } from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    ArrowLeft,
    Edit,
    Save,
    X,
    MessageSquare,
    Star,
    Calendar,
    Clock,
    User,
    Tag,
    Activity,
    Crown,
    Link,
    Trash2,
    Instagram,
    Facebook,
} from "lucide-react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useInbox } from "@/contexts/InboxContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { getDateLabel } from "@/utils/date";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

interface ContactProfileProps {
    contact: any;
    userPlan: "free" | "starter" | "professional";
    onBack: () => void;
    onUpdate: (contact: any) => void;
}

const ContactProfile: React.FC<ContactProfileProps> = ({
    contact,
    userPlan,
    onBack,
    onUpdate,
}) => {
    const {
        updateContact,
        availableTags,
        setSelectedConversation,
        conversations,
        tags,
    } = useInbox();
    const { t } = useLanguage();
    const navigate = useNavigate();
    const [isEditing, setIsEditing] = useState(false);
    const [editedContact, setEditedContact] = useState(contact);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const tagColorMap = useMemo(() => {
        const map = new Map<string, string>();
        tags.forEach((tag) => {
            if (tag.name && tag.color) {
                map.set(tag.name, tag.color);
            }
        });
        return map;
    }, [tags]);

    useEffect(() => {
        setSelectedConversation(contact.id);
        return () => setSelectedConversation(null);
    }, [contact.id, setSelectedConversation]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [contact.messages]);

    const handleSave = async () => {
        await updateContact(contact.id, {
            name: editedContact.name,
            tags: editedContact.tags,
            notes: editedContact.notes,
        });
        onUpdate(editedContact);
        setIsEditing(false);
    };

    const handleAddTag = (tag: string) => {
        if (!editedContact.tags.includes(tag)) {
            setEditedContact((prev: any) => ({
                ...prev,
                tags: [...prev.tags, tag],
            }));
        }
    };

    const handleRemoveTag = (tagToRemove: string) => {
        setEditedContact((prev: any) => ({
            ...prev,
            tags: prev.tags.filter((tag: string) => tag !== tagToRemove),
        }));
    };

    const handleOpenConversation = () => {
        setSelectedConversation(contact.id);
        navigate(`/dashboard?tab=inbox&conversation=${contact.id}`);
    };

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

    const formatTimestamp = (date: Date) => {
        return new Intl.DateTimeFormat("en-US", {
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        }).format(date);
    };

    const isProfessionalFeature = userPlan !== "professional";

    const currentMessages =
        conversations.find((c) => c.id === contact.id)?.messages ||
        contact.messages;

    return (
        <div className="max-h-screen bg-gray-50">
            <div className="mx-auto p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                        <Button
                            variant="ghost"
                            onClick={onBack}
                            className="p-2"
                        >
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                        <div className="flex items-center gap-3">
                            <Avatar className="h-12 w-12">
                                <AvatarImage src={editedContact.avatar} />
                                <AvatarFallback>
                                    {contact.name.charAt(0)}
                                </AvatarFallback>
                            </Avatar>

                            <div className="flex items-center gap-2">
                                <h1 className="text-2xl font-bold text-gray-900">
                                    {editedContact.name}
                                </h1>
                                {editedContact.isVip && (
                                    <Star className="h-5 w-5 text-yellow-500 fill-current" />
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        {isEditing ? (
                            <>
                                <Button
                                    variant="outline"
                                    onClick={() => {
                                        setEditedContact(contact);
                                        setIsEditing(false);
                                    }}
                                >
                                    <X className="h-4 w-4 mr-2" />
                                    {t("ContactProfile.cancelButton")}
                                </Button>
                                <Button
                                    onClick={handleSave}
                                    className="bg-green-500 hover:bg-green-600"
                                >
                                    <Save className="h-4 w-4 mr-2" />
                                    {t("ContactProfile.saveButton")}
                                </Button>
                            </>
                        ) : (
                            <Button
                                onClick={() => setIsEditing(true)}
                                variant="outline"
                            >
                                <Edit className="h-4 w-4 mr-2" />
                                {t("ContactProfile.editContactButton")}
                            </Button>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Contact Information */}
                    <div className="lg:col-span-1 space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <User className="h-5 w-5 text-blue-500" />
                                    {t("ContactProfile.contactInfo.title")}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {isEditing ? (
                                    <div>
                                        <label className="text-sm font-medium text-gray-700">
                                            {t(
                                                "ContactProfile.contactInfo.nameLabel"
                                            )}
                                        </label>
                                        <Input
                                            value={editedContact.name}
                                            onChange={(e) =>
                                                setEditedContact(
                                                    (prev: any) => ({
                                                        ...prev,
                                                        name: e.target.value,
                                                    })
                                                )
                                            }
                                            className="mt-1"
                                        />
                                    </div>
                                ) : (
                                    <>
                                        <div className="flex items-center gap-2">
                                            {getChannelIcon(
                                                editedContact.mainChannel
                                            )}
                                            <span className="text-sm text-gray-600 capitalize">
                                                {editedContact.identifier ||
                                                    t(
                                                        "ContactProfile.contactInfo.noIdentifier"
                                                    )}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Link className="h-4 w-4 text-gray-500" />
                                            <span className="text-sm text-gray-600 capitalize">
                                                {t(
                                                    `ContactProfile.channel.${editedContact.mainChannel.toLowerCase()}`
                                                )}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Clock className="h-4 w-4 text-gray-500" />
                                            <span className="text-sm text-gray-600">
                                                {t(
                                                    "ContactProfile.contactInfo.lastContacted"
                                                )}{" "}
                                                {formatTimestamp(
                                                    editedContact.lastContacted
                                                )}
                                            </span>
                                        </div>
                                    </>
                                )}
                            </CardContent>
                        </Card>

                        {/* Tags */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Tag className="h-5 w-5 text-blue-500" />
                                    {t("ContactProfile.tags.title")}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex flex-wrap gap-2 mb-3">
                                    {editedContact.tags.length > 0 ? (
                                        editedContact.tags.map(
                                            (tag: string) => (
                                                <Badge
                                                    key={tag}
                                                    variant="secondary"
                                                    className={`flex items-center gap-2 text-xs ${
                                                        tagColorMap.get(tag) ||
                                                        "bg-gray-100 text-gray-800"
                                                    }`}
                                                >
                                                    {tag}
                                                    {isEditing && (
                                                        <Trash2
                                                            className="h-3 w-3 cursor-pointer hover:text-red-600"
                                                            onClick={() =>
                                                                handleRemoveTag(
                                                                    tag
                                                                )
                                                            }
                                                        />
                                                    )}
                                                </Badge>
                                            )
                                        )
                                    ) : (
                                        <p className="text-sm text-gray-600">
                                            {t("ContactProfile.tags.noTags")}
                                        </p>
                                    )}
                                </div>

                                {isEditing && (
                                    <Select onValueChange={handleAddTag}>
                                        <SelectTrigger>
                                            <SelectValue
                                                placeholder={t(
                                                    "ContactProfile.tags.addTagPlaceholder"
                                                )}
                                            />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {availableTags
                                                .filter(
                                                    (tag) =>
                                                        !editedContact.tags.includes(
                                                            tag
                                                        )
                                                )
                                                .map((tag) => (
                                                    <SelectItem
                                                        key={tag}
                                                        value={tag}
                                                    >
                                                        {tag}
                                                    </SelectItem>
                                                ))}
                                        </SelectContent>
                                    </Select>
                                )}
                            </CardContent>
                        </Card>

                        {/* Notes */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Edit className="h-5 w-5 text-blue-500" />
                                    {t("ContactProfile.notes.title")}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                {isEditing ? (
                                    <Textarea
                                        value={editedContact.notes}
                                        onChange={(e) =>
                                            setEditedContact((prev: any) => ({
                                                ...prev,
                                                notes: e.target.value,
                                            }))
                                        }
                                        placeholder={t(
                                            "ContactProfile.notes.placeholder"
                                        )}
                                        rows={4}
                                    />
                                ) : (
                                    <p className="text-sm text-gray-600">
                                        {editedContact.notes &&
                                        editedContact.notes.trim() !== ""
                                            ? editedContact.notes
                                                  .split("\n")
                                                  .map((line, index) => (
                                                      <span key={index}>
                                                          {line}
                                                          {index <
                                                              editedContact.notes.split(
                                                                  "\n"
                                                              ).length -
                                                                  1 && <br />}
                                                      </span>
                                                  ))
                                            : t("ContactProfile.notes.noNotes")}
                                    </p>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Main Content */}
                    <div className="lg:col-span-2">
                        <Tabs defaultValue="conversations" className="w-full">
                            <TabsList className="grid w-full grid-cols-2">
                                <TabsTrigger value="conversations">
                                    {t("ContactProfile.tabs.conversations")}
                                </TabsTrigger>
                                <TabsTrigger
                                    value="activities"
                                    className="relative"
                                >
                                    {t("ContactProfile.tabs.activities")}
                                    {isProfessionalFeature && (
                                        <Crown className="h-3 w-3 text-yellow-500 ml-1" />
                                    )}
                                </TabsTrigger>
                            </TabsList>

                            <TabsContent
                                value="conversations"
                                className="space-y-4"
                            >
                                <Card>
                                    <CardHeader>
                                        <CardTitle>
                                            {t(
                                                "ContactProfile.conversationHistory.title"
                                            )}
                                        </CardTitle>
                                        <CardDescription>
                                            {t(
                                                "ContactProfile.conversationHistory.description"
                                            )}
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="p-0">
                                        <div className="flex-1 overflow-y-auto p-4 space-y-4 h-[50vh]">
                                            {currentMessages.length > 0 ? (
                                                (() => {
                                                    const messagesByDate: {
                                                        [
                                                            key: string
                                                        ]: typeof currentMessages;
                                                    } = {};
                                                    currentMessages
                                                        .slice()
                                                        .reverse()
                                                        .forEach((message) => {
                                                            const date =
                                                                new Date(
                                                                    message.timestamp ||
                                                                        message.created_at
                                                                );
                                                            const dateKey =
                                                                date.toDateString();
                                                            if (
                                                                !messagesByDate[
                                                                    dateKey
                                                                ]
                                                            ) {
                                                                messagesByDate[
                                                                    dateKey
                                                                ] = [];
                                                            }
                                                            messagesByDate[
                                                                dateKey
                                                            ].push(message);
                                                        });

                                                    return Object.entries(
                                                        messagesByDate
                                                    ).map(
                                                        ([
                                                            dateKey,
                                                            messages,
                                                        ]) => (
                                                            <div
                                                                key={dateKey}
                                                                className="space-y-2"
                                                            >
                                                                <div className="text-center my-4">
                                                                    <span className="inline-block bg-gray-200 text-gray-700 text-xs font-medium px-3 py-1 rounded-full">
                                                                        {getDateLabel(
                                                                            new Date(
                                                                                dateKey
                                                                            ),
                                                                            t
                                                                        )}
                                                                    </span>
                                                                </div>
                                                                {messages.map(
                                                                    (
                                                                        message: any
                                                                    ) => (
                                                                        <motion.div
                                                                            key={
                                                                                message.id
                                                                            }
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
                                                                                <p className="text-sm">
                                                                                    {(
                                                                                        message.content ||
                                                                                        message.message ||
                                                                                        ""
                                                                                    )
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
                                                                                                        (
                                                                                                            message.message ||
                                                                                                            ""
                                                                                                        ).split(
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
                                                                    )
                                                                )}
                                                            </div>
                                                        )
                                                    );
                                                })()
                                            ) : (
                                                <div className="text-center text-gray-500">
                                                    {t(
                                                        "ContactProfile.conversationHistory.noMessages"
                                                    )}
                                                </div>
                                            )}
                                            <div ref={messagesEndRef} />
                                        </div>
                                        <div className="border-t border-gray-200 p-4">
                                            <Button
                                                onClick={handleOpenConversation}
                                                className="w-full"
                                            >
                                                <MessageSquare className="h-4 w-4 mr-2" />
                                                {t(
                                                    "ContactProfile.conversationHistory.openInInbox"
                                                )}
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            <TabsContent
                                value="activities"
                                className="space-y-4"
                            >
                                {isProfessionalFeature ? (
                                    <Card className="border-yellow-500 bg-gradient-to-r from-yellow-50 to-orange-50">
                                        <CardContent className="p-6 text-center">
                                            <Crown className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
                                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                                {t(
                                                    "ContactProfile.activities.professionalFeature.title"
                                                )}
                                            </h3>
                                            <p className="text-gray-600 mb-4">
                                                {t(
                                                    "ContactProfile.activities.professionalFeature.description"
                                                )}
                                            </p>
                                            <Button className="bg-yellow-500 hover:bg-yellow-600 text-gray-900">
                                                {t(
                                                    "ContactProfile.activities.professionalFeature.upgradeButton"
                                                )}
                                            </Button>
                                        </CardContent>
                                    </Card>
                                ) : (
                                    <div>
                                        {/* Activities skipped as per request */}
                                    </div>
                                )}
                            </TabsContent>
                        </Tabs>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContactProfile;
