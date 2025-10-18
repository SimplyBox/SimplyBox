import React, { useState, useMemo, useEffect } from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Search,
    Plus,
    Upload,
    MessageSquare,
    Mail,
    Phone,
    MoreVertical,
    Star,
    Clock,
    Users,
    Tag,
    Activity,
    ChevronRight,
    SortAsc,
    SortDesc,
} from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ContactProfile from "./ContactProfile";
import AddContactModal from "./AddContactModal";
import ImportContactsModal from "./ImportContactsModal";
import BulkMessageModal from "./BulkMessageModal";
import TagManagement from "./TagManagement";
import { useInbox } from "@/contexts/InboxContext";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useSearchParams, useNavigate } from "react-router-dom";

interface ContactManagementProps {
    userPlan: "free" | "starter" | "professional";
}

const ContactManagement: React.FC<ContactManagementProps> = ({ userPlan }) => {
    const { conversations, availableTags, tags } = useInbox();
    const { company } = useAuth();
    const { t } = useLanguage();
    const [selectedContact, setSelectedContact] = useState<any | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [sortBy, setSortBy] = useState<
        "name" | "lastContacted" | "totalMessages"
    >("lastContacted");
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
    const [showAddContact, setShowAddContact] = useState(false);
    const [showImportContacts, setShowImportContacts] = useState(false);
    const [showBulkMessage, setShowBulkMessage] = useState(false);
    const [showTagManagement, setShowTagManagement] = useState(false);
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();

    const tagColorMap = useMemo(() => {
        const map = new Map<string, string>();
        tags.forEach((tag) => {
            if (tag.name && tag.color) {
                map.set(tag.name, tag.color);
            }
        });
        return map;
    }, [tags]);

    const mappedContacts = useMemo(() => {
        return conversations.map((conv) => ({
            id: conv.id,
            name: conv.contact.name,
            identifier: conv.contact.identifier,
            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${conv.contact.name}`,
            tags: conv.contact.tags || [],
            lastContacted: new Date(conv.lastMessage),
            mainChannel: conv.channel,
            isVip: conv.contact.tags?.includes("VIP") || false,
            isLead: conv.contact.tags?.includes("Lead") || false,
            notes: conv.contact.notes,
            totalMessages: conv.messages.length,
            status: conv.status,
            contact: conv.contact,
            messages: conv.messages,
        }));
    }, [conversations]);

    useEffect(() => {
        const contactId = searchParams.get("contact");
        if (contactId) {
            const contact = mappedContacts.find((c) => c.id === contactId);
            if (contact) {
                setSelectedContact(contact);
            }
        }
    }, [searchParams, mappedContacts]);

    const filteredContacts = useMemo(() => {
        let filtered = mappedContacts.filter((contact) => {
            const matchesSearch =
                contact.name
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase()) ||
                contact.identifier
                    ?.toLowerCase()
                    .includes(searchQuery.toLowerCase());
            const matchesTags =
                selectedTags.length === 0 ||
                selectedTags.some((tag) => contact.tags.includes(tag));
            return matchesSearch && matchesTags;
        });

        filtered.sort((a, b) => {
            let comparison = 0;
            switch (sortBy) {
                case "name":
                    comparison = b.name.localeCompare(a.name);
                    break;
                case "lastContacted":
                    comparison =
                        a.lastContacted.getTime() - b.lastContacted.getTime();
                    break;
                case "totalMessages":
                    comparison = a.totalMessages - b.totalMessages;
                    break;
            }
            return sortOrder === "asc" ? comparison : -comparison;
        });

        return filtered;
    }, [mappedContacts, searchQuery, selectedTags, sortBy, sortOrder]);

    const recentContacts = mappedContacts
        .sort((a, b) => b.lastContacted.getTime() - a.lastContacted.getTime())
        .slice(0, 5);

    const getChannelIcon = (channel: string) => {
        switch (channel.toLowerCase()) {
            case "whatsapp":
                return <MessageSquare className="h-4 w-4 text-green-600" />;
            case "email":
                return <Mail className="h-4 w-4 text-blue-600" />;
            case "phone":
                return <Phone className="h-4 w-4 text-purple-600" />;
            default:
                return <MessageSquare className="h-4 w-4" />;
        }
    };

    const formatLastContacted = (date: Date) => {
        const now = new Date();
        const diffTime = Math.floor((now.getTime() - date.getTime()) / 1000);

        if (diffTime < 60) {
            return t("ContactManagement.timeAgo.justNow");
        } else if (diffTime < 3600) {
            const minutes = Math.floor(diffTime / 60);
            return t("ContactManagement.timeAgo.minutes", { count: minutes });
        } else if (diffTime < 86400) {
            const hours = Math.floor(diffTime / 3600);
            return t("ContactManagement.timeAgo.hours", { count: hours });
        } else if (diffTime < 172800) {
            return t("ContactManagement.timeAgo.yesterday");
        } else if (diffTime < 604800) {
            const days = Math.floor(diffTime / 86400);
            return t("ContactManagement.timeAgo.days", { count: days });
        } else if (diffTime < 2592000) {
            const weeks = Math.floor(diffTime / 604800);
            return t("ContactManagement.timeAgo.weeks", { count: weeks });
        } else if (diffTime < 31536000) {
            const months = Math.floor(diffTime / 2592000);
            return t("ContactManagement.timeAgo.months", { count: months });
        } else {
            const years = Math.floor(diffTime / 31536000);
            return t("ContactManagement.timeAgo.years", { count: years });
        }
    };

    const handleSelectContact = (contact: any) => {
        setSelectedContact(contact);
        navigate(`/dashboard?tab=contacts&contact=${contact.id}`);
    };

    const handleBackFromProfile = () => {
        setSelectedContact(null);
        navigate(`/dashboard?tab=contacts`);
    };

    if (selectedContact) {
        return (
            <ContactProfile
                contact={selectedContact}
                userPlan={userPlan}
                onBack={handleBackFromProfile}
                onUpdate={(updatedContact) =>
                    setSelectedContact(updatedContact)
                }
            />
        );
    }

    return (
        <div className="h-full bg-gray-50">
            <div className="mx-auto p-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">
                            {t("ContactManagement.title")}
                        </h1>
                        <p className="text-gray-600">
                            {t("ContactManagement.description", {
                                companyName: company.name,
                            })}
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Button
                            onClick={() => setShowAddContact(true)}
                            className="bg-[#3A9BDC] hover:bg-[#2E8BC7]"
                        >
                            <Plus className="h-4 w-4 mr-2" />
                            {t("ContactManagement.addContactButton")}
                        </Button>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline">
                                    <MoreVertical className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                    onClick={() => setShowImportContacts(true)}
                                >
                                    <Upload className="h-4 w-4 mr-2" />
                                    {t("ContactManagement.importContacts")}
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onClick={() => setShowBulkMessage(true)}
                                >
                                    <MessageSquare className="h-4 w-4 mr-2" />
                                    {t("ContactManagement.sendBulkMessage")}
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onClick={() => setShowTagManagement(true)}
                                >
                                    <Tag className="h-4 w-4 mr-2" />
                                    {t("ContactManagement.manageTags")}
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">
                                        {t("ContactManagement.totalContacts")}
                                    </p>
                                    <p className="text-2xl font-bold text-gray-900">
                                        {mappedContacts.length}
                                    </p>
                                </div>
                                <Users className="h-8 w-8 text-[#3A9BDC]" />
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">
                                        {t("ContactManagement.vipContacts")}
                                    </p>
                                    <p className="text-2xl font-bold text-gray-900">
                                        {
                                            mappedContacts.filter(
                                                (c) => c.isVip
                                            ).length
                                        }
                                    </p>
                                </div>
                                <Star className="h-8 w-8 text-[#F1C40F]" />
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">
                                        {t("ContactManagement.activeLeads")}
                                    </p>
                                    <p className="text-2xl font-bold text-gray-900">
                                        {
                                            mappedContacts.filter(
                                                (c) => c.isLead
                                            ).length
                                        }
                                    </p>
                                </div>
                                <Activity className="h-8 w-8 text-[#2ECC71]" />
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">
                                        {t("ContactManagement.thisWeek")}
                                    </p>
                                    <p className="text-2xl font-bold text-gray-900">
                                        {
                                            mappedContacts.filter((c) => {
                                                const weekAgo = new Date();
                                                weekAgo.setDate(
                                                    weekAgo.getDate() - 7
                                                );
                                                return (
                                                    c.lastContacted >= weekAgo
                                                );
                                            }).length
                                        }
                                    </p>
                                </div>
                                <Clock className="h-8 w-8 text-purple-600" />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <Tabs defaultValue="overview" className="w-full mt-6">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="overview">
                            {t("ContactManagement.tabs.overview")}
                        </TabsTrigger>
                        <TabsTrigger value="all-contacts">
                            {t("ContactManagement.tabs.allContacts")}
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="overview" className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Clock className="h-5 w-5 text-[#3A9BDC]" />
                                    {t(
                                        "ContactManagement.recentContacts.title"
                                    )}
                                </CardTitle>
                                <CardDescription>
                                    {t(
                                        "ContactManagement.recentContacts.description"
                                    )}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    {recentContacts.map((contact) => (
                                        <div
                                            key={contact.id}
                                            className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors"
                                            onClick={() =>
                                                handleSelectContact(contact)
                                            }
                                        >
                                            <div className="flex items-center gap-3">
                                                <Avatar>
                                                    <AvatarImage
                                                        src={contact.avatar}
                                                    />
                                                    <AvatarFallback>
                                                        {contact.name
                                                            .split(" ")
                                                            .map((n) => n[0])
                                                            .join("")}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <p className="font-medium text-gray-900">
                                                            {contact.name}
                                                        </p>
                                                        {contact.isVip && (
                                                            <Star className="h-4 w-4 text-[#F1C40F] fill-current" />
                                                        )}
                                                    </div>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <div className="flex items-center gap-1">
                                                            {getChannelIcon(
                                                                contact.mainChannel
                                                            )}
                                                            <span className="text-xs text-gray-500 capitalize">
                                                                {
                                                                    contact.identifier
                                                                }
                                                            </span>
                                                        </div>
                                                        <span className="text-xs text-gray-500">
                                                            {formatLastContacted(
                                                                contact.lastContacted
                                                            )}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <div className="flex gap-1">
                                                    {contact.tags
                                                        .slice(0, 3)
                                                        .map((tag) => (
                                                            <Badge
                                                                key={tag}
                                                                variant="secondary"
                                                                className={`text-xs ${
                                                                    tagColorMap.get(
                                                                        tag
                                                                    ) ||
                                                                    "bg-gray-100 text-gray-800"
                                                                }`}
                                                            >
                                                                {tag}
                                                            </Badge>
                                                        ))}
                                                    {contact.tags.length >
                                                        3 && (
                                                        <Badge
                                                            variant="secondary"
                                                            className="text-xs"
                                                        >
                                                            +
                                                            {contact.tags
                                                                .length - 3}
                                                        </Badge>
                                                    )}
                                                </div>
                                                <ChevronRight className="h-4 w-4 text-gray-400" />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <Card
                                className="cursor-pointer hover:shadow-md transition-shadow"
                                onClick={() => setShowImportContacts(true)}
                            >
                                <CardContent className="p-6 text-center">
                                    <Upload className="h-12 w-12 text-[#3A9BDC] mx-auto mb-4" />
                                    <h3 className="font-semibold text-gray-900 mb-2">
                                        {t(
                                            "ContactManagement.importContactsCard.title"
                                        )}
                                    </h3>
                                    <p className="text-sm text-gray-600">
                                        {t(
                                            "ContactManagement.importContactsCard.description"
                                        )}
                                    </p>
                                </CardContent>
                            </Card>
                            <Card
                                className="cursor-pointer hover:shadow-md transition-shadow"
                                onClick={() => setShowBulkMessage(true)}
                            >
                                <CardContent className="p-6 text-center">
                                    <MessageSquare className="h-12 w-12 text-[#2ECC71] mx-auto mb-4" />
                                    <h3 className="font-semibold text-gray-900 mb-2">
                                        {t(
                                            "ContactManagement.bulkMessageCard.title"
                                        )}
                                    </h3>
                                    <p className="text-sm text-gray-600">
                                        {t(
                                            "ContactManagement.bulkMessageCard.description"
                                        )}
                                    </p>
                                </CardContent>
                            </Card>
                            <Card
                                className="cursor-pointer hover:shadow-md transition-shadow"
                                onClick={() => setShowTagManagement(true)}
                            >
                                <CardContent className="p-6 text-center">
                                    <Tag className="h-12 w-12 text-[#F1C40F] mx-auto mb-4" />
                                    <h3 className="font-semibold text-gray-900 mb-2">
                                        {t(
                                            "ContactManagement.tagManagementCard.title"
                                        )}
                                    </h3>
                                    <p className="text-sm text-gray-600">
                                        {t(
                                            "ContactManagement.tagManagementCard.description"
                                        )}
                                    </p>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>

                    <TabsContent value="all-contacts" className="space-y-4">
                        <div className="flex flex-col sm:flex-row gap-4">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                <Input
                                    placeholder={t(
                                        "ContactManagement.searchPlaceholder"
                                    )}
                                    value={searchQuery}
                                    onChange={(e) =>
                                        setSearchQuery(e.target.value)
                                    }
                                    className="pl-10"
                                />
                            </div>
                            <div className="flex gap-2">
                                <Select
                                    value={sortBy}
                                    onValueChange={(value: any) =>
                                        setSortBy(value)
                                    }
                                >
                                    <SelectTrigger className="w-40">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="lastContacted">
                                            {t(
                                                "ContactManagement.sortOptions.lastContacted"
                                            )}
                                        </SelectItem>
                                        <SelectItem value="name">
                                            {t(
                                                "ContactManagement.sortOptions.name"
                                            )}
                                        </SelectItem>
                                        <SelectItem value="totalMessages">
                                            {t(
                                                "ContactManagement.sortOptions.totalMessages"
                                            )}
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() =>
                                        setSortOrder(
                                            sortOrder === "asc" ? "desc" : "asc"
                                        )
                                    }
                                >
                                    {sortOrder === "asc" ? (
                                        <SortAsc className="h-4 w-4" />
                                    ) : (
                                        <SortDesc className="h-4 w-4" />
                                    )}
                                </Button>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-2 items-center">
                            <span className="text-sm text-gray-600">
                                {t("ContactManagement.filterByTags")}
                            </span>
                            {availableTags.map((tag) => (
                                <Button
                                    key={tag}
                                    variant="outline"
                                    size="sm"
                                    className={`cursor-pointer ${
                                        selectedTags.includes(tag)
                                            ? "text-white bg-blue-400 hover:text-white hover:bg-blue-500"
                                            : "hover:bg-gray-100"
                                    }`}
                                    onClick={() => {
                                        setSelectedTags((prev) =>
                                            prev.includes(tag)
                                                ? prev.filter((t) => t !== tag)
                                                : [...prev, tag]
                                        );
                                    }}
                                >
                                    {tag}
                                </Button>
                            ))}
                            {selectedTags.length > 0 && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setSelectedTags([])}
                                    className="text-xs"
                                >
                                    {t("ContactManagement.clearFilters")}
                                </Button>
                            )}
                        </div>

                        <Card>
                            <CardContent className="p-0">
                                <div className="divide-y">
                                    {filteredContacts.map((contact) => (
                                        <div
                                            key={contact.id}
                                            className="flex items-center justify-between p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                                            onClick={() =>
                                                handleSelectContact(contact)
                                            }
                                        >
                                            <div className="flex items-center gap-4">
                                                <Avatar>
                                                    <AvatarImage
                                                        src={contact.avatar}
                                                    />
                                                    <AvatarFallback>
                                                        {contact.name
                                                            .split(" ")
                                                            .map((n) => n[0])
                                                            .join("")}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <h3 className="font-medium text-gray-900">
                                                            {contact.name}
                                                        </h3>
                                                        {contact.isVip && (
                                                            <Star className="h-4 w-4 text-[#F1C40F] fill-current" />
                                                        )}
                                                    </div>
                                                    <div className="flex items-center gap-4 mt-1">
                                                        <div className="flex items-center gap-1">
                                                            {getChannelIcon(
                                                                contact.mainChannel
                                                            )}
                                                            <span className="text-xs text-gray-500 capitalize">
                                                                {
                                                                    contact.identifier
                                                                }
                                                            </span>
                                                        </div>
                                                        <span className="text-xs text-gray-500">
                                                            {formatLastContacted(
                                                                contact.lastContacted
                                                            )}
                                                        </span>
                                                        <span className="text-xs text-gray-500">
                                                            {
                                                                contact.totalMessages
                                                            }{" "}
                                                            {t(
                                                                "ContactManagement.sortOptions.totalMessages"
                                                            ).toLowerCase()}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <div className="flex gap-1">
                                                    {contact.tags
                                                        .slice(0, 3)
                                                        .map((tag) => (
                                                            <Badge
                                                                key={tag}
                                                                variant="secondary"
                                                                className={`text-xs ${
                                                                    tagColorMap.get(
                                                                        tag
                                                                    ) ||
                                                                    "bg-gray-100 text-gray-800"
                                                                }`}
                                                            >
                                                                {tag}
                                                            </Badge>
                                                        ))}
                                                    {contact.tags.length >
                                                        3 && (
                                                        <Badge
                                                            variant="secondary"
                                                            className="text-xs"
                                                        >
                                                            +
                                                            {contact.tags
                                                                .length - 3}
                                                        </Badge>
                                                    )}
                                                </div>
                                                <ChevronRight className="h-4 w-4 text-gray-400" />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                {filteredContacts.length === 0 && (
                                    <div className="text-center py-12">
                                        <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                                            {t(
                                                "ContactManagement.noContactsFound.title"
                                            )}
                                        </h3>
                                        <p className="text-gray-600 mb-4">
                                            {t(
                                                "ContactManagement.noContactsFound.description"
                                            )}
                                        </p>
                                        <Button
                                            onClick={() =>
                                                setShowAddContact(true)
                                            }
                                            className="bg-[#3A9BDC] hover:bg-[#2E8BC7]"
                                        >
                                            <Plus className="h-4 w-4 mr-2" />
                                            {t(
                                                "ContactManagement.noContactsFound.addFirstContactButton"
                                            )}
                                        </Button>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>

                {showAddContact && (
                    <AddContactModal
                        isOpen={showAddContact}
                        onClose={() => setShowAddContact(false)}
                        onAdd={(newContact) => {
                            setShowAddContact(false);
                        }}
                        availableTags={availableTags}
                    />
                )}

                {showImportContacts && (
                    <ImportContactsModal
                        isOpen={showImportContacts}
                        onClose={() => setShowImportContacts(false)}
                        onImport={(importedContacts) => {
                            setShowImportContacts(false);
                        }}
                        userPlan={userPlan}
                    />
                )}

                {showTagManagement && (
                    <TagManagement
                        isOpen={showTagManagement}
                        onClose={() => setShowTagManagement(false)}
                    />
                )}
            </div>
        </div>
    );
};

export default ContactManagement;
