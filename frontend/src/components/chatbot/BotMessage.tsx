import React, { useMemo } from "react";
import ChatProductGrid from "./ChatProductGrid";
import { OrderPreviewCard } from "./OrderPreviewCard";

interface BotMessageProps {
  content: string;
}

const BotMessage: React.FC<BotMessageProps> = ({ content }) => {

  const parsedData = useMemo(() => {
    // 0. Loại bỏ thẻ <think> (Chain of Thought)
    let cleanContent = content.replace(/<think>[\s\S]*?<\/think>/g, "").trim();

    let productIds: string[] = [];
    let orderCode: string | null = null;
    let isJsonMode = false;

    // 1. Cải tiến: Tách JSON từ nội dung hỗn hợp (Hỗ trợ cả Markdown Block & Raw JSON)
    try {
      // Sử dụng cleanContent đã loại bỏ <think> để regex không bị nhiễu
      const jsonRegex = /({[\s\S]*"type"\s*:\s*"product_list"[\s\S]*"data"[\s\S]*})/;
      const match = cleanContent.match(jsonRegex);

      if (match) {
        const rawJson = match[1]; // Capture group 1 là toàn bộ cục JSON
        const jsonData = JSON.parse(rawJson);

        if (jsonData.type === "product_list" && Array.isArray(jsonData.data)) {
          productIds = jsonData.data.map((p: any) => p.id);

          // Remove JSON part from content to get description text
          // Clean cả markdown wrappers nếu có xung quanh nó
          const fullMatchString = match[0];
          let textPart = cleanContent.replace(fullMatchString, "").trim();

          // Clean lingering markdown ending '```' if any
          textPart = textPart.replace(/```json|```/g, "").trim();

          cleanContent = textPart;
          isJsonMode = true;
        }
      }
    } catch (e) {
      console.warn("JSON Parse Failed:", e);
    }

    if (!isJsonMode) {
      // 2. Logic Regex (Legacy / Fallback)
      const PRODUCT_REGEX = /\[PRODUCT_LIST_START\](.*?)\[PRODUCT_LIST_END\]/s;
      const productMatch = cleanContent.match(PRODUCT_REGEX);
      if (productMatch) {
        try {
          productIds = JSON.parse(productMatch[1]);
        } catch (e) {
          console.error("Lỗi parse JSON list sản phẩm:", e);
        }
        cleanContent = cleanContent.replace(PRODUCT_REGEX, "").trim();
      }

      const ORDER_REGEX = /\[ORDER_CODE:([a-zA-Z0-9]+)\]/;
      const orderMatch = cleanContent.match(ORDER_REGEX);
      if (orderMatch) {
        orderCode = orderMatch[1];
        cleanContent = cleanContent.replace(ORDER_REGEX, "").trim();
      }
    }

    return { cleanContent, productIds, orderCode };
  }, [content]);

  return (
    <div className="space-y-3 w-full overflow-hidden">
      {parsedData.cleanContent && (
        <p className="whitespace-pre-wrap leading-relaxed">
          {parsedData.cleanContent}
        </p>
      )}

      {parsedData.orderCode && (
        <OrderPreviewCard orderCode={parsedData.orderCode} />
      )}

      {parsedData.productIds.length > 0 && (
        <ChatProductGrid productIds={parsedData.productIds} />
      )}
    </div>
  );
};

export default BotMessage;
