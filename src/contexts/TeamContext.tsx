import React, { createContext, useContext } from "react";
import { useAuth } from "./AuthContext";
import { useTeamService } from "@/services/team";
import { TeamContextType } from "@/types";

const TeamContext = createContext<TeamContextType | undefined>(undefined);

export const useTeam = () => {
    const context = useContext(TeamContext);
    if (context === undefined) {
        throw new Error("useTeam must be used within a TeamProvider");
    }
    return context;
};

export const TeamProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const { user, company, signUpTeamMember } = useAuth();
    const {
        teamMembers,
        currentTeamMember,
        loading,
        refreshTeamMembers,
        inviteTeamMember,
        verifyInvitationToken,
        acceptInvitation,
        removeTeamMember,
        isOwner,
        isAdmin,
    } = useTeamService(user?.id, company?.id, signUpTeamMember);

    const value: TeamContextType = {
        teamMembers,
        currentTeamMember,
        loading,
        refreshTeamMembers,
        inviteTeamMember,
        verifyInvitationToken,
        acceptInvitation,
        removeTeamMember,
        isOwner,
        isAdmin,
    };

    return (
        <TeamContext.Provider value={value}>{children}</TeamContext.Provider>
    );
};
