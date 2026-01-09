import React, { useState, useEffect, useRef, useContext } from 'react';
import { io } from 'socket.io-client';
import { UserContext } from '../context/UserContext';
import { Send, Bot, Sparkles } from 'lucide-react';
import { BASE_URL } from '../utils/apiPaths';

const AIAssistant = ({ dashboardData }) => {
    const { user } = useContext(UserContext);
    const [messages, setMessages] = useState([
        {
            type: 'ai',
            text: `Hi ${user?.fullName?.split(' ')[0] || 'there'}! 👋 I'm your AI financial assistant. Ask me anything about your expenses, income, or get financial advice!`,
            timestamp: new Date().toISOString()
        }
    ]);
    const [inputMessage, setInputMessage] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [socket, setSocket] = useState(null);
    const messagesEndRef = useRef(null);
    const textareaRef = useRef(null);

    useEffect(() => {
        const newSocket = io(BASE_URL, {
            withCredentials: true
        });


        newSocket.on('connect', () => console.log('✅ Connected'));
        newSocket.on('ai-response', (data) => {
            setMessages(prev => [...prev, {
                type: 'ai',
                text: data.message,
                timestamp: data.timestamp
            }]);
            setIsTyping(false);
        });

        setSocket(newSocket);
        return () => newSocket.close();
    }, []);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isTyping]);

    const handleSendMessage = () => {
        if (!inputMessage.trim() || !socket || isTyping) return;

        setMessages(prev => [...prev, {
            type: 'user',
            text: inputMessage,
            timestamp: new Date().toISOString()
        }]);

        setIsTyping(true);
        socket.emit('user-message', {
            message: inputMessage,
            userContext: {
                totalBalance: dashboardData?.totalBalance || 0,
                totalIncome: dashboardData?.totalIncome || 0,
                totalExpenses: dashboardData?.totalExpenses || 0,
                recentExpenses: dashboardData?.recentTransactions?.slice(0, 5) || []
            }
        });

        setInputMessage('');
        if (textareaRef.current) {
            textareaRef.current.style.height = '44px';
            textareaRef.current.style.overflowY = 'hidden';
        }
    };

    const handleTextareaChange = (e) => {
        setInputMessage(e.target.value);

        const textarea = e.target;

        textarea.style.height = 'auto'; // Reset to min height

        const newHeight = Math.max(44, Math.min(textarea.scrollHeight, 200));
        textarea.style.height = newHeight + 'px';

        // SHOW SCROLLBAR ONLY WHEN CONTENT EXCEEDS MAX HEIGHT
        if (textarea.scrollHeight > 200) {
            textarea.style.overflowY = 'auto';
        } else {
            textarea.style.overflowY = 'hidden';
        }
    };


    const suggestedQuestions = [
        "How much did I spend this month?",
        "What's my biggest expense category?",
        "Give me budgeting tips",
        "Should I save more?"
    ];

    // ✅ CORRECT - Using profileImageUrl like other components
    const getUserAvatar = () => {
        if (user?.profileImageUrl) {
            // If it's already a full URL
            if (user.profileImageUrl.startsWith('http')) {
                return user.profileImageUrl;
            }
            // If it's a relative path, combine with BASE_URL
            return `${BASE_URL}${user.profileImageUrl}`;
        }
        return null;
    };

    return (
        <div className="flex flex-col h-full">
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-600 to-purple-500 rounded-t-2xl p-4 sm:p-6">
                <div className="flex items-center gap-3">
                    <div className="bg-white/20 p-2 sm:p-3 rounded-xl">
                        <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                    </div>
                    <div>
                        <h2 className="text-lg sm:text-2xl font-bold text-white">AI Financial Assistant</h2>
                        <p className="text-xs sm:text-sm text-purple-100">Ask me anything about your finances</p>
                    </div>
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto bg-gray-50 p-4 sm:p-6 space-y-4">
                {messages.map((msg, i) => (
                    <div key={i} className={`flex gap-3 ${msg.type === 'user' ? 'flex-row-reverse' : ''}`}>
                        {/* Avatar */}
                        <div className={`flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center overflow-hidden ${msg.type === 'ai' ? 'bg-purple-100' : 'bg-gradient-to-br from-purple-500 to-blue-500'
                            }`}>
                            {msg.type === 'ai' ? (
                                <Bot className="w-5 h-5 text-purple-600" />
                            ) : getUserAvatar() ? (
                                <img
                                    src={getUserAvatar()}
                                    alt={user?.fullName || 'User'}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        console.error('Image failed to load:', getUserAvatar());
                                        e.target.style.display = 'none';
                                        e.target.parentElement.innerHTML = `<span class="text-sm font-bold text-white">${user?.fullName?.charAt(0) || 'U'}</span>`;
                                    }}
                                />
                            ) : (
                                <span className="text-sm font-bold text-white">{user?.fullName?.charAt(0) || 'U'}</span>
                            )}
                        </div>

                        {/* Message */}
                        <div className={`flex flex-col max-w-[75%] ${msg.type === 'user' ? 'items-end' : 'items-start'}`}>
                            <div className={`rounded-2xl px-4 py-3 shadow-sm ${msg.type === 'ai'
                                ? 'bg-white text-gray-800'
                                : 'bg-purple-600 text-white'
                                }`}>
                                <p className="text-sm sm:text-base whitespace-pre-wrap break-words">{msg.text}</p>
                            </div>
                            <span className="text-xs text-gray-400 mt-1 px-1">
                                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                        </div>
                    </div>
                ))}

                {/* Typing Indicator */}
                {isTyping && (
                    <div className="flex gap-3">
                        <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                            <Bot className="w-5 h-5 text-purple-600" />
                        </div>
                        <div className="bg-white rounded-2xl px-4 py-3 shadow-sm">
                            <div className="flex gap-1.5">
                                {[0, 150, 300].map((delay, idx) => (
                                    <div
                                        key={idx}
                                        className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"
                                        style={{ animationDelay: `${delay}ms` }}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Suggestions */}
                {messages.length === 1 && (
                    <div className="pt-2">
                        <p className="text-sm text-gray-500 mb-3 px-1">💡 Try asking:</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {suggestedQuestions.map((q, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => {
                                        setInputMessage(q);
                                        textareaRef.current?.focus();
                                    }}
                                    className="text-left text-sm p-3 bg-white hover:bg-purple-50 border border-gray-200 hover:border-purple-300 rounded-xl transition-all shadow-sm"
                                >
                                    {q}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="bg-white border-t border-gray-200 p-3 sm:p-4 rounded-b-2xl">
                <div className="flex gap-2 items-end">
                    <textarea
                        ref={textareaRef}
                        value={inputMessage}
                        onChange={handleTextareaChange}
                        onKeyPress={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleSendMessage();
                            }
                        }}
                        placeholder="Ask me anything..."
                        disabled={isTyping}
                        rows={1}
                        className="flex-1 px-4 py-3 text-sm sm:text-base border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:bg-gray-50 disabled:cursor-not-allowed resize-none transition-all"
                        style={{
                            minHeight: '44px',
                            maxHeight: '200px',
                            height: '44px',
                            overflowY: 'hidden' // START WITH HIDDEN!
                        }}
                    />

                    <button
                        onClick={handleSendMessage}
                        disabled={!inputMessage.trim() || isTyping}
                        className="w-11 h-11 sm:w-12 sm:h-12 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-xl transition-all flex items-center justify-center shadow-lg hover:shadow-xl active:scale-95"
                    >
                        <Send className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AIAssistant;
