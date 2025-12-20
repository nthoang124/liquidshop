import React, { useState, useEffect, useRef } from "react";
import { MessageSquare, Send, X, Loader2, Bot, User } from "lucide-react";
import { chatbotService } from "@/services/api/customer/chatbot.service";
import { type IChatMessage } from "@/types/chatbot";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

import { useAuth } from "@/context/CustomerAuthContext";

import BotMessage from "./BotMessage";

const ChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<IChatMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const { user, isLoading: isAuthLoading } = useAuth();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen, isStreaming]);

  useEffect(() => {
    if (isOpen && messages.length === 0 && user) {
      const fetchHistory = async () => {
        setIsLoading(true);
        const history = await chatbotService.getHistory();
        setMessages(history);
        setIsLoading(false);
      };
      fetchHistory();
    }
  }, [isOpen, user]);

  const handleToggleBot = () => {
    if (!user) {
      toast.error("Vui lòng đăng nhập để sử dụng trợ lý ảo!", {
        description:
          "Bạn cần đăng nhập để chúng tôi có thể hỗ trợ thông tin đơn hàng và tài khoản.",
        duration: 3000,
      });
      return;
    }
    setIsOpen(!isOpen);
  };

  // Tạm thời chưa render để tránh lag khi load auth
  if (isAuthLoading) return null;

  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputValue.trim() || isStreaming) return;

    const userMsg: IChatMessage = { role: "user", content: inputValue };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue("");
    setIsStreaming(true);

    const botMsgPlaceholder: IChatMessage = { role: "bot", content: "" };
    setMessages((prev) => [...prev, botMsgPlaceholder]);

    let botResponseAccumulated = "";

    await chatbotService.sendMessageStream(
      userMsg.content,
      (chunk) => {
        botResponseAccumulated += chunk;

        setMessages((prev) => {
          const newMsgs = [...prev];
          const lastMsg = newMsgs[newMsgs.length - 1];
          if (lastMsg.role === "bot" || lastMsg.role === "model") {
            lastMsg.content = botResponseAccumulated;
          }
          return newMsgs;
        });
      },
      () => {
        setIsStreaming(false);
        setTimeout(() => inputRef.current?.focus(), 100);
      },
      (error) => {
        console.error(error);
        setIsStreaming(false);
        setMessages((prev) => [
          ...prev,
          {
            role: "bot",
            content: "Xin lỗi, hệ thống đang bận. Vui lòng thử lại sau.",
          },
        ]);
      }
    );
  };

  return (
    <div
      className={cn(
        "fixed right-6 sm:right-3 z-50 flex flex-col items-end transition-all duration-300",
        "bottom-[84px] md:bottom-6",
        isOpen && "bottom-18 md:bottom-6"
      )}
    >
      {isOpen && (
        <div className="mb-4 w-[350px] sm:w-[400px] h-[500px] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-10 duration-300 ">
          {/* Header */}
          <div className="bg-red-600 p-4 flex justify-between items-center text-white">
            <div className="flex items-center gap-2">
              <Bot className="w-6 h-6" />
              <div>
                <h3 className="font-bold text-sm">Trợ lý ảo AI</h3>
                <span className="text-xs text-red-100 flex items-center gap-1">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                  Online
                </span>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="hover:bg-red-700 p-1 rounded transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 bg-gray-50 space-y-4">
            {isLoading ? (
              <div className="flex justify-center items-center h-full text-gray-400">
                <Loader2 className="w-6 h-6 animate-spin mr-2" /> Đang tải lịch
                sử...
              </div>
            ) : messages.length === 0 ? (
              <div className="text-center text-gray-400 mt-10">
                <Bot className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p className="text-sm">Xin chào! Tôi có thể giúp gì cho bạn?</p>
              </div>
            ) : (
              messages.map((msg, idx) => {
                const isUser = msg.role === "user";
                return (
                  <div
                    key={idx}
                    className={`flex ${
                      isUser ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`flex gap-2 max-w-[85%] ${
                        isUser ? "flex-row-reverse" : "flex-row"
                      }`}
                    >
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                          isUser ? "bg-gray-200" : "bg-red-100"
                        }`}
                      >
                        {isUser ? (
                          <User className="w-5 h-5 text-gray-600" />
                        ) : (
                          <Bot className="w-5 h-5 text-red-600" />
                        )}
                      </div>

                      <div
                        className={`p-3 text-sm rounded-2xl ${
                          isUser
                            ? "bg-red-600 text-white rounded-tr-none"
                            : "bg-white border border-gray-200 text-gray-800 rounded-tl-none shadow-sm"
                        }`}
                      >
                        {isUser ? (
                          <span className="whitespace-pre-wrap">
                            {msg.content}
                          </span>
                        ) : (
                          <BotMessage content={msg.content} />
                        )}

                        {!isUser &&
                          isStreaming &&
                          idx === messages.length - 1 && (
                            <span className="inline-block w-1.5 h-4 bg-red-600 ml-1 align-middle animate-pulse"></span>
                          )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <form
            onSubmit={handleSendMessage}
            className="p-3 bg-white border-t border-gray-100 flex gap-2"
          >
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Nhập tin nhắn..."
              disabled={isStreaming}
              className="flex-1 px-4 py-2 text-sm bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={!inputValue.trim() || isStreaming}
              className="bg-red-600 text-white p-2.5 rounded-full hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {isStreaming ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
            </button>
          </form>
        </div>
      )}

      <button
        onClick={handleToggleBot}
        className={cn(
          "h-14 w-14 rounded-full shadow-xl flex items-center justify-center transition-all duration-300 hover:scale-110 cursor-pointer",
          isOpen ? "bg-gray-600 text-white rotate-90" : "bg-red-600 text-white"
        )}
      >
        {isOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <MessageSquare className="w-7 h-7" />
        )}
      </button>
    </div>
  );
};

export default ChatBot;
