import React, { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { useTeam } from "@/contexts/TeamContext";
import { useLanguage } from "@/contexts/LanguageContext";

interface InviteTeamMemberModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const InviteTeamMemberModal: React.FC<InviteTeamMemberModalProps> = ({
    isOpen,
    onClose,
}) => {
    const [email, setEmail] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { inviteTeamMember, isOwner } = useTeam();
    const { t } = useLanguage();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsSubmitting(true);

        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            setError(t("InviteTeamMemberModal.invalidEmailError"));
            setIsSubmitting(false);
            return;
        }

        if (!isOwner()) {
            setError(t("InviteTeamMemberModal.ownerOnlyError"));
            setIsSubmitting(false);
            return;
        }

        const result = await inviteTeamMember(email, "admin");
        if (result.success) {
            setEmail("");
            onClose();
        } else {
            setError(
                result.error || t("InviteTeamMemberModal.failedInvitationError")
            );
        }
        setIsSubmitting(false);
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>
                        {t("InviteTeamMemberModal.title")}
                    </DialogTitle>
                    <DialogDescription>
                        {t("InviteTeamMemberModal.description")}
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
                        <div className="flex items-center gap-4">
                            <Label htmlFor="email" className="w-16">
                                {t("InviteTeamMemberModal.emailLabel")}
                            </Label>
                            <Input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder={t(
                                    "InviteTeamMemberModal.emailPlaceholder"
                                )}
                                disabled={isSubmitting}
                                className="flex-1"
                            />
                        </div>

                        {error && (
                            <Alert variant="destructive">
                                <AlertCircle className="h-4 w-4" />
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        )}
                    </div>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                            disabled={isSubmitting}
                        >
                            {t("InviteTeamMemberModal.cancelButton")}
                        </Button>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting
                                ? t("InviteTeamMemberModal.sendingButton")
                                : t("InviteTeamMemberModal.sendButton")}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default InviteTeamMemberModal;
