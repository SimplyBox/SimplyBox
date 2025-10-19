import React from "react";
import { useLanguage } from "@/contexts/LanguageContext"; // Adjust the import path as needed

const ProblemSolutionSection: React.FC = () => {
    const { t } = useLanguage();

    const problemsData = [
        { key: "fragmented", borderColor: "border-red-500" },
        { key: "slowResponse", borderColor: "border-red-500" },
        { key: "manualOverwhelm", borderColor: "border-red-500" },
    ];

    const solutionsData = [
        { key: "unifiedInbox", borderColor: "border-blue-500" },
        { key: "intelligentReplies", borderColor: "border-blue-500" },
        { key: "visualWorkflow", borderColor: "border-blue-500" },
    ];

    return (
        <section className="py-16 px-4 md:px-8 lg:px-16 bg-gray-50">
            <div className="max-w-7xl mx-auto">
                {/* Problems */}
                <div className="mb-16">
                    <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
                        {t("problemSolution.problemTitle")}
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {problemsData.map((problem, index) => (
                            <div
                                key={`problem-${index}`}
                                className={`bg-white p-6 rounded-lg shadow-md border-t-4 ${problem.borderColor} hover:shadow-lg transition-shadow`}
                            >
                                <h3 className="text-xl font-semibold mb-3 text-gray-800">
                                    {t(
                                        `problemSolution.problems.${problem.key}.title`
                                    )}
                                </h3>
                                <p className="text-gray-600">
                                    {t(
                                        `problemSolution.problems.${problem.key}.description`
                                    )}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Solutions */}
                <div>
                    <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
                        {t("problemSolution.solutionTitle")}
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {solutionsData.map((solution, index) => (
                            <div
                                key={`solution-${index}`}
                                className={`bg-white p-6 rounded-lg shadow-md border-t-4 ${solution.borderColor} hover:shadow-lg transition-shadow`}
                            >
                                <h3 className="text-xl font-semibold mb-3 text-gray-800">
                                    {t(
                                        `problemSolution.solutions.${solution.key}.title`
                                    )}
                                </h3>
                                <p className="text-gray-600">
                                    {t(
                                        `problemSolution.solutions.${solution.key}.description`
                                    )}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ProblemSolutionSection;
