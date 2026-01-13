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

  const scrollToBottom = (behavior: ScrollBehavior = "smooth") => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior });
    }, 700);
  };

  useEffect(() => {
    if (isOpen && !isLoading) {
      scrollToBottom("smooth");
    }
  }, [messages, isStreaming]);

  useEffect(() => {
    if (isOpen && !isLoading) {
      scrollToBottom("auto");
    }
  }, [isOpen, isLoading]);

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
        "fixed right-4 sm:right-3 z-50 flex flex-col items-end transition-all duration-300",
        "bottom-34 md:bottom-23"
      )}
    >
      {isOpen && (
        <div
          className={cn(
            "fixed inset-0 z-[9999] bg-black flex flex-col",
            "animate-in slide-in-from-bottom-10 fade-in duration-300",

            "sm:inset-auto sm:bottom-1 sm:right-2",
            "sm:w-[400px] sm:h-[500px]",
            "sm:bg-zinc-950 sm:rounded-2xl sm:shadow-2xl sm:border sm:border-red-900",
            "sm:slide-in-from-bottom-6 sm:duration-400"
          )}
        >
          {/* Header */}
          <div className="bg-red-700 p-4 flex justify-between items-center text-white shrink-0">
            <div className="flex items-center gap-2">
              <Bot className="w-6 h-6 text-red-200" />
              <div>
                <h3 className="font-bold text-sm">Liquid AI Assistant</h3>
                <span className="text-xs text-red-200 flex items-center gap-1">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                  Online
                </span>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="hover:bg-red-800/50 p-1 rounded transition-colors "
            >
              <X className="w-6 h-6 sm:w-5 sm:h-5 cursor-pointer" />
            </button>
          </div>

          {/* Message Area */}
          <div className="flex-1 overflow-y-auto p-4 bg-zinc-950 space-y-4">
            {isLoading ? (
              <div className="flex justify-center items-center h-full text-zinc-400">
                <Loader2 className="w-6 h-6 animate-spin mr-2" />
                Đang tải lịch sử...
              </div>
            ) : messages.length === 0 ? (
              <div className="text-center text-zinc-500 mt-10">
                <Bot className="w-12 h-12 mx-auto mb-2 opacity-40" />
                <p className="text-sm">Xin chào! Tôi có thể giúp gì cho bạn?</p>
              </div>
            ) : (
              messages.map((msg, idx) => {
                const isUser = msg.role === "user";
                return (
                  <div
                    key={idx}
                    className={`flex ${isUser ? "justify-end" : "justify-start"
                      }`}
                  >
                    <div
                      className={`flex gap-2 max-w-[85%] ${isUser ? "flex-row-reverse" : "flex-row"
                        }`}
                    >
                      {/* Avatar */}
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${isUser ? "bg-zinc-700" : "bg-red-900/50"
                          }`}
                      >
                        {isUser ? (
                          <User className="w-5 h-5 text-zinc-200" />
                        ) : (
                          <Bot className="w-5 h-5 text-red-400" />
                        )}
                      </div>

                      {/* Bubble */}
                      <div
                        className={`p-3 text-sm rounded-2xl ${isUser
                            ? "bg-red-600 text-white rounded-tr-none"
                            : "bg-zinc-900 border border-zinc-800 text-zinc-200 rounded-tl-none shadow-md"
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
                            <span className="inline-block w-1.5 h-4 bg-red-500 ml-1 align-middle animate-pulse"></span>
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
            className="p-3 bg-zinc-900 border-t border-zinc-800 flex gap-2 shrink-0 pb-safe"
          >
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Nhập tin nhắn..."
              disabled={isStreaming}
              className="flex-1 px-4 py-3 sm:py-2 text-base sm:text-sm 
                     bg-zinc-800 text-zinc-100 placeholder-zinc-500
                     rounded focus:outline-none focus:ring-2 focus:ring-red-600
                     disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={!inputValue.trim() || isStreaming}
              className="bg-red-600 text-white p-3 sm:p-2.5 rounded-full 
                     hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed 
                     transition-all flex-shrink-0"
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

      {/* Nút bật tắt chat */}
      <button
        onClick={handleToggleBot}
        className={cn(
          "h-13 w-13 rounded-full shadow-xl flex items-center justify-center bg-red-600 text-white cursor-pointer"
        )}
      >
        <MessageSquare className="w-7 h-7" />
      </button>
    </div>
  );
};

export default ChatBot;
