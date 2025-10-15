import React from "react";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "../ui/accordion";
import { useLanguage } from "@/contexts/LanguageContext";

const FAQSection: React.FC = () => {
    const { t } = useLanguage();

    // Array of FAQ keys for easy mapping
    const faqKeys = [
        "planUpgrade",
        "messageLimit",
        "contract",
        "aiAssistant",
        "dataSecurity",
        "support",
        "aiAccuracy",
        "aiCustomization",
        "ecommerce",
    ];

    return (
        <section className="w-full py-16 bg-gray-50">
            <div className="container mx-auto px-4">
                <div className="max-w-3xl mx-auto">
                    <h3 className="text-3xl font-bold mb-6 text-center text-gray-900">
                        {t("faq.title")}
                    </h3>
                    <Accordion type="single" collapsible className="w-full">
                        {faqKeys.map((faqKey, index) => (
                            <AccordionItem key={index} value={`item-${index}`}>
                                <AccordionTrigger className="text-left text-md">
                                    {t(`faq.questions.${faqKey}.question`)}
                                </AccordionTrigger>
                                <AccordionContent>
                                    {t(`faq.questions.${faqKey}.answer`)}
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </div>
            </div>
        </section>
    );
};

export default FAQSection;
