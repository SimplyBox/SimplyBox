import React from "react";
import HeroSection from "../components/home/HeroSection";
import ProblemSolutionSection from "../components/home/ProblemSolutionSection";
import HowItWorksSection from "../components/home/HowItWorksSection";
import FeatureShowcase from "../components/home/FeatureSection";
import PricingSection from "../components/home/PricingSection";
import FAQSection from "../components/home/FAQSection";
import FooterSection from "../components/home/FooterSection";
import { useLanguage } from "../contexts/LanguageContext";

interface HomeProps {
    onContactSales: () => void;
    onLoginNeeded?: () => void;
    onSignUpNeeded?: () => void;
}

const Home: React.FC<HomeProps> = ({
    onContactSales,
    onLoginNeeded,
    onSignUpNeeded,
}) => {
    const { setLanguage } = useLanguage();

    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section */}
            <HeroSection
                onLanguageChange={setLanguage}
                onTryFree={onSignUpNeeded}
                onLogin={onLoginNeeded}
                onSignUp={onSignUpNeeded}
            />

            {/* Problem-Solution Section */}
            <ProblemSolutionSection />

            {/* How It Works Section */}
            <HowItWorksSection />

            {/* Feature Showcase */}
            <FeatureShowcase onTryFree={onSignUpNeeded} />

            {/* Pricing Section */}
            <PricingSection />

            {/* FAQ Section */}
            <FAQSection />

            {/* Footer Section */}
            <FooterSection
                onLanguageChange={setLanguage}
                onTryFree={onSignUpNeeded}
                onContactSales={onContactSales}
            />
        </div>
    );
};

export default Home;
