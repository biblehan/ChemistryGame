import React from 'react';
import { X } from 'lucide-react';

export const MessageNotification = ({ messages, setMessages }) => {
    const closeMessage = (id) => {
        setMessages(prev => prev.filter(msg => msg.id !== id));
    };

    return (
        <div className="fixed bottom-4 left-4 right-4 z-50 flex flex-col-reverse gap-2">
            {messages.map((message) => (
                <div
                    key={message.id}
                    className={`text-sm sm:text-base md:text-lg font-bold p-3 pr-10 sm:p-4 sm:pr-12 rounded-xl shadow-2xl w-full relative ${message.type === 'success' ? 'bg-green-500/90' :
                        message.type === 'discovery' ? 'bg-purple-500/90 animate-pulse' :
                            'bg-red-500/90'
                        } text-white transition-all duration-300 backdrop-blur-sm`}
                >
                    {message.text}
                    <button
                        onClick={() => closeMessage(message.id)}
                        className="absolute top-2 right-2 hover:bg-white/20 rounded-lg p-1 transition-colors"
                    >
                        <X size={16} className="sm:w-5 sm:h-5" />
                    </button>
                </div>
            ))}
        </div>
    );
};