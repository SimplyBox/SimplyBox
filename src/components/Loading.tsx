import React from "react";

const Loading: React.FC = () => {
    return (
        <div className="flex items-center justify-center h-screen bg-gray-100">
            <div className="flex flex-col items-center p-6 bg-white rounded-xl shadow-lg">
                <img
                    src="/LogoFull.png"
                    alt="SimplyBox Logo"
                    className="w-32"
                />
                <p className="mt-4 text-2xl font-semibold text-gray-700 text-center animate-pulse">
                    Loading...
                </p>
            </div>
        </div>
    );
};

export default Loading;
