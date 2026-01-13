import React, { useMemo } from "react";
import ChatProductGrid from "./ChatProductGrid";
import { OrderPreviewCard } from "./OrderPreviewCard";
interface BotMessageProps {
  content: string;
}

const BotMessage: React.FC<BotMessageProps> = ({ content }) => {
  const PRODUCT_REGEX = /\[PRODUCT_LIST_START\](.*?)\[PRODUCT_LIST_END\]/s;

  const ORDER_REGEX = /\[ORDER_CODE:([a-zA-Z0-9]+)\]/;

  const parsedData = useMemo(() => {
    // 0. Loại bỏ thẻ <think> (Chain of Thought)
    let cleanContent = content.replace(/<think>[\s\S]*?<\/think>/g, "").trim();

    let productIds: string[] = [];
    let orderCode: string | null = null;
    let isJsonMode = false;

    // 1. Thử tách JSON từ nội dung hỗn hợp (Text + JSON)
    try {
      // Tìm vị trí bắt đầu của JSON object
      const jsonStartIndex = content.indexOf('{"type":"product_list"');

      if (jsonStartIndex !== -1) {
        const textPart = content.substring(0, jsonStartIndex).trim();
        const jsonPart = content.substring(jsonStartIndex);

        const jsonData = JSON.parse(jsonPart);

        if (jsonData.type === "product_list" && Array.isArray(jsonData.data)) {
          productIds = jsonData.data; // Lưu ý: ChatProductGrid cần được update để nhận object hoặc map ID
          // Nếu ChatProductGrid chỉ nhận string[], ta map ID. 
          // Nhưng ở đây nên pass full object để đỡ fetch lại. 
          // Tuy nhiên để an toàn với logic cũ, ta check prop của ChatProductGrid.
          // Giả sử ChatProductGrid nhận ID list, ta map:
          productIds = jsonData.data.map((p: any) => p.id);

          cleanContent = textPart; // Giữ lại phần text giới thiệu
          isJsonMode = true;
        }
      } else {
        // Fallback: Try strict JSON if separate
        if (content.trim().startsWith("{") && content.trim().endsWith("}")) {
          const jsonData = JSON.parse(content);
          if (jsonData.type === "product_list" && Array.isArray(jsonData.data)) {
            productIds = jsonData.data.map((p: any) => p.id);
            cleanContent = "";
            isJsonMode = true;
          }
        }
      }
    } catch (e) {
      // JSON parse fail, ignore
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
