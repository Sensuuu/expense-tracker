import React, { useState, useEffect, useRef, useContext } from 'react';
import { io } from 'socket.io-client';
import { UserContext } from '../context/UserContext';
import { Send, Bot, X, Loader } from 'lucide-react';

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
    const inputRef = useRef(null);

    // Initialize Socket.IO
    useEffect(() => {
        const newSocket = io('http://localhost:8000', {
            transports: ['websocket']
        });

        newSocket.on('connect', () => {
            console.log('✅ Connected to server');
        });

        newSocket.on('ai-response', (data) => {
            setMessages(prev => [...prev, {
                type: 'ai',
                text: data.message,
                timestamp: data.timestamp
            }]);
            setIsTyping(false);
        });

        newSocket.on('connect_error', (error) => {
            console.error('❌ Connection error:', error);
        });

        setSocket(newSocket);

        return () => newSocket.close();
    }, []);

    // Auto-scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isTyping]);

    const handleSendMessage = () => {
        if (!inputMessage.trim() || !socket || isTyping) return;

        // Add user message
        const userMsg = {
            type: 'user',
            text: inputMessage,
            timestamp: new Date().toISOString()
        };
        setMessages(prev => [...prev, userMsg]);

        // Prepare user context
        const userContext = {
            totalBalance: dashboardData?.totalBalance || 0,
            totalIncome: dashboardData?.totalIncome || 0,
            totalExpenses: dashboardData?.totalExpenses || 0,
            recentExpenses: dashboardData?.recentTransactions?.slice(0, 5) || []
        };

        // Send to AI
        setIsTyping(true);
        socket.emit('user-message', {
            message: inputMessage,
            userContext
        });

        setInputMessage('');
        inputRef.current?.focus();
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const formatTime = (timestamp) => {
        return new Date(timestamp).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Suggested questions
    const suggestedQuestions = [
        "How much did I spend this month?",
        "What's my biggest expense category?",
        "Give me budgeting tips",
        "Should I save more?"
    ];

    const handleSuggestionClick = (question) => {
        setInputMessage(question);
        inputRef.current?.focus();
    };

    return (
        <div className="h-full flex flex-col bg-gray-50">
            {/* Header */}
            <div className="bg-primary text-white p-5 border-b">
                <div className="flex items-center gap-3">
                    <div className="bg-white/20 p-2 rounded-full">
                        <Bot className="w-6 h-6" />
                    </div>
                    <div>
                        <h2 className="text-xl font-semibold">AI Financial Assistant</h2>
                        <p className="text-sm text-white/80">Ask me anything about your finances</p>
                    </div>
                </div>
            </div>

            {/* Messages Container */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
                {messages.map((msg, index) => (
                    <div
                        key={index}
                        className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                        <div
                            className={`max-w-[75%] rounded-2xl px-4 py-3 ${msg.type === 'user'
                                ? 'bg-primary text-white rounded-br-sm'
                                : 'bg-white border border-gray-200 text-gray-800 rounded-bl-sm shadow-sm'
                                }`}
                        >
                            {msg.type === 'ai' && (
                                <div className="flex items-center gap-2 mb-2">
                                    <Bot className="w-4 h-4 text-primary" />
                                    <span className="text-xs font-semibold text-primary">AI Assistant</span>
                                </div>
                            )}
                            <p className="text-[15px] leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                            <p className={`text-[10px] mt-1.5 ${msg.type === 'user' ? 'text-white/70' : 'text-gray-400'
                                }`}>
                                {formatTime(msg.timestamp)}
                            </p>
                        </div>
                    </div>
                ))}

                {/* Typing Indicator */}
                {isTyping && (
                    <div className="flex justify-start">
                        <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm">
                            <div className="flex items-center gap-2">
                                <Loader className="w-4 h-4 text-primary animate-spin" />
                                <span className="text-sm text-gray-600">AI is thinking...</span>
                            </div>
                        </div>
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>

            {/* Suggested Questions */}
            {messages.length === 1 && (
                <div className="px-5 pb-3">
                    <p className="text-xs text-gray-500 mb-2">💡 Try asking:</p>
                    <div className="flex flex-wrap gap-2">
                        {suggestedQuestions.map((q, i) => (
                            <button
                                key={i}
                                onClick={() => handleSuggestionClick(q)}
                                className="text-xs bg-white border border-gray-200 hover:border-primary hover:text-primary px-3 py-1.5 rounded-full transition-colors"
                            >
                                {q}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Input Area */}
            <div className="bg-white border-t border-gray-200 p-4">
                <div className="flex gap-2">
                    <input
                        ref={inputRef}
                        type="text"
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Ask me anything..."
                        disabled={isTyping}
                        className="flex-1 border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:bg-gray-100 disabled:cursor-not-allowed"
                    />
                    <button
                        onClick={handleSendMessage}
                        disabled={!inputMessage.trim() || isTyping}
                        className="bg-primary text-white px-5 py-3 rounded-xl hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:shadow-lg"
                    >
                        <Send className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AIAssistant;
