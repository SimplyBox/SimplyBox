import React, { useState } from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Users,
    UserPlus,
    Crown,
    User,
    ArrowUpRight,
    AlertCircle,
    Trash2,
    Loader2,
} from "lucide-react";
import { useTeam } from "@/contexts/TeamContext";
import { useLanguage } from "@/contexts/LanguageContext";
import InviteTeamMemberModal from "./InviteTeamMemberModal";

interface TeamManagementPageProps {
    userPlan: "free" | "starter" | "professional" | "enterprise";
    currentUsage: {
        users: { used: number; total: number };
    };
    onUpgrade?: () => void;
}

const TeamManagementPage = ({
    userPlan,
    currentUsage,
    onUpgrade,
}: TeamManagementPageProps) => {
    const {
        teamMembers,
        currentTeamMember,
        refreshTeamMembers,
        removeTeamMember,
        isOwner,
        isAdmin,
    } = useTeam();
    const { t } = useLanguage();
    const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
    const [isRemoveDialogOpen, setIsRemoveDialogOpen] = useState(false);
    const [memberToRemove, setMemberToRemove] = useState<string | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const planLimits = {
        free: { maxMembers: 0, name: t("layout.plan.free") },
        starter: { maxMembers: 3, name: t("layout.plan.starter") },
        professional: { maxMembers: 8, name: t("layout.plan.professional") },
        enterprise: { maxMembers: 50, name: t("layout.plan.enterprise") },
    };

    const currentLimit = planLimits[userPlan];
    const usedSeats = currentUsage.users.used;
    const usagePercentage =
        currentUsage.users.total > 0
            ? (usedSeats / currentUsage.users.total) * 100
            : 0;

    const handleRefreshTeamMembers = React.useCallback(() => {
        if (refreshTeamMembers) {
            refreshTeamMembers();
        }
    }, [refreshTeamMembers]);

    const getRoleIcon = (role: string) => {
        switch (role) {
            case "owner":
                return <Crown className="h-4 w-4 text-yellow-500" />;
            case "admin":
                return <User className="h-4 w-4 text-blue-500" />;
            default:
                return <User className="h-4 w-4 text-gray-500" />;
        }
    };

    const getRoleBadge = (role: string) => {
        const variants = {
            owner: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200 hover:text-yellow-900",
            admin: "bg-blue-100 text-blue-800 hover:bg-blue-200 hover:text-blue-900",
        };
        const roleVariant = variants[role as keyof typeof variants];
        return (
            <Badge className={`${roleVariant} text-xs px-2 py-1`}>
                {t(`TeamManagementPage.roles.${role}`)}
            </Badge>
        );
    };

    const handleRemoveClick = (userId: string) => {
        setMemberToRemove(userId);
        setIsRemoveDialogOpen(true);
    };

    const handleRemoveConfirm = async () => {
        if (memberToRemove && removeTeamMember) {
            setIsDeleting(true);
            const { success, error } = await removeTeamMember(memberToRemove);
            if (success) {
                setIsDeleting(false);
                setIsRemoveDialogOpen(false);
                setMemberToRemove(null);
                await handleRefreshTeamMembers();
            } else {
                console.error("Failed to remove team member:", error);
            }
        }
    };

    const owner = teamMembers?.find((member) => member.role === "owner");
    const otherMembers =
        teamMembers?.filter((member) => member.role !== "owner") || [];

    const isCurrentUserOwner = isOwner();
    const isCurrentUserAdmin = isAdmin();

    return (
        <div className="h-full bg-gray-50">
            <div className="mx-auto p-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold mb-2">
                            {t("TeamManagementPage.title")}
                        </h1>
                        <p className="text-gray-600">
                            {t("TeamManagementPage.description")}
                        </p>
                    </div>

                    <div className="flex items-center space-x-4 mt-4 md:mt-0">
                        <div className="text-right">
                            <div className="text-sm text-gray-500">
                                {t("TeamManagementPage.teamUsage")}
                            </div>
                            <div className="font-semibold">
                                {t("TeamManagementPage.seatsUsed", {
                                    used: usedSeats,
                                    total: currentUsage.users.total,
                                })}
                            </div>
                        </div>

                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleRefreshTeamMembers}
                            className="mr-2"
                        >
                            {t("TeamManagementPage.refreshButton")}
                        </Button>
                        {isCurrentUserOwner && (
                            <Button
                                onClick={() => setIsInviteModalOpen(true)}
                                disabled={userPlan === "free"}
                                className={
                                    userPlan === "free"
                                        ? "bg-blue-600 hover:bg-blue-700 opacity-50 cursor-not-allowed"
                                        : "bg-blue-600 hover:bg-blue-700"
                                }
                            >
                                <UserPlus className="h-4 w-4 mr-2" />
                                {t("TeamManagementPage.inviteMemberButton")}
                            </Button>
                        )}
                    </div>
                </div>

                <Card className="mb-6">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center space-x-3">
                                <div className="p-2 bg-blue-100 rounded-full">
                                    <Users className="h-5 w-5 text-blue-600" />
                                </div>
                                <div>
                                    <h3 className="font-semibold">
                                        {t("TeamManagementPage.teamSeatsUsage")}
                                    </h3>
                                    <p className="text-sm text-gray-600">
                                        {t("TeamManagementPage.planName", {
                                            plan: currentLimit.name,
                                            used: usedSeats,
                                            total: currentUsage.users.total,
                                        })}
                                    </p>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="text-2xl font-bold">
                                    {t("TeamManagementPage.usedPercentage", {
                                        percentage: Math.round(usagePercentage),
                                    })}
                                </div>
                            </div>
                        </div>
                        <Progress
                            value={usagePercentage}
                            className="h-3 mb-4"
                        />
                        {usagePercentage >= 80 && (
                            <Alert>
                                <AlertTitle className="flex items-center gap-2">
                                    <AlertCircle className="h-4 w-4" />
                                    {t(
                                        "TeamManagementPage.approachingLimitTitle"
                                    )}
                                </AlertTitle>
                                <AlertDescription className="flex items-center justify-between">
                                    <span>
                                        {t(
                                            "TeamManagementPage.approachingLimitDescription",
                                            {
                                                used: usedSeats,
                                                total: currentUsage.users.total,
                                            }
                                        )}
                                    </span>
                                    {onUpgrade && (
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={onUpgrade}
                                        >
                                            <ArrowUpRight className="h-4 w-4 mr-1" />
                                            {t(
                                                "TeamManagementPage.upgradeButton"
                                            )}
                                        </Button>
                                    )}
                                </AlertDescription>
                            </Alert>
                        )}
                    </CardContent>
                </Card>

                {teamMembers === null ? (
                    <Card className="mb-6">
                        <CardContent className="p-6">
                            <div className="text-center">
                                <div className="animate-pulse">
                                    {t("TeamManagementPage.loadingTeamMembers")}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ) : (
                    <>
                        {owner && (
                            <Card className="mb-6">
                                <CardHeader>
                                    <CardTitle className="flex items-center">
                                        <Crown className="h-5 w-5 mr-2" />
                                        {t("TeamManagementPage.ownerTitle")}
                                    </CardTitle>
                                    <CardDescription>
                                        {t(
                                            "TeamManagementPage.ownerDescription"
                                        )}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex items-center p-4 border rounded-lg">
                                        <div className="flex items-center space-x-4">
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center text-white font-semibold">
                                                {owner.name &&
                                                    owner.name
                                                        .charAt(0)
                                                        .toUpperCase()}
                                            </div>
                                            <div>
                                                <div className="flex items-center space-x-2">
                                                    <h4 className="font-medium">
                                                        {currentTeamMember?.user_id ===
                                                        owner.user_id
                                                            ? t(
                                                                  "TeamManagementPage.roles.you"
                                                              )
                                                            : owner.name ||
                                                              "Unknown"}
                                                    </h4>
                                                    {getRoleIcon(owner.role)}
                                                    {getRoleBadge(owner.role)}
                                                </div>
                                                <p className="text-sm text-gray-600">
                                                    {owner.email || "No email"}
                                                </p>
                                                {owner.phone && (
                                                    <p className="text-xs text-gray-500">
                                                        {owner.phone}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center">
                                    <Users className="h-5 w-5 mr-2" />
                                    {t("TeamManagementPage.teamMembersTitle", {
                                        count: otherMembers.length,
                                    })}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {otherMembers.map((member) => (
                                        <div
                                            key={member.id}
                                            className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                                        >
                                            <div className="flex items-center space-x-4">
                                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-semibold">
                                                    {member.name &&
                                                        member.name
                                                            .charAt(0)
                                                            .toUpperCase()}
                                                </div>
                                                <div>
                                                    <div className="flex items-center space-x-2">
                                                        <h4 className="font-medium">
                                                            {currentTeamMember?.user_id ===
                                                            member.user_id
                                                                ? t(
                                                                      "TeamManagementPage.roles.you"
                                                                  )
                                                                : member.name ||
                                                                  "Unknown"}
                                                        </h4>
                                                        {getRoleIcon(
                                                            member.role
                                                        )}
                                                        {getRoleBadge(
                                                            member.role
                                                        )}
                                                    </div>
                                                    <p className="text-sm text-gray-600">
                                                        {member.email ||
                                                            "No email"}
                                                    </p>
                                                    {member.phone && (
                                                        <p className="text-xs text-gray-500">
                                                            {member.phone}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>

                                            {isCurrentUserOwner &&
                                                member.role !== "owner" && (
                                                    <div className="flex items-center space-x-2">
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() =>
                                                                handleRemoveClick(
                                                                    member.user_id
                                                                )
                                                            }
                                                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                )}
                                        </div>
                                    ))}
                                </div>

                                {otherMembers.length === 0 && (
                                    <div className="text-center py-12">
                                        <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                                            {t(
                                                "TeamManagementPage.noTeamMembersTitle"
                                            )}
                                        </h3>
                                        <p className="text-gray-600 mb-4">
                                            {t(
                                                "TeamManagementPage.noTeamMembersDescription"
                                            )}
                                        </p>
                                        {isCurrentUserOwner && (
                                            <Button
                                                onClick={() =>
                                                    setIsInviteModalOpen(true)
                                                }
                                                disabled={userPlan === "free"}
                                                className={
                                                    userPlan === "free"
                                                        ? "opacity-50 cursor-not-allowed"
                                                        : ""
                                                }
                                            >
                                                <UserPlus className="h-4 w-4 mr-2" />
                                                {t(
                                                    "TeamManagementPage.inviteFirstMemberButton"
                                                )}
                                            </Button>
                                        )}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </>
                )}

                {isCurrentUserOwner && (
                    <>
                        <InviteTeamMemberModal
                            isOpen={isInviteModalOpen}
                            onClose={() => setIsInviteModalOpen(false)}
                        />
                        <Dialog
                            open={isRemoveDialogOpen}
                            onOpenChange={setIsRemoveDialogOpen}
                        >
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>
                                        {t(
                                            "TeamManagementPage.confirmRemovalTitle"
                                        )}
                                    </DialogTitle>
                                    <DialogDescription>
                                        {t(
                                            "TeamManagementPage.confirmRemovalDescription"
                                        )}
                                    </DialogDescription>
                                </DialogHeader>
                                <DialogFooter>
                                    <Button
                                        variant="outline"
                                        size="default"
                                        onClick={() =>
                                            setIsRemoveDialogOpen(false)
                                        }
                                    >
                                        {t(
                                            "InviteTeamMemberModal.cancelButton"
                                        )}
                                    </Button>
                                    <Button
                                        variant="destructive"
                                        size="default"
                                        onClick={handleRemoveConfirm}
                                        disabled={isDeleting}
                                    >
                                        {isDeleting ? (
                                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                        ) : (
                                            <Trash2 className="h-4 w-4 mr-2" />
                                        )}
                                        {t("TeamManagementPage.removeButton")}
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </>
                )}
            </div>
        </div>
    );
};

export default TeamManagementPage;
