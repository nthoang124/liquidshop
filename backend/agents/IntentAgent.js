const Groq = require("groq-sdk");
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const ROUTER_PROMPT = `
Role: Intent Classifier.
Task: Analyze user query and output JSON.

Intents:
1. "GREETING": Chào hỏi xã giao (hi, hello, shop ơi...).
2. "SEARCH_PRODUCT": Tìm kiếm sản phẩm cụ thể, hỏi giá, tìm theo tiêu chí (laptop dưới 20tr, bàn phím cơ...).
3. "COMPARE_PRODUCT": So sánh 2 hoặc nhiều sản phẩm.
4. "CONSULTING": Yêu cầu tư vấn chung chung (mua máy gì làm văn phòng, tư vấn giúp em...).
5. "TECHNICAL_ADVICE": Hỏi về kỹ thuật, cấu hình, phần mềm, tư vấn kiến thức (Máy này chạy Docker được không? Sinh viên IT cần máy gì? Nên mua PC hay Laptop?...).
6. "OTHER": Các trường hợp khác (hỏi đơn hàng, thanh toán, shop ở đâu...).

JSON Output:
{
  "intent": "GREETING" | "SEARCH_PRODUCT" | "COMPARE_PRODUCT" | "CONSULTING" | "TECHNICAL_ADVICE" | "OTHER",
  "query": {
    "keyword": string,
    "category": string | null,
    "products_to_compare": [string],
    "quantity": number | null,
    "price_max": number,
    "price_min": number,
    "sort_by": "price_asc" | "price_desc" | "newest" | null, 
    "device_model": string | null
  }
}
`;

class IntentAgent {
    async detectIntent(message) {
        try {
            const completion = await groq.chat.completions.create({
                messages: [
                    { role: "system", content: ROUTER_PROMPT },
                    { role: "user", content: message },
                ],
                model: "qwen/qwen3-32b",
                temperature: 0,
                response_format: { type: "json_object" },
            });

            return JSON.parse(completion.choices[0].message.content);
        } catch (error) {
            console.error("Intent Detection Error:", error);
            return { intent: "OTHER", query: {} };
        }
    }
}

module.exports = new IntentAgent();
