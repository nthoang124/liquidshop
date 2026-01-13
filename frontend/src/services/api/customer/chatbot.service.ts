import axiosClient from "@/services/api/customer/axiosClient";
import type { IChatMessage, IChatHistoryResponse } from "@/types/chatbot";

const BASE_URL = import.meta.env.VITE_API_URL;

export const chatbotService = {
  getHistory: async (): Promise<IChatMessage[]> => {
    try {
      const response = await axiosClient.get<any, IChatHistoryResponse>(
        "/chatbot"
      );
      const rawMessages = response.session?.messages || [];

      return rawMessages.map((msg: any) => ({
        _id: msg._id,
        role: msg.sender === "user" ? "user" : "bot",
        content: msg.message || "",
        createdAt: msg.timestamp,
      }));
    } catch (error) {
      console.error("Lỗi lấy lịch sử chat:", error);
      return [];
    }
  },

  sendMessageStream: async (
    message: string,
    onChunk: (text: string) => void,
    onComplete: () => void,
    onError: (err: any) => void
  ) => {
    try {
      const token =
        localStorage.getItem("accessToken") ||
        sessionStorage.getItem("accessToken");

      const response = await fetch(`${BASE_URL}/chatbot`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ message }),
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      if (!response.body) throw new Error("ReadableStream not supported.");

      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");

      let done = false;
      let leftover = "";

      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;

        if (value) {
          const chunkRaw = leftover + decoder.decode(value, { stream: true });

          const lines = chunkRaw.split("\n");

          leftover = lines.pop() || "";

          for (const line of lines) {
            const trimmedLine = line.trim();
            if (!trimmedLine || !trimmedLine.startsWith("data: ")) continue;

            const jsonStr = trimmedLine.replace("data: ", "").trim();

            if (jsonStr === "[DONE]") {
              onComplete();
              return;
            }

            try {
              const parsedData = JSON.parse(jsonStr);
              if (parsedData && parsedData.content) {
                onChunk(parsedData.content);
              }
            } catch (err) {
              leftover = line + leftover;
            }
          }
        }
      }
      onComplete();
    } catch (error) {
      onError(error);
    }
  },
  resetSession: async (): Promise<boolean> => {
    try {
      await axiosClient.delete("/chatbot");
      return true;
    } catch (error) {
      console.error("Lỗi khi reset chatbot session:", error);
      return false;
    }
  },
};
