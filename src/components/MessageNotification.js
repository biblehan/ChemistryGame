import React from 'react';

export const MessageNotification = ({ messages }) => {
    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col-reverse gap-2">
            {messages.map((message) => (
                <div
                    key={message.id}
                    className={`text-lg font-bold p-4 rounded-xl shadow-2xl ${message.type === 'success' ? 'bg-green-500' :
                        message.type === 'discovery' ? 'bg-purple-500 animate-pulse' :
                            'bg-red-500'
                        } text-white transition-all duration-300`}
                >
                    {message.text}
                </div>
            ))}
        </div>
    );
};
