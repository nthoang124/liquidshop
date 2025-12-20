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
    let cleanContent = content;
    let productIds: string[] = [];
    let orderCode: string | null = null;

    const productMatch = cleanContent.match(PRODUCT_REGEX);
    if (productMatch) {
      try {
        productIds = JSON.parse(productMatch[1]);
      } catch (e) {
        console.error("Lỗi parse JSON list sản phẩm:", e);
      }
      cleanContent = cleanContent.replace(PRODUCT_REGEX, "").trim();
    }

    const orderMatch = cleanContent.match(ORDER_REGEX);
    if (orderMatch) {
      orderCode = orderMatch[1];
      cleanContent = cleanContent.replace(ORDER_REGEX, "").trim();
    }

    return { cleanContent, productIds, orderCode };
  }, [content]);

  return (
    <div className="space-y-3">
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
