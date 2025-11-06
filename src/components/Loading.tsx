import React from "react";

const Loading: React.FC = () => {
    return (
        <div className="flex items-center justify-center h-screen bg-gradient-to-br from-gray-100 to-gray-200">
            <div className="flex flex-col items-center p-8 bg-white rounded-2xl shadow-2xl">
                <div className="relative w-40 h-40 flex items-center justify-center">
                    <div className="absolute inset-0 border-4 border-transparent border-t-blue-400 border-r-cyan-400 rounded-full animate-spin"></div>
                    <div className="absolute inset-2 border-4 border-transparent border-b-yellow-400 border-l-cyan-300 rounded-full animate-[spin_1.5s_linear_infinite_reverse]"></div>
                    <img
                        src="/favicon.png"
                        alt="SimplyBox Logo"
                        className="w-24 h-24"
                    />
                </div>
            </div>
        </div>
    );
};

export default Loading;
