
import Groq from 'groq-sdk';
import Product from '../../models/productModel.js';
import Order from '../../models/orderModel.js';
import ChatSession from '../../models/chatSessionModel.js';
import Fuse from 'fuse.js';


const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

let searchEngine = null;
let cachedProducts = [];
let lastUpdated = 0;

// Cập nhật dữ liệu tìm kiếm mỗi 5p
async function updateSearchIndex() {
  const now = Date.now();
  if (now - lastUpdated > 300000 || !searchEngine) {
    try {
      const products = await Product.find({ status: "active" })
        .populate("brand", "name")
        .populate("category", "name")
        .select(
          "name price slug description brand category image sku specifications tags"
        );

      // Chuẩn hóa dữ liệu để search ngon hơn
      cachedProducts = products.map((p) => ({
        _id: p._id,
        name: p.name,
        price: p.price,
        // Tạo một trường text tổng hợp để search cho chuẩn
        searchText: `${p.name} ${p.brand?.name || ""} ${
          p.category?.name || ""
        } ${p.description || ""} ${JSON.stringify(p.specifications || "")}
        ${p.tags}`,
        raw: p,
      }));

      // Cấu hình Fuse.js
      const options = {
        includeScore: true,
        keys: ["searchText"], // Tìm trong trường text tổng hợp
        threshold: 0.4, // Độ chấp nhận sai số
        ignoreLocation: true,
      };

      searchEngine = new Fuse(cachedProducts, options);
      lastUpdated = now;
      console.log(
        `Search Engine Updated! Loaded ${cachedProducts.length} products.`
      );
    } catch (e) {
      console.error("Update Search Index Error:", e);
    }
  }
}

// updateSearchIndex(); // Removed to prevent race condition before DB connect



const FAQ_KNOWLEDGE_BASE = [
  {
    keywords: ["giao hàng", "vận chuyển", "bao lâu", "ship"],
    answer: "Team Liquid giao hàng toàn quốc. Nội thành Hà Nội/TP.HCM nhận hàng trong 1-2 ngày, các tỉnh khác từ 3-5 ngày làm việc."
  },
  {
    keywords: ["đổi trả", "hoàn tiền", "trả hàng", "bảo hành"],
    answer: "Bạn có thể đổi trả hàng miễn phí trong vòng 7 ngày nếu có lỗi từ nhà sản xuất. Sản phẩm phải còn nguyên tem mác và chưa qua sử dụng."
  },
  {
    keywords: ["thanh toán", "banking", "tiền mặt", "momo", "vnpay"],
    answer: "Chúng mình hỗ trợ thanh toán khi nhận hàng (COD), chuyển khoản ngân hàng và các ví điện tử như Momo, GrabPay qua cổng thanh toán."
  },
  {
    keywords: ["địa chỉ", "cửa hàng", "shop ở đâu", "showroom"],
    answer: "Hiện tại Team Liquid bán hàng online chủ yếu qua website này. Văn phòng đại diện của chúng mình đặt tại Quận 1, TP.HCM."
  }
];



const ROUTER_PROMPT = `
Role: Intent Classifier.
Task: Analyze user query and output JSON.

Intents:
1. "search_product": Find product, ask price, or ask for recommendations.
2. "check_order": Check order status or order details.
3. "faq": General questions about shipping, returns, payment, or store info.
4. "greeting": Hello, hi, goodbye, thanks.
5. "contact_support": Request to talk to human, need urgent help.

JSON Output:
{
  "intent": "search_product" | "check_order" | "faq" | "greeting" | "contact_support",
  "query": {
    "keyword": string, // Extract core keywords (product name, brand, or FAQ topic)
    "price_max": number // For search_product only
  }
}
`;

const RESPONDER_SYSTEM_PROMPT = `
Role: Sales Assistant for Team Liquid (LiquidShop). Tone: Friendly, Enthusiastic, Vietnamese.
Task: Answer based on CONTEXT and KNOWLEDGE provided.
Rules:
- Be concise but helpful.
- For products: Just introduce them briefly. Users see cards below.
- For FAQ: Use the KNOWLEDGE BASE provided.
- If unsure, ask clarifying questions or suggest contacting support.
`;

