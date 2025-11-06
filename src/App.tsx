import { Suspense } from "react";
import { useNavigate, Routes, Route, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import ContactSalesPage from "./pages/ContactSalesPage";
import PaymentPage from "./pages/PaymentPage";
import PaymentSuccessPage from "./pages/PaymentSuccessPage";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import Dashboard from "./pages/Dashboard";
import UpgradePage from "./pages/UpgradePage";
import { AuthProvider } from "./contexts/AuthContext";
import { TeamProvider } from "./contexts/TeamContext";
import { FilesProvider } from "./contexts/FilesContext";
import { SubscriptionProvider } from "./contexts/SubscriptionContext";
import { InboxProvider } from "./contexts/InboxContext";
import { LanguageProvider } from "./contexts/LanguageContext";
import { ActivityProvider } from "./contexts/ActivityContext";
import { WhatsAppProvider } from "./contexts/WhatsAppContext";
import { InstagramProvider } from "./contexts/InstagramContext";
import { FacebookProvider } from "./contexts/FacebookContext";
import OAuthCallback from "./components/dashboard/settings/OAuthCallback";
import VerifyEmailPage from "./pages/VerifyEmailPage";
import AcceptInvitationPage from "./pages/AcceptInvitaionPage";
import PrivacyPolicyPage from "./pages/PrivacyPolicyPage";
import TermsOfServicePage from "./pages/TermsOfServicePage";

function HomeWrapper() {
    const navigate = useNavigate();

    const handleContactSales = () => {
        navigate("/contact-sales", { state: { from: "/" } });
    };

    const handleLoginNeeded = () => {
        navigate("/login");
    };

    const handleSignUpNeeded = () => {
        navigate("/signup");
    };

    return (
        <Home
            onContactSales={handleContactSales}
            onLoginNeeded={handleLoginNeeded}
            onSignUpNeeded={handleSignUpNeeded}
        />
    );
}

function App() {
    return (
        <AuthProvider>
            <SubscriptionProvider>
                <TeamProvider>
                    <FilesProvider>
                        <InboxProvider>
                            <LanguageProvider>
                                <ActivityProvider>
                                    <WhatsAppProvider>
                                        <InstagramProvider>
                                            <FacebookProvider>
                                                <Suspense
                                                    fallback={
                                                        <div className="flex items-center justify-center h-screen">
                                                            <p>Loading...</p>
                                                        </div>
                                                    }
                                                >
                                                    <Routes>
                                                        {/* Public Routes */}
                                                        <Route
                                                            path="/"
                                                            element={
                                                                <HomeWrapper />
                                                            }
                                                        />
                                                        <Route
                                                            path="/privacy-policy"
                                                            element={
                                                                <PrivacyPolicyPage />
                                                            }
                                                        />
                                                        <Route
                                                            path="/terms-of-service"
                                                            element={
                                                                <TermsOfServicePage />
                                                            }
                                                        />
                                                        <Route
                                                            path="/login"
                                                            element={
                                                                <LoginPage />
                                                            }
                                                        />
                                                        <Route
                                                            path="/signup"
                                                            element={
                                                                <SignUpPage />
                                                            }
                                                        />
                                                        <Route
                                                            path="/accept-invitation"
                                                            element={
                                                                <AcceptInvitationPage />
                                                            }
                                                        />
                                                        <Route
                                                            path="/verify-email"
                                                            element={
                                                                <VerifyEmailPage />
                                                            }
                                                        />
                                                        <Route
                                                            path="/contact-sales"
                                                            element={
                                                                <ContactSalesPage />
                                                            }
                                                        />
                                                        {/* Dashboard Routes (protected) */}
                                                        <Route
                                                            path="/dashboard/*"
                                                            element={
                                                                <Routes>
                                                                    <Route
                                                                        index
                                                                        element={
                                                                            <Dashboard />
                                                                        }
                                                                    />
                                                                    <Route
                                                                        path="/oauth/callback"
                                                                        element={
                                                                            <OAuthCallback />
                                                                        }
                                                                    />
                                                                    <Route
                                                                        path="upgrade"
                                                                        element={
                                                                            <UpgradePage />
                                                                        }
                                                                    />
                                                                    <Route
                                                                        path="payment"
                                                                        element={
                                                                            <PaymentPage />
                                                                        }
                                                                    />
                                                                    <Route
                                                                        path="payment-success"
                                                                        element={
                                                                            <PaymentSuccessPage />
                                                                        }
                                                                    />
                                                                </Routes>
                                                            }
                                                        />

                                                        {/* Fallback route - redirect to home */}
                                                        <Route
                                                            path="*"
                                                            element={
                                                                <HomeWrapper />
                                                            }
                                                        />
                                                    </Routes>
                                                </Suspense>
                                            </FacebookProvider>
                                        </InstagramProvider>
                                    </WhatsAppProvider>
                                </ActivityProvider>
                            </LanguageProvider>
                        </InboxProvider>
                    </FilesProvider>
                </TeamProvider>
            </SubscriptionProvider>
        </AuthProvider>
    );
}

export default App;
