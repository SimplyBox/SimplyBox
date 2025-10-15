export const getLimitsForTier = (tier: string) => {
    switch (tier) {
        case "free":
            return {
                messages_limit: 100,
                team_members_limit: 0,
                files_limit: 2,
            };
        case "starter":
            return {
                messages_limit: 600,
                team_members_limit: 3,
                files_limit: 10,
            };
        case "professional":
            return {
                messages_limit: 2500,
                team_members_limit: 8,
                files_limit: 50,
            };
        case "enterprise":
            return {
                messages_limit: 10000,
                team_members_limit: 50,
                files_limit: 500,
            };
        default:
            throw new Error("Invalid tier");
    }
};
