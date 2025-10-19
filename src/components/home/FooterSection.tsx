import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";

interface FooterSectionProps {
    onLanguageChange?: (language: "en" | "id") => void;
    onTryFree?: () => void;
    onContactSales?: () => void;
}

const FooterSection: React.FC<FooterSectionProps> = ({
    onLanguageChange = () => {},
    onTryFree = () => {},
    onContactSales = () => {},
}) => {
    const { t, language } = useLanguage();

    const companyLinks = ["aboutUs", "careers", "blog", "newsroom"];
    const productLinks = ["features", "pricing", "integrations", "apiDocs"];
    const supportLinks = [
        "helpCenter",
        "contactSupport",
        "communityForum",
        "statusPage",
    ];
    const legalLinks = [
        { key: "privacyPolicy", href: "/privacy-policy" },
        { key: "termsOfService", href: "/terms-of-service" },
    ];

    const socialLinks = [
        {
            name: "linkedin",
            href: "#",
            icon: "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z",
        },
        {
            name: "twitter",
            href: "#",
            icon: "M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z",
        },
        {
            name: "facebook",
            href: "#",
            icon: "M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z",
        },
        {
            name: "instagram",
            href: "#",
            icon: "M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24c6.624 0 11.99-5.367 11.99-11.987C24.007 5.367 18.641.001 12.017.001z",
        },
    ];

    return (
        <footer className="bg-gray-900 text-white">
            {/* CTA Section */}
            <div className="bg-gradient-to-r from-blue-500 to-green-500 py-16 px-4 md:px-8 lg:px-16">
                <div className="max-w-7xl mx-auto text-center">
                    <h2 className="text-3xl font-bold mb-4 text-white">
                        {t("footer.cta.title")}
                    </h2>
                    <p className="text-blue-100 max-w-2xl mx-auto mb-8">
                        {t("footer.cta.subtitle")}
                    </p>

                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <button
                            onClick={onTryFree}
                            className="bg-white text-blue-500 hover:bg-gray-100 font-semibold py-3 px-8 rounded-lg transition-colors"
                        >
                            {t("footer.cta.primary")}
                        </button>
                        <button
                            onClick={onContactSales}
                            className="bg-transparent hover:bg-white/10 border-2 border-white text-white font-semibold py-3 px-8 rounded-lg transition-colors"
                        >
                            {t("footer.cta.secondary")}
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Footer Content */}
            <div className="py-16 px-4 md:px-8 lg:px-16">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
                        {/* Company Info */}
                        <div className="lg:col-span-2">
                            <div className="mb-6">
                                <img
                                    src="/LogoVertical.png"
                                    alt="SimplyBox Logo"
                                    className="h-16 mb-4 brightness-0 invert"
                                />
                                <p className="text-gray-300 mb-4">
                                    {t("footer.company.description")}
                                </p>
                            </div>

                            {/* Contact Info */}
                            <div className="mb-6">
                                <h4 className="font-semibold mb-3 text-white">
                                    {t("footer.company.tagline")}
                                </h4>
                                <div className="space-y-2 text-gray-300">
                                    <p>{t("footer.contact.email")}</p>
                                    <p>{t("footer.contact.phone")}</p>
                                    <p>{t("footer.contact.address")}</p>
                                </div>
                            </div>
                        </div>

                        {/* Company Links */}
                        <div>
                            <h4 className="font-semibold mb-4 text-white">
                                {t("footer.sections.company")}
                            </h4>
                            <ul className="space-y-2">
                                {companyLinks.map((link) => (
                                    <li key={link}>
                                        <a
                                            href="#"
                                            className="text-gray-300 hover:text-white transition-colors"
                                        >
                                            {t(`footer.links.${link}`)}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Product Links */}
                        <div>
                            <h4 className="font-semibold mb-4 text-white">
                                {t("footer.sections.product")}
                            </h4>
                            <ul className="space-y-2">
                                {productLinks.map((link) => (
                                    <li key={link}>
                                        <a
                                            href={
                                                link === "pricing"
                                                    ? "#pricing"
                                                    : "#"
                                            }
                                            className="text-gray-300 hover:text-white transition-colors"
                                        >
                                            {t(`footer.links.${link}`)}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Support & Legal */}
                        <div>
                            <h4 className="font-semibold mb-4 text-white">
                                {t("footer.sections.support")}
                            </h4>
                            <ul className="space-y-2 mb-6">
                                {supportLinks.map((link) => (
                                    <li key={link}>
                                        <a
                                            href="#"
                                            className="text-gray-300 hover:text-white transition-colors"
                                        >
                                            {t(`footer.links.${link}`)}
                                        </a>
                                    </li>
                                ))}
                            </ul>

                            <h4 className="font-semibold mb-4 text-white">
                                {t("footer.sections.legal")}
                            </h4>
                            <ul className="space-y-2">
                                {legalLinks.map((link) => (
                                    <li key={link.key}>
                                        <a
                                            href={link.href}
                                            className="text-gray-300 hover:text-white transition-colors"
                                        >
                                            {t(`footer.links.${link.key}`)}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Social Media */}
                    <div className="mt-12 pt-8 border-t border-gray-700">
                        <div className="flex flex-col md:flex-row justify-between items-center">
                            <div className="mb-6 md:mb-0">
                                <p className="text-gray-400">
                                    {t("footer.copyright")}
                                </p>
                            </div>

                            <div className="flex items-center gap-6">
                                {/* Social Links */}
                                <div className="flex gap-4">
                                    {socialLinks.map((social) => (
                                        <a
                                            key={social.name}
                                            href={social.href}
                                            className="text-gray-400 hover:text-white transition-colors"
                                            aria-label={t(
                                                `footer.social.${social.name}`
                                            )}
                                        >
                                            <svg
                                                className="w-5 h-5"
                                                fill="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path d={social.icon} />
                                            </svg>
                                        </a>
                                    ))}
                                </div>

                                {/* Language Toggle */}
                                <div className="flex items-center">
                                    <span className="mr-2 text-gray-400">
                                        {t("footer.language.label")}:
                                    </span>
                                    <div className="flex bg-gray-800 rounded-full p-1">
                                        <button
                                            onClick={() =>
                                                onLanguageChange("en")
                                            }
                                            className={`px-3 py-1 rounded-full text-sm transition-colors ${
                                                language === "en"
                                                    ? "bg-blue-500 text-white"
                                                    : "text-gray-400 hover:text-white"
                                            }`}
                                        >
                                            EN
                                        </button>
                                        <button
                                            onClick={() =>
                                                onLanguageChange("id")
                                            }
                                            className={`px-3 py-1 rounded-full text-sm transition-colors ${
                                                language === "id"
                                                    ? "bg-blue-500 text-white"
                                                    : "text-gray-400 hover:text-white"
                                            }`}
                                        >
                                            ID
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default FooterSection;