export const chatWithAI = async (req, res) => {
  const { message } = req.body;
  const userId = req.user.id;

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  try {
    await updateSearchIndex();

    let session = await ChatSession.findOne({ userId });
    if (!session) {
      session = new ChatSession({ userId, messages: [] });
      await session.save();
    }


    const historyContext = session.messages.slice(-6).map(msg => ({
      role: msg.sender === 'user' ? 'user' : 'assistant',
      content: msg.message

   
    }));

    // Intent discovery
    const routerCompletion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: ROUTER_PROMPT },
        ...historyContext,
        { role: "user", content: message },
      ],
      model: "llama-3.1-8b-instant",
      temperature: 0,
      response_format: { type: "json_object" },
    });


    const { intent, query } = JSON.parse(routerCompletion.choices[0].message.content);
    console.log(`Intent: ${intent}, Query:`, query);

    let dbContext = "Không có dữ liệu đặc biệt.";

    
    let foundDataPayload = null;

    if (intent === "search_product") {
      let results = [];
      if (query?.keyword) {
        const fuseResults = searchEngine.search(query.keyword);
        results = fuseResults.map((r) => r.item);
      } else {
        results = cachedProducts;
      }

      if (query?.price_max) {
        results = results.filter((p) => p.price <= query.price_max);
      }

      const products = results.slice(0, 5);
      if (products.length > 0) {

        dbContext = `DANH SÁCH SẢN PHẨM KHỚP:\n` +
          products.map(p => `- ${p.name} | SKU: ${p.sku} | Giá: ${p.price.toLocaleString()} VNĐ`).join("\n");

        foundDataPayload = `[PRODUCT_LIST_START]${JSON.stringify(products.map(p => p._id))}[PRODUCT_LIST_END]`;
      } else {
        dbContext = "KHO HÀNG: Hiện không tìm thấy sản phẩm chính xác như yêu cầu. Hãy gợi ý khách xem các sản phẩm khác.";
=======
    
      }
    } else if (intent === "check_order") {

      const orders = await Order.find({ userId }).sort({ createdAt: -1 }).limit(1);

      if (orders.length > 0) {
        const o = orders[0];
        dbContext = `ĐƠN HÀNG MỚI NHẤT:\nMã: ${o.orderCode}\nTrạng thái: ${o.orderStatus}\nTổng tiền: ${o.totalAmount.toLocaleString()} VNĐ\nNgày đặt: ${new Date(o.createdAt).toLocaleDateString('vi-VN')}`;
        foundDataPayload = `[ORDER_CODE:${o.orderCode}]`;
      } else {
        dbContext = "HỆ THỐNG: Khách hàng chưa có đơn hàng nào.";
      }

    } else if (intent === "faq") {
      const faqMatch = FAQ_KNOWLEDGE_BASE.find(f =>
        f.keywords.some(kw => query?.keyword?.toLowerCase().includes(kw))
      );
      dbContext = faqMatch ? `KẾT QUẢ FAQ: ${faqMatch.answer}` : "FAQ: Không tìm thấy câu trả lời cụ thể trong Knowledge Base. Hãy trả lời chung chung hoặc hướng dẫn liên hệ hỗ trợ.";
    }

    // Final response generation
    const stream = await groq.chat.completions.create({
      messages: [
        { role: "system", content: RESPONDER_SYSTEM_PROMPT },
        ...historyContext,

        { role: "system", content: `DỮ LIỆU NGỮ CẢNH HỆ THỐNG:\n${dbContext}` },
        { role: "user", content: message }
      ],
      model: "llama-3.3-70b-versatile",
      stream: true,
      temperature: 0.6,
      max_tokens: 800

       
    });

    let fullBotResponse = "";
    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content || "";
      if (content) {
        fullBotResponse += content;
        res.write(`data: ${JSON.stringify({ content })}\n\n`);
      }
    }

    if (foundDataPayload) {

      const payloadWrapper = `\n\n${foundDataPayload}`;
      res.write(`data: ${JSON.stringify({ content: payloadWrapper })}\n\n`);
      fullBotResponse += payloadWrapper;
    }

    session.messages.push({ sender: 'user', message });
    session.messages.push({ sender: 'bot', message: fullBotResponse });

      
    session.updatedAt = Date.now();
    await session.save();

    res.end();
  } catch (error) {
    console.error("Chatbot Error:", error);
    res.write(
      `data: ${JSON.stringify({
        content: "Mạng lag quá, mình chưa load được. Bạn hỏi lại nha!",
      })}\n\n`
    );
    res.end();
  }
};

export const getHistory = async (req, res) => {
  const userId = req.user.id;
  try {
    const session = await ChatSession.findOne({ userId });

    if (!session) {

      return res.status(400).json({
        message: "Chat history empty"

   
      });
    }

    res.status(200).json({
      message: "Get history chatbot successfull",
      session,
    });
  } catch (error) {
    res.status(500).json({
      message: "Get history chatbot error",
      error,
    });
  }

};

