import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { useAuth } from "@/contexts/AuthContext";
import { useInbox } from "@/contexts/InboxContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import DashboardLayout from "@/components/dashboard/DashboardLayout";
import KanbanBoard from "@/components/dashboard/kanban/KanbanBoard";
import InsightsDashboard from "@/components/dashboard/insights/InsightsDashboard";
import ProfilePage from "@/components/profile/ProfilePage";
import TeamManagementPage from "@/components/dashboard/team/TeamManagementPage";
import FilesPage from "@/components/dashboard/files/FilesPage";
import ContactManagement from "@/components/dashboard/contacts/ContactManagement";
import InteractiveInbox from "@/components/dashboard/inbox/InteractiveInbox";
import AIInsightPage from "@/components/dashboard/insights/AIInsightPage";
import SettingsPage from "@/components/dashboard/settings/SettingsPage";

type UserPlan = "free" | "starter" | "professional" | "enterprise";

const Dashboard = () => {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const [activeTab, setActiveTab] = useState(
        searchParams.get("tab") || "inbox"
    );
    const [showProfilePage, setShowProfilePage] = useState(false);
    const { subscription } = useSubscription();
    const { company } = useAuth();

    const userPlan: UserPlan = subscription?.tier || "free";

    const currentUsage = subscription?.usage
        ? {
              messages: {
                  used: subscription.usage.messages_used || 0,
                  total: subscription.usage.messages_limit || 100,
              },
              files: {
                  used: subscription.usage.files_used || 0,
                  total: subscription.usage.files_limit || 2,
              },
              users: {
                  used: subscription.usage.team_members_used || 0,
                  total: subscription.usage.team_members_limit || 0,
              },
          }
        : {
              messages: { used: 0, total: 100 },
              files: { used: 0, total: 2 },
              users: { used: 0, total: 0 },
          };

    useEffect(() => {
        const tab = searchParams.get("tab");
        if (tab) {
            setActiveTab(tab);
        }
    }, [searchParams]);

    const handleUpgrade = () => {
        navigate("/dashboard/upgrade");
    };

    const handleProfileClick = () => {
        setShowProfilePage(true);
    };

    const handleProfileSave = (profileData: any) => {
        console.log("Profile saved:", profileData);
        setShowProfilePage(false);
    };

    if (!company) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <Card className="max-w-md w-full text-center">
                    <CardHeader>
                        <CardTitle>Not Part of Any Company</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-gray-500">
                            You are not currently a member of any company team.
                            Please contact your company owner to be added to a
                            team.
                        </p>
                        <Button
                            variant="outline"
                            className="mt-4"
                            onClick={() => navigate("/")}
                        >
                            Go to Home
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (showProfilePage) {
        return (
            <div className="min-h-screen bg-gray-50">
                <div className="bg-white border-b border-gray-200 p-4">
                    <Button
                        variant="ghost"
                        onClick={() => setShowProfilePage(false)}
                        className="mb-2"
                    >
                        ← Back to Dashboard
                    </Button>
                </div>
                <ProfilePage userPlan={userPlan} onSave={handleProfileSave} />
            </div>
        );
    }

    return (
        <DashboardLayout
            activeTab={activeTab}
            onTabChange={(tab) => {
                setActiveTab(tab);
                setSearchParams({ tab });
            }}
            userPlan={userPlan}
            currentUsage={currentUsage}
            onUpgrade={handleUpgrade}
            onProfileClick={handleProfileClick}
        >
            <TabsContent value="inbox" className="mt-0">
                <InteractiveInbox />
            </TabsContent>
            <TabsContent value="kanban" className="mt-0">
                <KanbanBoard userPlan={userPlan} />
            </TabsContent>
            <TabsContent value="insights" className="mt-0">
                <Tabs defaultValue="overview" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="overview">Overview</TabsTrigger>
                        <TabsTrigger value="ai-insight">AI Insight</TabsTrigger>
                    </TabsList>
                    <TabsContent value="overview" className="mt-6">
                        <InsightsDashboard plan={userPlan} />
                    </TabsContent>
                    <TabsContent value="ai-insight" className="mt-6">
                        <AIInsightPage
                            userPlan={userPlan}
                            onUpgrade={handleUpgrade}
                        />
                    </TabsContent>
                </Tabs>
            </TabsContent>
            <TabsContent value="contacts" className="mt-0">
                {userPlan !== "enterprise" ? (
                    <ContactManagement
                        userPlan={
                            userPlan as "free" | "starter" | "professional"
                        }
                    />
                ) : (
                    <div className="p-4 text-center text-gray-500">
                        Contact management is not available for the Enterprise
                        plan.
                    </div>
                )}
            </TabsContent>
            {(userPlan === "starter" ||
                userPlan === "professional" ||
                userPlan === "enterprise") && (
                <TabsContent value="team" className="mt-0">
                    <TeamManagementPage
                        userPlan={userPlan}
                        currentUsage={currentUsage}
                        onUpgrade={handleUpgrade}
                    />
                </TabsContent>
            )}
            <TabsContent value="files" className="mt-0">
                <FilesPage
                    userPlan={userPlan}
                    currentUsage={currentUsage}
                    onUpgrade={handleUpgrade}
                />
            </TabsContent>
            <TabsContent value="settings" className="mt-0">
                <SettingsPage
                    userPlan={userPlan}
                    currentUsage={currentUsage}
                    onUpgrade={handleUpgrade}
                />
            </TabsContent>
        </DashboardLayout>
    );
};

export default Dashboard;
